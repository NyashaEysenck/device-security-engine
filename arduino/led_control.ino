#define GREEN_LED 12
#define RED_LED 13

void setup() {
  pinMode(GREEN_LED, OUTPUT);
  pinMode(RED_LED, OUTPUT);
  Serial.begin(9600);
  // Default: green on, red off
  digitalWrite(GREEN_LED, HIGH);
  digitalWrite(RED_LED, LOW);
}

void loop() {
  if (Serial.available()) {
    String cmd = Serial.readStringUntil('\n');
    cmd.trim();
    if (cmd == "GREEN_ON") {
      digitalWrite(GREEN_LED, HIGH);
      digitalWrite(RED_LED, LOW);
      Serial.println("GREEN_ON_ACK");
    } else if (cmd == "RED_ON") {
      digitalWrite(GREEN_LED, LOW);
      // Flicker the red LED for alert
      for (int i = 0; i < 10; i++) { // Flicker for ~2 seconds
        digitalWrite(RED_LED, HIGH);
        delay(100);
        digitalWrite(RED_LED, LOW);
        delay(100);
      }
      // Leave red LED ON after flicker
      digitalWrite(RED_LED, HIGH);
      Serial.println("RED_ON_ACK");
    }
  }
}
