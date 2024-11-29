import cv2
import numpy as np
from flask import Flask, Response
from tensorflow.lite.python.interpreter import Interpreter

app = Flask(__name__)

# Load TFLite model
interpreter = Interpreter(model_path="orangutan_detection_model.tflite")
interpreter.allocate_tensors()

input_details = interpreter.get_input_details()
output_details = interpreter.get_output_details()

camera = None  # Initialize camera
LABELS = ['deer', 'frog', 'human', 'nothing', 'orangutan','tiger']

def preprocess_frame(frame):
    frame_resized = cv2.resize(frame, (224, 224))  # Assuming model input size
    input_data = np.expand_dims(frame_resized, axis=0).astype(np.float32)
    return input_data / 255.0

def initialize_camera():
    global camera
    if camera is None or not camera.isOpened():
        camera = cv2.VideoCapture(0)  # Ensure the camera index is correct

def generate_frames():
    initialize_camera()
    while True:
        success, frame = camera.read()
        if not success:
            break

        # Preprocess frame and run inference
        input_data = preprocess_frame(frame)
        interpreter.set_tensor(input_details[0]['index'], input_data)
        interpreter.invoke()
        output_data = interpreter.get_tensor(output_details[0]['index'])

        # Get detection result with highest confidence
        try:
            highest_confidence_index = np.argmax(output_data)
            if highest_confidence_index < len(LABELS):
                result = LABELS[highest_confidence_index]
                confidence = output_data[0][highest_confidence_index]

                # Draw bounding box and overlay result if confidence is high enough
                if confidence > 0.8:  # Threshold for displaying detection
                    height, width, _ = frame.shape
                    box_start = (int(width * 0.2), int(height * 0.2))  # Adjust bounding box position as needed
                    box_end = (int(width * 0.8), int(height * 0.8))
                    color = (0, 255, 0)  # Green color for the box
                    thickness = 2

                    # Draw bounding box and add label
                    cv2.rectangle(frame, box_start, box_end, color, thickness)
                    label = f"{result}: {confidence:.2f}"
                    cv2.putText(frame, label, (box_start[0], box_start[1] - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.8, color, 2)
            else:
                print(f"Warning: Invalid index {highest_confidence_index} for LABELS array.")

        except IndexError as e:
            print(f"Error: {e}")
            continue

        # Encode frame as JPEG
        _, buffer = cv2.imencode('.jpg', frame)
        frame_bytes = buffer.tobytes()

        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

@app.route('/analyze', methods=['GET'])
def analyze():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/AI', methods=['GET'])
def get_prediction():
    initialize_camera()
    success, frame = camera.read()
    if success:
        # Preprocess frame
        input_data = preprocess_frame(frame)
        interpreter.set_tensor(input_details[0]['index'], input_data)
        interpreter.invoke()
        output_data = interpreter.get_tensor(output_details[0]['index'])

        # Get the label with the highest confidence
        highest_confidence_index = int(np.argmax(output_data))
        confidence = float(output_data[0][highest_confidence_index])
        result = LABELS[highest_confidence_index] if highest_confidence_index < len(LABELS) else "Unknown"

        # Return prediction as JSON
        return {
            "label": result,
            "confidence": confidence
        }
    else:
        return {"error": "Failed to capture image"}, 500

@app.route('/release', methods=['POST'])
def release_resources():
    global camera
    if camera is not None and camera.isOpened():
        camera.release()
        camera = None
    return jsonify({"message": "Resources released"})

@app.route('/snapshot', methods=['GET'])
def snapshot():
    initialize_camera()
    success, frame = camera.read()
    if success:
        _, buffer = cv2.imencode('.jpg', frame)
        return Response(buffer.tobytes(), mimetype='image/jpeg')
    else:
        return Response("Error capturing image", status=500)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
