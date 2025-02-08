from flask import Flask
from flask_cors import CORS
from pymongo import MongoClient

app = Flask(__name__)
CORS(app)  # Allow frontend to access API
MONGO_URI= "mongodb+srv://apchoudh:apchoudh@cluster0.dlweo96.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

try:
    client = MongoClient(MONGO_URI)
    db = client.test
    db.command("ping")
    print("Connected to MongoDB successfully!")
except Exception as e:
    print(f"MongoDB connection failed: {e}")

@app.route('/')
def home():
    return {"Home": ["home"]}

if __name__ == '__main__':
    app.run(debug=True)