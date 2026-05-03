import { arrayUnion, doc, setDoc, Timestamp } from "firebase/firestore";
import { Posts } from "../../const";
import { Shift } from "../../types/Shift";
import { db } from "../../services/firebase";


type CreateShiftParams = {
  userId: string;
  date: Date;
  postId: string;
  startTime: string;
  endTime: string;
  remark?: string;
};

export const createShift = async ({
  userId,
  date,
  postId,
  startTime,
  endTime,
  remark = "",
}: CreateShiftParams) => {
  try {
    const post = Posts.find(p => p.id === postId);

    if (!post) {
      throw new Error("Post not found");
    }

    const newShift: Shift = {
      id: `${date.getTime()}_${post.id}`,
      userId: userId,
      date: date,
      post,
      startTime,
      endTime,
      remark,
    };

    const userRef = doc(db, "users", userId);

    await setDoc(
      userRef,
      {
        shifts: arrayUnion(newShift),
      },
      { merge: true }
    );

    return newShift;
  } catch (error) {
    console.error("❌ Failed to create shift:", error);
    throw error;
  }
};
