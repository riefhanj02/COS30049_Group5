import tensorflow as tf
import numpy as np
import cv2
import random
from tqdm import tqdm

# Load the saved model for testing
model = tf.keras.models.load_model('orangutan_detection_model.h5')

# IP Webcam URL - replace with the correct address from your phone
ip_webcam_url = "http://192.168.1.2:8080/video"  # Adjust this URL to match your IP Webcam

# Connect to the IP Webcam
camera = cv2.VideoCapture(ip_webcam_url)

# Check if the camera connection is successful
if not camera.isOpened():
    print("Error: Unable to connect to the IP Webcam feed.")
    exit()

# Class labels as per your trained model
class_labels = ['deer', 'frog', 'nothing', 'orangutan', 'poacher', 'tiger']
class_counts = {label: 0 for label in class_labels}

# Number of frames to capture for testing
num_frames = 100

# Loop to capture frames from the live feed
for i in tqdm(range(num_frames), desc="Testing Live Feed"):
    # Capture frame-by-frame
    ret, frame = camera.read()
    
    if not ret:
        print("Error: Unable to read frame from the IP Webcam feed.")
        break

    # Randomly apply augmentations to simulate different conditions
    angle = random.randint(-30, 30)
    height, width = frame.shape[:2]
    rotation_matrix = cv2.getRotationMatrix2D((width / 2, height / 2), angle, 1)
    augmented_frame = cv2.warpAffine(frame, rotation_matrix, (width, height))

    brightness_factor = 0.5 + random.uniform(0, 1.5)
    augmented_frame = cv2.convertScaleAbs(augmented_frame, alpha=brightness_factor, beta=0)

    # Resize the frame to match the model's expected input size
    input_image = cv2.resize(augmented_frame, (224, 224))
    input_image = np.expand_dims(input_image, axis=0) / 255.0

    # Make predictions using the model
    predictions = model.predict(input_image, verbose=0)
    predicted_class_index = np.argmax(predictions)
    predicted_class_label = class_labels[predicted_class_index]

    # Update class counts
    class_counts[predicted_class_label] += 1

    # Display the frame with the predicted label
    cv2.putText(frame, f"Detected: {predicted_class_label}", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
    cv2.imshow("Live IP Webcam Feed", frame)

    # Stop if the user presses 'q'
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Release the video capture object and close the OpenCV window
camera.release()
cv2.destroyAllWindows()

# Display the count of each detected class
print("\nDetected Class Counts:")
for label, count in class_counts.items():
    print(f"{count} {label} detected during testing")
