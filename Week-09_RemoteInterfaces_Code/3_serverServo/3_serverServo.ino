/*
  DM3014 Interactive Devices, Ashley Hi 2026
  Week 9 - Remote Interfaces
  ESP32-C3 Server Servo Control
  Move a 180° servo motor over web server.
  Additional Components: Servo Motor
*/

// ====== Reference Libraries ======
#include <WiFi.h>
#include <ESP32Servo.h>

// ====== Network Credentials ======
const char* ssid     = "ESP32-Access-Emi"; // *** edit AP name here
const char* password = "jessie331";         // *** edit password here

// ====== Network Settings ======
WiFiServer server(80);
String header;        // variable stores HTTP request
int servo_angle = 90; // variable stores current servo angle (0-180)

// ====== Assign Servo Pin ======
#define SERVO_PIN 13
Servo myServo;

// ====== Webpage ======
// *** edit the page here, written exactly like a normal HTML file
// %ANGLE% is a placeholder: it gets swapped for the current servo angle,
const char webpage[] = R"HTML(
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" href="data:,">
  <style>
    html { font-family: Helvetica; text-align: center; }
    .button {
      background-color: #C3EAFA;
      color: #053142;
      border: 2px solid #94CBE3;
      border-radius: 50%;
      width: 90px; 
      height: 90px;
      padding: 0;
      font-size: 20px;
      margin: 2px;
      cursor: pointer;
    }
    .compass {
      display: grid;
    grid-template-columns: repeat(3, auto);
    justify-content: center;
    gap: 10px;
    margin-top: 20px;
    }
    .north { grid-column: 2; grid-row: 1; }
    .west  { grid-column: 1; grid-row: 2; }
    .east  { grid-column: 3; grid-row: 2; }

  </style>
</head>
<body>
  <h1>ESP32 Mini Compass</h1>
  <p>Servo Angle - %ANGLE%&deg;</p>
 
  <!-- add more angles by copying a line and changing both numbers -->
  <div class="compass">
    <a class="north" href="/servo/90"><button class="button">north</button></a>
    <a class="west"  href="/servo/180"><button class="button">west</button></a>
    <a class="east"  href="/servo/0"><button class="button">east</button></a>
  </div>

</body>
</html>
)HTML";

void setup() {
  // ESP32PWM::allocateTimer(0);
  // ESP32PWM::allocateTimer(1);
  // ESP32PWM::allocateTimer(2);
  // ESP32PWM::allocateTimer(3);
  // ====== Setup Serial Monitor ======
  Serial.begin(115200);

  // ====== Setup Servo ======
  myServo.setPeriodHertz(50);           // standard servos expect 50 Hz
  myServo.attach(SERVO_PIN, 500, 2400); // pulse width range in microseconds
  myServo.write(servo_angle);           // move to start position

  // ====== Setup ESP as Access Point ======
  Serial.print("Setting AP (Access Point)…");
  WiFi.softAP(ssid, password);
  IPAddress IP = WiFi.softAPIP();
  Serial.print("IP Address: ");
  Serial.println(IP);
  server.begin();
}

void loop(){
  WiFiClient client = server.available(); // listen for incoming clients
  if (client) {                           // if a new client connects
    Serial.println("New Client");   
    String currentLine = "";
    unsigned long startTime = millis();   // note when client connected (for timeout)
    while (client.connected() && millis() - startTime < 2000) { // set a 2s timeout
      if (client.available()) {           // if there's bytes to read from the client
        char c = client.read();           // read a byte
        Serial.write(c);
        header += c;
        if (c == '\n') {
          if (currentLine.length() == 0) {
            // ====== Setup Webpage ======
            client.println("HTTP/1.1 200 OK");
            client.println("Content-type:text/html");
            client.println("Connection: close");
            client.println();
            
            // ====== Move Servo ======
            int pos = header.indexOf("GET /servo/");
            if (pos >= 0) {
              servo_angle = constrain(header.substring(pos + 11).toInt(), 0, 180); // read the number after /servo/
              Serial.println("servo to " + String(servo_angle));
              myServo.write(servo_angle);
            } 
            
            // ====== Display HTML Webpage ======
            String page = webpage;                        // copy webpage from top of the sketch
            page.replace("%ANGLE%", String(servo_angle)); // fill in the current angle
            client.print(page);                           // send it to the browser
            client.println();                             // HTTP response ends with another blank line
            break;                                        // break out of the while loop
          } else {
            currentLine = "";
          }
        } else if (c != '\r') {
          currentLine += c;
        }
      }
    }
    header = "";   // clear the header variable
    client.stop(); // close the connection
    Serial.println("Client disconnected.");
    Serial.println("");
  }
}