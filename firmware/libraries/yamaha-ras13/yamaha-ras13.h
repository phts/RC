String BUTTON_REPEAT = "REPEAT";
String BUTTON_UNKNOWN = "UNKNOWN";

String get_button_name(unsigned long code)
{
  switch (code)
  {
  case 0xFFFFFFFF:
    return "REPEAT";
  case 0x9E6140BF:
    return "play";
  case 0x9E61AA55:
    return "pause";
  case 0x9E6120DF:
    return "prev";
  case 0x9E61E01F:
    return "next";
  case 0x9E616A95:
    return "stop";
  case 0x9E6106F9:
    return "power_cd";
  case 0x9E61807F:
    return "eject";
  case 0x5EA1758A:
    return "band";
  case 0xFE8026D8:
    return "tuning_left";
  case 0xFE808678:
    return "tuning_right";
  case 0x5EA1F50A:
    return "memory";
  case 0x5EA18877:
    return "preset_left";
  case 0x5EA108F7:
    return "preset_right";
  case 0x9E61A05F:
    return "rew";
  case 0x9E61F20D:
    return "disk_skip";
  case 0x9E61609F:
    return "ff";
  case 0x5EA138C7:
    return "mute";
  case 0x5EA158A7:
    return "volume_up";
  case 0x5EA1D827:
    return "volume_down";
  case 0x5EA118E7:
    return "coaxial";
  case 0x5EA1CA34:
    return "optical";
  case 0x5EA19867:
    return "line_1";
  case 0x5EA1837C:
    return "line_2";
  case 0x5EA103FC:
    return "line_3";
  case 0x5EA16897:
    return "tuner";
  case 0x5EA128D7:
    return "phono";
  case 0x5EA1A857:
    return "cd";
  default:
    return BUTTON_UNKNOWN;
  }
}
