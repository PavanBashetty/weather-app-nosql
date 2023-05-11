const express = require("express");
const bodyParser = require("body-parser");
const redis = require("redis");
const { connectToMongoDB, getDB } = require("./mongodb");
const { connectToMongoHistDB, getHistDB } = require("./mongodbHist")
const { json } = require("body-parser");
const util = require("util");

const app = express();
app.use(express.json());
app.use(bodyParser());

//MONGODB CONNECTION -- To Current Climate Record DB
let mongodb;
connectToMongoDB((err) => {
    if (!err) {
        console.log("MongoDB connection to current climate DB is success");
        mongodb = getDB();
    } else {
        console.log("MongoDB connection to current climate DB is unsucessfull");
    }
})

//MONGODB CONNECTION -- To Historic Climate Record DB
let mongodbHist;
connectToMongoHistDB((err) => {
    if (!err) {
        console.log("MongoDB connection to historic climate DB is success");
        mongodbHist = getHistDB();
    } else {
        console.log("MongoDB connection to historic climate DB is unsucessfull");
    }
})

//REDIS CONNECTION
const redisClient = redis.createClient();
redisClient.on("connect", (err) => {
    if (err) throw err;
    console.log("Redis connection is success");
})


//EXPRESS SERVER
var port = process.env.PORT || 3000
app.listen(port, () => {
    console.log("Express server started ...");
});


                        //ROUTES
//POST REST API METHOD TO ADD NEW USERS INTO THE DATABASE
app.post("/api/signup", (req, res) => {
    let newUserEntry = req.body;
    mongodb.collection('userDetails')
        .insertOne(newUserEntry)
        .then((result) => {
            res.status(201).json(result)
        })
        .catch((err) => {
            res.status(500).json({ err: 'Could not enter a new user document' })
        })
})


//GET REST API METHOD TO LOGIN
app.get("/api/login/:email", (req, res) => {
    let emailID = req.params.email;
    mongodb.collection('userDetails')
        .findOne({ email: emailID })
        .then(doc => {
            res.status(200).json(doc)
        })
        .catch(() => {
            res.status(500).json({ error: 'Could not fetch that data!' })
        })
})

// GET REST API METHOD TO GET USER DETAILS
app.get("/api/userdetails/:email", (req, res) => {
    let emailID = req.params.email;
    let hsetKey = `userEmailID:${emailID}`;

    redisClient.hgetall(hsetKey, (err, redisHgetResult) => {
        //redisClient.get(`userEmailID:${emailID}`, (err,redisGetResult)=>{
        if (err) throw err;
        if (redisHgetResult !== null) {
            //const docFromRedis = JSON.parse(redisGetResult);
            console.log("user detail document picked from Redis HSET");
            res.status(200).json(redisHgetResult)
        } else {
            mongodb.collection('userDetails')
                .findOne({ email: emailID })
                .then(doc => {
                    for (const key in doc) {
                        redisClient.hset(hsetKey, `${key}`, `${doc[key]}`)
                    }
                    redisClient.expire(hsetKey, 1200)
                    //redisClient.set(`userEmailID:${emailID}`, JSON.stringify(doc), 'EX', 600);
                    console.log("user detail document picked from MongoDB");
                    res.status(200).json(doc)
                })
                .catch(() => {
                    res.status(500).json({ error: 'Could not fetch the data!' })
                })
        }
    })
})

// UPDATE CITY AND MEASUREMENT SYSTEM FOR A USER
app.post("/api/saveuserchanges/:email", (req, res) => {
    let emailID = req.params.email;
    let hsetKey = `userEmailID:${emailID}`
    let updatedContent = req.body;
    let newCurrentCity = req.body.currentCity;
    let newMeasurementSystem = req.body.measurementSystem;

    mongodb.collection('userDetails')
        .updateOne({ email: emailID }, { $set: updatedContent })
        .then((result) => {
            redisClient.hmset(hsetKey, "currentCity", `${newCurrentCity}`, "measurementSystem", `${newMeasurementSystem}`)
            res.status(200).json(result)
        })
        .catch(() => {
            res.status(500).json({ error: 'Could not update the data!' })
        })
})

//GET REST API METHOD TO FETCH A LOGGED IN USER'S PERSONALIZED WEATHER DATA
app.get("/api/getpersonalizedweatherdata/:email", (req, res) => {
    let emailID = req.params.email;
    let cCity;
    let mSystem;

    mongodb.collection('userDetails')
        .findOne({ email: emailID }, { "currentCity": 1, "measurementSystem": 1 })
        .then((userDoc) => {
            mSystem = userDoc.measurementSystem;
            cCity = userDoc.currentCity;
            let todayDate = new Date().toISOString().split('T')[0];
            let month = new Date().getMonth() + 1;
            if (month < 10) {
                month = '0' + month;
            }
            let year = new Date().getFullYear();
            let mongodbCollectionName = `${cCity}_${month}_${year}`;
            let hpersonalizedKey = `userEmailID:${emailID}:${cCity}`;

            redisClient.get(hpersonalizedKey, (err, objFromRedis) => {
                if (err) throw err;
                if (objFromRedis !== null) {
                    console.log("Current weather data picked from Redis SET")
                    const personalizedWeatherDoc = JSON.parse(objFromRedis)
                    res.status(200).json({ personalizedWeatherDoc, mSystem })
                } else {
                    mongodb.collection(`${mongodbCollectionName}`)
                        .findOne({ address: cCity, 'days.datetime': { $eq: `${todayDate}` } })
                        .then((wholeWeatherDoc) => {
                            //instead of sending the data only for the current date[because dates are in nested object], it is sending the whole object so a for loop is added
                            let personalizedWeatherDoc;
                            for (let i = 0; i < wholeWeatherDoc.days.length; i++) {
                                if (wholeWeatherDoc.days[i].datetime == todayDate) {
                                    personalizedWeatherDoc = wholeWeatherDoc.days[i]
                                }
                            }
                            personalizedWeatherDoc['address'] = wholeWeatherDoc.address;

                            // original object is a nested object So if you wanna go with hset, either use a recurisve function to clone everything or don't send the whole object instead send only displayed data to frontend, it will be a simple object and can be easily stored in redis. Another option is to go with set but updating values in redis will be difficult, it works well if we are only using it to display
                            
                            // [It is sending the whole thing because its just one object. This is the case for currentClimateRecordDB. Here, every city has only one object for each month. Within this, nested objects are present for each date. Whereas in HistoricClimateRecordDB, every city has one collection for each month and in each collection 30/31 objects are present, one for every date]

                            // So three options: 1. fetch only required fields 2. fetch all fields but store only required fields using hmset 3. use set instead of hset
                            redisClient.set(hpersonalizedKey, JSON.stringify(personalizedWeatherDoc))
                            redisClient.expire(hpersonalizedKey, 900)
                            console.log("Current weather data picked from MongoDB");
                            res.status(200).json({ personalizedWeatherDoc, mSystem })
                        })
                        .catch(() => {
                            res.status(500).json({ error: 'Could not fetch personalized weather data from weather collection' })
                        })
                }
            })
        })
        .catch(() => {
            res.status(500).json({ error: 'Could not fetch personalized data from user collection' })
        })

})


// GET REST API METHOD TO FETCH WEATHER REPORT FOR SEARCHED CITY BY A LOGGED IN USER
app.get("/api/getsearchedcityweatherdata/:email/:searchcity", (req, res) => {
    let emailID = req.params.email;
    let searchcity = req.params.searchcity;
    let mSystem;
    let todayDate = new Date().toISOString().split('T')[0];

    mongodb.collection('userDetails')
        .findOne({ email: emailID }, { "measurementSystem": 1 })
        .then((userDoc) => {
            mSystem = userDoc.measurementSystem;
            let month = new Date().getMonth() + 1;
            if (month < 10) {
                month = '0' + month;
            }
            let year = new Date().getFullYear();
            let mongodbCollectionName = `${searchcity}_${month}_${year}`;
            mongodb.collection(`${mongodbCollectionName}`)
                .findOne({ address: searchcity, 'days.datetime': { $eq: `${todayDate}` } })
                .then((searchedCityWholeWeatherDoc) => {
                    let searchedCityWeatherDoc;
                    for (let i = 0; i < searchedCityWholeWeatherDoc.days.length; i++) {
                        if (searchedCityWholeWeatherDoc.days[i].datetime == todayDate) {
                            searchedCityWeatherDoc = searchedCityWholeWeatherDoc.days[i]
                        }
                    }
                    searchedCityWeatherDoc['address'] = searchedCityWholeWeatherDoc.address
                    res.status(200).json({ searchedCityWeatherDoc, mSystem })
                })
                .catch(() => {
                    res.status(500).json({ error: 'Could not fetch searched city weather data from weather collection' })
                })
        })
        .catch(() => {
            res.status(500).json({ error: 'Could not fetch personalized data from user collection' })
        })
})

//GET REST API METHOD TO FETCH WEATHER REPORT FOR SEARCHED CITY BY A GUEST
app.get("/api/getsearchedcitydataforguest/:searchcity", (req, res) => {
    let searchcity = req.params.searchcity;
    let todayDate = new Date().toISOString().split('T')[0];
    let month = new Date().getMonth() + 1;
    if (month < 10) {
        month = '0' + month;
    }
    let year = new Date().getFullYear();
    let mongodbCollectionName = `${searchcity}_${month}_${year}`;
    let hGuestSearchKey = `City: ${searchcity}`

    redisClient.get(hGuestSearchKey, (err, objFromRedis) => {
        if (err) throw err;
        if (objFromRedis !== null) {
            console.log("Data for searched city by guest is picked from Redis SET");
            const searchedCityWeatherDoc = JSON.parse(objFromRedis)
            res.status(200).json(searchedCityWeatherDoc)
        } else {
            mongodb.collection(`${mongodbCollectionName}`)
                .findOne({ address: searchcity, 'days.datetime': { $eq: `${todayDate}` } })
                .then((searchedCityWholeWeatherDoc) => {
                    let searchedCityWeatherDoc;
                    for (let i = 0; i < searchedCityWholeWeatherDoc.days.length; i++) {
                        if (searchedCityWholeWeatherDoc.days[i].datetime == todayDate) {
                            searchedCityWeatherDoc = searchedCityWholeWeatherDoc.days[i]
                        }
                    }
                    searchedCityWeatherDoc['address'] = searchedCityWholeWeatherDoc.address
                    redisClient.set(hGuestSearchKey, JSON.stringify(searchedCityWeatherDoc))
                    redisClient.expire(hGuestSearchKey, 600)
                    console.log("Data for searched city by guest is picked from MongoDB");
                    res.status(200).json(searchedCityWeatherDoc)
                })
                .catch(() => {
                    res.status(500).json({ error: 'Could not fetch searched city weather data from weather collection' })
                })
        }
    })

})


//GET REST API METHOD TO FETCH FUTURE DATA FOR A CITY
app.get("/api/getfeatureweatherdata/:currentcity", (req, res) => {
    let currentCity = req.params.currentcity;
    let todayDate = new Date().toISOString().split('T')[0];
    let month = new Date().getMonth() + 1;
    if (month < 10) {
        month = '0' + month;
    }
    let year = new Date().getFullYear();
    let mongodbCollectionName = `${currentCity}_${month}_${year}`;

    mongodb.collection(`${mongodbCollectionName}`)
        .findOne({ address: currentCity })
        .then((wholeWeatherDoc) => {
            let futureWeatherDoc = []
            for (let i = 0; i < wholeWeatherDoc.days.length; i++) {
                if ((wholeWeatherDoc.days[i].datetime > todayDate) && futureWeatherDoc.length <= 10) {
                    futureWeatherDoc.push(wholeWeatherDoc.days[i])
                }
            }
            res.status(200).json(futureWeatherDoc)
        })
        .catch(() => {
            res.status(500).json({ error: 'Could not get future weather data from weather collection' })
        })
})

  
//GET REST API METHOD TO FETCH HISTORIC DATA FOR A CITY
app.get("/api/gethistoricweatherdata/:currentcity/:year/:month", (req,res)=>{
    let currentCity = req.params.currentcity;
    let selectedYear = req.params.year;
    let selectedMonth = req.params.month;
    let mongodbCollectionName = `${currentCity}_${selectedMonth}_${selectedYear}`;

    mongodbHist.collection(`${mongodbCollectionName}`)
    .find({}).toArray()
    .then((wholeMonthHistWeatherDoc)=>{
        res.status(200).json(wholeMonthHistWeatherDoc)
    })
    .catch(()=>{
        res.status(500).json({error:'Could not get historic weather data from weather collection'})
    })

})
