const { MongoClient } = require("mongodb");
require("dotenv").config();

//local mongodb
//const localURL = 'mongodb://127.0.0.1:27017/weatherApp';

//mongodb atlas
const atlasURL = `mongodb+srv://${process.env.MONGOCLOUD_USERNAME}:${process.env.MONGOCLOUD_PASSWORD}@${process.env.MONGOCLOUD_CLUSTERNAME}/${process.env.MONGOCLOUD_HISTORIC_DATABASE}?retryWrites=true&w=majority`;
const mClient = new MongoClient(atlasURL, { useNewUrlParser: true, useUnifiedTopology: true });

let dbConnection;
module.exports = {
    //To connect to a database
    connectToMongoHistDB: (cb)=>{
        mClient.connect(atlasURL)
        .then((client)=>{
            dbConnection = client.db()
            //console.log("Connected to Mongo Historic climate record DB!")
            return cb()
        })
        .catch((err)=>{
            console.log(err)
            return cb(err)
        })
    },

    //Return the DB connection for further communication with the DB
    getHistDB: ()=> dbConnection
}