import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../services/firebase";

type DeleteShiftParams = {
  userId: string;
  shiftId: string;
};

export const deleteShift = async ({ userId, shiftId }: DeleteShiftParams) => {
  try {
    const userRef = doc(db, "users", userId);
    const snap = await getDoc(userRef);

    if (!snap.exists()) return;

    const user = snap.data();

    const updatedShifts = (user.shifts || []).filter(
      (s: any) => s.id !== shiftId
    );

    await setDoc(
      userRef,
      { shifts: updatedShifts },
      { merge: true }
    );

    return true;
  } catch (error) {
    console.error("❌ Failed to delete shift:", error);
    throw error;
  }
};
