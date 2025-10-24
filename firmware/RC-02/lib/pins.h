const int PIN_PAUSE = 11;
const int PIN_FF = 10;
const int PIN_REW = 9;
const int PIN_PLAY = 8;
const int PIN_STOP = 7;
const int PIN_REC = 6;
const int PIN_MUTE = 5;
const int PIN_IR = 3;
const int PIN_RED = A0;
const int PIN_YELLOW = A1;
const int PIN_GREEN = A2;
const int PIN_BLUE = A3;
const int PIN_WHITE = A4;
const int PIN_AKAI = A5;

void setup_pins()
{
  pinMode(PIN_PAUSE, OUTPUT);
  pinMode(PIN_FF, OUTPUT);
  pinMode(PIN_REW, OUTPUT);
  pinMode(PIN_PLAY, OUTPUT);
  pinMode(PIN_STOP, OUTPUT);
  pinMode(PIN_REC, OUTPUT);
  pinMode(PIN_MUTE, OUTPUT);
  pinMode(PIN_IR, OUTPUT);
  pinMode(PIN_AKAI, OUTPUT);
  pinMode(PIN_RED, OUTPUT);
  pinMode(PIN_YELLOW, OUTPUT);
  pinMode(PIN_GREEN, OUTPUT);
  pinMode(PIN_BLUE, OUTPUT);
  pinMode(PIN_WHITE, OUTPUT);
  digitalWrite(PIN_PAUSE, LOW);
  digitalWrite(PIN_FF, LOW);
  digitalWrite(PIN_REW, LOW);
  digitalWrite(PIN_PLAY, LOW);
  digitalWrite(PIN_STOP, LOW);
  digitalWrite(PIN_REC, LOW);
  digitalWrite(PIN_MUTE, LOW);
}
