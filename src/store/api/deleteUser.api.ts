// optional safer version
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../services/firebase";

export const deleteUser = async ({ userId }: { userId: string }) => {
  try {
    const userRef = doc(db, "users", userId);
    const snap = await getDoc(userRef);

    if (!snap.exists()) return;

    const user = snap.data();

    // 🔥 OPTIONAL: clear shifts before delete
    if (user.shifts?.length) {
      console.warn("User has shifts, deleting anyway...");
    }

    await deleteDoc(userRef);

    return true;
  } catch (error) {
    console.error("❌ Failed to delete user:", error);
    throw error;
  }
};
