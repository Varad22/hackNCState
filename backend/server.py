from flask import Flask, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import db_utils as db
app = Flask(__name__)
CORS(app)

db.connectDB()

collection_dh = "dining_halls"

@app.route('/')
def home():
    return {"Home": ["home"]}

@app.route("/publish", methods=["post", "get"])
def publish():
    return db.add_collection("test")
    # dbconn.insert_data("test")
    # return "SUCCESS"

@app.route("/dining_halls", methods=["POST", "GET"])
def get_dining_halls():
    data = db.get_all(collection_dh)
    return data
    
if __name__ == '__main__':
    app.run(debug=True)