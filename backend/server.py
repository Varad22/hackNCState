from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
import db_utils as db
from datetime import date

app = Flask(__name__)
CORS(app)

db.connectDB()

collection_dh = "dining_halls"

@app.route('/')
def home():
    return {"Home": ["home"]}

@app.route("/publish", methods=["post"])
def publish():
    return db.add_collection("test")
    # dbconn.insert_data("test")
    # return "SUCCESS"

@app.route("/dining_halls", methods=["GET"])
def get_dining_halls():
    data = db.get_all(collection_dh)
    return data.get_json()

# @app.route("/add", methods=["POST"])
# def add_daily_record():
#     print("asasasas")
#     halls = get_dining_halls()
#     # print(halls)
#     for hall in halls:
#         dining_hall_name = hall["dining_hall_name"]
#         today = date.today()
#         existing_record = db[collection_dh].find_one(
#             {"dining_hall_name": dining_hall_name, "records.date": date}
#         )
#         if not existing_record:
#             # Add a new record for the day with 0 donated and total boxes
#             db[collection_dh].update_one(
#                 {"dining_hall_name": dining_hall_name},
#                 {
#                     "$push": {
#                         "records": {
#                             "date": today,
#                             "donated_boxes": 0,
#                             "total_boxes": 0
#                         }
#                     }
#                 },
#                 upsert=True
#             )
#     return "SUCCESS"
#     # # return jsonify({"message": "New record added for the date with 0 count"}), 200
    
# # @app.route("/update_inventory", methods=["POST", "GET"])
# # def update_inventory():
# #     try:
# #         req = request.get_json()

# #         dining_hall_name = req.get("dining_hall_name")
# #         date = req.get("date")
# #         donated_boxes = req.get("donated_boxes")
# #         total_boxes = req.get("total_boxes")

# #         if not dining_hall_name or not date:
# #             return jsonify({"error": "Missing dining_hall_name or date"}), 400

# #         # # Case 1: Midnight Case (Adding a new record with 0 count)
# #         # if donated_boxes is None and total_boxes is None:
# #         #     # Check if the record for the date exists
            

# #         # Case 2: Updating donated_boxes
# #         if donated_boxes is not None:
# #             # Update the donated_boxes for the given date
# #             result = collection_dh.update_one(
# #                 {"dining_hall_name": dining_hall_name, "records.date": date},
# #                 {"$set": {"records.$.donated_boxes": donated_boxes}}
# #             )

# #             if result.matched_count > 0:
# #                 return jsonify({"message": "Donated boxes updated successfully"}), 200
# #             else:
# #                 return jsonify({"error": "Record not found for the given date"}), 404

# #         # Case 3: Updating total_boxes
# #         if total_boxes is not None:
# #             # Update the total_boxes for the given date
# #             result = collection_dh.update_one(
# #                 {"dining_hall_name": dining_hall_name, "records.date": date},
# #                 {"$set": {"records.$.total_boxes": total_boxes}}
# #             )

# #             if result.matched_count > 0:
# #                 return jsonify({"message": "Total boxes updated successfully"}), 200
# #             else:
# #                 return jsonify({"error": "Record not found for the given date"}), 404

# #     except Exception as e:
# #         return jsonify({"error": str(e)}), 500

    
    
if __name__ == '__main__':
    app.run(debug=True)