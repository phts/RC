const int PIN_FF = 2;
const int PIN_REW = 3;
const int PIN_PLAY = 4;
const int PIN_STOP = 5;
const int PIN_PAUSE = 6;
const int PIN_REC = 7;
const int PIN_MUTE = 8;
const int PIN_IR = 9;
const int PIN_RED = 10;
const int PIN_YELLOW = 11;
const int PIN_GREEN = 12;
const int PIN_BLUE = 13;

void setup_pins()
{
  pinMode(PIN_FF, OUTPUT);
  pinMode(PIN_REW, OUTPUT);
  pinMode(PIN_PLAY, OUTPUT);
  pinMode(PIN_STOP, OUTPUT);
  pinMode(PIN_PAUSE, OUTPUT);
  pinMode(PIN_REC, OUTPUT);
  pinMode(PIN_MUTE, OUTPUT);
  pinMode(PIN_IR, OUTPUT);
  pinMode(PIN_RED, OUTPUT);
  pinMode(PIN_YELLOW, OUTPUT);
  pinMode(PIN_GREEN, OUTPUT);
  pinMode(PIN_BLUE, OUTPUT);
}