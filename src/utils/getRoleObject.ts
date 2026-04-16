import { Roles } from "../const";

export const getRoleObject = (roleValue: string) => {
    return Roles.find(r => r.value === roleValue);
  };
