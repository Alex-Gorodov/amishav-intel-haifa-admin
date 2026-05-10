import { Timestamp } from "firebase/firestore";

export function normalizeDate(date: any): Date {
  if (!date) return new Date();

  if (date instanceof Date) {
    return date;
  }

  if (typeof date.toDate === 'function') {
    return date.toDate();
  }

  return new Date(date);
}

export function getFormattedDate(date: Date | string) {
  const normalizedDate = new Date(date);

  return normalizedDate.toLocaleDateString('he-IL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function getFormattedTimestamp(date: any) {
  return normalizeDate(date).toLocaleDateString('he-IL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
