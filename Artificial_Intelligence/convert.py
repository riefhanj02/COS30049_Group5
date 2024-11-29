import tensorflow as tf

def convert_to_tflite():
    # Load the trained model
    model = tf.keras.models.load_model('orangutan_detection_model.h5')

    # Convert the model to TensorFlow Lite format
    converter = tf.lite.TFLiteConverter.from_keras_model(model)
    tflite_model = converter.convert()

    # Save the TensorFlow Lite model
    with open('orangutan_detection_model.tflite', 'wb') as f:
        f.write(tflite_model)

convert_to_tflite()
