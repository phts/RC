const unsigned int LED_OVERHEAD = 0b1000000;
const unsigned int LED_RED = 0b000001;
const unsigned int LED_YELLOW = 0b000010;
const unsigned int LED_GREEN = 0b000100;
const unsigned int LED_BLUE = 0b001000;
const unsigned int LED_WHITE = 0b010000;
const unsigned int LED_AKAI = 0b100000;

void led_on(int pin)
{
  digitalWrite(pin, HIGH);
}

void led_off(int pin)
{
  digitalWrite(pin, LOW);
}
