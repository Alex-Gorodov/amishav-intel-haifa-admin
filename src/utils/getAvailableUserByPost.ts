// import { User } from "../types/User";
// import { getRoleByPost } from "./getRoleByPost";

// export const getAvailableUsersByPost = (
//   users: User[],
//   postId: string
// ): User[] => {
//   const role = getRoleByPost(postId);

//   if (!role) return [];

//   return users.filter(user => user.roles.includes(role));
// };


import { User } from "../types/User";
import { Post } from "../types/Post";

/**
 * Filters a list of users to return only those who possess the matching role for a given postId.
 * @param users The full list of application users.
 * @param postId The ID of the post we want to fill.
 * @param allPosts The runtime contextual posts collection (security, occ, or dert).
 */
export const getAvailableUsersByPost = (
  users: User[],
  postId: string,
  allPosts: Post[]
): User[] => {
  // Find the post matching our ID within our contextual array
  const currentPost = allPosts.find(p => p.id === postId);

  // If the post isn't found or doesn't have a role assigned, block selection
  if (!currentPost || !currentPost.role) return [];

  // Filter users to only those containing the post's role requirements
  return users.filter(user => user.roles.includes(currentPost.role));
};
