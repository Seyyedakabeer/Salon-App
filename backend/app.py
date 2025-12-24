from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from datetime import datetime, timedelta
import random
import dsa  # Your DSA file (must be in same folder)

app = Flask(__name__)
CORS(app)

# Connect to local MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['salon-booking']
users = db.users
appointments = db.appointments

# In-memory caches
user_histories = {}
slot_bsts = {}

def generate_ref_num():
    return str(random.randint(100000, 999999))

# Initialize slots for a day (9 AM - 7 PM, no lunch 1-2 PM)
def init_slots_for_day(date_str):
    if date_str in slot_bsts:
        return
    
    bst = dsa.BST()
    start = datetime.fromisoformat(f"{date_str}T09:00:00")
    end = datetime.fromisoformat(f"{date_str}T19:00:00")
    lunch_start = datetime.fromisoformat(f"{date_str}T13:00:00")
    lunch_end = datetime.fromisoformat(f"{date_str}T14:00:00")
    
    current = start
    while current < end:
        if not (lunch_start <= current < lunch_end):
            bst.insert(current.isoformat(), True)  # True = available
        current += timedelta(minutes=30)
    
    # Mark already booked slots
    booked = appointments.find({"date": {"$regex": f"^{date_str}"}})
    for appt in booked:
        appt_time = datetime.fromisoformat(appt["date"])
        duration = appt.get("duration", 30)
        for i in range(0, duration, 30):
            slot_time = (appt_time + timedelta(minutes=i)).isoformat()
            bst.insert(slot_time, False)
    
    slot_bsts[date_str] = bst

# Initialize 15 days
today = datetime.now().date()
for i in range(15):
    day = (today + timedelta(days=i)).isoformat()
    init_slots_for_day(day)

# Load user histories
def load_histories():
    user_histories.clear()
    for user in users.find():
        uid = str(user["_id"])
        ll = dsa.LinkedList()
        for appt in appointments.find({"user_id": uid}):
            ll.append(appt)
        user_histories[uid] = ll

load_histories()

# ==================== ROUTES ====================

@app.route('/')
def home():
    return "<h1>Salon Booking Backend Running!</h1>"

@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    if users.find_one({"email": data['email']}):
        return jsonify({"error": "Email exists"}), 400
    user_id = users.insert_one(data).inserted_id
    user_histories[str(user_id)] = dsa.LinkedList()
    return jsonify({"user_id": str(user_id)})

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    user = users.find_one({"email": data['email'], "password": data['password']})
    if not user:
        return jsonify({"error": "Invalid credentials"}), 401
    return jsonify({
        "user_id": str(user["_id"]),
        "name": user.get("name", "User")
    })

@app.route('/get_slots')
def get_slots():
    result = {}
    for date_str, bst in slot_bsts.items():
        available = []
        for item in bst.inorder():
            if item['value'] is True:  # Only available slots
                available.append(item['key'])  # "2025-12-09T11:00:00"
        result[date_str] = available
    return jsonify(result)

@app.route('/book_appointment', methods=['POST'])
def book_appointment():
    data = request.json
    user_id = data['user_id']
    services = data['services']
    slot_time = data['slot_time']  # e.g. "2025-12-09T11:00:00"

    date_str = slot_time.split('T')[0]
    bst = slot_bsts.get(date_str)
    if not bst:
        return jsonify({"error": "Invalid date"}), 400

    num_services = len(services)
    duration = 60 if num_services > 2 else 30
    customer_type = "VIP" if num_services > 2 else "Normal"

    # Check all required slots are available
    current = datetime.fromisoformat(slot_time)
    for _ in range(duration // 30):
        slot = bst.search(current.isoformat())
        if not slot or slot is False:
            return jsonify({"error": "Slot already booked"}), 400
        current += timedelta(minutes=30)

    # Book them
    current = datetime.fromisoformat(slot_time)
    for _ in range(duration // 30):
        bst.insert(current.isoformat(), False)
        current += timedelta(minutes=30)

    ref_num = generate_ref_num()
    appt = {
        "user_id": user_id,
        "ref_num": ref_num,
        "services": services,
        "date": slot_time,
        "duration": duration,
        "type": customer_type
    }
    appointments.insert_one(appt)
    user_histories[user_id].append(appt)

    return jsonify({"ref_num": ref_num, "message": "Booked successfully!"})

@app.route('/mybookings/<user_id>')
def my_bookings(user_id):
    bookings = list(appointments.find({"user_id": user_id}))
    for b in bookings:
        b['_id'] = str(b['_id'])
    return jsonify(bookings)

@app.route('/user_dashboard/<user_id>')
def user_dashboard(user_id):
    if user_id not in user_histories:
        return jsonify({"error": "User not found"}), 404
    
    history = user_histories[user_id]
    visits = history.count_visits_this_month()
    top = history.top_two_services()
    next_appt = appointments.find_one(
        {"user_id": user_id, "date": {"$gte": datetime.now().isoformat()}},
        sort=[("date", 1)]
    )
    return jsonify({
        "visits_month": visits,
        "top_services": top,
        "next_appt": next_appt
    })

@app.route('/admin_dashboard')
def admin_dashboard():
    all_bookings = list(appointments.find())
    for b in all_bookings:
        b['_id'] = str(b['_id'])
    sorted_bookings = dsa.quick_sort(all_bookings, key=lambda x: x['date'])
    return jsonify(sorted_bookings)

if __name__ == '__main__':
    app.run(debug=True, port=5000)