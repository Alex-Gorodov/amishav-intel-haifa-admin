import { Shift } from "../types/Shift";
import { User } from "../types/User";

function pad(n: number) {
  return n < 10 ? `0${n}` : `${n}`;
}
export function toISODate(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function getFridayForWeek(date: Date): Date {
  const day = date.getDay(); // 0=Sunday, 5=Friday, 6=Saturday
  const daysUntilFriday = (5 - day + 7) % 7;
  const friday = new Date(date);
  friday.setDate(friday.getDate() + daysUntilFriday);
  friday.setHours(0, 0, 0, 0);
  return friday;
}

/**
 * Проверяет правило шаббата: максимум 3 шаббата подряд, 1 из 4 должен быть свободным
 */
export function checkShabbatRule(
  user: User,
  targetWeekStart: Date,
  newShifts: Shift[]
): { valid: boolean; error?: string } {
  // Получаем все смены пользователя (существующие + новые)
  const allUserShifts = [...(user.shifts || []), ...newShifts];

  // Группируем смены по неделям (по пятнице)
  const shiftsByWeek = new Map<string, Shift[]>();

  for (const shift of allUserShifts) {
    const shiftDate = shift.date;
    const friday = getFridayForWeek(shiftDate);
    const weekKey = toISODate(friday);

    if (!shiftsByWeek.has(weekKey)) {
      shiftsByWeek.set(weekKey, []);
    }
    shiftsByWeek.get(weekKey)!.push(shift);
  }

  // Проверяем, работает ли пользователь в шаббат (пятница или суббота)
  const weeksWithShabbatWork = new Set<string>();

  for (const [weekKey, shifts] of shiftsByWeek.entries()) {
    const friday = new Date(weekKey + 'T00:00:00');
    const saturday = new Date(friday);
    saturday.setDate(friday.getDate() + 1);

    const hasFridayShift = shifts.some(s => {
      const shiftDate = s.date;
      const shiftDay = shiftDate.getDay();
      return shiftDay === 5; // Friday (0=Sunday, 5=Friday)
    });

    const hasSaturdayShift = shifts.some(s => {
      const shiftDate = s.date;
      const shiftDay = shiftDate.getDay();
      return shiftDay === 6; // Saturday
    });

    if (hasFridayShift || hasSaturdayShift) {
      weeksWithShabbatWork.add(weekKey);
    }
  }

  // Проверяем 4-недельное окно, релевантное для targetWeekStart
  const targetFriday = getFridayForWeek(targetWeekStart);
  const last4Keys: string[] = [];
  for (let i = 3; i >= 0; i--) {
    const wk = new Date(targetFriday);
    wk.setDate(wk.getDate() - i * 7);
    last4Keys.push(toISODate(wk));
  }

  // TODO return number of shabbats in row

  // Если во всех 4 неделях из окна есть работа в шаббат — это нарушение
  const workedAllFour = last4Keys.every(k => weeksWithShabbatWork.has(k));

  if (workedAllFour) {
    return {
      valid: false,
      error: `Пользователь ${user.firstName} ${user.secondName} работает 4 шаббата подряд (недели ${last4Keys[0]} - ${last4Keys[3]}), должен иметь отдых хотя бы на одной неделе из 4`
    };
  }

  return { valid: true };
}
