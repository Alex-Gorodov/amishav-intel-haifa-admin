import { User } from "../../types/User"
import RoleLabel from "../ui/RoleLabel";
import TrainingsList from "../TrainingsList/TrainingsList";
import { getRoleObject } from "../../utils/getRoleObject";
import { useState, useEffect, useRef } from "react";
import RolesListPopup from "../RolesListPopup/RolesListPopup";

interface EmployeeItemProps {
  user: User;
}

export default function EmployeeItem({user}: EmployeeItemProps) {
  const [isRolesPopupOpen, setIsRolesPopupOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsRolesPopupOpen(false);
      }
    }

    if (isRolesPopupOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isRolesPopupOpen]);

  return (
    <tr key={user.id} className="employee">
      <td>{user.firstName} {user.secondName}</td>
      <td className="employee__roles">
        {user.roles?.map((roleValue: any) => {
          const roleObj = getRoleObject(roleValue);
          return roleObj ? <RoleLabel key={roleValue} role={roleObj} user={user} /> : null;
        })}
        <div className="roles-droplist__wrapper" ref={wrapperRef}>
          <button
            className="employee__role-label employee__role-label--add roles-list__trigger"
            title="הוסף תפקיד"
            onClick={() => setIsRolesPopupOpen(!isRolesPopupOpen)}
          >
            +
          </button>
          {
            isRolesPopupOpen && <RolesListPopup user={user} />
          }
        </div>
      </td>
      <td className="employee__trainings">
        <TrainingsList user={user} />
      </td>
      <td>{user.phoneNumber || '-'}</td>
    </tr>
  )
}
