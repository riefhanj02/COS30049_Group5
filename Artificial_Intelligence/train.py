import tensorflow as tf
import numpy as np
import os
import cv2
import shutil
import json
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout
from tensorflow.keras.models import Model
from tensorflow.keras.optimizers import Adam
from tqdm import tqdm
import random

# Define constants
image_height, image_width = 224, 224
batch_size = 32
epochs = 20
initial_learning_rate = 0.001
confidence_threshold = 0.8  # Confidence threshold for predictions

# Define directories
data_dir = r"C:\Swinburne\Y2S1\AI_test\data"
train_data_dir = os.path.join(data_dir, "train")
val_data_dir = os.path.join(data_dir, "val")

# Move 20% of images from train to validation folder
def split_train_val(train_dir, val_dir, split_ratio=0.2):
    classes = os.listdir(train_dir)
    for class_name in classes:
        train_class_dir = os.path.join(train_dir, class_name)
        val_class_dir = os.path.join(val_dir, class_name)
        
        if not os.path.exists(val_class_dir):
            os.makedirs(val_class_dir)
        
        images = os.listdir(train_class_dir)
        num_images_to_move = int(len(images) * split_ratio)
        images_to_move = random.sample(images, num_images_to_move)
        
        for image in images_to_move:
            src_path = os.path.join(train_class_dir, image)
            dest_path = os.path.join(val_class_dir, image)
            shutil.move(src_path, dest_path)

# Execute the split function
split_train_val(train_data_dir, val_data_dir)

# Data augmentation for training
data_gen_train = ImageDataGenerator(
    rescale=1.0/255,
    rotation_range=40,
    width_shift_range=0.2,
    height_shift_range=0.2,
    shear_range=0.2,
    zoom_range=0.2,
    horizontal_flip=True,
    fill_mode='nearest'
)

# Data generator for validation
data_gen_val = ImageDataGenerator(rescale=1.0/255)

# Load training and validation datasets
train_dataset = data_gen_train.flow_from_directory(
    train_data_dir,
    target_size=(image_height, image_width),
    batch_size=batch_size,
    class_mode='categorical'
)

val_dataset = data_gen_val.flow_from_directory(
    val_data_dir,
    target_size=(image_height, image_width),
    batch_size=batch_size,
    class_mode='categorical'
)

# Save the class indices for use during inference
with open('class_indices.json', 'w') as f:
    json.dump(train_dataset.class_indices, f)

# Load the base model
base_model = MobileNetV2(weights='imagenet', include_top=False, input_shape=(image_height, image_width, 3))
base_model.trainable = False  # Freeze the base model

# Add custom layers on top of the base model
x = base_model.output
x = GlobalAveragePooling2D()(x)
x = Dense(1024, activation='relu')(x)
x = Dropout(0.5)(x)  # Add dropout to reduce overfitting
predictions = Dense(train_dataset.num_classes, activation='softmax')(x)

# Create the model
model = Model(inputs=base_model.input, outputs=predictions)

# Compile the model
model.compile(optimizer=Adam(learning_rate=initial_learning_rate), loss='categorical_crossentropy', metrics=['accuracy'])

# Train the model
model.fit(
    train_dataset,
    epochs=epochs,
    validation_data=val_dataset
)

# Unfreeze some layers of the base model for fine-tuning
for layer in base_model.layers[-30:]:
    layer.trainable = True

# Compile the model with a lower learning rate for fine-tuning
model.compile(optimizer=Adam(learning_rate=initial_learning_rate / 10), loss='categorical_crossentropy', metrics=['accuracy'])

# Fine-tune the model
model.fit(
    train_dataset,
    epochs=10,  # Additional epochs for fine-tuning
    validation_data=val_dataset
)

# Save the trained model
model.save('orangutan_detection_model.h5')

# Evaluate model on validation data with confidence thresholding
val_dataset.reset()
correct_predictions = 0
total_samples = len(val_dataset.filenames)

for i in tqdm(range(total_samples), desc="Evaluating Validation Set with Confidence Thresholding"):
    # Load an image from the validation dataset
    image_path = os.path.join(val_data_dir, val_dataset.filenames[i])
    image = cv2.imread(image_path)
    if image is None:
        continue

    # Resize the image to match the input size of the model
    image = cv2.resize(image, (image_height, image_width))

    # Prepare the image for prediction
    input_image = np.expand_dims(image, axis=0) / 255.0

    # Predict the class of the image
    prediction = model.predict(input_image, verbose=0)
    predicted_class_index = np.argmax(prediction)
    confidence = np.max(prediction)

    if confidence >= confidence_threshold:
        true_class_index = val_dataset.classes[i]
        if predicted_class_index == true_class_index and predicted_class_index != train_dataset.class_indices['nothing']:
            correct_predictions += 1

# Calculate and display the accuracy with confidence thresholding
accuracy = (correct_predictions / total_samples) * 100
print(f"Validation Accuracy with Confidence Thresholding: {accuracy:.2f}%")
