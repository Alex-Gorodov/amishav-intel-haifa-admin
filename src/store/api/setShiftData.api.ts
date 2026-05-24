// store/api/setShiftData.api.ts

import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../services/firebase";
import { GUEST_MODE_KEY } from "../../const";

type UpdateShiftParams = {
  userId: string;
  shiftId: string;
  data: {
    date: Date;
    startTime: string;
    endTime: string;
    remark?: string;
  };
};

export const setShiftData = async ({
  userId,
  shiftId,
  data,
}: UpdateShiftParams) => {
  const isGuestMode = typeof window !== 'undefined' && localStorage.getItem(GUEST_MODE_KEY) === 'true';
  if (isGuestMode) {
    console.warn('Guest mode: skipping shift update to Firestore');
    return true;
  }

  const userRef = doc(db, "users", userId);
  const snap = await getDoc(userRef);

  if (!snap.exists()) return;

  const user = snap.data();

  const updatedShifts = (user.shifts || []).map((s: any) => {
    if (s.id !== shiftId) return s;

    return {
      ...s,
      ...data,
    };
  });

  await setDoc(
    userRef,
    { shifts: updatedShifts },
    { merge: true }
  );

  return true;
};
