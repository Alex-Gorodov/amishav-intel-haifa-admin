import { User } from "../../types/User"
import RoleLabel from "../ui/RoleLabel";
import { Roles } from "../../const";

interface EmployeeItemProps {
  user: User;
}

export default function EmployeeItem({user}: EmployeeItemProps) {
  const getRoleObject = (roleValue: string) => {
    return Roles.find(r => r.value === roleValue);
  };

  return (
    <div className="employee-item">
      {
        user
        ?
        <>
          <h3>{user.firstName} {user.secondName}</h3>
          <div className="employee__roles">
            {user.roles.map((roleValue) => {
              const roleObj = getRoleObject(roleValue);
              return roleObj ? <RoleLabel key={roleValue} role={roleObj} /> : null;
            })}
          </div>
        </>
        :
        <p>Loading...</p>
      }
    </div>
  )
}
