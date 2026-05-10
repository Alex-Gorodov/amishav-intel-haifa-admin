import { useDispatch } from "react-redux";
import { Role, User } from "../../types/User";
import { addUserRole, removeUserRole } from "../../store/actions";
import { setEmployeeData } from "../../store/api/setEmployeeData.api";
import { useAITheme } from "../../hooks/useAIContext";
import { useEffect, useRef, useState } from "react";

interface RoleLabelProps {
  isButton?: boolean;
  role: Role;
  user: User;
}

export default function RoleLabel({ role, isButton, user }: RoleLabelProps) {
  const dispatch = useDispatch();
  const { isAI } = useAITheme();

  const removeRole = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    dispatch(removeUserRole({userId: user.id, role}));
    setEmployeeData(user.id, {
      roles: user.roles.filter(r => r !== role.value)
    });
  };

  const addRole = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    dispatch(addUserRole({userId: user.id, role}));
    setEmployeeData(user.id, {
      roles: [...user.roles, role.value]
    });
  };

  const roleRef = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState<number>();

  useEffect(() => {
    if (!roleRef.current) return;

    const rawWidth = roleRef.current.offsetWidth;
    const adjusted = Math.ceil(rawWidth / 25) * 25;

    setWidth(adjusted);
  }, []);
  return (
    isButton ? (
      <button
        className={`employee__role-label employee__role-label--add ${isAI ? 'role--ai' : ''}`}
        title="הוסף תפקיד"
        onClick={addRole}
      >
        {isAI && <span className="ai-plus-icon">+</span>}
        <span>
          {role.label}
        </span>
      </button>
    ) : (
    <div
      className={`employee__role-label ${isAI ? 'role--ai' : ''}`}
      ref={roleRef}
      style={{ width: width }}
    >
      <span>{role.label}</span>
      <button
        className="employee__role-remove-btn"
        title="הסר תפקיד"
        onClick={removeRole}
      >
        {isAI ? '×' : '×'}
      </button>
    </div>
  ));
}
