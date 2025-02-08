from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow frontend to access API

@app.route('/')
def home():
    return {"Home": ["home"]}

if __name__ == '__main__':
    app.run(debug=True)