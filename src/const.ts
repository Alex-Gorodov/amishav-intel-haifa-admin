import { collection } from "firebase/firestore";
import { db } from "./services/firebase";
import { Post } from "./types/Post";
import { RequestStatus } from "./types/Request";

export type Forms = "protocol" | "newEmployee" | "newShift";


export const USERS = collection(db, 'users');

export const SWAP_REQUESTS = collection(db, 'swapRequests');
export const GIVE_REQUESTS = collection(db, 'giveRequests');

export const POSTS = collection(db, 'posts');

export const PROTOCOLS_HEADERS = collection(db, 'protocolsHeaders')

export enum Colors {
  IntelBlue = "#0078d4",
  White = "#ffffff",
  GrayLight = "#f5f5f5",
  GrayDark = "#333333",
}

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
  Employees = "/amishav-intel-haifa-admin/employees",
  Requests = "/amishav-intel-haifa-admin/requests",
  NewEmployee = "/amishav-intel-haifa-admin/new-employee",
  NewProtocol = "/amishav-intel-haifa-admin/new-protocol",
  AddShift = "/amishav-intel-haifa-admin/add-shift",
  Schedule = "/amishav-intel-haifa-admin/schedule",
}

export const Titles: Record<string, string> = {
  [AppRoute.Root]: "עמישב אינטל חיפה\u00A0|\u00A0מערכת ניהול",
  [AppRoute.Employees]: "עמישב אינטל חיפה\u00A0|\u00A0רשימת עובדים",
  [AppRoute.Requests]: "עמישב אינטל חיפה\u00A0|\u00A0בקשות לשינויים",
  [AppRoute.NewEmployee]: "עמישב אינטל חיפה\u00A0|\u00A0עובד חדש",
  [AppRoute.NewProtocol]: "עמישב אינטל חיפה\u00A0|\u00A0נוהל חדש",
  [AppRoute.AddShift]: "עמישב אינטל חיפה\u00A0|\u00A0משמרת חדשה",
  [AppRoute.Schedule]: "עמישב אינטל חיפה\u00A0|\u00A0סידור עבודה",
};

export const StatusLabels: Record<RequestStatus, string> = {
  [RequestStatus.PendingUser]: 'ממתין לאישור עובד',
  [RequestStatus.PendingAdmin]: 'ממתין לאישור מנהל',
  [RequestStatus.Approved]: 'אושר',
  [RequestStatus.Rejected]: 'נדחה',
};


export const icons: Record<string, string> = {
  "הדרכת בטיחות": "🛡️",
  "רענון רוני": "🔄",
  "רענון נשק": "🔫",
  "רענון עזרה ראשונה": "🩹",
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
  { id: "gatehouse-morning", title: "גייטהאוס בוקר", defaultStartTime: "06:30", defaultEndTime: "15:00", hourlyRate: Tariffs.securityGuard, role: 'security_guard'},
  { id: "gatehouse-afternoon", title: "גייטהאוס צהריים", defaultStartTime: "14:45", defaultEndTime: "22:00" , hourlyRate: Tariffs.securityGuard, role: 'security_guard'},
  { id: "gatehouse-night", title: "גייטהאוס לילה", defaultStartTime: "21:45", defaultEndTime: "07:00", hourlyRate: Tariffs.securityGuard, role: 'security_guard'},

  { id: "security-sl-morning", title: "אחמ״ש אבטחה בוקר", defaultStartTime: "06:00", defaultEndTime: "14:00", hourlyRate: Tariffs.securityShiftLeader, role: 'security_shift_leader'},
  { id: "security-sl-afternoon", title: "אחמ״ש אבטחה צהריים", defaultStartTime: "13:30", defaultEndTime: "22:15", hourlyRate: Tariffs.securityShiftLeader, role: 'security_shift_leader'},

  { id: "patrol-satellite-morning", title: "סייר לווינים בוקר", defaultStartTime: "06:30", defaultEndTime: "15:00", hourlyRate: Tariffs.securityGuard, role: 'security_guard'},
  { id: "patrol-satellite-afternoon", title: "סייר לווינים צהריים", defaultStartTime: "12:00", defaultEndTime: "22:00", hourlyRate: Tariffs.securityGuard, role: 'security_guard'},
  { id: "patrol-satellite-night", title: "סייר לווינים לילה", defaultStartTime: "21:45", defaultEndTime: "07:00", hourlyRate: Tariffs.securityGuard, role: 'security_guard'},

  { id: "patrol-preliminary-2", title: "סייר מקדים 2 (עד 17:00)", defaultStartTime: "06:30", defaultEndTime: "17:00", hourlyRate: Tariffs.securityGuard, role: 'security_guard'},

  { id: "patrol-main-morning", title: "סייר ראשי בוקר", defaultStartTime: "06:30", defaultEndTime: "16:00", hourlyRate: Tariffs.securityGuard, role: 'security_guard'},
  { id: "gatehouse-reinforcement", title: "תגבור גייט", defaultStartTime: "06:30", defaultEndTime: "15:00", hourlyRate: Tariffs.securityGuard, role: 'security_guard'},
  { id: "patrol-9-afternoon", title: "סייר 9 צהריים", defaultStartTime: "11:30", defaultEndTime: "20:00", hourlyRate: Tariffs.securityGuard, role: 'security_guard'},

  { id: "shift-manager-morning", title: "מנהל משמרת חמוש בוקר", defaultStartTime: "06:00", defaultEndTime: "14:00", hourlyRate: Tariffs.shiftManager, role: 'shift_manager'},
  { id: "shift-manager-afternoon", title: "מנהל משמרת חמוש צהריים", defaultStartTime: "13:30", defaultEndTime: "22:00", hourlyRate: Tariffs.shiftManager, role: 'shift_manager'},
  { id: "shift-manager-night", title: "מנהל משמרת חמוש לילה", defaultStartTime: "21:30", defaultEndTime: "06:30", hourlyRate: Tariffs.shiftManager, role: 'shift_manager'},
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
  CHECK_EMAIL_FOR_RESET_LINK: "בדוק את האימייל שלך - שלחנו לך קישור לאיפוס הסיסמה! ייתכן שהקישור הגיע לתיקיית הספאם",

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
  SHIFT_DELETED: "משמרת נמחקה בהצלחה!",
  PROFILE_IMAGE_UPDATED: "תמונת פרופיל חודשה בהצלחה!",
  USER_CREATED: "המשתמש נוצר בהצלחה",
  USER_DELETED: "המשתמש נמחק בהצלחה",
  POST_CREATED: "העמדה נוצרה בהצלחה",
  DATA_SAVED: "הנתונים נשמרו בהצלחה",
  SHIFT_SWAP_REQUEST_SENT: "בקשת החלפה נשלחה בהצלחה",
  SHIFT_GIVE_REQUEST_SENT: "בקשת מסירת משמרת נשלחה בהצלחה",
  SHIFT_SWAP_COMPLETED: "חילןף בין המשמרות בוצע בהצלחה!",
  SHIFT_GIVE_COMPLETED: "מסירת משמרת בוצעה בהצלחה!",
  SHIFT_EDIT_COMPLETED: "עדכון פרטי המשמרת בוצע בהצלחה!",
  PROTOCOL_ADDED: "נוהל נוצר בהצלחה",
};

export const DEFAULT_TRAININGS = (userId: string) => ({
  safety: {
    id: `${userId}-safety`,
    title: 'הדרכת בטיחות',
    description: '',
    executionDate: null,
    validityPeriod: 365,
  },
  roni: {
    id: `${userId}-roni`,
    title: 'רענון רוני',
    description: '',
    executionDate: null,
    validityPeriod: 365,
  },
  weapon: {
    id: `${userId}-weapon`,
    title: 'רענון נשק',
    description: '',
    executionDate: null,
    validityPeriod: 182,
  },
  mada: {
    id: `${userId}-mada`,
    title: 'רענון עזרה ראשונה',
    description: '',
    executionDate: null,
    validityPeriod: 730,
  },
  rights: {
    id: `${userId}-rights`,
    title: 'הדרכת סמכויות',
    description: '',
    executionDate: null,
    validityPeriod: 365,
  }
});

export type TrainingKey =
  | "safety"
  | "roni"
  | "weapon"
  | "mada"
  | "rights";

export const TRAINING_SCHEMA: Record<
  TrainingKey,
  { title: string; validityPeriod: number }
> = {
  safety: {
    title: "הדרכת בטיחות",
    validityPeriod: 365,
  },
  roni: {
    title: "רענון רוני",
    validityPeriod: 365,
  },
  weapon: {
    title: "רענון נשק",
    validityPeriod: 182,
  },
  mada: {
    title: "רענון עזרה ראשונה",
    validityPeriod: 730,
  },
  rights: {
    title: "הדרכת סמכויות",
    validityPeriod: 365,
  },
};
