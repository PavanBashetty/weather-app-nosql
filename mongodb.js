const { MongoClient } = require("mongodb");
const url = 'mongodb://127.0.0.1:27017/weatherApp';

let dbConnection;
module.exports = {
    //To connect to a database
    connectToMongoDB: (cb)=>{
        MongoClient.connect(url)
        .then((client)=>{
            dbConnection = client.db()
            console.log("Connected to MongoDB")
            return cb()
        })
        .catch((err)=>{
            console.log(err)
            return cb(err)
        })
    },

    //Return the DB connection for further communication with the DB
    getDB: ()=> dbConnection
}