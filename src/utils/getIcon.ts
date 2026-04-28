import { icons } from "../const";

export const getIcon = (title: string): string => {
  return icons[title] || "📋";
};
