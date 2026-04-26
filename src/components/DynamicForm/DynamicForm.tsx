import { useEffect, useMemo, useState } from "react";
import { isTouchDevice } from "../../utils/isTouchDevice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/root-reducer";
import { getAvailableUsersByPost } from "../../utils/getAvailableUserByPost";
import { Post } from "../../types/Post";
import { User } from "../../types/User";
import { Shift } from "../../types/Shift";
import { getFullUserName } from "../../utils/getFullUserName";
import { getFormattedDate } from "../../utils/getFormattedDate";
import { swapShifts } from "../../store/api/swapShifts.api";
import { fetchUsers } from "../../store/api/fetchUsers.api";
import { ArrowRightLeft } from "lucide-react";

interface FormProps {
  type: 'add' | 'change' | 'remove' | null;
  onAccept?: () => void;
  onClose: () => void;
  shift: Shift;
}

export default function DynamicForm({type, shift, onClose, onAccept}: FormProps) {
  const dispatch = useDispatch();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAccept?.();
  };
  const users = useSelector((state: RootState) => state.data.users);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
  const [search, setSearch] = useState("");


  const triggeredUser = users.find((u) => u.id === shift.userId);

  const [insertedUserName, setInsertedUserName] = useState("");

  const currentDate = new Date();


  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay()); // Sunday
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 7);


  const availableUsers = useMemo(() => {
    const filtered = shift.post?.id
      ? getAvailableUsersByPost(users, shift.post.id)
      : users;

    return filtered.filter(u =>
      getFullUserName(u).toLowerCase().includes(search.toLowerCase())
    );
  }, [users, shift.post?.id, search]);

  // const availableShifts = useMemo(() => {
  //   return availableUsers.flatMap(user =>
  //     (user.shifts || [])
  //       .filter(s => {
  //         if (!s?.date) return false;

  //         const shiftDate =
  //           typeof s.date === "object" && "toDate" in s.date
  //             ? s.date.toDate()
  //             : new Date(s.date);

  //         return (
  //           s.id !== shift.id &&                 // not same shift
  //           user.id !== shift.userId &&          // ❌ NOT SAME USER
  //           shiftDate >= startOfWeek &&          // same week
  //           shiftDate < endOfWeek
  //         );
  //       })
  //       .map(s => ({
  //         ...s,
  //         user,
  //       }))
  //   );
  // }, [users, shift, startOfWeek, endOfWeek]);

  const canSwap = (userA: User, userB: User, shiftA: Shift, shiftB: Shift) => {
    // same user ❌
    if (userA.id === userB.id) return false;

    // A must be able to work B's shift
    const aCanTakeB =
      getAvailableUsersByPost([userA], shiftB.post.id).length > 0;

    // B must be able to work A's shift
    const bCanTakeA =
      getAvailableUsersByPost([userB], shiftA.post.id).length > 0;

    return aCanTakeB && bCanTakeA;
  };

  const availableShifts = useMemo(() => {
    const start = startOfWeek;
    const end = endOfWeek;

    return users.flatMap(user => {
      return (user.shifts || [])
        .filter(targetShift => {
          if (!targetShift?.date) return false;

          const targetDate =
            "toDate" in targetShift.date
              ? targetShift.date.toDate()
              : new Date(targetShift.date);

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
      const dateA =
        "toDate" in a.date ? a.date.toDate() : new Date(a.date);

      const dateB =
        "toDate" in b.date ? b.date.toDate() : new Date(b.date);

      return dateA.getTime() - dateB.getTime();
    });
  }, [users, shift, startOfWeek, endOfWeek]);

  const handleSwap = async () => {
    if (!selectedShift) return;

    await swapShifts({
      firstUserId: shift.userId,
      secondUserId: selectedShift.userId,
      firstShiftId: shift.id,
      secondShiftId: selectedShift.id,
    });

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
                תאריך: <span className="highlight">{getFormattedDate(shift.date.toDate())}</span>
              </h2>
              <div className="buttons-wrapper">
                <button className="button button--delete" onClick={onAccept} type="button">למחוק</button>
                <button className="button button--cancel" onClick={onClose} type="button">ביטול</button>
              </div>
            </div>
          }
          {
            type === 'change'
            &&
            <div className="form__wrapper">

              <div className="form__list-item form__list-item--self">
                <p>{getFullUserName(triggeredUser!)}</p>
                <p>{shift.post.title}</p>
                <p>{getFormattedDate(shift.date.toDate())}</p>
                <p>{shift.startTime} - {shift.endTime}</p>
              </div>

              <ArrowRightLeft size={20} className="form__swap-icon"/>

              <div className="form__list">
                {availableShifts.map(s => {
                  const isSelected = selectedShift?.id === s.id;

                  return (
                    <div
                      key={s.id}
                      className={`form__list-item ${
                        selectedShift?.id === s.id ? 'form__list-item--selected' : ''
                      }`}
                      onClick={() => setSelectedShift(isSelected ? null : s)}
                    >
                      <p>{getFullUserName(s.user)}</p>
                      <p>{s.post.title}</p>
                      <p>{getFormattedDate(s.date.toDate())}</p>
                      <p>{s.startTime} - {s.endTime}</p>
                    </div>
                  );
                })}
              </div>



              <div className="buttons-wrapper">
                {/* <button className="button button--change" onClick={onAccept} type="button">להחליף</button> */}
                <button
                  className="button button--change"
                  type="button"
                  onClick={handleSwap}
                  // onClick={async () => {
                  //   if (!selectedUser || !selectedShift) return;

                  //   await swapShifts({
                  //     firstUserId: shift.userId,
                  //     firstShiftId: shift.id,
                  //     secondUserId: selectedUser.id,
                  //     secondShiftId: selectedShift.id,
                  //   });

                  //   onClose();
                  // }}
                >
                  להחליף
                </button>
                <button className="button button--cancel" onClick={onClose} type="button">ביטול</button>
              </div>
            </div>
          }
        </form>
      </div>
    </div>
  )
}
