import { User } from "../types/User";

export function getFullUserName(user: User) {
  return user.firstName + ' ' + user.secondName
}
