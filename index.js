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
        //Try to write data extraction from API code here with time limits
        mongodb = getDB();
    }else{
        console.log("MongoDB connection is unsucessfull");
    }
})

//REDIS CONNECTION
const redisClient = redis.createClient();
const redisSetAsync = util.promisify(redisClient.set).bind(redisClient);

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

    redisClient.get(`userEmailID:${emailID}`, (err,redisGetResult)=>{
        if(err) throw err;
        if(redisGetResult !== null){
            const docFromRedis = JSON.parse(redisGetResult);
            console.log("Document picked from Redis");
            res.status(200).json(docFromRedis)
        }else{
            mongodb.collection('userDetails')
            .findOne({email:emailID})
            .then(doc=>{
                redisClient.set(`userEmailID:${emailID}`, JSON.stringify(doc), 'EX', 600);
                console.log("Document picked from MongoDB");
                res.status(200).json(doc)
            })
            .catch(()=>{
                res.status(500).json({error:'Could not fetch the data!'})
            })
        }
    })

    // mongodb.collection('userDetails')
    // .findOne({email:emailID})
    // .then(doc=>{
    //     res.status(200).json(doc)
    // })
    // .catch(()=>{
    //     res.status(500).json({error:'Could not fetch the data!'})
    // })
})

// UPDATE CITY AND MEASUREMENT SYSTEM FOR A USER
app.post("/api/saveuserchanges/:email", (req,res)=>{
    let emailID = req.params.email;
    let updatedContent = req.body;
    mongodb.collection('userDetails')
    .updateOne({email:emailID},{$set: updatedContent})
    .then((result)=>{
        res.status(200).json(result)
    })
    .catch(()=>{
        res.status(500).json({error: 'Could not update the data!'})
    })
})