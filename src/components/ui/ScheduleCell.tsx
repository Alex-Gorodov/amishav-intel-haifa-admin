import { CirclePlus, CircleX, DeleteIcon, EllipsisVertical, RefreshCw, ReplaceIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import DynamicForm from "../DynamicForm/DynamicForm";
import { deleteShift } from "../../store/api/deleteShift.api";
import { Shift } from "../../types/Shift";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/root-reducer";
import { getFullUserName } from "../../utils/getFullUserName";
import { fetchUsers } from "../../store/api/fetchUsers.api";

interface ScheduleCellProps {
  shift: Shift | null;
  onAction: (type: 'add' | 'change' | 'remove', shift?: Shift | null) => void;
}

export default function ScheduleCell({ onAction, shift }: ScheduleCellProps) {
  const dispatch = useDispatch();

  const [isTriggerVisible, setTriggerVisible] = useState(false);
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [openUp, setOpenUp] = useState(false);
  const [shiftFormOpened, setShiftForm] = useState<'add' | 'change' | 'remove' | null>(null);

  const users = useSelector((state: RootState) => state.data.users);
  const user = users.find((u) => u.id === shift?.userId);
  const userName = user ? getFullUserName(user) : '';

  const handleToggleMenu = () => {
    if (!isMenuVisible && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();

      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;

      const menuHeight = 170;

      if (spaceBelow < menuHeight && spaceAbove > menuHeight) {
        setOpenUp(true);
      } else {
        setOpenUp(false);
      }
    }

    setMenuVisible(prev => !prev);
  };

  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        !triggerRef.current?.contains(e.target as Node)
      ) {
        setMenuVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleAddShift = () => {
    setMenuVisible(false);
    onAction('add');
  };

  const handleChangeShift = () => {
    setMenuVisible(false);
    setShiftForm('change');
    onAction('change');
  };

  const handleDeleteClick = () => {
  setMenuVisible(false);
  setShiftForm('remove');
};

  const handleDelete = async () => {
    if (shift && shiftFormOpened === 'remove') {
      await deleteShift({
        userId: shift.userId,
        shiftId: shift.id,
      });
    }

    setShiftForm(null);
    setTriggerVisible(false);
    fetchUsers(dispatch);

  }

  return (
    <div
      className="schedule__cell"
      onMouseEnter={() => setTriggerVisible(true)}
      onMouseLeave={() => setTriggerVisible(false)}
    >
      {isTriggerVisible && (
        <button
          ref={triggerRef}
          className="schedule__cell-trigger"
          onClick={handleToggleMenu}
        >
          <EllipsisVertical size={18} />
        </button>
      )}

      {isMenuVisible && (
        <div
          className={`schedule__cell-menu ${
            openUp ? "schedule__cell-menu--top" : ""
          }`}
          ref={menuRef}
        >
          <button
            className="schedule__menu-btn button button--add"
            onClick={handleAddShift}
          >
            <CirclePlus size={18}/>
            הוסף
          </button>
          <button
            className="schedule__menu-btn button button--change"
            onClick={handleChangeShift}
          >
            <RefreshCw size={18}/>
            חילוף
          </button>
          <button
            className="schedule__menu-btn button button--delete"
            onClick={handleDeleteClick}
          >
            <CircleX size={18}/>
            מחיקה
          </button>
        </div>
      )}

      {shift && shiftFormOpened && (
        <DynamicForm
          type={shiftFormOpened}
          shift={shift}
          onAccept={handleDelete}
          onClose={() => setShiftForm(null)}
        />
      )}

      <p className="schedule__cell-text">{userName}</p>
    </div>
  );
}
