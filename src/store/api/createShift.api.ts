import { arrayUnion, doc, setDoc } from "firebase/firestore";
import { db } from "../../services/firebase";
import { Post } from "../../types/Post";
import { GUEST_MODE_KEY } from "../../const";

type CreateShiftParams = {
  userId: string;
  date: Date;
  posts: Post[];
  postId: string;
  startTime: string;
  endTime: string;
  remark?: string;
};

export const createShift = async ({
  userId,
  date,
  posts,
  postId,
  startTime,
  endTime,
  remark = "",
}: CreateShiftParams) => {
  try {

    const post = posts.find(p => p.id === postId);

    if (!post) {
      throw new Error(`Post not found. Tried looking for ID "${postId}" inside an array of ${posts?.length || 0} items.`);
    }

    // Clean post object fields to ensure no hidden properties evaluate to undefined
    const sanitizedPost = {
      id: post.id || "",
      title: post.title || "",
      tasks: post.tasks || [],
      hourlyRate: post.hourlyRate ?? 0,
      defaultStartTime: post.defaultStartTime || "",
      defaultEndTime: post.defaultEndTime || ""
    };

    // Format the date securely. If your Shift interface strictly mandates a Date instance,
    // remember that Firestore handles raw Dates poorly inside arrays; using ISO strings
    // or Timestamps is highly recommended.
    const newShift: any = {
      id: `${date.getTime()}_${sanitizedPost.id}`,
      userId: userId,
      // Convert to string format so Firestore does not reject it as an undefined or raw complex prototype
      date: date.toISOString().split('T')[0],
      post: sanitizedPost,
      startTime: startTime || "",
      endTime: endTime || "",
      remark: remark || "",
    };

    // Strip out any potentially accidental undefined values just to be absolutely bulletproof
    Object.keys(newShift).forEach(key => {
      if (newShift[key] === undefined) {
        newShift[key] = "";
      }
    });

    const isGuestMode = typeof window !== 'undefined' && localStorage.getItem(GUEST_MODE_KEY) === 'true';

    if (!isGuestMode) {
      const userRef = doc(db, "users", userId);

      await setDoc(
        userRef,
        {
          shifts: arrayUnion(newShift),
        },
        { merge: true }
      );
    }

    return newShift;
  } catch (error) {
    console.error("❌ Failed to create shift:", error);
    throw error;
  }
};
