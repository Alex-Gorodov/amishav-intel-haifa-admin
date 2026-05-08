export const normalizeDate = (date: any): Date => {
  if (date?.toDate) {
    return date.toDate();
  }

  return new Date(date);
};
