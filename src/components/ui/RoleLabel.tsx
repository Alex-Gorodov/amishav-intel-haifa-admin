import { useDispatch } from "react-redux";
import { Role, User } from "../../types/User";
import { addUserRole, removeUserRole } from "../../store/actions";

interface RoleLabelProps {
  isButton?: boolean;
  role: Role;
  user: User;
}

export default function RoleLabel({ role, isButton, user }: RoleLabelProps) {
  const dispatch = useDispatch();

  const removeRole = () => {
    dispatch(removeUserRole({userId: user.id, role})); // userId will be handled in the popup component
  };

  const addRole = () => {
    dispatch(addUserRole({userId: user.id, role})); // userId will be handled in the popup component
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
