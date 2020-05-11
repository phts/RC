#include <IRremote.h>
#include <SimpleTimer.h>
#include "constants.h"
#include "yamaha-ras13.h"
#include "akai-gx-f37.h"
#include "pins.h"
#include "leds.h"

IRrecv irrecv(PIN_IR);
decode_results results;
bool is_pc_disabled = false;
String last_btn = BUTTON_UNKNOWN;
int last_leds = 0b0;
bool is_pc_disconnected = false;
SimpleTimer pingTimer;

void send_btn(const String btn)
{
  if (!is_pc_disabled && btn != BUTTON_UNKNOWN)
  {
    Serial.println(btn);
  }
}

void handle_btn(const String btn)
{
  if (btn == BUTTON_POWER_CD && !is_pc_disconnected)
  {
    is_pc_disabled = !is_pc_disabled;
    if (is_pc_disabled)
    {
      led_on(PIN_AKAI);
      led_on(PIN_BUILTIN_LED);
      led_off(PIN_RED);
      led_off(PIN_YELLOW);
      led_off(PIN_GREEN);
      led_off(PIN_BLUE);
      led_off(PIN_WHITE);
    }
    else
    {
      led_off(PIN_AKAI);
      led_off(PIN_BUILTIN_LED);
      handle_leds(last_leds);
      last_btn = BUTTON_UNKNOWN;
    }
    return;
  }

  if (is_pc_disabled)
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
  else
  {
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
  is_pc_disconnected = true;
  is_pc_disabled = true;
  led_off(PIN_AKAI);
  led_off(PIN_BUILTIN_LED);
  led_off(PIN_RED);
  led_off(PIN_YELLOW);
  led_off(PIN_GREEN);
  led_off(PIN_BLUE);
  led_off(PIN_WHITE);
}

void setup()
{
  setup_pins();
  Serial.begin(SERIAL_BAUD_RATE);
  irrecv.enableIRIn();
  pingTimer.setInterval(PING_INTERVAL);
}

void loop()
{
  if (!is_pc_disconnected && pingTimer.isReady())
  {
    Serial.println(PING);
    String answer = Serial.readString();
    if (answer == PONG)
    {
      pingTimer.reset();
    }
    else
    {
      handle_pc_disconnect();
    }
  }
  if (irrecv.decode(&results))
  {
    String btn = get_button_name(results.value);
    handle_btn(btn);
    irrecv.resume();
  }
  if (Serial.available())
  {
    int data = Serial.read();
    handle_leds(data);
  }
}
