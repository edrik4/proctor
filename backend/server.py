from flask import Flask, request, jsonify
import cv2
import numpy as np
import torch
from ultralytics import YOLO
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for front-end communication

model = YOLO("yolov8n.pt")  # Load pre-trained YOLOv8 model

ALERT_OBJECTS = ["cell phone", "tv", "remote", "person"]

@app.route("/detect", methods=["POST"])
def detect_objects():
    try:
        file = request.files["image"]
        img_array = np.frombuffer(file.read(), np.uint8)
        img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)

        results = model(img)[0]
        detected_classes = [model.names[int(box.cls)] for box in results.boxes]

        alerts = [obj for obj in detected_classes if obj in ALERT_OBJECTS]

        if "person" not in detected_classes:
            alerts.append("Student missing from the screen")

        return jsonify({"alerts": alerts})
    
    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
