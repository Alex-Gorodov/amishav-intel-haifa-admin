import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/root-reducer";
import { getAvailableUsersByPost } from "../../utils/getAvailableUserByPost";
import { Post } from "../../types/Post";
import { User } from "../../types/User";
import { Shift } from "../../types/Shift";
import { getFullUserName } from "../../utils/getFullUserName";
import { getFormattedDate, normalizeDate } from "../../utils/dateUtils";
import { swapShifts } from "../../store/api/swapShifts.api";
import { fetchUsers } from "../../store/api/fetchUsers.api";
import { ArrowRightLeft, Save } from "lucide-react";
import { setShiftData } from "../../store/api/setShiftData.api";
import { setStateSuccess } from "../../store/actions";
import { Colors, SuccessMessages } from "../../const";

interface FormProps {
  type: 'add' | 'swap' | 'remove' | 'edit' | null;
  onAccept?: () => void;
  onClose: () => void;
  shift: Shift;
  allPosts: Post[]
}

export default function DynamicShiftForm({type, shift, onClose, onAccept, allPosts}: FormProps) {
  const dispatch = useDispatch();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAccept?.();
  };

  const users = useSelector((state: RootState) => state.data.users);

  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);

  const [formData, setFormData] = useState({
    date: normalizeDate(shift.date).toISOString().split("T")[0],
    startTime: shift.startTime || "",
    endTime: shift.endTime || "",
    remark: shift.remark || "",
  });

  const triggeredUser = users.find((u) => u.id === shift.userId);

  const currentDate = new Date();

  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay()); // Sunday
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 7);


  const canSwap = (userA: User, userB: User, shiftA: Shift, shiftB: Shift) => {
    if (userA.id === userB.id) return false;

    const aCanTakeB =
      getAvailableUsersByPost([userA], shiftB.post.id, allPosts).length > 0;

    const bCanTakeA =
      getAvailableUsersByPost([userB], shiftA.post.id, allPosts).length > 0;

    return aCanTakeB && bCanTakeA;
  };

  const availableShifts = useMemo(() => {
    const start = startOfWeek;
    const end = endOfWeek;

    return users.flatMap(user => {
      return (user.shifts || [])
        .filter(targetShift => {
          if (!targetShift?.date) return false;

          // ✅ FIX 1: Safely normalize with the utility instead of 'in' operator check
          const targetDate = normalizeDate(targetShift.date);

          const inWeek = targetDate >= start && targetDate < end;

          if (!inWeek) return false;

          if (user.id === shift.userId && targetShift.id === shift.id) return false;

          const ok = canSwap(
            users.find(u => u.id === shift.userId)!,
            user,
            shift,
            targetShift
          );

          return ok;
        })
        .map(targetShift => ({
          ...targetShift,
          user,
        }));
    })
    .sort((a, b) => {
      // ✅ FIX 2: Safely normalize inside sorting map
      const dateA = normalizeDate(a.date);
      const dateB = normalizeDate(b.date);

      return dateA.getTime() - dateB.getTime();
    });
  }, [users, shift, startOfWeek, endOfWeek]);

  const groupedShifts = useMemo(() => {
    return availableShifts.reduce((acc, s) => {
      // ✅ FIX 3: Safely normalize during group indexing
      const date = normalizeDate(s.date);

      const key = date.toISOString().split("T")[0]; // YYYY-MM-DD

      if (!acc[key]) acc[key] = [];
      acc[key].push(s);

      return acc;
    }, {} as Record<string, typeof availableShifts>);
  }, [availableShifts]);

  const handleSwap = async () => {
    if (!selectedShift) return;

    await swapShifts({
      firstUserId: shift.userId,
      secondUserId: selectedShift.userId,
      firstShiftId: shift.id,
      secondShiftId: selectedShift.id,
    });

    dispatch(setStateSuccess({message: SuccessMessages.SHIFT_SWAP_COMPLETED}))
    await fetchUsers(dispatch);

    onClose();
  };

  const handleUpdate = async () => {
    if (!shift?.userId || !shift?.id) return;

    await setShiftData({
      userId: shift.userId,
      shiftId: shift.id,
      data: {
        ...formData,
        date: new Date(formData.date),
      },
    });

    dispatch(setStateSuccess({message: SuccessMessages.SHIFT_EDIT_COMPLETED}))
    await fetchUsers(dispatch);

    onClose();
  };

  return (
    <div className="form__overlay" onClick={onClose}>
      <div className="form__modal form__modal--dynamic" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit} className="form__wrapper">

          {
            type === 'remove'
            &&
            <div className="form__wrapper">
              <h2 className="form__title">
                אנא אשר שברצונך למחוק את המשמרת
                <br/>
                של <span className="highlight">{triggeredUser ? getFullUserName(triggeredUser) : ''}</span>
                <br />
                עמדה: <span className="highlight">{shift.post?.title}</span>
                <br />
                תאריך: <span className="highlight">{getFormattedDate(shift.date)}</span>
              </h2>
              <div className="buttons-wrapper">
                <button className="button button--delete" onClick={onAccept} type="button">למחוק</button>
                <button className="button button--cancel" onClick={onClose} type="button">ביטול</button>
              </div>
            </div>
          }

          {
            type === 'swap'
            &&
            <div className="form__wrapper">

              <h2 className="form__title">בחר משמרת לחילוף</h2>

              <div className="form__list-item form__list-item--self">
                <p>{getFullUserName(triggeredUser!)}</p>
                <p>{shift.post.title}</p>
                <p>{getFormattedDate(shift.date)}</p>
                <p>{shift.startTime} - {shift.endTime}</p>
              </div>

              <ArrowRightLeft size={20} className="form__swap-icon"/>

              <div className="form__list">
                {Object.entries(groupedShifts)
                  .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
                  .map(([dateKey, shifts]) => (
                    <div key={dateKey} className="form__date-group">

                      {/* DATE HEADER */}
                      <p className="form__date-title">
                        {getFormattedDate(new Date(dateKey))}
                      </p>

                      {/* SHIFTS */}
                      {shifts.map(s => {
                        const isSelected = selectedShift?.id === s.id;

                        return (
                          <div
                            key={s.id}
                            className={`form__list-item ${
                              isSelected ? "form__list-item--selected" : ""
                            }`}
                            onClick={() => setSelectedShift(isSelected ? null : s)}
                          >
                            <p>{getFullUserName(s.user)}</p>
                            <p>{s.post.title}</p>
                            <p>{s.startTime} - {s.endTime}</p>
                          </div>
                        );
                      })}

                    </div>
                  ))}
              </div>

              <div className="buttons-wrapper">
                <button
                  className="button"
                  type="button"
                  onClick={handleSwap}
                >
                  להחליף
                </button>
                <button className="button button--cancel" onClick={onClose} type="button">ביטול</button>
              </div>

            </div>
          }

          {
            type === 'edit' &&
            <div className="form__wrapper">

              <h2 className="form__title">עריכת משמרת</h2>

              <div className="form__column">

                {/* DATE */}
                <label className="form__label">תאריך</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData(prev => ({ ...prev, date: e.target.value }))
                  }
                  className="form__input"
                />

                {/* START TIME */}
                <label className="form__label">שעת התחלה</label>
                <input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) =>
                    setFormData(prev => ({ ...prev, startTime: e.target.value }))
                  }
                  className="form__input"
                />

                {/* END TIME */}
                <label className="form__label">שעת סיום</label>
                <input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) =>
                    setFormData(prev => ({ ...prev, endTime: e.target.value }))
                  }
                  className="form__input"
                />

                {/* REMARK */}
                <label className="form__label">הערה</label>
                <textarea
                  value={formData.remark}
                  onChange={(e) =>
                    setFormData(prev => ({ ...prev, remark: e.target.value }))
                  }
                  className="form__input"
                  placeholder="הוסף הערה..."
                />

              </div>

              <div className="buttons-wrapper">
                <button
                  className="button button--with-icon"
                  type="button"
                  onClick={handleUpdate}
                >
                  <Save color={Colors.White} size={18}/>
                  שמור שינויים
                </button>

                <button
                  className="button button--cancel"
                  type="button"
                  onClick={onClose}
                >
                  ביטול
                </button>
              </div>

            </div>
          }

        </form>
      </div>
    </div>
  );
}
