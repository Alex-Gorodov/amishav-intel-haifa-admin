import { Post } from "./Post";

export type Shift = {
  id: string;
  userId: string;
  date: Date;
  post: Post;
  startTime: string;
  endTime: string;
  remark?: string;
}
