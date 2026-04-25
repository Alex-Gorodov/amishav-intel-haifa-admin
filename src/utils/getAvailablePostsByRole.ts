import { Posts } from "../const";
import { Post } from "../types/Post";
import { User } from "../types/User";

export const getAvailablePostsByRole = (user: User): Post[] => {
  return Posts.filter(post => user.roles.includes(post.role));
};
