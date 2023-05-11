import requests
import pymongo
import urllib.parse
from datetime import datetime
import threading

# Visual Crossing API key
api_key = "EGVUNQPJ22NPCYG77BTYDKAAV"

# MongoDB Atlas account details
username = "Your Username"
password = "Your Password"
database_name = "CurrentClimateRecord"
cluster_name = "cluster0.xlhhapk.mongodb.net"
mongo_uri = f"mongodb+srv://{urllib.parse.quote_plus(username)}:{urllib.parse.quote_plus(password)}@{cluster_name}/{database_name}?retryWrites=true&w=majority"

# Connect to MongoDB Atlas
client = pymongo.MongoClient(mongo_uri)
db = client[database_name]

def fetch_data():
    # Retrieve current weather data for Montreal from Visual Crossing API
    fields = "datetime,tempmax,tempmin,temp,feelslike,humidity,precip,precipprob,preciptype,snow,snowdepth,windspeed,winddir,cloudcover,visibility,sunrise,sunset,conditions,name"
    url = f"https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/Montreal?unitGroup=metric&key={api_key}&fields={fields}"
    response = requests.get(url)
    data = response.json()

    # Store data in MongoDB Atlas
    #collection_name = f"Montreal_{datetime.now().strftime('%B_%Y')}"
    collection_name = f"Montreal_{datetime.now().strftime('%m_%Y')}"
    collection = db[collection_name]
    collection.insert_one(data)

    print(f"Stored data for {datetime.now().strftime('%Y-%m-%d')}")

# Fetch current weather data for Montreal and store it in MongoDB Atlas
fetch_data()

# Close MongoDB Atlas connection
client.close()
