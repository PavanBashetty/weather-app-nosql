const express = require("express");
const bodyParser = require("body-parser");
const redis = require("redis");
const {connectToMongoDB, getDB} = require("./mongodb");
const {json} = require("body-parser");
const util = require("util");

const app = express();
app.use(express.json());
app.use(bodyParser());

//MONGODB CONNECTION
let mongodb;
connectToMongoDB((err)=>{
    if(!err){
        console.log("MongoDB connection is success");
        mongodb = getDB();
    }else{
        console.log("MongoDB connection is unsucessfull");
    }
})

//REDIS CONNECTION
const redisClient = redis.createClient();
redisClient.on("connect", (err)=>{
    if(err) throw err;
    console.log("Redis connection is success");
})


//EXPRESS SERVER
var port = process.env.PORT || 3000
app.listen(port, () => {
    console.log("Express server started ...");
});

// app.get("/", (req, res) => {
//     res.send("Hello From The Server");
// })

                    //ROUTES
//POST REST API METHOD TO ADD NEW USERS INTO THE DATABASE
app.post("/api/signup", (req,res)=>{
    let newUserEntry = req.body;
    mongodb.collection('userDetails')
    .insertOne(newUserEntry)
    .then((result)=>{
        res.status(201).json(result)
    })
    .catch((err)=>{
        res.status(500).json({err:'Could not enter a new user document'})
    })
})


//GET REST API METHOD TO LOGIN
app.get("/api/login/:email", (req,res)=>{
    let emailID = req.params.email;
    mongodb.collection('userDetails')
    .findOne({email:emailID})
    .then(doc=>{
        res.status(200).json(doc)
    })
    .catch(()=>{
        res.status(500).json({error:'Could not fetch that data!'})
    })
})

// GET REST API METHOD TO GET USER DETAILS
app.get("/api/userdetails/:email", (req,res)=>{
    let emailID = req.params.email;
    let hsetKey = `userEmailID:${emailID}`;

    redisClient.hgetall(hsetKey, (err,redisHgetResult)=>{
    //redisClient.get(`userEmailID:${emailID}`, (err,redisGetResult)=>{
        if(err) throw err;
        if(redisHgetResult !== null){
            //const docFromRedis = JSON.parse(redisGetResult);
            console.log("user detail document picked from Redis HSET");
            res.status(200).json(redisHgetResult)
        }else{
            mongodb.collection('userDetails')
            .findOne({email:emailID})
            .then(doc=>{
                for(const key in doc){
                    redisClient.hset(hsetKey, `${key}`, `${doc[key]}`)
                }
                redisClient.expire(hsetKey, 1200)
                //redisClient.set(`userEmailID:${emailID}`, JSON.stringify(doc), 'EX', 600);
                console.log("user detail document picked from MongoDB");
                res.status(200).json(doc)
            })
            .catch(()=>{
                res.status(500).json({error:'Could not fetch the data!'})
            })
        }
    })
})

// UPDATE CITY AND MEASUREMENT SYSTEM FOR A USER
app.post("/api/saveuserchanges/:email", (req,res)=>{
    let emailID = req.params.email;
    let hsetKey = `userEmailID:${emailID}`
    let updatedContent = req.body;
    let newCurrentCity = req.body.currentCity;
    let newMeasurementSystem = req.body.measurementSystem;
 
    mongodb.collection('userDetails')
    .updateOne({email:emailID},{$set: updatedContent})
    .then((result)=>{
        redisClient.hmset(hsetKey, "currentCity", `${newCurrentCity}`, "measurementSystem",`${newMeasurementSystem}`)
        res.status(200).json(result)
    })
    .catch(()=>{
        res.status(500).json({error: 'Could not update the data!'})
    })
})

//GET REST API METHOD TO FETCH A LOGGED IN USER'S PERSONALIZED WEATHER DATA
app.get("/api/getpersonalizedweatherdata/:email", (req,res)=>{
    let emailID = req.params.email;
    let cCity;
    let mSystem;

    mongodb.collection('userDetails')
    .findOne({email:emailID},{"currentCity":1, "measurementSystem":1})
    .then((userDoc)=>{
        mSystem = userDoc.measurementSystem;
        cCity = userDoc.currentCity;

        //step1: hpersonalizedKey here with the city name
        let hpersonalizedKey = `userEmailID:${emailID}:${cCity}`;
        redisClient.get(hpersonalizedKey, (err,objFromRedis)=>{
            if(err) throw err;
            if(objFromRedis !== null){
                console.log("Current weather data picked from Redis SET")
                const personalizedWeatherDoc = JSON.parse(objFromRedis)
                res.status(200).json({personalizedWeatherDoc, mSystem})
            }else{
                mongodb.collection('tempWeatherData')
                .findOne({address:cCity})
                .then((personalizedWeatherDoc)=>{
                    // original output object is a nested object So if you wanna go with hset, either use a recurisve function to clone everything or don't send the whole object, instead send only displayed data to frontend, it will be a simple object and can be easily stored in redis. Another option is to go with set but updating values in redis will be difficult, it works well if we are only using it to display

                    redisClient.set(hpersonalizedKey, JSON.stringify(personalizedWeatherDoc))
                    redisClient.expire(hpersonalizedKey, 900)
                    console.log("Current weather data picked from MongoDB");
                    res.status(200).json({personalizedWeatherDoc, mSystem})
                })
                .catch(()=>{
                    res.status(500).json({error:'Could not fetch personalized weather data from weather collection'})
                })
            }
        })
    })
    .catch(()=>{
        res.status(500).json({error:'Could not fetch personalized data from user collection'})
    })

})


// GET REST API METHOD TO FETCH WEATHER REPORT FOR SEARCHED CITY BY A LOGGED IN USER
app.get("/api/getsearchedcityweatherdata/:email/:searchcity", (req,res)=>{
    let emailID = req.params.email;
    let searchcity = req.params.searchcity;
    let mSystem;

    mongodb.collection('userDetails')
    .findOne({email:emailID},{"measurementSystem":1})
    .then((userDoc)=>{
        mSystem = userDoc.measurementSystem;
        mongodb.collection('tempWeatherData')
        .findOne({address: searchcity})
        .then((searchedCityWeatherDoc)=>{
            res.status(200).json({searchedCityWeatherDoc, mSystem})
        })
        .catch(()=>{
            res.status(500).json({error:'Could not fetch searched city weather data from weather collection'})
        })
    })
    .catch(()=>{
        res.status(500).json({error:'Could not fetch personalized data from user collection'})
    })
})