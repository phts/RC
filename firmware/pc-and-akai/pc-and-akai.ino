#include <IRremote.h>
#include "yamaha-ras13.h"
#include "pins.h"

IRrecv irrecv(PIN_IR);
decode_results results;
bool is_pc_disabled = false;
String last_btn = BUTTON_UNKNOWN;

void send_btn(const String btn)
{
  if (!is_pc_disabled && btn != BUTTON_UNKNOWN)
  {
    Serial.println(btn);
  }
}

void press_btn(int pin)
{
  digitalWrite(pin, HIGH);
  delay(50);
  digitalWrite(pin, LOW);
}

void press_two_btns(int pin1, int pin2)
{
  digitalWrite(pin1, HIGH);
  delay(100);
  digitalWrite(pin2, HIGH);
  delay(50);
  digitalWrite(pin1, LOW);
  digitalWrite(pin2, LOW);
}

void handle_btn(const String btn)
{
  if (btn == BUTTON_POWER_CD)
  {
    is_pc_disabled = !is_pc_disabled;
    if (is_pc_disabled)
    {
      digitalWrite(PIN_RED, HIGH);
      digitalWrite(PIN_YELLOW, HIGH);
      digitalWrite(PIN_GREEN, HIGH);
      digitalWrite(PIN_BLUE, HIGH);
    }
    else
    {
      digitalWrite(PIN_RED, LOW);
      digitalWrite(PIN_YELLOW, LOW);
      digitalWrite(PIN_GREEN, LOW);
      digitalWrite(PIN_BLUE, LOW);
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

void setup()
{
  setup_pins();
  Serial.begin(9600);
  irrecv.enableIRIn();
}

void loop()
{
  if (irrecv.decode(&results))
  {
    String btn = get_button_name(results.value);
    handle_btn(btn);
    irrecv.resume();
  }
}