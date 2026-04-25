import { User } from "../types/User";
import { getRoleByPost } from "./getRoleByPost";

export const getAvailableUsersByPost = (
  users: User[],
  postId: string
): User[] => {
  const role = getRoleByPost(postId);

  if (!role) return [];

  return users.filter(user => user.roles.includes(role));
};
