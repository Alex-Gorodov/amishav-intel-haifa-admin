import { doc, runTransaction } from "firebase/firestore";
import { db } from "../../services/firebase";
import { GUEST_MODE_KEY } from "../../const";

type SwapParams = {
  firstUserId: string;
  secondUserId: string;
  firstShiftId: string;
  secondShiftId: string;
};

export const swapShifts = async ({
  firstUserId,
  secondUserId,
  firstShiftId,
  secondShiftId,
}: SwapParams) => {
  const isGuestMode = typeof window !== 'undefined' && localStorage.getItem(GUEST_MODE_KEY) === 'true';
  if (isGuestMode) {
    console.warn('Guest mode: skipping shift swap to Firestore');
    return true;
  }

  const firstUserRef = doc(db, "users", firstUserId);
  const secondUserRef = doc(db, "users", secondUserId);

  await runTransaction(db, async (transaction) => {
    const firstUserSnap = await transaction.get(firstUserRef);
    const secondUserSnap = await transaction.get(secondUserRef);

    if (!firstUserSnap.exists() || !secondUserSnap.exists()) {
      throw new Error("Users not found");
    }

    const firstUser = firstUserSnap.data();
    const secondUser = secondUserSnap.data();

    const firstShift = firstUser.shifts?.find(
      (s: any) => s.id === firstShiftId
    );

    const secondShift = secondUser.shifts?.find(
      (s: any) => s.id === secondShiftId
    );

    if (!firstShift || !secondShift) {
      throw new Error("Shift not found");
    }

    // 🔄 swap
    const updatedFirstShifts = (firstUser.shifts || [])
      .filter((s: any) => s.id !== firstShiftId)
      .concat({ ...secondShift, userId: firstUserId });

    const updatedSecondShifts = (secondUser.shifts || [])
      .filter((s: any) => s.id !== secondShiftId)
      .concat({ ...firstShift, userId: secondUserId });

    transaction.update(firstUserRef, { shifts: updatedFirstShifts });
    transaction.update(secondUserRef, { shifts: updatedSecondShifts });
  });
};
