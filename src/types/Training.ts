import { Timestamp } from "firebase/firestore";

export type Training = {
  id: string;
  title: string;
  description?: string;
  executionDate: Date | null;
  validityPeriod: number;
}
