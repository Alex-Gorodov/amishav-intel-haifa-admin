import { collection } from "firebase/firestore";
import { db } from "./services/firebase";
import { Post } from "./types/Post";
import { RequestStatus } from "./types/Request";
import { RoleValue } from "./types/User";

export type Forms = "protocol" | "newEmployee" | "newShift";


export const USERS = collection(db, 'users');

export const SWAP_REQUESTS = collection(db, 'swapRequests');
export const GIVE_REQUESTS = collection(db, 'giveRequests');

export const SECURITY_POSTS = collection(db, 'posts');
export const CONTROLL_CENTER_POSTS = collection(db, 'controllCenterPosts');
export const DERT_POSTS = collection(db, 'dertPosts');

export const PROTOCOLS_HEADERS = collection(db, 'protocolsHeaders')
export const PROTOCOLS = collection(db, 'protocols')

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

export const securityRoles: RoleValue[] = [
  "shift_manager",
  "security_shift_leader",
  "security_guard",
];

export const controlRoomRoles: RoleValue[] = [
  "controller",
  "supervisor",
];

export const emergencyRoles: RoleValue[] = [
  "dert_member",
  "dert_leader",
];

export enum AppRoute {
  Root = "/",
  Auth = '/auth',
  Employees = "/employees",
  Requests = "/requests",
  NewEmployee = "/new-employee",
  NewProtocol = "/new-protocol",
  AddShift = "/add-shift",
  Schedule = "/schedule",
}

export const GUEST_MODE_KEY = "amishav-guest-mode";

export const Titles: Record<string, string> = {
  [AppRoute.Root]: "אינטל חיפה\u00A0|\u00A0מערכת ניהול",
  [AppRoute.Auth]: "אינטל חיפה\u00A0|\u00A0התחברות למערכת",
  [AppRoute.Employees]: "אינטל חיפה\u00A0|\u00A0רשימת עובדים",
  [AppRoute.Requests]: "אינטל חיפה\u00A0|\u00A0בקשות לשינויים",
  [AppRoute.NewEmployee]: "אינטל חיפה\u00A0|\u00A0עובד חדש",
  [AppRoute.NewProtocol]: "אינטל חיפה\u00A0|\u00A0נוהל חדש",
  [AppRoute.AddShift]: "אינטל חיפה\u00A0|\u00A0משמרת חדשה",
  [AppRoute.Schedule]: "אינטל חיפה\u00A0|\u00A0סידור עבודה",
};

export const StatusLabels: Record<RequestStatus, string> = {
  [RequestStatus.PendingUser]: 'ממתין לאישור עובד',
  [RequestStatus.PendingAdmin]: 'ממתין לאישור מנהל',
  [RequestStatus.Approved]: 'אושר',
  [RequestStatus.Rejected]: 'נדחה',
};

export const STATUS_PRIORITY: Record<RequestStatus, number> = {
  [RequestStatus.PendingAdmin]: 1, // First
  [RequestStatus.PendingUser]: 2,  // Second
  [RequestStatus.Approved]: 3,     // Third
  [RequestStatus.Rejected]: 4,     // Last
};

export const Tariffs = {
  shiftManager: 65,
  supervisor: 60,
  dertLeader: 60,
  securityShiftLeader: 56,
  controller: 56,
  dertMember: 56,
  securityGuard: 50,
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


export const SecurityPostsOrder = [
  { id: "gatehouse-morning"},
  { id: "gatehouse-afternoon"},
  { id: "gatehouse-night"},

  { id: "security-sl-morning"},
  { id: "security-sl-afternoon"},

  { id: "patrol-satellite-morning"},
  { id: "patrol-satellite-afternoon"},
  { id: "patrol-satellite-night"},

  { id: "patrol-preliminary-2"},

  { id: "patrol-main-morning"},
  { id: "gatehouse-reinforcement"},
  { id: "patrol-9-afternoon"},

  { id: "shift-manager-morning"},
  { id: "shift-manager-afternoon"},
  { id: "shift-manager-night"},
];

export const DertPostsOrder = [
  { id: 'dert-morning'},
  { id: 'dert-leader-morning'},
  { id: 'dert-evening'},
  { id: 'dert-leader-evening'},
  { id: 'dert-night'},
  { id: 'dert-leader-night'},
];

export const OccPostsOrder = [
  { id: 'controller-1-morning'},
  { id: 'controller-2-morning'},
  { id: 'supervisor-morning'},
  { id: 'controller-evening'},
  { id: 'supervisor-evening'},
  { id: 'controller-night'},
  { id: 'supervisor-night'},
]

export const FirebaseErrorMessages = {
  SIGN_UP_EMAIL: "Firebase: Error (auth/invalid-email).",
  SIGN_UP_PASSWORD: "Firebase: Password should be at least 6 characters (auth/weak-password).",
  SIGN_UP_EMAIL_EXIST: "Firebase: Error (auth/email-already-in-use).",
}

export const ErrorMessages = {
  // global
  TRY_AGAIN: "נסה שוב",
  UNKNOWN_ERROR: "אירעה שגיאה לא צפויה",
  CONNECTION_ERROR: "בדוק את החיבור ונסה שוב",

  // user / login
  FIELDS_REQUIRED: "כל השדות חייבים להיות מלאים",
  ROLE_REQUIRED: "בחר לפחות תפקיד אחד",
  ENTER_VALID_EMAIL: "אנא הכנס אימייל תקין",
  USER_NOT_SELECTED: "שגיאה! לא נבחר משתמש",
  CHECK_LOGIN_AND_PASSWORD: "תוודא שהנתונים תקינים",
  PASSWORD_MIN_LENGTH_ERROR: "הסיסמה חייבת להכיל 6 ספרות",
  CHECK_EMAIL_FOR_RESET_LINK: "בדוק את האימייל שלך - שלחנו לך קישור לאיפוס הסיסמה! ייתכן שהקישור הגיע לתיקיית הספאם",
  NO_ADMIN_PERMISSIONS: "אין הרשאות מנהל",
  USER_CREATING_ERROR: "שגיאה בתהליך יצור משתמש",
  USER_CREATING_WRONG_EMAIL: "בדוק אימייל",
  USER_CREATING_SHORT_PASSWORD: "הסיסמא צריכה להכיל 6 ספרות (מספר עובד עמישב)",
  USER_CREATING_EMAIL_EXIST: "משמתמש עם אימייל זהה כבר קיים!",

  // camera
  CAMERA_OPEN_ERROR: "שגיאה בפתיחת המצלמה",
  CAMERA_ACCESS_NEEDED: "יש לתת הרשאה לגישה למצלמה",

  // Protocols
  PROTOCOL_CREATING_ERROR: "שגיאה ביצירת נוהל",

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
  USER_CREATED: "העובד נוצר בהצלחה",
  USER_DELETED: "העובד נמחק בהצלחה",
  POST_CREATED: "העמדה נוצרה בהצלחה",
  DATA_SAVED: "הנתונים נשמרו בהצלחה",
  SHIFT_SWAP_REQUEST_SENT: "בקשת החלפה נשלחה בהצלחה",
  SHIFT_GIVE_REQUEST_SENT: "בקשת מסירת משמרת נשלחה בהצלחה",
  SHIFT_SWAP_ACCEPT_COMPLETED: "חילןף בין המשמרות בוצע בהצלחה!",
  SHIFT_SWAP_REJECT_COMPLETED: "חילןף בין המשמרות נדחה בהצלחה!",
  SHIFT_GIVE_ACCEPT_COMPLETED: "מסירת משמרת בוצעה בהצלחה!",
  SHIFT_GIVE_REJECT_COMPLETED: "מסירת משמרת נדחה בהצלחה!",
  SHIFT_EDIT_COMPLETED: "עדכון פרטי המשמרת בוצע בהצלחה!",
  PROTOCOL_ADDED: "נוהל נוצר בהצלחה",
  PROTOCOL_EDITED: "הנוהל הודכן בהצלחה",
  PROTOCOL_DELETED: "הנוהל הוסר בהצלחה"
};

export const DEFAULT_TRAININGS = (userId: string) => ({
  safety: {
    id: `${userId}-safety`,
    title: 'הדרכת בטיחות',
    description: '',
    updatingDate: null,
    validityPeriod: 365,
  },
  roni: {
    id: `${userId}-roni`,
    title: 'רענון רוני',
    description: '',
    updatingDate: null,
    validityPeriod: 365,
  },
  weapon: {
    id: `${userId}-weapon`,
    title: 'רענון נשק',
    description: '',
    updatingDate: null,
    validityPeriod: 182,
  },
  mada: {
    id: `${userId}-mada`,
    title: 'רענון עזרה ראשונה',
    description: '',
    updatingDate: null,
    validityPeriod: 730,
  },
  rights: {
    id: `${userId}-rights`,
    title: 'הדרכת סמכויות',
    description: '',
    updatingDate: null,
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
