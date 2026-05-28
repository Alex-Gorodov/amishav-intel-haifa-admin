import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ErrorMessages, SuccessMessages } from "../../const";
import { setUserShifts } from "../../store/actions";
import { arrayUnion, doc, setDoc, Timestamp } from "firebase/firestore";
import { db } from "../../services/firebase";
import { fetchUsers } from "../../store/api/fetchUsers.api";
import { State } from "../../types/State";
import { Shift } from "../../types/Shift";
import Layout from "../../components/Layout/Layout";
import { isTouchDevice } from "../../utils/isTouchDevice";
import { getAvailablePostsByRole } from "../../utils/getAvailablePostsByRole";
import { getAvailableUsersByPost } from "../../utils/getAvailableUserByPost";
import { useAITheme } from "../../hooks/useAIContext";
import { RootState } from "../../store/root-reducer";

export default function AddShiftPage() {
  const dispatch = useDispatch();
  const { isAI } = useAITheme();

  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [remark, setRemark] = useState("");
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [insertedUserName, setInsertedUserName] = useState("");
  const [userId, setUserId] = useState<string | null>(null);

  const isGuestMode = useSelector((state: RootState) => state.app.isGuestMode);
  const users = useSelector((state: State) => state.data.users);

  const securityPosts = useSelector((state: any) => state.data.securityPosts);
  const occPosts = useSelector((state: any) => state.data.controllCenterPosts);
  const dertPosts = useSelector((state: any) => state.data.dertPosts);

  const allPosts = useMemo(() => {
    return [...securityPosts, ...occPosts, ...dertPosts];
  }, [securityPosts, occPosts, dertPosts]);

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
    const post = allPosts.find(p => p.id === postId);
    setStartTime(post?.defaultStartTime || "");
    setEndTime(post?.defaultEndTime || "");
  };

  // function validateShift(start: string, end: string) {
  //   const errors: string[] = [];

  //   if (!start) setError(ErrorMessages.START_TIME_NOT_SELECTED);
  //   if (!end) setError(ErrorMessages.END_TIME_NOT_SELECTED);

  //   if (start && end) {
  //     const [sh, sm] = start.split(":").map(Number);
  //     const [eh, em] = end.split(":").map(Number);

  //     const startMin = sh * 60 + sm;
  //     let endMin = eh * 60 + em;

  //     const isNightShift = sh >= 18 || sh < 6;

  //     if (endMin < startMin && !isNightShift) {
  //       // errors.push(ErrorMessages.END_BEFORE_START_DAY);
  //       setError(ErrorMessages.END_BEFORE_START_DAY);
  //     }

  //     if (endMin < startMin && isNightShift) {
  //       endMin += 24 * 60;
  //     }

  //     const duration = endMin - startMin;

  //     // if (duration > 12 * 60) errors.push(ErrorMessages.SHIFT_TOO_LONG);
  //     if (duration > 12 * 60) setError(ErrorMessages.SHIFT_TOO_LONG);
  //   }

  //   return errors;
  // };

  function validateShift(start: string, end: string) {
    const errors: string[] = [];

    if (!start) {
      setError(ErrorMessages.START_TIME_NOT_SELECTED);
      errors.push(ErrorMessages.START_TIME_NOT_SELECTED);
    }
    if (!end) {
      setError(ErrorMessages.END_TIME_NOT_SELECTED);
      errors.push(ErrorMessages.END_TIME_NOT_SELECTED);
    }

    if (start && end) {
      const [sh, sm] = start.split(":").map(Number);
      const [eh, em] = end.split(":").map(Number);

      const startMin = sh * 60 + sm;
      let endMin = eh * 60 + em;

      const isNightShift = sh >= 18 || sh < 6;

      if (endMin < startMin && !isNightShift) {
        setError(ErrorMessages.END_BEFORE_START_DAY);
        errors.push(ErrorMessages.END_BEFORE_START_DAY);
      }

      if (endMin < startMin && isNightShift) {
        endMin += 24 * 60;
      }

      const duration = endMin - startMin;

      if (duration > 12 * 60) {
        setError(ErrorMessages.SHIFT_TOO_LONG);
        errors.push(ErrorMessages.SHIFT_TOO_LONG);
      }
    }

    return errors;
  }

  const handleEndTimeChange = (newEnd: string | null) => {
    if (!newEnd) return;
    setEndTime(newEnd);
  };

  // const handleSave = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (!selectedPost) {
  //     setError(ErrorMessages.POST_NOT_SELECTED);
  //     return;
  //   }

  //   const errors = validateShift(startTime, endTime);
  //   if (errors.length > 0) {
  //     setError(`${errors.join("\n")}שגיעות! `);
  //     return;
  //   }

  //   if (!userId) {
  //     setError(ErrorMessages.USER_NOT_SELECTED);
  //     return;
  //   }

  //   setLoading(true);

  //   const post = allPosts.find(p => p.id === selectedPost);
  //   if (!post) {
  //     setLoading(false);
  //     return;
  //   }

  //   const dateToSet = new Date(date);

  //   const newShift: Shift = {
  //     id: `${dateToSet.getTime()}_${post.id}`,
  //     date: dateToSet,
  //     post,
  //     startTime,
  //     endTime,
  //     remark,
  //     userId,
  //   };

  //   try {
  //     if (isGuestMode) {
  //       const user = users.find((u) => u.id === userId);
  //       if (user) {
  //         dispatch(setUserShifts({
  //           userId,
  //           shifts: [
  //             ...(user.shifts || []),
  //             newShift,
  //           ],
  //         }));
  //       }

  //       resetForm();
  //       setSuccess(SuccessMessages.SHIFT_ADDED);
  //     } else {
  //       const userRef = doc(db, "users", userId);
  //       await setDoc(
  //         userRef,
  //         { shifts: arrayUnion({ ...newShift, date: Timestamp.fromDate(dateToSet) }) },
  //         { merge: true }
  //       );

  //       resetForm();
  //       await fetchUsers(dispatch);
  //       setSuccess(SuccessMessages.SHIFT_ADDED)
  //     }
  //   } catch (err) {
  //     console.error(err)
  //     setError(ErrorMessages.SHIFT_SAVE_ERROR);
  //   } finally {
  //     setLoading(false);
  //   }
  // };


  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPost) {
      setError(ErrorMessages.POST_NOT_SELECTED);
      return;
    }

    const errors = validateShift(startTime, endTime);
    if (errors.length > 0) {
      setError(`${errors.join("\n")} שגיאות! `);
      return;
    }

    if (!userId) {
      setError(ErrorMessages.USER_NOT_SELECTED);
      return;
    }

    setLoading(true);

    const post = allPosts.find(p => p.id === selectedPost);
    if (!post) {
      setLoading(false);
      return;
    }

    const dateToSet = new Date(date);

    // Formulate the structural data base
    const rawShift = {
      id: `${dateToSet.getTime()}_${post.id}`,
      date: dateToSet,
      post: JSON.parse(JSON.stringify(post)), // Quick clean of any hidden prototype/undefined props in post
      startTime,
      endTime,
      remark: remark || "", // Fallback safely to empty string if undefined
      userId,
    };

    // Strip undefined keys out so Firestore doesn't crash
    const newShift = Object.fromEntries(
      Object.entries(rawShift).filter(([_, value]) => value !== undefined)
    ) as unknown as Shift;

    try {
      if (isGuestMode) {
        const user = users.find((u) => u.id === userId);
        if (user) {
          dispatch(setUserShifts({
            userId,
            shifts: [
              ...(user.shifts || []),
              newShift,
            ],
          }));
        }

        resetForm();
        setSuccess(SuccessMessages.SHIFT_ADDED);
      } else {
        const userRef = doc(db, "users", userId);

        // Prepare data for Firestore by swapping the raw JS Date for a Timestamp
        const firestoreShift = {
          ...newShift,
          date: Timestamp.fromDate(dateToSet)
        };

        await setDoc(
          userRef,
          { shifts: arrayUnion(firestoreShift) },
          { merge: true }
        );

        resetForm();
        await fetchUsers(dispatch);
        setSuccess(SuccessMessages.SHIFT_ADDED);
      }
    } catch (err) {
      console.error(err);
      setError(ErrorMessages.SHIFT_SAVE_ERROR);
    } finally {
      setLoading(false);
    }
  };

  const user = users.find((u) => u.id === userId)

  const roleFilteredUsers = useMemo(() => {
    if (!selectedPost) return users;
    return getAvailableUsersByPost(users, selectedPost, allPosts);
  }, [users, selectedPost, allPosts]);

  const availablePosts = useMemo(() => {
    if (!user) return [];
    return getAvailablePostsByRole(user, allPosts);
  }, [user, allPosts]);

  const availableUsers = useMemo(() => {
    return roleFilteredUsers.filter(u => {
      const fullName = `${u.firstName} ${u.secondName}`;
      return fullName.includes(insertedUserName);
    });
  }, [roleFilteredUsers, insertedUserName]);

  return (
    <Layout>
      <div className="page__content">
        <form
          onSubmit={handleSave}
          method="post"
          className={`form ${isAI ? 'form--ai-theme' : ''}`}
        >

          <div className="form__wrapper form__wrapper--fullscreen">

            {
              <div className={`form__message-wrapper form__message-wrapper--error ${error ? 'form__message-wrapper--active' : ''}`}>
                <p className='form__message form__message--error'>{error}</p>
              </div>
            }

            {
              <div className={`form__message-wrapper form__message-wrapper--success ${success ? 'form__message-wrapper--active' : ''}`}>
                <p className='form__message form__message--success'>{success}</p>
              </div>
            }

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
                    className="form__input form__list-item form__list-item--search-user"
                    type="search"
                    id="user"
                    onChange={(e) => setInsertedUserName(e.target.value)}
                    value={insertedUserName}
                    placeholder="הכנס שם עובד..."
                    autoFocus={!isTouchDevice()}
                  />
                  {
                    availableUsers.length === 0
                    ?
                    <div className='form__message-wrapper form__message-wrapper--error form__message-wrapper--active'>
                      <p className='form__message form__message--error'>לא נמצאו עובדים</p>
                    </div>
                    :
                    availableUsers.map(u => (
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
            />

            <button
              className='button button--wide'
              type='submit'
            >
              {loading ? <span>טעינה...</span> : <span>הוסף משמרת</span>}
            </button>
          </div>

        </form>
      </div>
    </Layout>

  );
}
