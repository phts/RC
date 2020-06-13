#include <SimpleTimer.h>

const String PING = "PING";
const String PONG = "PONG";

class Ping
{
private:
  SimpleTimer pingTimer;
  uint64_t interval;

public:
  Ping(uint64_t interval)
  {
    Ping::interval = interval;
  }

  void setup()
  {
    pingTimer.setInterval(interval);
  }

  bool check()
  {
    if (!pingTimer.isReady())
    {
      return true;
    }

    Serial.println(PING);
    String answer = Serial.readString();
    if (answer != PONG)
    {
      return false;
    }
    pingTimer.reset();
    return true;
  }
};
