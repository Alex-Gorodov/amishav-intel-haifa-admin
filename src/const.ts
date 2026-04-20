import { collection } from "firebase/firestore";
import { db } from "./services/firebase";
import { Post } from "./types/Post";

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

export const Tariffs = {
  shiftManager: 65,
  supervisor: 52,
  dertLeader: 57,
  securityShiftLeader: 52,
  controller: 48,
  dertMember: 48,
  securityGuard: 48,
}

export const Posts: Post[] = [
  { id: "gatehouse-morning", title: "גייטהאוס בוקר", defaultStartTime: "06:30", defaultEndTime: "15:00", hourlyRate: Tariffs.securityGuard},
  { id: "gatehouse-afternoon", title: "גייטהאוס צהריים", defaultStartTime: "14:45", defaultEndTime: "22:00" , hourlyRate: Tariffs.securityGuard},
  { id: "gatehouse-night", title: "גייטהאוס לילה", defaultStartTime: "21:45", defaultEndTime: "07:00", hourlyRate: Tariffs.securityGuard},

  { id: "gatehouse-reinforcement", title: "תגבור גייט", defaultStartTime: "06:30", defaultEndTime: "15:00", hourlyRate: Tariffs.securityGuard},

  { id: "security-sl-morning", title: "אחמ״ש אבטחה בוקר", defaultStartTime: "06:00", defaultEndTime: "14:00", hourlyRate: Tariffs.securityShiftLeader},
  { id: "security-sl-afternoon", title: "אחמ״ש אבטחה צהריים", defaultStartTime: "13:30", defaultEndTime: "22:00", hourlyRate: Tariffs.securityShiftLeader},
  { id: "security-sl-night", title: "אחמ״ש אבטחה לילה", defaultStartTime: "21:30", defaultEndTime: "06:30", hourlyRate: Tariffs.securityShiftLeader},

  { id: "patrol-9-morning", title: "סייר 9 בוקר", defaultStartTime: "06:30", defaultEndTime: "15:00", hourlyRate: Tariffs.securityGuard},
  { id: "patrol-9-afternoon", title: "סייר 9 צהריים", defaultStartTime: "11:30", defaultEndTime: "22:00", hourlyRate: Tariffs.securityGuard},

  { id: "patrol-main-morning", title: "סייר ראשי בוקר", defaultStartTime: "06:30", defaultEndTime: "15:00", hourlyRate: Tariffs.securityGuard},
  { id: "patrol-main-afternoon", title: "סייר ראשי צהריים", defaultStartTime: "14:45", defaultEndTime: "22:00", hourlyRate: Tariffs.securityGuard},
  { id: "patrol-main-double-shift", title: "סייר ראשי כפולה", defaultStartTime: "08:00", defaultEndTime: "20:00", hourlyRate: Tariffs.securityGuard},

  { id: "patrol-satellite-afternoon", title: "סייר לווינים צהריים", defaultStartTime: "12:00", defaultEndTime: "22:00", hourlyRate: Tariffs.securityGuard},
  { id: "patrol-satellite-night", title: "סייר לווינים לילה", defaultStartTime: "21:45", defaultEndTime: "07:00", hourlyRate: Tariffs.securityGuard},

  { id: "patrol-preliminary-1", title: "סייר מקדים 1 (עד 14:00)", defaultStartTime: "06:30", defaultEndTime: "14:00", hourlyRate: Tariffs.securityGuard},
  { id: "patrol-preliminary-2", title: "סייר מקדים 2 (עד 17:00)", defaultStartTime: "06:30", defaultEndTime: "17:00", hourlyRate: Tariffs.securityGuard},

  { id: "shift-manager-morning", title: "מנהל משמרת חמוש בוקר", defaultStartTime: "06:00", defaultEndTime: "14:00", hourlyRate: Tariffs.shiftManager},
  { id: "shift-manager-afternoon", title: "מנהל משמרת חמוש צהריים", defaultStartTime: "13:30", defaultEndTime: "22:00", hourlyRate: Tariffs.shiftManager},
  { id: "shift-manager-night", title: "מנהל משמרת חמוש לילה", defaultStartTime: "21:30", defaultEndTime: "06:30", hourlyRate: Tariffs.shiftManager},
];

export const ErrorMessages = {
  // global
  TRY_AGAIN: "נסה שוב",
  UNKNOWN_ERROR: "אירעה שגיאה לא צפויה",
  CONNECTION_ERROR: "בדוק את החיבור ונסה שוב",

  // user / login
  FIELDS_REQUIRED: "כל השדות חייבים להיות מלאים",
  ROLE_REQUIRED: "בחר לפחות תפקיד אחד",
  USER_CREATE_ERROR: "אירעה שגיאה ביצירת המשתמש",
  ENTER_VALID_EMAIL: "אנא הכנס אימייל תקין",
  USER_NOT_SELECTED: "שגיאה! לא נבחר משתמש",
  CHECK_LOGIN_AND_PASSWORD: "תוודא שהנתונים תקינים",
  PASSWORD_MIN_LENGTH_ERROR: "הסיסמה חייבת להכיל 6 ספרות",

  // camera
  CAMERA_OPEN_ERROR: "שגיאה בפתיחת המצלמה",
  CAMERA_ACCESS_NEEDED: "יש לתת הרשאה לגישה למצלמה",

  // shifts
  POST_NOT_SELECTED: "שגיאה! לא נבחרה עמדה",
  START_TIME_NOT_SELECTED: "לא נבחר זמן התחלה",
  END_TIME_NOT_SELECTED: "לא נבחר זמן סיום",
  END_BEFORE_START_DAY: "שעת הסיום מוקדמת משעת ההתחלה למשמרת בוקר/צהריים",
  SHIFT_TOO_LONG: "המשמרת לא יכולה להימשך יותר מ-12 שעות",
  SHIFT_SAVE_ERROR: "שגיאה בשמירת המשמרת",
  MISSING_DATA_FOR_EXCHANGE: "חסרים נתונים לביצוע החלפה",
  MISSING_SHIFT_DATA_FOR_GIVING: "חסרים נתונים למסירת משמרת",
  REQUEST_NOT_SENT_TRY_AGAIN: "הבקשה לא נשלחה. נסה שוב",
  FUTURE_SHIFTS_ONLY: "ניתן למסור או להחליף רק משמרות עתידיות",
};

export const SuccessMessages = {
  SHIFT_ADDED: "משמרת נוספה בהצלחה!",
  PROFILE_IMAGE_UPDATED: "תמונת פרופיל חודשה בהצלחה!",
  USER_CREATED: "המשתמש נוצר בהצלחה",
  DATA_SAVED: "הנתונים נשמרו בהצלחה",
  SHIFT_SWAP_REQUEST_SENT: "בקשת החלפה נשלחה בהצלחה",
  SHIFT_GIVE_REQUEST_SENT: "בקשת מסירת משמרת נשלחה בהצלחה",
  CHECK_EMAIL_FOR_RESET_LINK: "בדוק את האימייל שלך - שלחנו לך קישור לאיפוס הסיסמה! ייתכן שהקישור הגיע לתיקיית הספאם"

};
