Wildlife Detection AI Model Setup Guide
This document guides you on how to install and run the files related to the Wildlife Detection AI model. Please follow the steps in order, and remember to modify the paths to fit your own directory setup.

*Requirements:
Python 3.10.0
TensorFlow 2.9.1
Scipy 1.7.3
NumPy 1.21.6
Pillow
OpenCV
Flask
tqdm (for progress visualization)
ImageDataGenerator (from TensorFlow/Keras)
HD Webcam (connected to your computer)
Installation Instructions
Set Up Python Environment:

*It is recommended to use a virtual environment for installing the required libraries.
Enter the following code:

python -m venv venv

Activate the virtual environment:
On Windows:

venv\Scripts\activate

On macOS/Linux:

source venv/bin/activate

*Install Required Libraries:
Install all the necessary Python libraries by running the following command:

pip install numpy==1.21.6
pip install scipy==1.7.3
pip install tensorflow==2.9.1
pip install pillow
pip install opencv-python
pip install flask
pip install tqdm

Make sure to install other additional dependencies if they are missing.

*Update Paths in Python Files:
train.py: Update the following paths:
Modify data_dir to match the location of your training and validation images.
This directory must contain subfolders (train, val) with each class (e.g., deer, frog, etc.).
test.py: Update test_data_dir to the directory where your testing images are stored.
convert.py: Make sure the paths for input and output model files are correct according to your directory setup.
Training the Model
Splitting Data into Train/Validation Folders:

*Run train.py to prepare the dataset. The script will automatically move 20% of the images from the training folder to the validation folder.
Each class folder should have images of the respective category:

├── train
│   ├── deer
│   ├── frog
│   ├── nothing
│   ├── orangutan
│   ├── poacher
│   ├── tiger
├── val (This will initially be empty, `train.py` will handle the split.)

*Important: Please ensure the class nothing is included for training to help the model distinguish and avoid identifying random backgrounds as animals.
Training the Model:

Execute the training script to train the AI model:

python train.py

This will generate an .h5 model file (orangutan_detection_model.h5) after training.

*Validation During Training:
The model will validate itself using the validation images, ensuring that it's learning correctly with real-world variability. The script will display accuracy after each training cycle.

*Model Conversion for IoT Deployment
Convert the Model:
To convert the trained model into a .tflite format suitable for IoT deployment, run:

python convert.py

This creates a lightweight version of the model (orangutan_detection_model.tflite) optimized for the M5Stack Fire IoT device.

*Testing the Model
Testing with Static Images:
To evaluate the model's accuracy on test images, run the test.py script:

python test.py

The script will test the model on images, apply random augmentation (like brightness and rotation), and show the detection count for each class.

*Testing with Live Webcam
To use a live webcam feed for testing, connect your HD webcam to your computer. But to have a better result, run the live test on M5Stacks Fire.
Update the script live_test.py to use the correct device index (e.g., 0 for most webcams).
Run:

python live_test.py

This script will run predictions in real-time from your webcam feed.

*Important Notes
File Paths: Modify all the file paths in each script to match your directory setup.
Confidence Threshold: The confidence threshold for the AI model has been set to 80%. This value can be adjusted in the script to tweak the sensitivity of the model during testing.
HD Webcam Setup: Ensure the HD webcam is properly connected and accessible from your machine. You might need to adjust the camera index in the script (0 by default).

*Potential Issues
Model Not Detecting Correctly: Ensure you use well-lit conditions during testing to reduce false detections.
Database Connection Issue: The data science member was unable to complete their portion, meaning no integration was performed between the AI data and the frontend. This means the AI detections currently do not interact with a database.
Summary
This AI model aims to detect orangutans, tigers, deer, frogs, and poachers in real-time, leveraging both image datasets and an IoT deployment setup for environmental monitoring. Make sure to set up all paths correctly and follow the training/testing steps for successful implementation.

Thank you for choosing us!