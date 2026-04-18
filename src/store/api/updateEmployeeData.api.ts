import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../services/firebase";
import { User } from "../../types/User";

export const updateEmployeeData = async (
  userId: string,
  data: Partial<User>
): Promise<void> => {
  try {
    if (!userId) throw new Error('No userId provided');
    if (!data || Object.keys(data).length === 0) {
      throw new Error('No data provided to update');
    }

    const { id, ...updateData } = data;
    const userRef = doc(db, 'users', userId);

    await updateDoc(userRef, updateData as Partial<Omit<User, 'id'>>);
  } catch (error) {
    console.error('❌ Error updating user data:', error);
    throw error;
  }
};
