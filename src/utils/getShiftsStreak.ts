import { User } from "../types/User";

export function getShiftsStreak(user: User): number {
  if (!user.shifts || user.shifts.length === 0) return 0;

  const shiftDays = new Set(
    user.shifts.map(s =>
      s.date.toDate().toISOString().split("T")[0]
    )
  );

  let streak = 0;
  const current = new Date();

  while (true) {
    const key = current.toISOString().split("T")[0];

    if (shiftDays.has(key)) {
      streak++;
      current.setDate(current.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}
