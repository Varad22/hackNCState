from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
import db_utils as db
from datetime import datetime
import schedule
import time
import threading
from flask_mail import Mail, Message
from bs4 import BeautifulSoup
import joblib
import openai
from chatgpt import menu, categorize_menu, generate_summary

app = Flask(__name__)
CORS(app)
app.config["MAIL_SERVER"] = "smtp.gmail.com"
app.config["MAIL_PORT"] = 587  # Use 587 for TLS (Secure)
app.config["MAIL_USE_TLS"] = True  # Use TLS encryption
app.config["MAIL_USE_SSL"] = False  # Must be False for TLS
app.config["MAIL_USERNAME"] = "varadjs22@gmail.com"  # Your Gmail address
app.config["MAIL_PASSWORD"] = "egsl ayev bbld bhrn"  # Use a Google App Password, NOT your real password
app.config["MAIL_DEFAULT_SENDER"] = "varadjs22@gmail.com"
mail = Mail(app)

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

@app.route("/predict",methods=["POST", "GET"])
def predict():
    try:
        # data = request.get_json()
        match_location_NC = [1,1,1,0]
        is_weekend = [0,1,0,1]
        dates = [
            "Feb 12, 2025",
            "Feb 15, 2025",
            "Feb 19, 2025",
            "Feb 28, 2025"
        ]
        
        # Load the trained model
        model = joblib.load('optimized_model.pkl')
        predictions=[]
        # Make prediction
        for i in range(len(is_weekend)):
            prediction = model.predict([[match_location_NC[i], is_weekend[i]]])[0]
            predictions.append(prediction)
        return jsonify({"predicted_total_boxes": predictions, "dates": dates})
    except Exception as e:
        return jsonify({"error": str(e)})

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

@app.route("/vendor/dashboard", methods=["get"])
def dashboard():
    try:
        response = db.get_one("users", "admin","username")
        data = response.get_json()
        hall = data[0].get("dining_hall")
        dining_details=db.get_one("dining_halls", hall,"dining_hall_name").get_json()
        if data and dining_details:
            return {"user":data, "hall":dining_details}
        else:
            return jsonify({"message": "No records found"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/employee/dashboard", methods=["GET"])
def employee_dashboard():
    try:
        response = db.get_one("users", "employee", "role")
        data = response.get_json()
        hall = data[0].get("dining_hall")
        dining_details = db.get_one("dining_halls", hall, "dining_hall_name").get_json()
        
        if data and dining_details:
            return {"user": data, "hall": dining_details}
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


@app.route('/meal_contents', methods=['POST'])
def get_package():
    
    data = request.get_json()
    
    if not data or 'preference' not in data:
        return jsonify({"error": "Invalid input. Please provide a 'preference' field."}), 400
    
    preference_map = {
        1: "Vegan",
        2: "Vegetarian",
        3: "Gluten-Free",
        4: "Meat"
    }
    
    try:
        # Get user preference as an integer
        user_choice = int(data['preference'])
        
        if user_choice not in preference_map:
            return jsonify({"error": f"Invalid preference. Choose a number between {list(preference_map.keys())}."}), 400
        
        # Map user choice to package name
        selected_package = preference_map[user_choice]
        categorized_menu = categorize_menu(menu)

        # Generate summary for the chosen package
        summary = generate_summary(selected_package, categorized_menu)
        
        # Use OpenAI API for enhanced response (optional)
        system_message = """
        You are a nutritionist assistant. We offer four meal packages: Vegan, Vegetarian, Gluten-Free, and Meat.
        
        Each package is tailored to specific dietary preferences. The package includes items from leftover dining hall food and may vary.
        
        - Vegan: Includes only vegan-tagged items.
        - Vegetarian: Includes only vegetarian-tagged items.
        - Gluten-Free: Includes all items except those with gluten allergens.
        - Meat (Anything Meal): Includes all menu items.
        
        Ask the user about their dietary restrictions and suggest a suitable package. Provide a short summary of what might be included in their chosen package from the menu.

        Reference exact menu items from categories. No brekafast or lunch option. Just from menu take variety of diffrent items 
    
        The package are made from food items left from the dining hall so the package may any of items in menu which were reamaining. Frame the answer as such. 

        Be specific to menu. 

        Be with short include 4-5 diverse items from summary. that it. tell them it may or may not have these items in package 

        Keep it under 50 words


        """
        
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": system_message},
                {"role": "user", "content": f"I chose the {selected_package} package. Can you tell me more about it?"},
                {"role": "assistant", "content": summary}
            ]
        )
        
        # Return ChatGPT's response
        assistant_response = response["choices"][0]["message"]["content"]
        
        return jsonify({"package_summary": assistant_response})
        
    
    except ValueError:
        return jsonify({"error": "'preference' must be a valid integer."}), 400
    



if __name__ == '__main__':
    app.run(debug=True)