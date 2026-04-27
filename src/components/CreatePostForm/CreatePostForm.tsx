import { useState } from "react";
import { createPost } from "../../store/api/createPost.api";
import { Post } from "../../types/Post";
import { Toggle } from "../ui/Toggle";
import { fetchPosts } from "../../store/api/fetchPosts.api";
import { useDispatch } from "react-redux";

interface Props {
  onClose: () => void;
}

type RoleOption = {
  value: Post["role"];
  label: string;
};

export default function PostForm({ onClose }: Props) {
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [id, setId] = useState("");
  const [role, setRole] = useState<Post["role"] | null>(null);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  // const [isMultiple, setIsMultiple] = useState(false);

  const roleOptions: RoleOption[] = [
    { value: "security_guard", label: "מאבטח" },
    { value: "security_shift_leader", label: "אחמ״ש" },
    { value: "shift_manager", label: "מנהל משמרת" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !id || !startTime || !endTime || !role) return;

    await createPost({
      id,
      title,
      role,
      defaultStartTime: startTime,
      defaultEndTime: endTime,
      // isMultiple: isMultiple
    });

    await fetchPosts(dispatch);

    onClose();
  };

  return (
    <div className="form__overlay" onClick={onClose}>
      <div
        className="form__modal form__modal--dynamic"
        onClick={(e) => e.stopPropagation()}
      >
        <form className="form__wrapper" onSubmit={handleSubmit}>
          <h2 className="form__title">הוספת עמדה חדשה</h2>

          <input
            className="form__input"
            placeholder="שם עמדה"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            className="form__input"
            placeholder="ID (למשל: gatehouse-morning)"
            value={id}
            onChange={(e) => setId(e.target.value)}
          />

          {/* <Toggle style={{ alignSelf: 'center '}} value={isMultiple} leftLabel="קבוצתי" rightLabel="אישי" onChange={() => setIsMultiple(!isMultiple)}/> */}

          <div className="form__wrapper">
            <p>תפקיד:</p>

            <div className="form__roles">
              {roleOptions.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setRole(r.value)}
                  className={`form__role-item ${
                    role === r.value ? "form__role-item--selected" : ""
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <input
            type="time"
            className="form__input"
            step={900}
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />

          <input
            type="time"
            className="form__input"
            value={endTime}
            step={900}
            onChange={(e) => setEndTime(e.target.value)}
          />

          <div className="buttons-wrapper">
            <button className="button button--add" type="submit">
              הוסף
            </button>

            <button
              className="button button--cancel"
              type="button"
              onClick={onClose}
            >
              ביטול
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
