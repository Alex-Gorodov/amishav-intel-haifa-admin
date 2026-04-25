import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ErrorMessages, Posts, SuccessMessages } from "../../const";
import { setError, setSuccess } from "../../store/actions";
import { arrayUnion, doc, setDoc, Timestamp } from "firebase/firestore";
import { db } from "../../services/firebase";
import { fetchUsers } from "../../store/api/fetchUsers.api";
import { State } from "../../types/State";
import Layout from "../../components/Layout/Layout";
import { isTouchDevice } from "../../utils/isTouchDevice";
import { getAvailablePostsByRole } from "../../utils/getAvailablePostsByRole";

export default function AddShiftPage() {
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [remark, setRemark] = useState("");
  const [loading, setLoading] = useState(false);

  const [focusRemark, setFocusRemark] = useState(false)

  // const [selectedUser, setSelectedUser] = useState<string | null >(null);
  const [insertedUserName, setInsertedUserName] = useState("");
  const [userId, setUserId] = useState<string | null>(null);

  const users = useSelector((state: State) => state.data.users);

  const filteredUsers = users.filter(u => {
    const fullName = `${u.firstName} ${u.secondName}`;
    return fullName.includes(insertedUserName);
  });

  const dispatch = useDispatch();

  const resetForm = () => {
    setUserId(null);
    setSelectedPost(null);
    setDate(new Date());
    setStartTime("");
    setEndTime("");
    setRemark("");
  };

  const handlePostSelect = (postId: string) => {
    setSelectedPost(postId);
    const post = Posts.find(p => p.id === postId);
    setStartTime(post?.defaultStartTime || "");
    setEndTime(post?.defaultEndTime || "");
  };

  function validateShift(start: string, end: string) {
    const errors: string[] = [];

    if (!start) errors.push(ErrorMessages.START_TIME_NOT_SELECTED);
    if (!end) errors.push(ErrorMessages.END_TIME_NOT_SELECTED);

    if (start && end) {
      const [sh, sm] = start.split(":").map(Number);
      const [eh, em] = end.split(":").map(Number);

      const startMin = sh * 60 + sm;
      let endMin = eh * 60 + em;

      const isNightShift = sh >= 18 || sh < 6;

      if (endMin < startMin && !isNightShift) {
        errors.push(ErrorMessages.END_BEFORE_START_DAY);
      }

      if (endMin < startMin && isNightShift) {
        endMin += 24 * 60;
      }

      const duration = endMin - startMin;

      if (duration > 12 * 60) errors.push(ErrorMessages.SHIFT_TOO_LONG);
    }

    return errors;
  };

  const handleEndTimeChange = (newEnd: string | null) => {
    if (!newEnd) return;
    setEndTime(newEnd);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPost) {
      dispatch(setError({message: (ErrorMessages.POST_NOT_SELECTED)}));
      return;
    }

    const errors = validateShift(startTime, endTime);
    if (errors.length > 0) {
      dispatch(setError({message: (`${errors.join("\n")}שגיעות! `)}));
      return;
    }

    if (!userId) {
      dispatch(setError({message: (ErrorMessages.USER_NOT_SELECTED)}));
      return;
    }

    setLoading(true);

    const post = Posts.find(p => p.id === selectedPost);
    if (!post) {
      setLoading(false);
      return;
    }

    const dateToSet = new Date(date);

    const newShift = {
      id: `${dateToSet.getTime()}_${post.id}`,
      date: Timestamp.fromDate(dateToSet),
      post,
      startTime,
      endTime,
      remark,
    };

    try {
      const userRef = doc(db, "users", userId);
      await setDoc(userRef, { shifts: arrayUnion(newShift) }, { merge: true });

      resetForm();

      await fetchUsers(dispatch);
      dispatch(setSuccess({ message: SuccessMessages.SHIFT_ADDED}));

    } catch (err) {
      dispatch(setError({ message: ErrorMessages.SHIFT_SAVE_ERROR }));
    } finally {
      setLoading(false);
    }
  };

  const user = users.find((u) => u.id === userId)

  const availablePosts = useMemo(() => {
    if (!user) return Posts;
    return getAvailablePostsByRole(user);
  }, [user, userId]);

  return (
    <Layout>
      <form onSubmit={handleSave} method="post">
        <div className="page__header">
          <h2 className="form__title">הוספת משמרת</h2>
        </div>

        <div className="page__content form__wrapper form__wrapper--fullscreen">

          <label className="form__label" htmlFor='date'>תאריך המשמרת</label>
          <input
            type="date"
            className="form__input"
            id='date'
            value={date.toISOString().split('T')[0]}
            onChange={(e) => setDate(new Date(e.target.value))}
          />

          <div className="form__columns">
            <div className="form__column">
              <label className="form__label" htmlFor='user'>בחר עובד</label>
              <div className="form__list form__list--users">
                <input
                  className="form__list-item form__list-item--search-user"
                  type="text"
                  id="user"
                  onChange={(e) => setInsertedUserName(e.target.value)}
                  value={insertedUserName}
                  placeholder="הכנס שם עובד..."
                  autoFocus={!isTouchDevice()}
                />
                {
                  filteredUsers.length === 0
                  ?
                  <p className='form__message'>לא נמצאו עובדים</p>
                  :
                  filteredUsers.map(u => (
                    <div
                      key={u.id}
                      className={`form__list-item ${userId === u.id ? 'form__list-item--selected' : ''}`}
                      onClick={() => u.id === userId ? setUserId(null) : setUserId(u.id)}
                    >
                      <span style={{textAlign: 'right'}}>{u.firstName} {u.secondName}</span>
                    </div>
                  ))
                }
              </div>
            </div>
            <div className="form__column">
              <span className="form__label">בחר עמדה</span>
              <div className="form__list">
                {availablePosts.map(p => (
                  <div
                    key={p.id}
                    className={`form__list-item ${selectedPost === p.id ? 'form__list-item--selected' : ''}`}
                    onClick={() => p.id === selectedPost ? setSelectedPost(null) : handlePostSelect(p.id)}
                  >
                    <span style={{textAlign: 'right'}}>{p.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>


          <div className="form__columns">
            <div className="form__time-column">
              <span className="form__label">שעת התחלה</span>
              <input
                type="time"
                className="form__input"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>

            <div className="form__time-column">
              <span className="form__label">שעת סיום</span>
              <input
                type="time"
                className="form__input"
                value={endTime}
                onChange={(e) => handleEndTimeChange(e.target.value)}
              />
            </div>
          </div>

          <label className="form__label">הערות (אופציונלי)</label>
          <input
            type="text"
            placeholder="הערות..."
            className="form__input"
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            onFocus={() => setFocusRemark(true)}
            onBlur={() => setFocusRemark(false)}
          />

          <button
            onClick={handleSave}
            className='button'
            >
            {loading ? <span>Loading...</span> : <span>הוסף משמרת</span>}

          </button>
        </div>

      </form>
    </Layout>

  );
}


