import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ErrorMessages, Posts, SuccessMessages } from "../../const";
import { setError, setSuccess, setUserShifts } from "../../store/actions";
import { fetchUsers } from "../../store/api/fetchUsers.api";
import { State } from "../../types/State";
import { isTouchDevice } from "../../utils/isTouchDevice";
import { createShift } from "../../store/api/createShift.api";
import { useAITheme } from "../../hooks/useAIContext";
import { Post } from "../../types/Post";
import { RootState } from "../../store/root-reducer";
import { User } from "../../types/User";
import { getAvailableUsersByPost } from "../../utils/getAvailableUserByPost";
import { getAvailablePostsByRole } from "../../utils/getAvailablePostsByRole";

interface Props {
  onClose: () => void;
  initialDate?: string;
  initialPostId?: string;
  scheduleType?: string;
}

export default function AddShiftModal({ onClose, initialDate, initialPostId, scheduleType }: Props) {
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [remark, setRemark] = useState("");
  const [loading, setLoading] = useState(false);

  const [insertedUserName, setInsertedUserName] = useState("");
  const [userId, setUserId] = useState<string | null>(null);

  const { isAI } = useAITheme();

  const users = useSelector((state: State) => state.data.users);

  // Extract specific post slices from Redux store
  const securityPosts = useSelector((state: any) => state.data.securityPosts);
  const occPosts = useSelector((state: any) => state.data.controllCenterPosts);
  const dertPosts = useSelector((state: any) => state.data.dertPosts);

  const contextPosts: Post[] = useMemo(() => {
    let selectedSlice: Post[] = [];

    switch (scheduleType?.toLowerCase()) {
      case 'security':
        selectedSlice = securityPosts;
        break;
      case 'occ':
      case 'controllcenter':
        selectedSlice = occPosts;
        break;
      case 'dert':
        selectedSlice = dertPosts;
        break;
      default:
        selectedSlice = [];
    }

    // 🔥 CRITICAL FIX: If Redux hasn't loaded the slice, or if it's empty,
    // fall back to the global Posts constant so lookups do not break.
    if (!selectedSlice || selectedSlice.length === 0) {
      return Posts;
    }

    return selectedSlice;
  }, [scheduleType, securityPosts, occPosts, dertPosts]);

  // Unified Single Source of Truth for the selected post ID
  const activePostId = selectedPost || initialPostId;

  const dispatch = useDispatch();
  const isGuestMode = useSelector((state: RootState) => state.app.isGuestMode);

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
    const post = contextPosts.find(p => p.id === postId);
    setStartTime(post?.defaultStartTime || "");
    setEndTime(post?.defaultEndTime || "");
  };

  // FIX 1: Watch contextPosts so default times apply immediately when Redux loads
  useEffect(() => {
    if (initialDate) {
      setDate(new Date(initialDate));
    }

    if (initialPostId && contextPosts.length > 0) {
      setSelectedPost(initialPostId);

      const post = contextPosts.find(p => p.id === initialPostId);
      setStartTime(post?.defaultStartTime || "");
      setEndTime(post?.defaultEndTime || "");
    }
  }, [initialDate, initialPostId, contextPosts]);

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
  }

  const handleEndTimeChange = (newEnd: string | null) => {
    if (!newEnd) return;
    setEndTime(newEnd);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    // FIX 2: Validate using activePostId instead of selectedPost
    if (!activePostId) {
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

    // FIX 3: Find the post entry using the activePostId backup chain
    const post = contextPosts.find(p => p.id === activePostId);
    if (!post) {
      console.error(`❌ Post ID "${activePostId}" was not found inside current contextPosts slice.`, contextPosts);
      setLoading(false);
      dispatch(setError({ message: "שגיאה: עמדה לא נמצאה במערכת" }));
      return;
    }

    try {
      const newShift = await createShift({
        userId,
        date,
        posts: contextPosts,
        postId: activePostId, // Pass activePostId down cleanly
        startTime,
        endTime,
        remark,
      });

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
      } else {
        await fetchUsers(dispatch);
      }

      resetForm();
      dispatch(setSuccess({ message: SuccessMessages.SHIFT_ADDED }));
      onClose();
    } catch (err) {
      console.error("CREATE SHIFT FAILED:", err);
      dispatch(setError({ message: ErrorMessages.SHIFT_SAVE_ERROR }));
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    resetForm();
    onClose();
  };

  const roleFilteredUsers: User[] = useMemo(() => {
    if (!activePostId) return users;
    return getAvailableUsersByPost(users, activePostId, contextPosts);
  }, [users, activePostId, contextPosts]);

  const user = users.find((u) => u.id === userId);

  const availablePosts: Post[] = useMemo(() => {
    if (!user) return contextPosts;
    const allowedByRole = getAvailablePostsByRole(user, contextPosts);
    return contextPosts.filter((cp: any) => allowedByRole.some((ap: any) => ap.id === cp.id));
  }, [user, contextPosts]);

  const availableUsers = useMemo(() => {
    return roleFilteredUsers.filter(u => {
      const fullName = `${u.firstName} ${u.secondName}`;
      return fullName.includes(insertedUserName);
    });
  }, [roleFilteredUsers, insertedUserName]);

  return (
    <div className="form__overlay" onClick={closeModal}>
      <div className="form__modal form__modal--shift" onClick={(e) => e.stopPropagation()}>
        <form
          onSubmit={handleSave}
          method="post"
          className={`form ${isAI ? 'form--ai-theme' : ''}`}
        >
          <div className="form__wrapper">

            <h2 className="form__title">הוספת משמרת</h2>

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
                    <p className='form__message'>לא נמצאו עובדים</p>
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
                      className={`form__list-item ${activePostId === p.id ? 'form__list-item--selected' : ''}`}
                      onClick={() => p.id === selectedPost ? setSelectedPost(null) : handlePostSelect(p.id)}
                    >
                      <span style={{textAlign: 'right'}}>{p.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="form__time-row">
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

            <div className="form__actions">
              <button
                type="submit"
                className='button'
                disabled={loading}
              >
                {loading ? <span>טעינה...</span> : <span>הוסף משמרת</span>}
              </button>

              <button type="button" className='button button--cancel' onClick={closeModal}>ביטול</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
