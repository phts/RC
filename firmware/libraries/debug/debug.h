#ifndef DEBUG_H
#define DEBUG_H

void debug(const String str)
{
  Serial.println(String("DEBUG: ") + str);
}

#endif
