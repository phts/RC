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
