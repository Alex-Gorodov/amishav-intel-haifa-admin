import { collection } from "firebase/firestore";
import { db } from "./services/firebase";

export type Forms = "protocol" | "newEmployee" | "newShift";


export const USERS = collection(db, 'users');

export const SWAP_REQUESTS = collection(db, 'swapRequests');
export const GIVE_REQUESTS = collection(db, 'giveRequests');

export const PROTOCOLS_HEADERS = collection(db, 'protocolsHeaders')

export const Roles = [
  { value: "shift_manager", label: "מנהל משמרת" },
  { value: "supervisor", label: "אחמ״ש בקרה" },
  { value: "dert_leader", label: "אחמ״ש חירום" },
  { value: "security_shift_leader", label: "אחמ״ש ביטחון" },
  { value: "controller", label: "בקר" },
  { value: "dert_member", label: "רספונדר" },
  { value: "security_guard", label: "מאבטח" },
] as const;

export enum AppRoute {
  Root = "/amishav-intel-haifa-admin",
  Employees = "/amishav-intel-haifa-admin/employees"
}

export const Titles: Record<string, string> = {
  [AppRoute.Root]: "עמישב אינטל חיפה | מערכת ניהול",
  [AppRoute.Employees]: "עמישב אינטל חיפה | רשימת עובדים",
};

export const trainingIcons: Record<string, string> = {
  "הדרכת בטיחות": "🛡️",
  "רענון רוני": "🔄",
  "רענון נשק": "🔫",
  "רענון אזרה ראשונה": "🩹",
  "הדרכת סמכויות": "📜"
};
