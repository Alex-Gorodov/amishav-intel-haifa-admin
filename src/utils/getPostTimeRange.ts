import { Shift } from "../types/Shift";

export function getPostTimeRange(shift?: Shift | null) {
  if (!shift) return null;

  const toMinutes = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };

  const format = (min: number) => {
    const h = String(Math.floor(min / 60)).padStart(2, "0");
    const m = String(min % 60).padStart(2, "0");
    return `${h}:${m}`;
  };

  const start = toMinutes(shift.startTime);
  const end = toMinutes(shift.endTime);

  return {
    from: format(start),
    to: format(end),
  };
}
