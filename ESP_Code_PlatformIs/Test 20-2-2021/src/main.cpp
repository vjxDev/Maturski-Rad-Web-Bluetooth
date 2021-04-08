#include <Arduino.h>
#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>

#include <DHT.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#define DHTTYPE DHT11 // DHT 11
#define DHTPIN 17
DHT dht(DHTPIN, DHTTYPE);

LiquidCrystal_I2C lcd(0x27, 16, 4); // set the LCD address to 0x27 for a 16 chars and 2 line display
// uint8_t heart[8] = {0x0, 0xa, 0x1f, 0x1f, 0xe, 0x4, 0x0};

TaskHandle_t Task0;
TaskHandle_t Task1;
SemaphoreHandle_t Semaphore;
BLEServer *pServer = NULL;
BLECharacteristic *pLIGHTCharacteristic = NULL;

BLECharacteristic *pTemperatureCharacteristic = NULL;
BLECharacteristic *pHumidityCharacteristic = NULL;

BLECharacteristic *pBatteryLevelCharacteristic = NULL;
BLECharacteristic *pBatteryPowerStateCharacteristic = NULL;

bool deviceConnected = false;
bool oldDeviceConnected = false;
int batteryLeveli = 0;
uint32_t heartRate = 0x063f;

#define LIGHT_SERVICE_UUID "4fafc201-1fb5-459e-8fcc-c5c9c331914b"
#define LIGHT_CHARACTERISTIC_UUID "beb5483e-36e1-4688-b7f5-ea07361b26a8"

#define ENV_SENSING_SERVICE_UUID "0000181a-0000-1000-8000-00805f9b34fb"
#define TEMPERATURE_CHARACTERISTIC_UUID "00002a6e-0000-1000-8000-00805f9b34fb"
#define HUMIDITY_CHARACTERISTIC_UUID "00002a6f-0000-1000-8000-00805f9b34fb"

#define BATTERY_SERVICE_UUID "0000180f-0000-1000-8000-00805f9b34fb"
#define BATTETY_LEVEL_CHARACTERISTIC_UUID "00002a19-0000-1000-8000-00805f9b34fb"
#define BATTETY_POWER_STATE_CHARACTERISTIC_UUID "00002a1a-0000-1000-8000-00805f9b34fb"

static volatile float humidity = 0;
static volatile float temperature = 0;

volatile float prevT = 0;
volatile float prevH = 0;
volatile uint8_t prevBatteryLevel = 0;

const int ledPin = 15;  // 15 corresponds to GPIO15
const int ledPin2 = 16; // 16 corresponds to GPIO16
const int ledPin3 = 18; // 18 corresponds to GPIO18

// setting PWM properties
const int freq = 4000;
const int resolution = 8;

const int redChannel = 0;
const int greenChannel = 1;
const int blueChannel = 2;

void initSerial()
{
  Serial.begin(115200);
  Serial.println("Init");
}
void initLCD()
{
  lcd.init();
  lcd.clear();
  lcd.backlight();
}
void LCDPrintDHT(float h, float t)
{
  Serial.println("LCDPrintDHT");
  lcd.setCursor(0, 0);
  if (isnan(h) || isnan(t))
  {
    lcd.clear();
    lcd.printf("Error");
    return;
  }
  lcd.print("Humidity: ");
  lcd.print(h);
  lcd.setCursor(0, 1);
  lcd.print("Temp: ");
  lcd.print(t);
}

void updateDHT(void *parameter)
{
  for (;;)
  {

    vTaskDelay(2000);
    float h = dht.readHumidity();
    float t = dht.readTemperature();

    // Serial.print(F("Humidity: "));
    // Serial.println(h);
    // Serial.print(F("%  Temperature: "));
    // Serial.println(t);
    xSemaphoreTake(Semaphore, portMAX_DELAY);
    humidity = h;
    temperature = t;
    xSemaphoreGive(Semaphore);
  }
}

void BLETemperatureUpdate(float readTemperature)
{
  uint8_t tempData[2];
  uint16_t tempValue;
  xSemaphoreTake(Semaphore, portMAX_DELAY);
  prevT = readTemperature;
  xSemaphoreGive(Semaphore);

  tempValue = (uint16_t)(readTemperature * 100);
  tempData[1] = tempValue >> 8;
  tempData[0] = tempValue;
  pTemperatureCharacteristic->setValue(tempData, 2);
  pTemperatureCharacteristic->notify();

  delay(12);
}
void BLEHumidityUpdate(float readHumidity)
{
  uint8_t tempData[2];
  uint16_t tempValue;
  xSemaphoreTake(Semaphore, portMAX_DELAY);
  prevH = readHumidity;
  xSemaphoreGive(Semaphore);

  tempValue = (uint16_t)(readHumidity * 100);
  tempData[1] = tempValue >> 8;
  tempData[0] = tempValue;

  pHumidityCharacteristic->setValue(tempData, 2);
  pHumidityCharacteristic->notify();
  delay(12);
}
void BLEBatteryUpdate(uint16_t readBatteryLevel)
{
  xSemaphoreTake(Semaphore, portMAX_DELAY);
  prevBatteryLevel = readBatteryLevel;
  xSemaphoreGive(Semaphore);
  pBatteryLevelCharacteristic->setValue(readBatteryLevel);
  pBatteryLevelCharacteristic->notify();
  Serial.println(readBatteryLevel);
  delay(12);
}
// int rgb = red;
// rgb = (rgb << 8) + green;
// rgb = (rgb << 8) + blue;

// int red = (rgb >> 16) & 0xFF;
// int green = (rgb >> 8) & 0xFF;
// int blue = rgb & 0xFF;
void BLEReadAndUpdateAll()
{
  delay(5000);
  Serial.println("1st time BLE");
  float readTemperature;
  float readHumidity;
  xSemaphoreTake(Semaphore, portMAX_DELAY);
  readTemperature = temperature;
  readHumidity = humidity;
  xSemaphoreGive(Semaphore);
  BLEHumidityUpdate(readHumidity);
  BLETemperatureUpdate(readTemperature);
  uint16_t readBatteryLevel = analogRead(34);
  readBatteryLevel = map(readBatteryLevel, 0, 4092, 0, 100);
  BLEBatteryUpdate(readBatteryLevel);
}
class MyServerCallbacks : public BLEServerCallbacks
{
  void onConnect(BLEServer *pServer)
  {
    deviceConnected = true;
  };

  void onDisconnect(BLEServer *pServer)
  {
    deviceConnected = false;
  }
};
class LightCharCallback : public BLECharacteristicCallbacks
{
  void onWrite(BLECharacteristic *pCharacteristic)
  {
    std::string rxValue = pCharacteristic->getValue();

    if (rxValue.length() > 0)
    {

      if (rxValue.length() == 3)
      {
        ledcWrite(redChannel, (int)rxValue[0]);
        ledcWrite(greenChannel, (int)rxValue[1]);
        ledcWrite(blueChannel, (int)rxValue[2]);
      }
    }
  }
};

void ledInit()
{
  ledcSetup(redChannel, freq, resolution);
  ledcSetup(greenChannel, freq, resolution);
  ledcSetup(blueChannel, freq, resolution);

  ledcAttachPin(19, redChannel);
  ledcAttachPin(18, greenChannel);
  ledcAttachPin(16, blueChannel);

  ledcWrite(redChannel, 255);
  ledcWrite(greenChannel, 255);
  ledcWrite(blueChannel, 255);
}
void setup()
{
  initSerial();
  dht.begin();
  initLCD();
  lcd.setCursor(0, 0);
  lcd.print("Starting");
  ledInit();
  pinMode(34, INPUT);
  Semaphore = xSemaphoreCreateMutex();

  xTaskCreatePinnedToCore(
      updateDHT, /* Function to implement the task */
      "Task0",   /* Name of the task */
      1000,      /* Stack size in words */
      NULL,      /* Task input parameter */
      10,        /* Priority of the task */
      &Task0,    /* Task handle. */
      1);        /* Core where the task should run */

  delay(20);
  lcd.print(".");

  // Create the BLE Device
  BLEDevice::init("ESP32");

  // Create the BLE Server
  pServer = BLEDevice::createServer();
  pServer->setCallbacks(new MyServerCallbacks());

  // Create the BLE Service
  BLEService *pLightService = pServer->createService(LIGHT_SERVICE_UUID);
  pLIGHTCharacteristic = pLightService->createCharacteristic(
      LIGHT_CHARACTERISTIC_UUID,
      BLECharacteristic::PROPERTY_READ |
          BLECharacteristic::PROPERTY_WRITE |
          BLECharacteristic::PROPERTY_NOTIFY |
          BLECharacteristic::PROPERTY_INDICATE);
  pLIGHTCharacteristic->addDescriptor(new BLE2902());
  pLIGHTCharacteristic->setCallbacks(new LightCharCallback());
  //
  lcd.print(".");
  BLEService *pEnvirementSensing = pServer->createService(ENV_SENSING_SERVICE_UUID);
  pTemperatureCharacteristic = pEnvirementSensing->createCharacteristic(
      TEMPERATURE_CHARACTERISTIC_UUID,
      BLECharacteristic::PROPERTY_READ |

          BLECharacteristic::PROPERTY_NOTIFY |
          BLECharacteristic::PROPERTY_INDICATE);

  pTemperatureCharacteristic->addDescriptor(new BLE2902());

  pHumidityCharacteristic = pEnvirementSensing->createCharacteristic(
      HUMIDITY_CHARACTERISTIC_UUID,
      BLECharacteristic::PROPERTY_READ |

          BLECharacteristic::PROPERTY_NOTIFY |
          BLECharacteristic::PROPERTY_INDICATE);

  pHumidityCharacteristic->addDescriptor(new BLE2902());

  //

  BLEService *pBatteryService = pServer->createService(BATTERY_SERVICE_UUID);
  pBatteryLevelCharacteristic = pBatteryService->createCharacteristic(
      BATTETY_LEVEL_CHARACTERISTIC_UUID,
      BLECharacteristic::PROPERTY_READ |

          BLECharacteristic::PROPERTY_NOTIFY |
          BLECharacteristic::PROPERTY_INDICATE);

  pBatteryLevelCharacteristic->addDescriptor(new BLE2902());

  pBatteryPowerStateCharacteristic = pBatteryService->createCharacteristic(
      BATTETY_POWER_STATE_CHARACTERISTIC_UUID,
      BLECharacteristic::PROPERTY_READ |

          BLECharacteristic::PROPERTY_NOTIFY |
          BLECharacteristic::PROPERTY_INDICATE);

  pBatteryPowerStateCharacteristic->addDescriptor(new BLE2902());
  lcd.print(".");
  pLightService->start();
  pEnvirementSensing->start();
  pBatteryService->start();

  // Start advertising
  BLEAdvertising *pAdvertising = BLEDevice::getAdvertising();
  pAdvertising->addServiceUUID(ENV_SENSING_SERVICE_UUID);
  pAdvertising->addServiceUUID(BATTERY_SERVICE_UUID);
  pAdvertising->addServiceUUID(LIGHT_SERVICE_UUID);

  pAdvertising->setScanResponse(false);
  pAdvertising->setMinPreferred(0x0); // set value to 0x00 to not advertise this parameter
  BLEDevice::startAdvertising();
  lcd.print(".");
  Serial.println("Waiting a client connection to notify...");
}
boolean onetime = true;
void loop()
{
  // notify changed value
  if (deviceConnected)
  {
    if (onetime)
    {
      BLEReadAndUpdateAll();
      onetime = false;
    }
    float readTemperature;
    float readHumidity;
    xSemaphoreTake(Semaphore, portMAX_DELAY);
    readTemperature = temperature;
    readHumidity = humidity;
    xSemaphoreGive(Semaphore);
    uint16_t readBatteryLevel = analogRead(34);
    readBatteryLevel = map(readBatteryLevel, 0, 4092, 0, 100);
    if (prevH != readHumidity || prevT != readTemperature)
    {
      LCDPrintDHT(readHumidity, readTemperature);
      if (prevH != readHumidity)
      {
        BLEHumidityUpdate(readHumidity);
      }
      if (prevT != readTemperature)
      {
        BLETemperatureUpdate(readTemperature);
      }
    }

    if (prevBatteryLevel + 1 < readBatteryLevel || prevBatteryLevel - 1 > readBatteryLevel)
    {
      BLEBatteryUpdate(readBatteryLevel);
    }

    delay(12); // bluetooth stack will go into congestion, if too many packets are sent, in 6 hours test i was able to go as low as 3ms
  }
  // disconnecting
  if (!deviceConnected && oldDeviceConnected)
  {
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("Disconected");
    lcd.setCursor(0, 1);
    lcd.print("Select a device");
    delay(500);                  // give the bluetooth stack the chance to get things ready
    pServer->startAdvertising(); // restart advertising
    Serial.println("start advertising");
    oldDeviceConnected = deviceConnected;

    onetime = true;
  }
  // connecting
  if (deviceConnected && !oldDeviceConnected)
  {
    // do stuff here on connecting
    oldDeviceConnected = deviceConnected;
  }
}