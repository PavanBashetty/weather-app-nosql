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

app.get("/", (req, res) => {
    res.send("Hello From The Server");
})

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
            console.log("Document picked from Redis HSET");
            res.status(200).json(redisHgetResult)
        }else{
            mongodb.collection('userDetails')
            .findOne({email:emailID})
            .then(doc=>{
                for(const key in doc){
                    redisClient.hset(hsetKey, `${key}`, `${doc[key]}`)
                }
                //redisClient.set(`userEmailID:${emailID}`, JSON.stringify(doc), 'EX', 600);
                console.log("Document picked from MongoDB");
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

//GET REST API METHOD TO FETCH PERSONALIZED WEATHER DATA
app.get("/api/getpersonalizedweatherdata/:email", (req,res)=>{
    let emailID = req.params.email;
    let hGetKey = `userEmailID:${emailID}`;
    let cCity;
    let mSystem;

    mongodb.collection('userDetails')
    .findOne({email:emailID},{"currentCity":1, "measurementSystem":1})
    .then((userDoc)=>{
        cCity = userDoc.currentCity;
        mSystem = userDoc.measurementSystem;
        mongodb.collection('tempWeatherData')
        .findOne({address:cCity})
        .then((personalizedWeatherDoc)=>{
            res.status(200).json({personalizedWeatherDoc, mSystem})
        })
        .catch(()=>{
            res.status(500).json({error:'Could not fetch personalized weather data from weather collection'})
        })
    })
    .catch(()=>{
        res.status(500).json({error:'Could not fetch personalized data from user collection'})
    })

})