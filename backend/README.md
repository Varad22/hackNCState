# 🍽 **Pack The Feed – Backend**

This is the backend service for **Pack The Feed**, a platform that redistributes surplus dining hall food to reduce waste and support those in need. Built using **Flask**, **MongoDB**, and **Flask-CORS**, it serves API endpoints for managing dining hall data, inventory updates, and meal recommendations.

---

## 🚀 **Getting Started**

### **1️⃣ Clone the Repository**
```bash
git clone <repo-url>
cd backend
```

### **2️⃣ Create a Virtual Environment**
```bash
python -m venv venv
source venv/bin/activate  # On macOS/Linux
venv\Scripts\activate     # On Windows
```

### **3️⃣ Install Dependencies**
```bash
pip install -r requirements.txt
```

### **4️⃣ Configure Environment Variables**
Create a `.env` file in the backend directory with:
```
MONGO_URI=<your-mongodb-connection-string>
API_KEY=<your-openai-api-key>
MAIL_USERNAME=<your-email>
MAIL_PASSWORD=<your-email-app-password>
```

### **5️⃣ Start the Server**
```bash
python app.py
```
The API will be available at **`http://127.0.0.1:5000`**.

---

## 🔗 **API Endpoints**
### **📌 Authentication & User Data**
- `GET /profile` – Fetches admin user data

### **📌 Dining Hall Operations**
- `GET /dining_halls` – Fetch all dining halls
- `POST /vendor/update_inventory` – Update total inventory count
- `POST /employee/update_inventory` – Update donated provisions count

### **📌 Predictions & Meal Recommendations**
- `GET /predict` – Predicts future surplus inventory
- `POST /meal_contents` – Provides meal recommendations based on dietary preferences

### **📌 Notifications & Communication**
- `POST /send-email` – Sends email notifications for meal availability

---

## 🏗 **Project Structure**
```
backend/
│── db_utils.py         # MongoDB database operations
│── app.py              # Main Flask app
│── chatgpt.py          # AI-based meal recommendations
│── requirements.txt    # Backend dependencies
│── .env                # Environment variables (ignored in Git)
```

---

## 📦 **Dependencies**
### **Core Backend**
- `Flask` – Web framework for API development
- `Flask-CORS` – Handles cross-origin requests
- `pymongo` – MongoDB connection
- `schedule` – Task scheduling for inventory updates

### **Machine Learning**
- `joblib` – Model loading
- `scikit-learn` – Predictions & analytics
- `numpy`, `scipy` – Data processing

### **AI Integration**
- `openai` – AI-powered meal recommendations

### **Email & Web Scraping**
- `Flask-Mail` – Sends email notifications
- `beautifulsoup4` – Parses dining hall menu data

