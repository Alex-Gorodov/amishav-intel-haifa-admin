import {
  ShieldCheck,
  HeartPulse,
  LucideIcon,
  File,
  Sword,
  BowArrow,
  IdCard,
  Headset,
  Siren,
  HardHat,
  Crown,
  Cctv,
  Clock,
  IdCardLanyard,
  Pencil
} from "lucide-react";

const icons: Record<string, LucideIcon> = {
  "הדרכת בטיחות": ShieldCheck,
  "רענון רוני": BowArrow,
  "רענון נשק": Sword,
  "רענון עזרה ראשונה": HeartPulse,
  "הדרכת סמכויות": IdCard,
  "מנהל משמרת": Crown,
  "אחמ״ש בקרה": Headset,
  "אחמ״ש חירום": Siren,
  "אחמ״ש ביטחון": IdCard,
  "בקר": Cctv,
  "רספונדר": HardHat,
  "מאבטח": IdCard,
  "שעון": Clock,
  "עובד": IdCardLanyard,
  "עיפרון": Pencil
};

export const getIcon = (
  title: string,
  color?: string,
  size?: number
) => {
  const Icon = icons[title] || File;

  return <Icon size={size || 18} color={color} />;
};
