#include <IRremote.h>

const int RECV_PIN = 8;
IRrecv irrecv(RECV_PIN);
decode_results results;
unsigned long key_value = 0;

void setup() {
  Serial.begin(9600);
  irrecv.enableIRIn();
  irrecv.blink13(true);
}

void loop() {
  if (irrecv.decode(&results)) {
    if (results.value == 0xFFFFFFFF) {
      results.value = key_value;
    }

    switch (results.value) {
    case 0x9E6140BF:
      Serial.println("play");
      break;
    case 0x9E61AA55:
      Serial.println("pause");
      break;
    case 0x9E6120DF:
      Serial.println("prev");
      break;
    case 0x9E61E01F:
      Serial.println("next");
      break;
    case 0x9E616A95:
      Serial.println("stop");
      break;
    case 0x9E6106F9:
      Serial.println("power_cd");
      break;
    case 0x9E61807F:
      Serial.println("eject");
      break;
    case 0x5EA1758A:
      Serial.println("band");
      break;
    case 0xFE8026D8:
      Serial.println("tuning_left");
      break;
    case 0xFE808678:
      Serial.println("tuning_right");
      break;
    case 0x5EA1F50A:
      Serial.println("memory");
      break;
    case 0x5EA18877:
      Serial.println("preset_left");
      break;
    case 0x5EA108F7:
      Serial.println("preset_right");
      break;
    case 0x9E61A05F:
      Serial.println("rew");
      break;
    case 0x9E61F20D:
      Serial.println("disk_skip");
      break;
    case 0x9E61609F:
      Serial.println("ff");
      break;
    case 0x5EA138C7:
      Serial.println("mute");
      break;
    case 0x5EA158A7:
      Serial.println("volume_up");
      break;
    case 0x5EA1D827:
      Serial.println("volume_down");
      break;
    case 0x5EA118E7:
      Serial.println("coaxial");
      break;
    case 0x5EA1CA34:
      Serial.println("optical");
      break;
    case 0x5EA19867:
      Serial.println("line_1");
      break;
    case 0x5EA1837C:
      Serial.println("line_2");
      break;
    case 0x5EA103FC:
      Serial.println("line_3");
      break;
    case 0x5EA16897:
      Serial.println("tuner");
      break;
    case 0x5EA128D7:
      Serial.println("phono");
      break;
    case 0x5EA1A857:
      Serial.println("cd");
      break;
    default:
      Serial.println(results.value, HEX);
      break;
    }
    key_value = results.value;
    irrecv.resume();
  }
}
