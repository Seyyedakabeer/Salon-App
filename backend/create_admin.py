from pymongo import MongoClient

client = MongoClient('mongodb://localhost:27017/')
db = client['salon-booking']

db.users.insert_one({
    "name": "Salon Admin",
    "email": "admin",
    "password": "admin123",
    "contact": "0000000000",
    "role": "admin"
})

print("Admin created! Login with email: admin  password: admin123")