// store/api/updateShiftData.api.ts

import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../services/firebase";

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

export const updateShiftData = async ({
  userId,
  shiftId,
  data,
}: UpdateShiftParams) => {
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
