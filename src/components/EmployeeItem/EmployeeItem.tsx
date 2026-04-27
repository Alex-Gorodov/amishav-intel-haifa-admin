import { User } from "../../types/User"
import RoleLabel from "../ui/RoleLabel";
import TrainingsList from "../TrainingsList/TrainingsList";
import { getRoleObject } from "../../utils/getRoleObject";
import { useState, useEffect, useRef } from "react";
import RolesListPopup from "../RolesListPopup/RolesListPopup";
import DynamicForm from "../DynamicForm/DynamicForm";
import { deleteUser } from "../../store/api/deleteUser.api";
import { getFullUserName } from "../../utils/getFullUserName";
import { useDispatch } from "react-redux";
import { fetchUsers } from "../../store/api/fetchUsers.api";
import { Pencil } from "lucide-react";
import { updateEmployeeData } from "../../store/api/updateEmployeeData.api";

interface EmployeeItemProps {
  user: User;
}

export default function EmployeeItem({user}: EmployeeItemProps) {
  const dispatch = useDispatch();
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

  const [isEditOpen, setIsEditOpen] = useState(false);

  const [editData, setEditData] = useState({
    firstName: user.firstName,
    secondName: user.secondName,
    phoneNumber: user.phoneNumber || '',
    passport: user.passportId || '',
  });

  const handleOpenRoles = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    setIsRolesPopupOpen(!isRolesPopupOpen);
  }

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [deletingPas, setDeletingPas] = useState('');

  const validated = deletingPas === user.passportId;

  const hasFutureShifts = user.shifts?.some((s) => {
    if (!s?.date || !s?.startTime) return false;

    const baseDate =
      typeof s.date === "object" && "toDate" in s.date
        ? s.date.toDate()
        : new Date(s.date);

    const [hours, minutes] = s.startTime.split(":").map(Number);

    const shiftDateTime = new Date(baseDate);
    shiftDateTime.setHours(hours, minutes, 0, 0);

    return shiftDateTime > new Date();
  });

  const deleteBtnTitle =
    hasFutureShifts
    ?
    'לפני המחיקה יש למחוק את המשמרות העתידיות של העובד.'
    :
    'למחוק את העובד'

  return (
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
          <div className={`employee__grid ${!isCollapsed ? 'employee__grid--rows' : ''}`}>
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

            {!isCollapsed && (
              <div className="employee__buttons">

                <button
                  className="button button--edit button--menu"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditOpen(true);
                  }}
                >
                  <Pencil size={18}/>
                  ערוך
                </button>

                <button
                  className="button button--delete button--menu"
                  disabled={hasFutureShifts}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!hasFutureShifts) setIsDeleteOpen(true);
                  }}
                  title={deleteBtnTitle}
                >
                  🗑 מחק עובד
                </button>

              </div>
            )}

            {isDeleteOpen && (
              <div className="form__overlay" onClick={() => {
                  setIsDeleteOpen(false)
                  setDeletingPas('')
                }
              }>
                <div className="form__modal form__modal--dynamic">
                  <div
                    className="form__wrapper"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h3>
                      למחוק את {getFullUserName(user)}?
                    </h3>

                    <p className="form__title">
                      אנא הכנס מספר ת.ז. של העובד
                      <b>{' ' + user.passportId}</b>
                    </p>

                    <input type="text" className="form__input" value={deletingPas} onChange={(e) => setDeletingPas(e.target.value)}/>

                    <div className="buttons-wrapper">
                      <button
                        className="button button--delete"
                        disabled={!validated}
                        onClick={async () => {
                          await deleteUser({userId: user.id});
                          setIsDeleteOpen(false);
                          fetchUsers(dispatch);
                        }}
                      >
                        מחק
                      </button>

                      <button
                        className="button button--cancel"
                        onClick={() => setIsDeleteOpen(false)}
                      >
                        ביטול
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {isEditOpen && (
              <div
                className="form__overlay"
                onClick={() => setIsEditOpen(false)}
              >
                <div className="form__modal form__modal--dynamic">
                  <div
                    className="form__wrapper"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h3>עריכת עובד</h3>

                    <input
                      className="form__input"
                      placeholder="שם פרטי"
                      value={editData.firstName}
                      onChange={(e) =>
                        setEditData(prev => ({ ...prev, firstName: e.target.value }))
                      }
                    />

                    <input
                      className="form__input"
                      placeholder="שם משפחה"
                      value={editData.secondName}
                      onChange={(e) =>
                        setEditData(prev => ({ ...prev, secondName: e.target.value }))
                      }
                    />

                    <input
                      className="form__input"
                      placeholder="טלפון"
                      value={editData.phoneNumber}
                      type="tel"
                      onChange={(e) =>
                        setEditData(prev => ({ ...prev, phoneNumber: e.target.value }))
                      }
                    />

                    <input
                      className="form__input"
                      placeholder="ת.ז."
                      value={editData.passport}
                      type="tel"
                      onChange={(e) =>
                        setEditData(prev => ({ ...prev, phoneNumber: e.target.value }))
                      }
                    />

                    <div className="buttons-wrapper">
                      <button
                        className="button button--add"
                        onClick={async () => {
                          await updateEmployeeData(user.id, editData);
                          setIsEditOpen(false);
                          fetchUsers(dispatch);
                        }}
                      >
                        שמור
                      </button>

                      <button
                        className="button button--cancel"
                        onClick={() => setIsEditOpen(false)}
                      >
                        ביטול
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div>{user.phoneNumber || '-'}</div>
          </div>
        </div>
      </td>
    </tr>
  )
}
