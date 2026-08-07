import { useDispatch } from "react-redux";
import { Role, User } from "../../types/User";
import { addUserRole, removeUserRole } from "../../store/actions";
import { setEmployeeData } from "../../store/api/setEmployeeData.api";
import { useDarkTheme } from "../../hooks/useDarkThemeContext";
import { useEffect, useRef, useState, useMemo } from "react";

interface RoleLabelProps {
  isButton?: boolean;
  role: Role;
  user: User;
}

export default function RoleLabel({ role, isButton, user }: RoleLabelProps) {
  const dispatch = useDispatch();
  const { isDark, isMobile } = useDarkTheme(); // Ensure context provides isMobile

  const roleRef = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState<number | string>("auto");

  useEffect(() => {
    if (isButton || isMobile || !roleRef.current) {
      if (isMobile) setWidth("100%");
      return;
    }

    const updateWidth = () => {
      // We use requestAnimationFrame to prevent the "ResizeObserver loop" error
      window.requestAnimationFrame(() => {
        if (!roleRef.current) return;

        // 1. Reset to auto to measure natural content size
        const originalStyle = roleRef.current.style.width;
        roleRef.current.style.width = "auto";

        const rawWidth = roleRef.current.offsetWidth;

        // 2. Calculate the snapped width
        if (rawWidth > 0) {
          const adjusted = Math.ceil(rawWidth / 25) * 25;
          setWidth(adjusted);
        }

        // 3. Put the style back so React can take over
        roleRef.current.style.width = originalStyle;
      });
    };

    updateWidth();

    const resizeObserver = new ResizeObserver(() => {
      updateWidth();
    });

    resizeObserver.observe(roleRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [isButton, role.label, isMobile]);

    // Logic to handle role changes
  const removeRole = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    dispatch(removeUserRole({ userId: user.id, role }));
    setEmployeeData(user.id, {
      roles: user.roles.filter((r) => r !== role.value),
    });
  };

  const addRole = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    dispatch(addUserRole({ userId: user.id, role }));
    setEmployeeData(user.id, {
      roles: [...user.roles, role.value],
    });
  };

  if (isButton) {
    return (
      <button
        className={`employee__role-label employee__role-label--add ${isDark ? "role--dark" : ""}`}
        style={{ width: isMobile ? "100%" : "auto" }} // Ensure button is also full width on mobile
        title="הוסף תפקיד"
        onClick={addRole}
      >
        {isDark && <span className="dark-plus-icon">+</span>}
        <span>{role.label}</span>
      </button>
    );
  }

  return (
    <div
      className={`employee__role-label ${isDark ? "role--dark" : ""}`}
      ref={roleRef}
      style={{
        width: isMobile ? "100%" : width,
        boxSizing: "border-box" // Critical for 100% width with padding
      }}
    >
      <span>{role.label}</span>
      <button
        className="employee__role-remove-btn"
        title="הסר תפקיד"
        onClick={removeRole}
      >
        ×
      </button>
    </div>
  );
}
