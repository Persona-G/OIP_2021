#include <dht11.h>
#define DHT11_PIN A1              // Sets DHT11 to send analog reading to analog pin 1
#define waterSensor_PIN A2        // Sets sensor reading to analog pin 2
#define THRESHOLD 200             // Threshold level for the water level sensor
#include <LiquidCrystal.h>
#include <Servo.h>

const int Button_PIN = 2;
const int pump_LED_PIN = 52;
const int fan_PIN = 3;
const int uv_PIN = 5;
const int pump_PIN = 6;
const int LED_PIN = 7;
const int buzzer = 30;    //buzzer to arduino pin 30
unsigned char i = 0;      //Buzzer Counter

int buttonState = 0;
int water_reading = 0;    //Water Sensor Value
dht11 DHT;
Servo cameraServo;

const int rs = 8, en = 9, d4 = 13, d5 = 12, d6 = 11, d7 = 10;
LiquidCrystal lcd(rs, en, d4, d5, d6, d7);
int pos = 0;                                                                          //Initial Position of Servo Motor

void setup(){
  Serial.begin(9600);
//**************************************  Servo n Buzzer n Waterpump n LED **************************************
  cameraServo.attach(22);        //Attach servo to pin 22
  pinMode(buzzer, OUTPUT);       // Buzzer output
  pinMode(pump_LED_PIN, OUTPUT); // Water Pump LED Sumulation
  cameraServo.write(0);          // Sets the servo to 0 before each operation
//**************************************  LCD **************************************
  // set up the LCD's number of columns and rows:
  lcd.begin(16, 2);
  lcd.setCursor(0, 0);
  lcd.print("    GROUP 8");
  lcd.setCursor(0, 1);
  lcd.print("   Syringer");

//****************************************** Fan *****************************************
  pinMode(fan_PIN, OUTPUT);
  digitalWrite(fan_PIN, LOW); 

//****************************************** Pump *****************************************
  pinMode(pump_PIN, OUTPUT);
  digitalWrite(pump_PIN, LOW);

//****************************************** LED *****************************************
  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, LOW);

//****************************************** UVLED *****************************************
  pinMode(uv_PIN, OUTPUT);
  digitalWrite(uv_PIN, LOW);
}

void loop(){
 // int chk;
  String upload;                               // Data that's going to Pi
  //chk = DHT.read(DHT11_PIN);                   // READ TEMPERATURE HUMIDITY DATA
  
  buttonState = digitalRead(Button_PIN);       // Constantly check for button reading

  water_reading = analogRead(waterSensor_PIN); // Set water level reading to water_reading (Will be 

//************************************* Water Pump LED Simulation ********************
  if (buttonState == HIGH) {
    digitalWrite(pump_LED_PIN, HIGH);
    delay(100);
  } else {
    digitalWrite(pump_LED_PIN, LOW);
    delay(100);
  }
//**************************************************************************************
  
  if (Serial.available() > 0) {
    String data = Serial.readStringUntil('\n');
    
    if (data == "wash") {

      lcd.clear();
      lcd.setCursor(0, 0);
      lcd.print("Washing in ");
      lcd.setCursor(0,1);
      lcd.print("progress...");
      delay(200);
      
    } else if (data == "stopWash") {
      
      lcd.clear();
      lcd.setCursor(0, 0);
      lcd.print("Stopping the");
      lcd.setCursor(0, 1);
      lcd.print("Wash");
      delay(200);
      
    } else if (data == "dry") {
      
      Fan();
      LED();
      Pump();           // Will be implementing a function to stop the pump once water level has reached required levels [FULL]
      LCD();  
      
    } else if (data == "stopDry") {
      
      StopFan();
      StopLED();
      PumpStop();      // Will be implementing a function to stop the pump once water level has reached required levels [EMPTY]
      
    } else if (data == "sterilize") {
      
      UV();
      LCD();  
      
    } else if (data == "stopSterilize") {
      
      StopUV();
      lcd.clear();
      lcd.setCursor(0,0);
      lcd.print("Sterilization");
      lcd.setCursor(0,1);
      lcd.print("Completed");

    } else if (data == "alert") {   
      tone(buzzer,1000); // Send 1KHz sound signal...

    } else if (data == "stopAlert"){
  
         noTone(buzzer);     // Stop sound...
         
    } else if (data == "humidity") {
        if (DHT.humidity < 79){
          Serial.println("dry");        //Sends data to Raspberry Pi when humidity is below 79% (Arbitary Threshold)
          
        }
                                 

        else if (DHT.humidity >80) {
          Serial.println("wet");        //Sends data to Raspberry Pi when humidity is above 80% (Arbitary Threshold)
        }

    } else if (data == "syringe") {

      lcd.clear();
      lcd.setCursor(0,0);
      lcd.print("Moving Camera");
      lcd.setCursor(0,1);
      lcd.print("To Syringe");
      syringe();
      
      
      Serial.println("done");           // Lets the Raspberry Pi know that revolution is completed towards syringe side.
      

    } else if (data == "plunge") {
      lcd.clear();
      lcd.setCursor(0,0);
      lcd.print("Moving Camera");
      lcd.setCursor(0,1);
      lcd.print("To Plunger");
      plunger();
      Serial.println("done");           // Lets the Raspberry Pi know that revolution is completed towards plunger side.
      
    }
  }
}

void LCD() {
  //**************************************  LCD **************************************
    // set the cursor to column 0, line 1
  // (note: line 1 is the second row, since counting begins with 0):
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Temperature: ");
  lcd.print(DHT.temperature);
  lcd.print(" C");

  lcd.setCursor(0, 1);
  lcd.print("Humidity: ");
  lcd.print(DHT.humidity);
  lcd.print(" %");
//****************************************************************************************
}

void Fan(){
  
    digitalWrite(fan_PIN, HIGH);
    delay(100);
}

void StopFan(){
  
    digitalWrite(fan_PIN, LOW);
    delay(100);
}

void Pump() {
    digitalWrite(pump_PIN, HIGH);
    delay(100);

}
void PumpStop() {
    digitalWrite(pump_PIN, LOW);
    delay(100);
}

void LED() {
    digitalWrite(LED_PIN, HIGH);
    delay(100);
}

void StopLED() {
  digitalWrite(LED_PIN,LOW);
}

void UV() {
  digitalWrite(uv_PIN, HIGH);
  delay(200);
}

void StopUV() {
  digitalWrite(uv_PIN, LOW);
  delay(200);
}

void syringe() {
  
    for (pos = pos; pos <= 180; pos += 1) { // goes from previous position to 180 degrees
    // in steps of 1 degree
    cameraServo.write(pos);              // tell servo to go to position in variable 'pos'
    delay(50);                       // waits 50ms for the servo to reach the position
  }

}

void plunger() {
  
    for (pos = pos; pos >= 0; pos -= 1) { // goes from previous position to 180 degrees to 0 degrees
    cameraServo.write(pos);              // tell servo to go to position in variable 'pos'
    delay(50);                       // waits 50ms for the servo to reach the position
    
  }
}
