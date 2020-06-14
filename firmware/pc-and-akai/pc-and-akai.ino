#include "constants.h"
#include "yamaha-ras13.h"
#include "akai-gx-f37.h"
#include "pins.h"
#include "leds.h"
#include "IrReceiver.h"
#include "Ping.h"

IrReceiver irReceiver(PIN_IR);
Ping ping(PING_INTERVAL);
bool is_pc_enabled = true;
bool is_pc_connected = true;
String last_btn = BUTTON_UNKNOWN;
int last_leds = 0b0;

void send_btn(const String btn)
{
  if (is_pc_enabled && btn != BUTTON_UNKNOWN)
  {
    Serial.println(btn);
  }
}

void toggle_pc()
{
  is_pc_enabled = !is_pc_enabled;
  if (is_pc_enabled)
  {
    led_off(PIN_AKAI);
    handle_leds(last_leds);
    last_btn = BUTTON_UNKNOWN;
  }
  else
  {
    led_on(PIN_AKAI);
    led_off(PIN_RED);
    led_off(PIN_YELLOW);
    led_off(PIN_GREEN);
    led_off(PIN_BLUE);
    led_off(PIN_WHITE);
  }
}

void handle_akai_btn(const String btn)
{
  if (btn == BUTTON_PLAY)
  {
    press_btn(PIN_PLAY);
  }
  else if (btn == BUTTON_STOP)
  {
    press_btn(PIN_STOP);
  }
  else if (btn == BUTTON_PREV)
  {
    press_btn(PIN_REW);
  }
  else if (btn == BUTTON_NEXT)
  {
    press_btn(PIN_FF);
  }
  else if (btn == BUTTON_PAUSE)
  {
    press_btn(PIN_PAUSE);
  }
  else if (btn == BUTTON_DISK_SKIP)
  {
    press_btn(PIN_MUTE);
  }
  else if (btn == BUTTON_MEMORY)
  {
    press_two_btns(PIN_REC, PIN_PAUSE);
  }
}

void handle_btn(const String btn)
{
  if (btn == BUTTON_POWER_CD && is_pc_connected)
  {
    toggle_pc();
    return;
  }

  if (!is_pc_enabled)
  {
    handle_akai_btn(btn);
    return;
  }

  if (btn == BUTTON_REPEAT)
  {
    send_btn(last_btn);
  }
  else
  {
    send_btn(btn);
    last_btn = btn;
  }
}

void handle_leds(int data)
{
  if (data == 0xA || data == -1)
  {
    return;
  }
  int leds = data ^ LED_OVERHEAD;
  (leds & LED_RED) ? led_on(PIN_RED) : led_off(PIN_RED);
  (leds & LED_YELLOW) ? led_on(PIN_YELLOW) : led_off(PIN_YELLOW);
  (leds & LED_GREEN) ? led_on(PIN_GREEN) : led_off(PIN_GREEN);
  (leds & LED_BLUE) ? led_on(PIN_BLUE) : led_off(PIN_BLUE);
  (leds & LED_WHITE) ? led_on(PIN_WHITE) : led_off(PIN_WHITE);
  last_leds = data;
}

void handle_pc_disconnect()
{
  is_pc_connected = false;
  is_pc_enabled = false;
  led_off(PIN_AKAI);
  led_off(PIN_RED);
  led_off(PIN_YELLOW);
  led_off(PIN_GREEN);
  led_off(PIN_BLUE);
  led_off(PIN_WHITE);
}

void handle_ir_code(const unsigned long code)
{
  String btn = get_button_name(code);
  handle_btn(btn);
}

void setup()
{
  setup_pins();
  Serial.begin(SERIAL_BAUD_RATE);
  irReceiver.setup();
  ping.setup();
}

void loop()
{
  if (is_pc_connected && !ping.check())
  {
    handle_pc_disconnect();
  }

  irReceiver.receive(handle_ir_code);

  if (Serial.available())
  {
    int data = Serial.read();
    handle_leds(data);
  }
}
