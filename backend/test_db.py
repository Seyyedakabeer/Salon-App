from pymongo import MongoClient

try:
    client = MongoClient('mongodb://localhost:27017/', serverSelectionTimeoutMS=3000)
    client.admin.command('ping')
    print("DATABASE CONNECTED SUCCESSFULLY!")
    print("Collections:", client['salon-booking'].list_collection_names())
except Exception as e:
    print("DATABASE NOT CONNECTED:", e)