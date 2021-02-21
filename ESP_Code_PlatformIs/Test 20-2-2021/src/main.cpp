#include <Arduino.h>
#include <DHT.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#define DHTTYPE DHT11 // DHT 11
#define DHTPIN 17
DHT dht(DHTPIN, DHTTYPE);

LiquidCrystal_I2C lcd(0x27, 16, 4); // set the LCD address to 0x27 for a 16 chars and 2 line display
uint8_t heart[8] = {0x0, 0xa, 0x1f, 0x1f, 0xe, 0x4, 0x0};

TaskHandle_t Task0;
TaskHandle_t Task1;
SemaphoreHandle_t Semaphore;

static volatile float humidity = 0;
static volatile float temperature = 0;

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
  if (isnan(h) || isnan(t))
  {
    Serial.println(F("Failed to read from DHT sensor!"));
    lcd.clear();

    lcd.setCursor(0, 0);
    lcd.printf("Error");
    return;
  }
  float hic = dht.computeHeatIndex(t, h, false);
  lcd.setCursor(0, 0);
  lcd.printf("Humidity: %f0.2", h);
  lcd.setCursor(0, 1);
  lcd.printf("Temperature: %f0.2", hic);

  Serial.print(F("Humidity: "));
  Serial.print(h);
  Serial.print(F("%  Temperature: "));
  Serial.print(t);
  Serial.print(F("°C "));
  Serial.print(hic);
  Serial.println(F("°C "));
}

void LCDPrintStart()
{

  lcd.setCursor(0, 0);
  lcd.print("Starting");
  delay(20);
  lcd.print(".");
  delay(800);

  lcd.print(".");
  delay(800);

  lcd.print(".");
  delay(800);
}

void updateDHT(void *parameter)
{
  for (;;)
  {
    vTaskDelay(2000);
    int h = dht.readHumidity();
    int t = dht.readTemperature();

    xSemaphoreTake(Semaphore, portMAX_DELAY);
    humidity = h;
    temperature = t;
    xSemaphoreGive(Semaphore);
  }
}

void setup()
{
  initSerial();
  dht.begin();
  initLCD();
  LCDPrintStart();
  Semaphore = xSemaphoreCreateMutex();

  xTaskCreatePinnedToCore(
      updateDHT, /* Function to implement the task */
      "Task0",   /* Name of the task */
      1000,      /* Stack size in words */
      NULL,      /* Task input parameter */
      10,        /* Priority of the task */
      &Task0,    /* Task handle. */
      1);        /* Core where the task should run */

  // xTaskCreatePinnedToCore(
  //     loop1,   /* Function to implement the task */
  //     "Task1", /* Name of the task */
  //     1000,    /* Stack size in words */
  //     NULL,    /* Task input parameter */
  //     //configMAX_PRIORITIES - 1, /* Priority of the task */
  //     1,
  //     &Task1, /* Task handle. */
  //     1);     /* Core where the task should run */
}
volatile float prevT = 0;
volatile float prevH = 0;
void loop()
{

  // If the Tempereature changes do this
  xSemaphoreTake(Semaphore, portMAX_DELAY);
  int readTemperature = temperature;
  int readHumidity = humidity;
  xSemaphoreGive(Semaphore);

  if (prevT != readTemperature || prevH != readHumidity)
  {

    xSemaphoreTake(Semaphore, portMAX_DELAY);
    prevT = readTemperature;
    prevH = readHumidity;
    xSemaphoreGive(Semaphore);
    LCDPrintDHT(readHumidity, readTemperature);
  }

  vTaskDelay(200);
}