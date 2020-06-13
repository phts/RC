#include <IRremote.h>

class IrReceiver
{
  typedef void (*Callback)(const unsigned long);

private:
  IRrecv irrecv;
  decode_results results;

public:
  IrReceiver(int pin) : irrecv(pin) {}

  void setup()
  {
    irrecv.enableIRIn();
    irrecv.blink13(true);
  }

  void receive(Callback fn)
  {
    if (irrecv.decode(&results))
    {
      fn(results.value);
      irrecv.resume();
    }
  }
};
