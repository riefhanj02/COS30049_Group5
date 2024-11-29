#include <M5Unified.h>
#include <M5UnitUnifiedENV.h> // For UnitUnified
#include <WiFi.h>
#include <Adafruit_NeoPixel.h>
#include <SHT3X.h>       // Include SHT3X library for temperature and humidity
#include <BMP280.h>     // Include BMP280 library for pressure
#include <HTTPClient.h>
#include <M5GFX.h> // For handling JPEG image decoding
#include <ArduinoJson.h>

// Declare sensor objects
SHT3X sht30;            // For temperature and humidity
BMP280 bmp280;        // For atmospheric pressure

// Wi-Fi Credentials
const char* ssid = "isthisthekrustycrab-2.4GHz";
const char* password = "georgemiller777";
const char* snapshotURL = "http://192.168.0.103:5000/snapshot";
const char* analyzeURL = "http://192.168.0.103:5000/analyze";
const char* AIURL = "http://192.168.0.103:5000/AI";

// RGB LED settings
#define M5STACK_FIRE_NEO_NUM_LEDS 10
#define M5STACK_FIRE_NEO_DATA_PIN 15
Adafruit_NeoPixel pixels = Adafruit_NeoPixel(
    M5STACK_FIRE_NEO_NUM_LEDS, M5STACK_FIRE_NEO_DATA_PIN, NEO_GRB + NEO_KHZ800);

// States for screen navigation
bool onMainScreen = true;
bool onOptionsScreen = false;
bool onSecondaryOptionsScreen = false;
bool motionDetectionActive = false;
bool showTemperature = true;
bool showHumidity = false;
bool showPressure = false;
bool motionDetectorScreen = false;  // Track if we are on the motion detector screen
bool onENVScreen = false;
bool onENVSubScreen = false;
// Declare timing and state variables for detecting double-clicks
unsigned long lastBtnATime = 0;
bool btnAClickedOnce = false;
const unsigned long doubleClickInterval = 500; // 500 milliseconds for detecting double-clicks
bool cameraSnapActive = false; // Track if the camera snap process is active
bool onCameraTrapScreen = false; // Track if on the Camera Trap page
bool cameraTrapMotionActive = false; // Track if the motion detector is active in Camera Trap
// Timer for motion detection in Camera Trap mode
unsigned long lastMotionDetectedTime = 0; // Store the last time motion was detected
bool isSnapshotCooldown = false;         // Track if we are in the cooldown period
const unsigned long motionCooldownDuration = 3000; // 3 seconds cooldown
bool motionDetected = false;

// Motion sensor pin (Port B, G36)
#define MOTION_PIN 36

// Function Declarations
void connectToWiFi();
void displayMainScreen();
void displayOptionsScreen();
void displaySecondaryOptions();
void displayENVSelectionScreen(); 
void displayTemperatureDetailsPage();
void displayHumidityDetailsPage();
void displayPressureDetailsPage();
void checkMotion();
void blinkRGBWithAlarm(int r, int g, int b);
void setRGB(int r, int g, int b);
void turnOffRGB();
void displayButtonLabels();
void displayButtonLabelsC();
void displayButtonLabelsBC();
void displayButtonLabelsAC();
void drawCameraSymbolAboveButtonA();
void takeSnapshot();
void displayCameraTrapPage();
void handleButtonA();
void handleButtonB();
void handleButtonC();
void sendMotionDetected();
void displayMainScreen();
void takeSnapshotWithAI();
void connectToWiFi();


void setup() {

  // Initialize M5Stack
  auto cfg = M5.config();
  cfg.internal_imu = false;    // Disable IMU if not used
  cfg.internal_rtc = false;    // Disable RTC if not used
  cfg.internal_spk = true;     // Enable Speaker
  M5.begin(cfg);
  M5.Lcd.clear();
  M5.Lcd.setTextSize(2);  // Set default text size

  // Initialize NeoPixel
  pixels.begin();
  turnOffRGB();

  // Initialize ENV II sensors
  if (!sht30.begin()) {
    M5.Lcd.println("Failed to initialize SHT3X sensor");
    while (1);  // Halt if the sensor initialization fails
  }

  if (!bmp280.begin(&Wire, 0x76)) { // Use the bmp280 object
    M5.Lcd.println("Failed to initialize BMP280 at 0x76!");
  }

  // Initialize motion sensor pin
  pinMode(MOTION_PIN, INPUT);

  // Connect to Wi-Fi
  connectToWiFi();

  // Show main screen
  displayMainScreen();
}

void loop() {
  // Update button presses
  M5.update();
  // Check motion if active
  if (motionDetectionActive) {
    checkMotion();
  }
  // Handle button presses
  if (M5.BtnA.wasPressed()) {
    handleButtonA();
    checkDoubleClickA(); // Check for double-click behavior
  }
  if (M5.BtnB.wasPressed()) {
    handleButtonB();
  }
  if (M5.BtnC.wasPressed()) {
    handleButtonC();
  }
}

// Function to return to the main menu
void returnToMainMenu() {
  onMainScreen = false;
  onOptionsScreen = false;
  onSecondaryOptionsScreen = true;
  onENVScreen = false;
  onENVSubScreen = false;
  motionDetectorScreen = false;
  motionDetectionActive = false;

  // Clear screen and display main menu
  displaySecondaryOptions();
}

// Function to connect to Wi-Fi
void connectToWiFi() {
  M5.Lcd.setCursor(0, 20);
  M5.Lcd.println("Connecting to Wi-Fi...");
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    M5.Lcd.print(".");
  }

  M5.Lcd.setCursor(0, 40);
  M5.Lcd.println("\nConnected to Wi-Fi");
  M5.Lcd.println("IP Address: " + WiFi.localIP().toString());
}

// Function to display the main screen
void displayMainScreen() {
  M5.Lcd.clear();
  M5.Lcd.setCursor(20, 40);
  M5.Lcd.println("Connected to Wi-Fi");
  M5.Lcd.setCursor(20, 60);
  M5.Lcd.println("Welcome!");
  M5.Lcd.setCursor(20, 80);
  M5.Lcd.println("Press C to Proceed.");
  onMainScreen = true;
  onOptionsScreen = false;
  onSecondaryOptionsScreen = false;
  motionDetectionActive = false;

  // Turn off RGB LEDs
  turnOffRGB();

  // Display button labels
  displayButtonLabelsC();
}

// Function to display the options screen
void displayOptionsScreen() {
  M5.Lcd.clear();
  M5.Lcd.setCursor(20, 40);
  M5.Lcd.println("Select Action:");
  M5.Lcd.setCursor(20, 60);
  M5.Lcd.println("A: Next");
  M5.Lcd.setCursor(20, 80);
  M5.Lcd.println("B: Motion Detector/");
  M5.Lcd.setCursor(20, 100);
  M5.Lcd.println("   Camera Trap");
  M5.Lcd.setCursor(20, 120);
  M5.Lcd.println("C: Main Screen");
  onMainScreen = false;
  onOptionsScreen = true;
  onSecondaryOptionsScreen = false;
  motionDetectionActive = false;

  // Turn off RGB LEDs
  turnOffRGB();

  // Display button labels
  displayButtonLabels();
}

// Function to display the ENV screen
void displayENVScreen() {
  M5.Lcd.clear();
  M5.Lcd.setCursor(20, 40);
  M5.Lcd.println("ENV II Sensor Data");
  M5.Lcd.setCursor(20, 60);
  M5.Lcd.println("A: Temperature");
  M5.Lcd.setCursor(20, 80);
  M5.Lcd.println("B: Humidity");
  M5.Lcd.setCursor(20, 100);
  M5.Lcd.println("C: Atmospheric Pressure");
  updateENVDisplay();
  onOptionsScreen = false;
  onSecondaryOptionsScreen = true;
  displayButtonLabels();
}

// Function to display the secondary options screen
void displaySecondaryOptions() {
  M5.Lcd.clear();
  M5.Lcd.setCursor(20, 40);
  M5.Lcd.println("Select Action:");
  M5.Lcd.setCursor(20, 60);
  M5.Lcd.println("A: Camera Snap");
  M5.Lcd.setCursor(20, 80);
  M5.Lcd.println("B: Environmental Sensor");
  M5.Lcd.setCursor(20, 100);
  M5.Lcd.println("C: Back");
  onMainScreen = false;
  onOptionsScreen = false;
  onSecondaryOptionsScreen = true;
  onENVScreen = false;
  onENVSubScreen = false;
  motionDetectionActive = false;

  // Turn off RGB LEDs
  turnOffRGB();

  // Display button labels
  displayButtonLabels();
}

void updateENVDisplay() {
    M5.Lcd.clear();
    M5.Lcd.setCursor(20, 40);
    M5.Lcd.println("ENV Sensor Data:");

    float temperature = 0.0;
    float humidity = 0.0;

    // Use the update() method to fetch data from the SHT3X sensor
    if (sht30.update()) {  // Check if the sensor data is successfully updated
        temperature = sht30.cTemp;   // Access Celsius temperature
        humidity = sht30.humidity;  // Access relative humidity

        if (showTemperature) {
            M5.Lcd.println("Temperature: " + String(temperature, 1) + " C");
        }
        if (showHumidity) {
            M5.Lcd.println("Humidity: " + String(humidity, 1) + " %");
        }
    }

    // Read atmospheric pressure from BMP280
    if (showPressure) {
        float pressure = bmp280.readPressure() / 100.0;  // Read pressure in hPa
        M5.Lcd.println("Pressure: " + String(pressure, 1) + " hPa");
    }
}

// Function to display the Temperature page
void displayTemperatureDetailsPage() {
  M5.Lcd.clear();
  M5.Lcd.setCursor(20, 40);
  M5.Lcd.println("Temperature Details");
  
  float temperature = 0.0;

  if (sht30.update()) {
    temperature = sht30.cTemp; // Celsius temperature
    M5.Lcd.setCursor(20, 60);
    M5.Lcd.println("Temperature: " + String(temperature, 1) + " C");
    M5.Lcd.setCursor(20, 80);
    M5.Lcd.println("Safe Range: 15°C - 35°C");
  } else {
    M5.Lcd.setCursor(20, 60);
    M5.Lcd.println("Failed to read Temperature!");
  }

  M5.Lcd.setCursor(20, 140);
  M5.Lcd.println("Double A: Other Actions");
  M5.Lcd.setCursor(20, 160);
  M5.Lcd.println("C: Return to ENV");
  displayButtonLabelsAC();
}

void displayHumidityDetailsPage() {
  M5.Lcd.clear();
  M5.Lcd.setCursor(20, 40);
  M5.Lcd.println("Humidity Details");

  float humidity = 0.0;

  if (sht30.update()) {
    humidity = sht30.humidity; // Relative humidity
    M5.Lcd.setCursor(20, 60);
    M5.Lcd.println("Humidity: " + String(humidity, 1) + " %");
    M5.Lcd.setCursor(20, 80);
    M5.Lcd.println("Safe Range: 30% - 70%");
  } else {
    M5.Lcd.setCursor(20, 60);
    M5.Lcd.println("Failed to read Humidity!");
  }

  M5.Lcd.setCursor(20, 140);
  M5.Lcd.println("Double A: Other Actions");
  M5.Lcd.setCursor(20, 160);
  M5.Lcd.println("C: Return to ENV");
  displayButtonLabelsAC();
}

void displayPressureDetailsPage() {
    M5.Lcd.clear();
    M5.Lcd.setCursor(20, 40);
    M5.Lcd.println("Pressure Details");

    float pressure = bmp280.readPressure() / 100.0;  // Read pressure in hPa

    if (pressure > 300 && pressure < 1100) { // Valid pressure range in hPa
        M5.Lcd.setCursor(20, 60);
        M5.Lcd.println("Pressure: " + String(pressure, 1) + " hPa");
        M5.Lcd.setCursor(20, 80);
        M5.Lcd.println("Normal Range: ");
        M5.Lcd.setCursor(20, 100);
        M5.Lcd.println("900 - 1025 hPa");
    } else {
        M5.Lcd.setCursor(20, 60);
        M5.Lcd.println("Failed to read Pressure!");
        M5.Lcd.setCursor(20, 80);
        M5.Lcd.println("Check Sensor Connection.");
    }

    Serial.println("Raw Pressure Reading: " + String(pressure));
    M5.Lcd.setCursor(20, 140);
    M5.Lcd.println("Double A: Other Actions");
    M5.Lcd.setCursor(20, 160);
    M5.Lcd.println("C: Return to ENV");
    displayButtonLabelsAC();
}

// Function to display all the button labels
void displayButtonLabels() {
  M5.Lcd.setTextSize(3);  // Increase text size for button labels
  M5.Lcd.setCursor(55, 200);
  M5.Lcd.println("A");
  M5.Lcd.setCursor(155, 200);
  M5.Lcd.println("B");
  M5.Lcd.setCursor(250, 200);
  M5.Lcd.println("C");
  M5.Lcd.setTextSize(2);  // Reset text size
}

// Function to display button labels for C only
void displayButtonLabelsC() {
  M5.Lcd.setTextSize(3);  // Increase text size for button labels
  M5.Lcd.setCursor(250, 200);
  M5.Lcd.println("C");
  M5.Lcd.setTextSize(2);
}

// Function to display button labels for B and C only
void displayButtonLabelsBC() {
  M5.Lcd.setTextSize(3);  // Increase text size for button labels
  M5.Lcd.setCursor(155, 200);
  M5.Lcd.println("B");
  M5.Lcd.setCursor(250, 200);
  M5.Lcd.println("C");
  M5.Lcd.setTextSize(2);
}

void displayButtonLabelsAC() {
  M5.Lcd.setTextSize(3);  // Increase text size for button labels
  M5.Lcd.setCursor(55, 200);
  M5.Lcd.println("A");
  M5.Lcd.setCursor(250, 200);
  M5.Lcd.println("C");
  M5.Lcd.setTextSize(2); 
}

void drawCameraSymbolAboveButtonA() {
  // Coordinates for the camera symbol
  int x = 60;  // X-coordinate for Button A
  int y = 235; // Y-coordinate above Button A

  // Draw camera body
 // Draw the camera body
  M5.Lcd.fillRect(x - 10, y - 20, 24, 14, TFT_WHITE); // Adjust width and height for better proportions
  M5.Lcd.drawRect(x - 10, y - 20, 24, 14, TFT_BLACK); // Add a black border for clarity

  // Draw the camera lens
  M5.Lcd.fillCircle(x + 2, y - 14, 6, TFT_BLACK);    // Adjusted lens position and radius for alignment
  M5.Lcd.drawCircle(x + 2, y - 14, 6, TFT_WHITE);    // Add a white border around the lens

  // Draw the camera top bar
  M5.Lcd.fillRect(x - 6, y - 22, 12, 2, TFT_BLACK);  // Align the top bar to the center of the camera body

  // Draw the flash
  M5.Lcd.fillCircle(x + 2, y - 14, 2, TFT_BLACK);    // Adjusted flash position and radius for alignment
  M5.Lcd.drawCircle(x + 2, y - 14, 2, TFT_WHITE);    // Add a white border around the flash
}

// Function to simulate taking a snapshot
void takeSnapshot() {
    cameraSnapActive = true;  // Set the state to active
    M5.Lcd.clear();
    M5.Lcd.setCursor(20, 60);
    M5.Lcd.println("Capturing Snapshot...");

    HTTPClient http;
    String url = "http://192.168.0.103:5000/snapshot"; // Flask server URL for static snapshot

    http.begin(url); // Start the HTTP connection
    int httpCode = http.GET();

    if (httpCode == HTTP_CODE_OK) {
        // Successfully fetched image
        WiFiClient* stream = http.getStreamPtr();
        int contentLength = http.getSize();
        M5.Lcd.setCursor(20, 100);
        M5.Lcd.println("Content Length: " + String(contentLength));

        if (contentLength > 0) {
            uint8_t* buffer = new uint8_t[contentLength];
            int bytesRead = 0;

            while (stream->available() && bytesRead < contentLength) {
                buffer[bytesRead++] = stream->read();
            }

            // Decode and draw the JPEG image
            bool success = M5.Lcd.drawJpg(buffer, contentLength);
            delete[] buffer; // Free the buffer memory

        } 
    } else {
        // Error occurred while fetching the snapshot
        M5.Lcd.setCursor(20, 80);
        M5.Lcd.printf("Error: HTTP %d", httpCode);
    }

    http.end(); // Close the HTTP connection

    M5.Lcd.setCursor(20, 180);
    M5.Lcd.println("Press C to go Back.");
    drawCameraSymbolAboveButtonA();
    displayButtonLabelsC();
}

void takeSnapshotWithAI() {
  HTTPClient http;
  String url = "http://192.168.0.103:5000/AI"; // Flask server URL for static snapshot
  // Capture snapshot
  M5.Lcd.clear();
  M5.Lcd.setCursor(20, 40);
  M5.Lcd.println("Capturing Snapshot...");

  http.begin(snapshotURL);
  int httpCode = http.GET();
  if (httpCode == HTTP_CODE_OK) {
    // Successfully fetched image
    WiFiClient* stream = http.getStreamPtr();
    int contentLength = http.getSize();
    M5.Lcd.setCursor(20, 100);
    M5.Lcd.println("Content Length: " + String(contentLength));

    if (contentLength > 0) {
        uint8_t* buffer = new uint8_t[contentLength];
        int bytesRead = 0;

        while (stream->available() && bytesRead < contentLength) {
            buffer[bytesRead++] = stream->read();
        }

        // Decode and draw the JPEG image
        bool success = M5.Lcd.drawJpg(buffer, contentLength);
        delete[] buffer; // Free the buffer memory
    } 
  }
  http.end();

  // Analyze snapshot
  M5.Lcd.setCursor(20, 80);
  M5.Lcd.println("Analyzing Snapshot...");

  http.begin(AIURL);
  httpCode = http.GET();
  if (httpCode == HTTP_CODE_OK) {
    String payload = http.getString();
    StaticJsonDocument<200> doc;
    DeserializationError error = deserializeJson(doc, payload);

    if (!error) {
      const char* label = doc["label"];
      float confidence = doc["confidence"];
      M5.Lcd.setCursor(20, 140);
      M5.Lcd.printf("Detected: %s (%.2f%%)", label, confidence * 100);

      if (String(label) == "human" || String(label) == "tiger" || String(label) == "orangutan" || 
          String(label) == "deer" || String(label) == "frog" || String(label) == "nothing") {
      } else {
        M5.Lcd.setCursor(20, 140);
        M5.Lcd.println("Error: Unrecognized label.");
      }
    } else {
      M5.Lcd.println("Error parsing AI response.");
    }
  } else {
    M5.Lcd.println("Error: Unable to analyze snapshot.");
  }
  http.end();
}

void displayENVSelectionScreen() {
  M5.Lcd.clear();
  M5.Lcd.setCursor(20, 40);
  M5.Lcd.println("ENV Sensors");
  M5.Lcd.setCursor(20, 60);
  M5.Lcd.println("A: Temperature");
  M5.Lcd.setCursor(20, 80);
  M5.Lcd.println("B: Humidity");
  M5.Lcd.setCursor(20, 100);
  M5.Lcd.println("C: Pressure");
  onENVScreen = true;
  displayButtonLabels();
}

void displayCameraTrapPage() {
  M5.Lcd.clear();
  M5.Lcd.setCursor(20, 40);
  M5.Lcd.println("Camera Trap");
  M5.Lcd.setCursor(20, 60);
  M5.Lcd.println("Press B to Toggle On/Off");
  M5.Lcd.setCursor(20, 80);
  M5.Lcd.println("Press C to go Back");
  M5.Lcd.setCursor(20, 100);
  if (cameraTrapMotionActive) {
    M5.Lcd.println("CamTrap: ON");
  } else {
    M5.Lcd.println("CamTrap: OFF");
  }
  onSecondaryOptionsScreen = false;
  onCameraTrapScreen = true;
  displayButtonLabelsBC();
}

// Function to check motion and update display
void checkMotion() {
  if (cameraTrapMotionActive && !isSnapshotCooldown) {
    // CamTrap: Detect motion and trigger snapshot
    if (digitalRead(MOTION_PIN) == HIGH) {
      M5.Lcd.setCursor(20, 160);
      M5.Lcd.println("Motion Detected (CamTrap)!!!");

      // Trigger snapshot
      takeSnapshotWithAI();

      // Start cooldown
      isSnapshotCooldown = true;
      lastMotionDetectedTime = millis();

      // Turn LEDs red
      blinkRGBWithAlarm(255, 0, 0);
    }
  } else if (motionDetectionActive) {
    // Motion Detector: Detect motion without snapshot
    if (digitalRead(MOTION_PIN) == HIGH) {
      M5.Lcd.setCursor(20, 160);
      M5.Lcd.println("Motion Detected!!!");

      // Turn LEDs red
      blinkRGBWithAlarm(255, 0, 0);
    } else {
      M5.Lcd.setCursor(20, 160);
      M5.Lcd.println("No Motion Detected."); // Overwrite text
      setRGB(0, 255, 0); // Turn LEDs green
    }
  }

  // Cooldown logic for CamTrap
  if (isSnapshotCooldown) {
    if (millis() - lastMotionDetectedTime >= motionCooldownDuration) {
      isSnapshotCooldown = false; // Reset cooldown
      M5.Lcd.setCursor(20, 160);
      M5.Lcd.println("Detecting motion.."); // Notify ready state
    }
  }
}

// Function to blink RGB LEDs with alarm
void blinkRGBWithAlarm(int r, int g, int b) {
  static unsigned long lastBlinkTime = 0;
  static bool isOn = false;

  unsigned long currentMillis = millis();
  if (currentMillis - lastBlinkTime >= 500) {  // Toggle every 0.5 seconds
    isOn = !isOn;

    if (isOn) {
      setRGB(r, g, b);
      M5.Speaker.tone(500, 500);  // Play a 1000 Hz tone for 0.5 seconds
    } else {
      turnOffRGB();
      M5.Speaker.stop();  // Stop the tone
    }

    lastBlinkTime = currentMillis;
  }
}

// Function to set RGB LEDs
void setRGB(int r, int g, int b) {
  for (int i = 0; i < M5STACK_FIRE_NEO_NUM_LEDS; i++) {
    pixels.setPixelColor(i, pixels.Color(r, g, b));  // Set color using RGB values
  }
  pixels.show();
}

// Function to turn off RGB LEDs
void turnOffRGB() {
  for (int i = 0; i < M5STACK_FIRE_NEO_NUM_LEDS; i++) {
    pixels.setPixelColor(i, pixels.Color(0, 0, 0));  // Turn off LEDs
  }
  pixels.show();
}

// Function to detect and handle double-click on Button A
void checkDoubleClickA() {
  unsigned long currentTime = millis();

  if (btnAClickedOnce && (currentTime - lastBtnATime <= doubleClickInterval)) {
    // Detected a double-click
    btnAClickedOnce = false; // Reset state
    lastBtnATime = 0;        // Reset timer

  if (onENVSubScreen) {
    // Navigate to Other Actions page from ENV subpages
    onENVSubScreen = false;
    displaySecondaryOptions();
    return;
    }
  } else {
    // Register a single click and start the timer
    btnAClickedOnce = true;
    lastBtnATime = currentTime;
    }
}

// Handle Button A
void handleButtonA() {
  if (onOptionsScreen) {
    displaySecondaryOptions(); // Move to the secondary options screen
    return;
  } 
  
  if (onSecondaryOptionsScreen && !motionDetectorScreen) {
    delay(500);
    takeSnapshot();
    return;
  } 
  
  if (onENVScreen && !onENVSubScreen) { // From ENV selection screen to Temperature details page
    onENVScreen = false; // Exit ENV screen state
    onENVSubScreen = true;
    displayTemperatureDetailsPage();
    return;
  }

  if (motionDetectorScreen) {
    // Navigate to Camera Trap page
    motionDetectorScreen = false;
    onCameraTrapScreen = true;
    motionDetectionActive = false;
    turnOffRGB();
    displayCameraTrapPage();
    return;
  }
}

// Handle Button B
// Handle Button B
void handleButtonB() {
  if (onCameraTrapScreen) {
    // Toggle CamTrap motion detection state
    cameraTrapMotionActive = !cameraTrapMotionActive;

    // Clear the screen and update the Camera Trap screen with the new state
    M5.Lcd.clear();
    M5.Lcd.setCursor(20, 40);
    M5.Lcd.println("Camera Trap");
    M5.Lcd.setCursor(20, 60);
    M5.Lcd.println("Press B to Toggle On");
    M5.Lcd.setCursor(20, 80);
    M5.Lcd.println("Press C to go Back");
    M5.Lcd.setCursor(20, 100);
    if (cameraTrapMotionActive) {
      M5.Lcd.println("CamTrap:  ON");
      motionDetectionActive = true; // Activate motion detection for CamTrap
    } else {
      M5.Lcd.println("CamTrap: OFF");
      motionDetectionActive = false; // Deactivate motion detection for CamTrap
      turnOffRGB(); // Turn off RGB LEDs
    }
    return;
  }

  if (cameraSnapActive) {
    // Ignore button presses during the camera snap process
    return;
  }

  if (onOptionsScreen) { // Navigate to motion detector screen
    motionDetectorScreen = true;  // Set to motion detector context
    onSecondaryOptionsScreen = true;
    M5.Lcd.clear();
    M5.Lcd.setCursor(20, 40);
    M5.Lcd.println("Motion Detector");
    M5.Lcd.setCursor(20, 60);
    M5.Lcd.println("Press A for CamTrap");
    M5.Lcd.setCursor(20, 80);
    M5.Lcd.println("Press B to Toggle On/Off");
    M5.Lcd.setCursor(20, 100);
    M5.Lcd.println("Press C to go Back");
    motionDetectionActive = false; // Ensure motion detection starts deactivated
    onOptionsScreen = false;
    onSecondaryOptionsScreen = false;
    turnOffRGB();
    displayButtonLabelsBC();
    return;
  } 
  
  if (motionDetectorScreen) { // Toggle motion detector
    motionDetectionActive = !motionDetectionActive; // Toggle state
    M5.Lcd.clear();
    M5.Lcd.setCursor(20, 40);
    if (motionDetectionActive) {
      M5.Lcd.println("Motion Detector");
      M5.Lcd.setCursor(20, 60);
      M5.Lcd.println("Activated");
    } else {
      M5.Lcd.println("Motion Detector");
      M5.Lcd.setCursor(20, 60);
      M5.Lcd.println("Deactivated");
      turnOffRGB();
    }
    M5.Lcd.setCursor(20, 80);
    M5.Lcd.println("Press A for CamTrap");
    M5.Lcd.setCursor(20, 100);
    M5.Lcd.println("Press B to Toggle On/Off");
    M5.Lcd.setCursor(20, 120);
    M5.Lcd.println("Press C to Go Back");
    displayButtonLabelsBC();
    return;
  }

  if (onSecondaryOptionsScreen && !motionDetectorScreen) { // Navigate to ENV selection screen
    onSecondaryOptionsScreen = false; // Disable secondary options screen
    onENVScreen = true; // Transition to the ENV screen
    displayENVSelectionScreen(); // Show ENV selection screen
    return;
  } 
  
  if (onENVScreen && !onENVSubScreen) { // From ENV selection to Humidity details page
    onENVSubScreen = true;
    onENVScreen = false; // Exit ENV screen state
    displayHumidityDetailsPage();
    return;
  }
}

// Handle Button C - Navigate Back
void handleButtonC() {
  
   if (onCameraTrapScreen) { // Navigate to motion detector screen
    motionDetectorScreen = true;  // Set to motion detector context
    onSecondaryOptionsScreen = true;
    M5.Lcd.clear();
    M5.Lcd.setCursor(20, 40);
    M5.Lcd.println("Motion Detector");
    M5.Lcd.setCursor(20, 60);
    M5.Lcd.println("Press A for CamTrap");
    M5.Lcd.setCursor(20, 80);
    M5.Lcd.println("Press B to Toggle On/Off");
    M5.Lcd.setCursor(20, 100);
    M5.Lcd.println("Press C to go Back");
    motionDetectionActive = false; // Ensure motion detection starts deactivated
    onOptionsScreen = false;
    onSecondaryOptionsScreen = false;
    onCameraTrapScreen = false;
    cameraTrapMotionActive = false;
    turnOffRGB();
    displayButtonLabelsBC();
    return;
  } 

  if (cameraSnapActive) {
    // Navigate back to the Secondary Options page
    cameraSnapActive = false; // Reset the state
    displaySecondaryOptions();
    return;
  }

  if (motionDetectorScreen) {
    // Exit Motion Detector Screen
    motionDetectorScreen = false;
    onOptionsScreen = true;
    displayOptionsScreen();
    return;
  }

  if (onENVSubScreen) {
    // Return to ENV selection screen
    onENVSubScreen = false;
    onENVScreen = true;
    displayENVSelectionScreen();
    return;
  }

  if (onSecondaryOptionsScreen) {
    // Return to Options Screen
    onSecondaryOptionsScreen = false;
    displayOptionsScreen();
    return;
  }

  if (onOptionsScreen) {
    // Return to Main Screen
    onOptionsScreen = false;
    displayMainScreen();
    return;
  }

  if (onMainScreen) { // Return to options screen from main screen
    displayOptionsScreen();
    return;
  }

  if (onENVScreen && !onENVSubScreen) { // From ENV selection to Humidity details page
    onENVSubScreen = true;
    onENVScreen = false; // Exit ENV screen state
    displayPressureDetailsPage();
    return;
  }
}