from flask import Flask
from flask_cors import CORS
from pymongo import MongoClient
import db_utils as db
app = Flask(__name__)
CORS(app)

db.connectDB()

@app.route('/')
def home():
    return {"Home": ["home"]}

@app.route("/publish", methods=["post", "get"])
def publish():
    return db.add_collection("test")
    # dbconn.insert_data("test")
    # return "SUCCESS"
    
if __name__ == '__main__':
    app.run(debug=True)