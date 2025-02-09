from flask import Flask, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import db_utils as db
app = Flask(__name__)
CORS(app)

db.connectDB()

collection_dh = "dining_halls"

@app.route('/')
def login():
    return {"Home": ["home"]}

@app.route("/publish", methods=["post", "get"])
def publish():
    return db.add_collection("dining_halls")
    # dbconn.insert_data("test")
    # return "SUCCESS"

@app.route("/dining_halls", methods=["POST", "GET"])
def get_dining_halls():
    data = db.get_all(collection_dh)
    return data
    
@app.route("/dashboard", methods=["get"])
def dashboard():
    try:
        response = db.get_one("dining_halls", "Hillside Dining")
        data = response.get_json()

        if data and isinstance(data, list) and len(data) > 0:
            return jsonify(data[0].get("records", []))
        else:
            return jsonify({"message": "No records found"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)