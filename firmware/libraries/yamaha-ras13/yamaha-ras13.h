const String BUTTON_REPEAT = "REPEAT";
const String BUTTON_PLAY = "play";
const String BUTTON_PAUSE = "pause";
const String BUTTON_PREV = "prev";
const String BUTTON_NEXT = "next";
const String BUTTON_STOP = "stop";
const String BUTTON_POWER_CD = "power_cd";
const String BUTTON_EJECT = "eject";
const String BUTTON_BAND = "band";
const String BUTTON_TUNING_LEFT = "tuning_left";
const String BUTTON_TUNING_RIGHT = "tuning_right";
const String BUTTON_MEMORY = "memory";
const String BUTTON_PRESET_LEFT = "preset_left";
const String BUTTON_PRESET_RIGHT = "preset_right";
const String BUTTON_REW = "rew";
const String BUTTON_DISK_SKIP = "disk_skip";
const String BUTTON_FF = "ff";
const String BUTTON_MUTE = "mute";
const String BUTTON_VOLUME_UP = "volume_up";
const String BUTTON_VOLUME_DOWN = "volume_down";
const String BUTTON_COAXIAL = "coaxial";
const String BUTTON_OPTICAL = "optical";
const String BUTTON_LINE_1 = "line_1";
const String BUTTON_LINE_2 = "line_2";
const String BUTTON_LINE_3 = "line_3";
const String BUTTON_TUNER = "tuner";
const String BUTTON_PHONO = "phono";
const String BUTTON_CD = "cd";
const String BUTTON_UNKNOWN = "UNKNOWN";

String get_button_name(unsigned long code)
{
  switch (code)
  {
  case 0xFFFFFFFF:
    return BUTTON_REPEAT;
  case 0x9E6140BF:
    return BUTTON_PLAY;
  case 0x9E61AA55:
    return BUTTON_PAUSE;
  case 0x9E6120DF:
    return BUTTON_PREV;
  case 0x9E61E01F:
    return BUTTON_NEXT;
  case 0x9E616A95:
    return BUTTON_STOP;
  case 0x9E6106F9:
    return BUTTON_POWER_CD;
  case 0x9E61807F:
    return BUTTON_EJECT;
  case 0x5EA1758A:
    return BUTTON_BAND;
  case 0xFE8026D8:
    return BUTTON_TUNING_LEFT;
  case 0xFE808678:
    return BUTTON_TUNING_RIGHT;
  case 0x5EA1F50A:
    return BUTTON_MEMORY;
  case 0x5EA18877:
    return BUTTON_PRESET_LEFT;
  case 0x5EA108F7:
    return BUTTON_PRESET_RIGHT;
  case 0x9E61A05F:
    return BUTTON_REW;
  case 0x9E61F20D:
    return BUTTON_DISK_SKIP;
  case 0x9E61609F:
    return BUTTON_FF;
  case 0x5EA138C7:
    return BUTTON_MUTE;
  case 0x5EA158A7:
    return BUTTON_VOLUME_UP;
  case 0x5EA1D827:
    return BUTTON_VOLUME_DOWN;
  case 0x5EA118E7:
    return BUTTON_COAXIAL;
  case 0x5EA1CA34:
    return BUTTON_OPTICAL;
  case 0x5EA19867:
    return BUTTON_LINE_1;
  case 0x5EA1837C:
    return BUTTON_LINE_2;
  case 0x5EA103FC:
    return BUTTON_LINE_3;
  case 0x5EA16897:
    return BUTTON_TUNER;
  case 0x5EA128D7:
    return BUTTON_PHONO;
  case 0x5EA1A857:
    return BUTTON_CD;
  default:
    return BUTTON_UNKNOWN;
  }
}
