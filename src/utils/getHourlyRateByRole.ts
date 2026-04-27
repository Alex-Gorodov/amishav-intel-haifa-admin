import { Tariffs } from "../const";
import { Post } from "../types/Post";

export const getHourlyRateByRole = (role: Post["role"]) => {
  switch (role) {
    case "security_guard":
      return Tariffs.securityGuard;
    case "security_shift_leader":
      return Tariffs.securityShiftLeader;
    case "shift_manager":
      return Tariffs.shiftManager;
    default:
      throw new Error("Unknown role");
  }
};
