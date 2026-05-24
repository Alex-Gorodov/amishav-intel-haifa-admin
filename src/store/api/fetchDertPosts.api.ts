import { getDocs } from "firebase/firestore"
import { DERT_POSTS, GUEST_MODE_KEY } from "../../const"
import { AppDispatch } from "../../types/State"
import { Post } from "../../types/Post";
import { loadDertPosts } from "../actions";

export const fetchDertPosts = async (dispatch: AppDispatch) => {
  if (localStorage.getItem(GUEST_MODE_KEY) === "true") return;
  try {
    const data = await getDocs(DERT_POSTS);

    if (localStorage.getItem(GUEST_MODE_KEY) === "true") return;

    const posts: Post[] = data.docs.map(doc => {
      const postData = doc.data() as Post;
      return {
        id: doc.id,
        title: postData.title || '',
        tasks: [],
        hourlyRate: postData.hourlyRate,
        defaultStartTime: postData.defaultStartTime,
        defaultEndTime: postData.defaultEndTime,
        role: postData.role,
        isMultiple: postData.isMultiple,
      } as Post;
    })

    dispatch(loadDertPosts({ posts }))
  } catch (error) {
    console.error("Error fetching posts:", error);
  }
};
