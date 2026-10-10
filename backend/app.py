from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ok", "message": "Backend is running!"})

@app.route('/api/detect', methods=['POST'])
def detect_garbage():
    # TODO: Load YOLO model and run inference on uploaded image
    # model = YOLO("yolov8s.pt")
    # results = model(image)
    return jsonify({"status": "success", "predictions": []})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
