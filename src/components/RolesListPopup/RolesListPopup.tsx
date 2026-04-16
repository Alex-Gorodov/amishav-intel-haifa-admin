import { Roles } from "../../const";
import { User } from "../../types/User";
import RoleLabel from "../ui/RoleLabel";

export default function RolesListPopup({user}: {user: User}) {
  return (
    <div className="roles-list">
      {Roles.filter(role => !user.roles?.includes(role.value)).map((role) => (
        <RoleLabel key={role.value} isButton role={role} user={user} />
      ))}
    </div>
  )
}
