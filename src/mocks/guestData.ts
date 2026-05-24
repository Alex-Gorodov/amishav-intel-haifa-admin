import { Timestamp } from "firebase/firestore";
import { AppDispatch } from "../types/State";
import { DEFAULT_TRAININGS } from "../const";
import { Post } from "../types/Post";
import { User } from "../types/User";
import { GiveShiftRequest, SwapShiftRequest, RequestStatus } from "../types/Request";
import { loadUsers, loadSecurityPosts, loadControllCenterPosts, loadDertPosts, loadRequests } from "../store/actions";

const securityPosts: Post[] = [
  {
    id: "gatehouse-morning",
    title: "גייטהאוס בוקר",
    defaultStartTime: "06:30",
    defaultEndTime: "15:00",
    hourlyRate: 48,
    role: "security_guard",
  },
  {
    id: "patrol-satellite-morning",
    title: "סייר לווינים בוקר",
    defaultStartTime: "06:30",
    defaultEndTime: "15:00",
    hourlyRate: 48,
    role: "security_guard",
  },
];

const controllCenterPosts: Post[] = [
  {
    id: "controller-1-morning",
    title: "בקר 1 בוקר",
    defaultStartTime: "07:00",
    defaultEndTime: "15:30",
    hourlyRate: 48,
    role: "controller",
  },
  {
    id: "supervisor-morning",
    title: "אחמ״ש בקרה בוקר",
    defaultStartTime: "06:00",
    defaultEndTime: "14:00",
    hourlyRate: 52,
    role: "supervisor",
  },
];

const dertPosts: Post[] = [
  {
    id: "dert-morning",
    title: "אחמ״ש חירום בוקר",
    defaultStartTime: "07:00",
    defaultEndTime: "15:00",
    hourlyRate: 48,
    role: "dert_member",
  },
  {
    id: "dert-leader-morning",
    title: "אחמ״ש חירום מנהל בוקר",
    defaultStartTime: "06:00",
    defaultEndTime: "14:00",
    hourlyRate: 57,
    role: "dert_leader",
  },
];

const makeGuestUser = (id: string, firstName: string, secondName: string, role: User["roles"][number][], email: string, phoneNumber: string, shifts: User["shifts"], availability: User["availability"]) => {
  const trainings = DEFAULT_TRAININGS(id) as {
    safety: { updatingDate: Date | null };
    roni: { updatingDate: Date | null };
    weapon: { updatingDate: Date | null };
    mada: { updatingDate: Date | null };
    rights: { updatingDate: Date | null };
  };

  trainings.safety.updatingDate = new Date("2025-10-12");
  trainings.roni.updatingDate = new Date("2025-11-05");
  trainings.weapon.updatingDate = new Date("2026-01-20");
  trainings.mada.updatingDate = new Date("2025-12-10");
  trainings.rights.updatingDate = new Date("2025-08-15");

  return {
    id,
    passportId: `00000000${id.slice(-1)}`,
    firstName,
    secondName,
    roles: role,
    shifts,
    email,
    availability,
    documents: [
      {
        url: `https://example.com/demo/${id}-id.pdf`,
        name: "תעודת זהות",
      },
    ],
    trainings,
    phoneNumber,
    createdAt: Timestamp.fromDate(new Date("2026-01-01")),
  } as User;
};

export const GUEST_USERS: User[] = [
  makeGuestUser(
    "guest-harry",
    "Harry",
    "Potter",
    ["security_guard"],
    "harry.potter@demo.amishav",
    "0500000001",
    [
      {
        id: "shift-guest-harry-1",
        userId: "guest-harry",
        date: new Date("2026-06-03T06:30:00"),
        post: securityPosts[0],
        startTime: "06:30",
        endTime: "15:00",
        remark: "גשש רגל לכניסה",
      },
    ],
    [
      {
        date: Timestamp.fromDate(new Date("2026-06-04")),
        comment: "available only during work hours",
        statuses: [true, true, true, false, false, false, false],
      },
    ]
  ),
  makeGuestUser(
    "guest-hermione",
    "Hermione",
    "Granger",
    ["controller"],
    "hermione.granger@demo.amishav",
    "0500000002",
    [
      {
        id: "shift-guest-hermione-1",
        userId: "guest-hermione",
        date: new Date("2026-06-03T07:00:00"),
        post: controllCenterPosts[0],
        startTime: "07:00",
        endTime: "15:30",
      },
    ],
    [
      {
        date: Timestamp.fromDate(new Date("2026-06-05")),
        comment: "ready for control shift",
        statuses: [true, true, true, true, true, false, false],
      },
    ]
  ),
  makeGuestUser(
    "guest-jon",
    "Jon",
    "Snow",
    ["shift_manager"],
    "jon.snow@demo.amishav",
    "0500000003",
    [
      {
        id: "shift-guest-jon-1",
        userId: "guest-jon",
        date: new Date("2026-06-04T06:00:00"),
        post: {
          id: "shift-manager-morning",
          title: "מנהל משמרת חמוש בוקר",
          defaultStartTime: "06:00",
          defaultEndTime: "14:00",
          hourlyRate: 65,
          role: "shift_manager",
        },
        startTime: "06:00",
        endTime: "14:00",
      },
    ],
    [
      {
        date: Timestamp.fromDate(new Date("2026-06-06")),
        comment: "מוכן לעבודה",
        statuses: [true, false, true, true, true, true, false],
      },
    ]
  ),
  makeGuestUser(
    "guest-frodo",
    "Frodo",
    "Baggins",
    ["security_guard"],
    "frodo.baggins@demo.amishav",
    "0500000004",
    [],
    [
      {
        date: Timestamp.fromDate(new Date("2026-06-07")),
        comment: "Needs rest after long patrols",
        statuses: [false, false, true, true, true, false, false],
      },
    ]
  ),
  makeGuestUser(
    "guest-leia",
    "Leia",
    "Organa",
    ["supervisor"],
    "leia.organa@demo.amishav",
    "0500000005",
    [
      {
        id: "shift-guest-leia-1",
        userId: "guest-leia",
        date: new Date("2026-06-04T06:00:00"),
        post: controllCenterPosts[1],
        startTime: "06:00",
        endTime: "14:00",
      },
    ],
    [
      {
        date: Timestamp.fromDate(new Date("2026-06-06")),
        comment: "supervisor check-up",
        statuses: [true, true, true, true, false, false, false],
      },
    ]
  ),
];

export const GUEST_SECURITY_POSTS = securityPosts;
export const GUEST_CONTROLL_CENTER_POSTS = controllCenterPosts;
export const GUEST_DERT_POSTS = dertPosts;

export const GUEST_SWAP_REQUESTS: SwapShiftRequest[] = [
  {
    id: "guest-swap-1",
    type: "swap",
    status: RequestStatus.PendingAdmin,
    createdAt: new Date("2026-06-01T10:00:00"),
    updatedAt: new Date("2026-06-01T10:00:00"),
    details: "Harry מבקש החלפת משמרת עם Jon",
    firstUserId: "guest-harry",
    secondUserId: "guest-jon",
    firstShiftId: "shift-guest-harry-1",
    secondShiftId: "shift-guest-jon-1",
  },
];

export const GUEST_GIVE_REQUESTS: GiveShiftRequest[] = [
  {
    id: "guest-give-1",
    type: "give",
    status: RequestStatus.PendingAdmin,
    createdAt: new Date("2026-06-02T09:00:00"),
    updatedAt: new Date("2026-06-02T09:00:00"),
    details: "Hermione מבקשת למסור משמרת לבקר",
    firstUserId: "guest-hermione",
    secondUserId: "guest-leia",
    shiftId: "shift-guest-hermione-1",
  },
];

export const loadGuestData = (dispatch: AppDispatch) => {
  dispatch(loadUsers({ users: GUEST_USERS }));
  dispatch(loadSecurityPosts({ posts: GUEST_SECURITY_POSTS }));
  dispatch(loadControllCenterPosts({ posts: GUEST_CONTROLL_CENTER_POSTS }));
  dispatch(loadDertPosts({ posts: GUEST_DERT_POSTS }));
  dispatch(loadRequests({ type: "swap", requests: GUEST_SWAP_REQUESTS }));
  dispatch(loadRequests({ type: "give", requests: GUEST_GIVE_REQUESTS }));
};
