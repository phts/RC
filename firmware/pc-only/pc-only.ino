#include <IRremote.h>
#include "constants.h"
#include "yamaha-ras13.h"

const int RECV_PIN = 8;
IRrecv irrecv(RECV_PIN);
decode_results results;
String last_btn = BUTTON_UNKNOWN;

void setup()
{
  Serial.begin(SERIAL_BAUD_RATE);
  irrecv.enableIRIn();
  irrecv.blink13(true);
}

void loop()
{
  if (irrecv.decode(&results))
  {
    String btn = get_button_name(results.value);
    if (btn == BUTTON_REPEAT)
    {
      Serial.println(last_btn);
    }
    else
    {
      Serial.println(btn);
      last_btn = btn;
    }
    irrecv.resume();
  }
}
