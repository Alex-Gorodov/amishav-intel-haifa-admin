import { User } from "../../../types/User";
import { getFullUserName } from "../../../utils/getFullUserName";
import { getRoleObject } from "../../../utils/getRoleObject";
import { getIcon } from "../../../utils/getIcon";
import { getMonthlyHours } from "../../../utils/getMonthlyHours";
import { useDarkTheme } from "../../../hooks/useDarkThemeContext";
import { useState } from "react";
import { setEmployeeData } from "../../../store/api/setEmployeeData.api";
import { fetchUsers } from "../../../store/api/fetchUsers.api";
import { Pencil, Save } from "lucide-react";
import { Colors } from "../../../const";
import { useDispatch } from "react-redux";

interface UserProps {
  user: User;
}

export default function DashboardUser({user}: UserProps) {

  const dispatch = useDispatch()

  // Theme control
  const { isDark } = useDarkTheme();
  const className = isDark ? 'dashboard-dark' : 'dashboard';

  const userName = getFullUserName(user)

  const [isEditOpen, setIsEditOpen] = useState(false)

  const [editData, setEditData] = useState({
    firstName: user.firstName,
    secondName: user.secondName,
    phoneNumber: user.phoneNumber || '',
    passportId: user.passportId || '',
  });

  return (
    <div className={`${className}__user-card`}>
      <button
        className={`${className}__edit-btn`}
        onClick={() => setIsEditOpen(true)}
      >
        {getIcon('עיפרון', 'currentColor', 12)}
      </button>
      {
        user.avatarUrl
        ?
        <img className={`${className}__user-avatar`} src={user.avatarUrl} alt={user.firstName} width={40} height={40}/>
        :
        <p>{getIcon('עובד')}</p>
      }

      <p className={`${className}__user-name`}>{userName}</p>

      <div style={{ display: 'flex', gap: 4 }}>
        {
          user.roles.map((r) => {
            const role = getRoleObject(r)

            return(
              <p className={`${className}__user-role`} key={user.id + '-role-' + role?.label} title={role?.label}>{getIcon(role?.label || '')}</p>
            )
          })
        }
      </div>
      <p title="שעות החודש">{getIcon('שעון', 'black', 14)} {getMonthlyHours(user.shifts)}</p>

      {isEditOpen && (
        <div
          className="form__overlay"
          onClick={(e) => {
            setIsEditOpen(false)
            e.stopPropagation()
          }}
        >
          <div className="form__modal form__modal--dynamic">
            <div
              className="form__wrapper"
              onClick={(e) => e.stopPropagation()}
            >
              <h3>עריכת עובד</h3>
              <label htmlFor="first-name" className="form__label form__label--secondary">שם פרטי:</label>
              <input
                className="form__input"
                placeholder="שם פרטי"
                value={editData.firstName}
                id="first-name"
                name="change-user-first-name"
                onChange={(e) =>
                  setEditData(prev => ({ ...prev, firstName: e.target.value }))
                }
              />

              <label htmlFor="second-name" className="form__label form__label--secondary">שם משפחה:</label>
              <input
                className="form__input"
                placeholder="שם משפחה"
                value={editData.secondName}
                id="second-name"
                name="change-user-second-name"
                onChange={(e) =>
                  setEditData(prev => ({ ...prev, secondName: e.target.value }))
                }
              />

              <label htmlFor="telephone" className="form__label form__label--secondary">טלפון:</label>
              <input
                className="form__input"
                placeholder="טלפון"
                value={editData.phoneNumber}
                type="tel"
                id="telephone"
                name="change-user-telephone"
                onChange={(e) =>
                  setEditData(prev => ({ ...prev, phoneNumber: e.target.value }))
                }
              />

              <label htmlFor="passport" className="form__label form__label--secondary">מספר תעודת זהות</label>
              <input
                className="form__input"
                placeholder="ת.ז."
                value={editData.passportId}
                type="number"
                minLength={8}
                maxLength={9}
                id="passport"
                name="change-user-passport"
                onChange={(e) =>
                  setEditData(prev => ({ ...prev, passportId: e.target.value }))
                }
              />

              <div className="buttons-wrapper">
                <button
                  className="button button--with-icon button--add"
                  onClick={async () => {
                    await setEmployeeData(user.id, editData);
                    setIsEditOpen(false);
                    fetchUsers(dispatch);
                  }}
                >
                  שמור
                  <Save color={Colors.White} size={18}/>
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
    </div>
  )
}
