import { useDispatch } from "react-redux";
import { Role, User } from "../../types/User";
import { addUserRole, removeUserRole } from "../../store/actions";
import { updateEmployeeData } from "../../store/api/updateEmployeeData.api";

interface RoleLabelProps {
  isButton?: boolean;
  role: Role;
  user: User;
}

export default function RoleLabel({ role, isButton, user }: RoleLabelProps) {
  const dispatch = useDispatch();

  const removeRole = () => {
    dispatch(removeUserRole({userId: user.id, role})); // userId will be handled in the popup component
    updateEmployeeData(user.id, {
      roles: user.roles.filter(r => r !== role.value)
    });
  };

  const addRole = () => {
    dispatch(addUserRole({userId: user.id, role})); // userId will be handled in the popup component
    updateEmployeeData(user.id, {
      roles: [...user.roles, role.value]
    });
  };

  return (
    isButton ? (
      <button
        className="employee__role-label employee__role-label--add"
        title="הוסף תפקיד"
        onClick={() => addRole()}
      >
        {role.label}
      </button>
    ) : (
    <div className="employee__role-label">
      <span>{role.label}</span>
      <button
        className="employee__role-remove-btn"
        title="הסר תפקיד"
        onClick={() => removeRole()}
      >
        ×
      </button>
    </div>
  ));
}
