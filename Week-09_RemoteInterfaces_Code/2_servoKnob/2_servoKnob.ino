/*
  DM3014 Interactive Devices, Ashley Hi 2026
  Week 9 - Remote Interfaces
  ESP32-C3 Servo Knob
  Controls servo position using a knob.
  Additional Components: Servo Motor, Potentiometer
*/

// ====== Reference Libraries ======
#include <ESP32Servo.h>

// ====== Set Servo & Knob ======
#define SERVO_PIN 7
#define POT_PIN 2 // must be an analog pin

// ====== Create Servo Objects ======
Servo servo;

int val; // variable to read value from analog pin

void setup() {
  servo.attach(SERVO_PIN, 500, 2000); // min/max of 500us – 2000us for an accurate 0º – 180º sweep
}

void loop() {
  val = analogRead(POT_PIN); // read value of potentiometer (0 – 1023)
  val = map(val, 0, 1023, 0, 180); // scale value to use with servo (0 – 180)
  servo.write(val); // set servo position to scaled value
  delay(15); // wait 15ms for servo to reach position                           
}
