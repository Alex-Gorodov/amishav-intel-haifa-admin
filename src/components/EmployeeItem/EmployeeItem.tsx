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
  const [isCollapsed, setIsCollapsed] = useState(true);

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

  const handleOpenRoles = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    setIsRolesPopupOpen(!isRolesPopupOpen);
  }

  return (
    // <tr className={`employee ${!isCollapsed ? 'employee--uncollapsed' : ''}`} key={user.id} onClick={() => setIsCollapsed(!isCollapsed)}>
    //   <td className="employee__name">
    //     <span className={`employee__uncollapse-trigger ${isCollapsed ? '' : 'employee__uncollapse-trigger--uncollapsed'}`}></span>
    //     <span>
    //       {user.firstName} {user.secondName}
    //     </span>
    //   </td>
    //   <td className="employee__roles">
    //     {user.roles?.map((roleValue: any) => {
    //       const roleObj = getRoleObject(roleValue);
    //       return roleObj ? <RoleLabel key={roleValue} role={roleObj} user={user} /> : null;
    //     })}
    //     <div className="roles-droplist__wrapper" ref={wrapperRef}>
    //       <button
    //         className="employee__role-label employee__role-label--add roles-list__trigger"
    //         title="הוסף תפקיד"
    //         onClick={handleOpenRoles}
    //       >
    //         +
    //       </button>
    //       {
    //         isRolesPopupOpen && <RolesListPopup user={user} />
    //       }
    //     </div>
    //   </td>
    //   <td className="employee__trainings">
    //     <TrainingsList user={user} isCollapsed={isCollapsed} />
    //   </td>
    //   <td>{user.phoneNumber || '-'}</td>
    // </tr>
    <tr
      className="employee"
      onClick={() => setIsCollapsed(!isCollapsed)}
    >
      <td colSpan={4}>
        <div
          className={`employee__content ${
            !isCollapsed ? 'employee__content--open' : ''
          }`}
        >
          <div className="employee__grid">
            <div className="employee__name">
              <span
                className={`employee__uncollapse-trigger ${
                  !isCollapsed
                    ? 'employee__uncollapse-trigger--uncollapsed'
                    : ''
                }`}
              />
              <span>
                {user.firstName} {user.secondName}
              </span>
            </div>

            <div className="employee__roles">
              {user.roles?.map((roleValue: any) => {
                const roleObj = getRoleObject(roleValue);
                return roleObj ? (
                  <RoleLabel key={roleValue} role={roleObj} user={user} />
                ) : null;
              })}

              <div className="roles-droplist__wrapper" ref={wrapperRef}>
                <button
                  className="employee__role-label employee__role-label--add"
                  onClick={handleOpenRoles}
                >
                  +
                </button>

                {isRolesPopupOpen && <RolesListPopup user={user} />}
              </div>
            </div>

            <div className="employee__trainings">
              <TrainingsList user={user} isCollapsed={isCollapsed} />
            </div>

            <div>{user.phoneNumber || '-'}</div>
          </div>
        </div>
      </td>
    </tr>
  )
}
