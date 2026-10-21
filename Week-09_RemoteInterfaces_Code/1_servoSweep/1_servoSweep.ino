/* 
  DM3014 Interactive Devices, Ashley Hi 2026
  Week 9 - Remote Interfaces
  ESP32-C3 Servo Sweep
  Servo sweeps clockwise & anticlockwise from 0º – 180º.
  Additional Components: Servo Motor
*/

// ====== Reference Libraries ======
#include <ESP32Servo.h>

// ====== Set Servo ======
#define SERVO_PIN 13

// ====== Create Servo Objects ======
Servo servo;
int pos = 0;

void setup() {
	ESP32PWM::allocateTimer(0);
  ESP32PWM::allocateTimer(1);
  ESP32PWM::allocateTimer(2);
  ESP32PWM::allocateTimer(3);
  servo.setPeriodHertz(50);
  servo.attach(SERVO_PIN, 500, 2000); // min/max of 500us – 2000us for accurate 0º – 180º sweep
}

void loop() {
	servo.write(16);
	for (pos = 0; pos <= 180; pos += 1) { // 0º – 180º in steps of 1º
		servo.write(pos); // set servo position to 'pos'
		delay(10); // wait 10ms for servo to reach position
	}
	for (pos = 180; pos >= 0; pos -= 1) { // 180º – 0º in steps of 1º
		servo.write(pos);
		delay(10);
	}
}