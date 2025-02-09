from flask import jsonify, request
from flask.cli import load_dotenv
from pymongo import MongoClient
from dotenv import load_dotenv
import os


load_dotenv()
# username = os.getenv("USERNAME")
# password = os.getenv("PASSWORD")
# mongodb+srv://varad:<db_password>@cluster0.wq3fm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
MONGO_URI= os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI)

def connectDB():
    try:
        global dbconn
        dbconn = client.test
        dbconn.command("ping")
        print("Connected to MongoDB successfully!")
        # return dbconn
    except Exception as e:
        print(f"MongoDB connection failed: {e}")

def add_collection(collection_name):
    try:
        dbconn.create_collection(collection_name)
        return jsonify({"message": f"Collection '{collection_name}' created successfully."})
    except Exception as e:
        return jsonify({"error": str(e)})


def insert_data(collection_name, data):
    try:
        data = data
        collection = dbconn[collection_name]
        if isinstance(data, list):
            collection.insert_many(data)
        else:
            collection.insert_one(data)
        return jsonify({"message": f"Data inserted into '{collection_name}' successfully."})
    except Exception as e:
        return jsonify({"error": str(e)})

def get_all(collection_name):
    try:
        collection = dbconn[collection_name]
        data = list(collection.find({}, {"_id": 0}))  # Exclude ObjectId from response
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)})

def get_one(collection_name, value, col):
    try:
        collection = dbconn[collection_name]
        data = list(collection.find({col: value}, {"_id": 0}))
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)})
