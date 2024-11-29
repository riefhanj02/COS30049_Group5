import tensorflow as tf
import numpy as np
import cv2
import os
import random
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tqdm import tqdm

# Load dataset for testing
test_data_dir = r"C:\Swinburne\Y2S1\AI_test\data\test"
image_height, image_width = 224, 224
batch_size = 16
confidence_threshold = 0.8  # Confidence threshold for predictions

# Load the saved model for testing
model = tf.keras.models.load_model('orangutan_detection_model.h5')

# Function to apply random augmentations to an image
def augment_image(image):
    # Randomly rotate the image
    angle = random.randint(-30, 30)  # Random angle between -30 to 30 degrees
    height, width = image.shape[:2]
    rotation_matrix = cv2.getRotationMatrix2D((width / 2, height / 2), angle, 1)
    rotated_image = cv2.warpAffine(image, rotation_matrix, (width, height))

    # Randomly change brightness
    brightness_factor = 0.5 + random.uniform(0, 1.5)  # Random brightness factor between 0.5 to 2.0
    bright_image = cv2.convertScaleAbs(rotated_image, alpha=brightness_factor, beta=0)

    return bright_image

# Create ImageDataGenerator for testing with rescaling
test_data_gen = ImageDataGenerator(rescale=1.0/255)

# Load testing dataset without any augmentations
test_dataset = test_data_gen.flow_from_directory(
    test_data_dir,
    target_size=(image_height, image_width),
    batch_size=1,
    class_mode='categorical',
    shuffle=False
)

# Initialize counters for each class
class_indices = {v: k for k, v in test_dataset.class_indices.items()}
class_counts = {class_name: 0 for class_name in class_indices.values()}

# Evaluate the model on test images with confidence thresholding
correct_predictions = 0
total_samples = len(test_dataset.filenames)

for i in tqdm(range(total_samples), desc="Testing Progress"):
    # Load an image from the test dataset
    image_path = os.path.join(test_data_dir, test_dataset.filenames[i])
    image = cv2.imread(image_path)
    if image is None:
        continue

    # Resize the image to match the input size of the model
    image = cv2.resize(image, (image_height, image_width))
    
    # Apply random augmentations
    augmented_image = augment_image(image)

    # Prepare the image for prediction
    input_image = np.expand_dims(augmented_image, axis=0) / 255.0

    # Predict the class of the image
    prediction = model.predict(input_image, verbose=0)
    predicted_class_index = np.argmax(prediction)
    confidence = np.max(prediction)

    # Update the class count only if the confidence is above the threshold
    if confidence >= confidence_threshold:
        predicted_class_name = class_indices[predicted_class_index]
        class_counts[predicted_class_name] += 1

    # Check if the prediction is correct
    true_class_index = test_dataset.classes[i]
    if confidence >= confidence_threshold and predicted_class_index == true_class_index and predicted_class_index != test_dataset.class_indices['nothing']:
        correct_predictions += 1

# Calculate and display the accuracy
accuracy = (correct_predictions / total_samples) * 100
print(f"Test Accuracy on Augmented Images with Confidence Thresholding: {accuracy:.2f}%")

# Display the count of each detected class
for class_name, count in class_counts.items():
    print(f"{count} {class_name} detected during testing")
