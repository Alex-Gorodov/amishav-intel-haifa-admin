import { Roles } from "../../const";
import { User } from "../../types/User";
import RoleLabel from "../ui/RoleLabel";

interface Props {
  user: User;
  openUp?: boolean;
}

export default function RolesListPopup({user, openUp}: Props) {
  return (
    <div className={`roles-popup ${openUp ? 'roles-popup--top' : ''}`}>
      {Roles.filter(role => !user.roles?.includes(role.value)).map((role) => (
        <RoleLabel key={role.value} isButton role={role} user={user} />
      ))}
    </div>
  )
}
