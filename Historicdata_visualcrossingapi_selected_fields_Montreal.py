import requests
import pymongo
import urllib.parse
from datetime import datetime, timedelta
import threading

# Visual Crossing API key
api_key = "U7YWL8LV3PSVUYF2NXRQYTN6N"

# MongoDB Atlas account details
username = "Your Username"
password = "Your Password"
database_name = "HistoricClimateRecords"
cluster_name = "cluster0.xlhhapk.mongodb.net"
mongo_uri = f"mongodb+srv://{urllib.parse.quote_plus(username)}:{urllib.parse.quote_plus(password)}@{cluster_name}/{database_name}?retryWrites=true&w=majority"

# Connect to MongoDB Atlas
client = pymongo.MongoClient(mongo_uri)
db = client[database_name]

def fetch_data(date):
    # Retrieve historical weather data for Montreal from Visual Crossing API
    date_str = date.strftime("%Y-%m-%d")
    fields = "datetime,tempmax,tempmin,temp,feelslike,humidity,precip,precipprob,preciptype,snow,snowdepth,windspeed,winddir,cloudcover,visibility,sunrise,sunset,conditions,name"
    url = f"https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/Montreal/{date_str}?key={api_key}&unitGroup=metric&include=obs&fields={fields}"
    response = requests.get(url)
    data = response.json()

    # Store data in MongoDB Atlas
    collection_name = f"Montreal_{date.strftime('%m_%Y')}"
    collection = db[collection_name]
    collection.insert_one(data)

    print(f"Stored data for {date_str}")

# Fetch historical weather data for Montreal from Jan 1st 2022 to May 11th 2023 and store it in MongoDB Atlas
start_date = datetime(2022, 1, 1)
end_date = datetime(2023, 5, 12)
delta = timedelta(days=1)

threads = []

while start_date < end_date:
    thread = threading.Thread(target=fetch_data, args=(start_date,))
    thread.start()
    threads.append(thread)

    # Limit number of threads to avoid hitting API rate limit
    while threading.active_count() >= 10:
        pass

    # Increment date
    start_date += delta

# Wait for all threads to complete
for thread in threads:
    thread.join()

# Close MongoDB Atlas connection
client.close()
