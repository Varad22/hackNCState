from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
import db_utils as db
from datetime import datetime
import schedule
import time
import threading
from flask_mail import Mail, Message

app = Flask(__name__)
CORS(app)
app.config["MAIL_SERVER"] = "smtp.gmail.com"
app.config["MAIL_PORT"] = 587  # Use 587 for TLS (Secure)
app.config["MAIL_USE_TLS"] = True  # Use TLS encryption
app.config["MAIL_USE_SSL"] = False  # Must be False for TLS
app.config["MAIL_USERNAME"] = "varadjs22@gmail.com"  # Your Gmail address
app.config["MAIL_PASSWORD"] = "egsl ayev bbld bhrn"  # Use a Google App Password, NOT your real password
app.config["MAIL_DEFAULT_SENDER"] = "varadjs22@gmail.com"

 
db.connectDB()

collection_dh = "dining_halls"

@app.route('/')
def login():
    return {"Home": ["home"]}

@app.route("/publish", methods=["post"])
def publish():
    return db.add_collection("users")
    # dbconn.insert_data("test")
    # return "SUCCESS"

@app.route("/profile", methods=["POST", "GET"])
def profile():
    user = db.get_one("users","admin", "username")
    return user

@app.route("/dining_halls", methods=["POST", "GET"])
def get_dining_halls():
    data = db.get_all(collection_dh)
    return data.get_json()

@app.route("/vendor/update_inventory", methods=["POST"])
def vendor_update_inventory():
    try:
        req = request.get_json()
        dining_hall_name = req.get("dining_hall_name")
        date_today = datetime.today().strftime("%Y-%m-%d")
        total_boxes = req.get("total_boxes")

        if not dining_hall_name:
            return jsonify({"error": "Missing dining_hall_name"}), 400

        if total_boxes is not None:
            result = db.dbconn[collection_dh].update_one(
                {"dining_hall_name": dining_hall_name, "records.date": date_today},
                {"$set": {"records.$.total_boxes": total_boxes}}
            )

        if result.matched_count > 0:
            return jsonify({"message": "Total boxes updated successfully"}), 200
        else:
            return jsonify({"error": "Record not found for the given date"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/employee/update_inventory", methods=["POST"])
def employee_update_inventory():
    try:
        req = request.get_json()
        dining_hall_name = req.get("dining_hall_name")
        date_today = datetime.today().strftime("%Y-%m-%d")
        donated_boxes = req.get("donated_boxes")

        if not dining_hall_name:
            return jsonify({"error": "Missing dining_hall_name"}), 400

        if not donated_boxes:
            return jsonify({"error": "Invalid Operation"}), 400

        if donated_boxes is not None:
            result = db.dbconn[collection_dh].update_one(
                {"dining_hall_name": dining_hall_name, "records.date": date_today},
                {"$set": {"records.$.donated_boxes": donated_boxes}}
            )

            if result.matched_count > 0:
                return jsonify({"message": "Donated boxes updated successfully"}), 200
            else:
                return jsonify({"error": "Record not found for the given date"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/dashboard", methods=["get"])
def dashboard():
    try:
        response = db.get_one("users", "admin","username")
        data = response.get_json()

        if data and isinstance(data, list) and len(data) > 0:
            return data
        else:
            return jsonify({"message": "No records found"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@app.route("/send-email", methods=["POST"])
def send_email():
    try:
        data = "Test body"
        recipient = "hacknc1@yopmail.com"
        subject = "Test subject"
        

        if not recipient:
            return jsonify({"error": "Recipient email is required"}), 400

        msg = Message(subject=subject, recipients=[recipient], body=data)
        mail.send(msg)

        return jsonify({"message": "Email sent successfully!"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ------- XXXXX -------

# @app.route("/add", methods=["POST"])
def add_daily_record():
    today_date = datetime.today().strftime("%Y-%m-%d")
    halls = get_dining_halls()
    for hall in halls:
        hall_name = hall.get("dining_hall_name")
        records = hall.get("records")
        if not any(record["date"] == today_date for record in records):
            print(f"Adding record for {hall_name} on {today_date}")

            new_record = {
                "date": today_date,
                "total_boxes": 0,
                "donated_boxes": 0
            }

            db.dbconn[collection_dh].update_one(
                {"dining_hall_name": hall_name}, 
                {"$push": {"records": new_record}}
            )

    return jsonify({"message": "New record added for all dining halls with 0 count"}), 200

def run_scheduler():
    """Runs the scheduler in a separate thread."""
    schedule.every().day.at("00:00").do(add_daily_record)
    while True:
        schedule.run_pending()
        time.sleep(60)

scheduler_thread = threading.Thread(target=run_scheduler, daemon=True)
scheduler_thread.start()

if __name__ == '__main__':
    app.run(debug=True)