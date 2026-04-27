import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "../../services/firebase";
import { Post } from "../../types/Post";
import { getHourlyRateByRole } from "../../utils/getHourlyRateByRole";

export const createPost = async (data: Omit<Post, "hourlyRate">) => {
  try {
    const hourlyRate = getHourlyRateByRole(data.role);

    const post: Post = {
      ...data,
      hourlyRate,
    };

    const ref = doc(collection(db, "posts"), data.id); // or auto-id if you want
    await setDoc(ref, post);

    console.log("✅ Post created");
  } catch (err) {
    console.error("❌ Error creating post:", err);
    throw err;
  }
};
