import {
  ShieldCheck,
  HeartPulse,
  LucideIcon,
  File,
  Sword,
  BowArrow,
  IdCard
} from "lucide-react";

const icons: Record<string, LucideIcon> = {
  "הדרכת בטיחות": ShieldCheck,
  "רענון רוני": BowArrow,
  "רענון נשק": Sword,
  "רענון עזרה ראשונה": HeartPulse,
  "הדרכת סמכויות": IdCard,
};

export const getIcon = (
  title: string,
  size: number = 18
) => {
  const Icon = icons[title] || File;

  return <Icon size={size} />;
};
