import { CirclePlus, CircleX, DeleteIcon, EllipsisVertical, Pencil, RefreshCw, ReplaceIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import DynamicShiftForm from "../DynamicShiftForm/DynamicShiftForm";
import { deleteShift } from "../../store/api/deleteShift.api";
import { Shift } from "../../types/Shift";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/root-reducer";
import { getFullUserName } from "../../utils/getFullUserName";
import { fetchUsers } from "../../store/api/fetchUsers.api";
import { getPostTimeRange } from "../../utils/getPostTimeRange";

interface ScheduleCellProps {
  shift: Shift | null;
  searchFor: string;
  onAction: (type: 'add' | 'swap' | 'remove' | 'edit', shift?: Shift | null) => void;
}

export default function ScheduleCell({ onAction, shift, searchFor }: ScheduleCellProps) {
  const dispatch = useDispatch();

  const [isTriggerVisible, setTriggerVisible] = useState(false);
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [openUp, setOpenUp] = useState(false);
  const [shiftFormOpened, setShiftForm] = useState<'add' | 'swap' | 'remove' | 'edit' | null>(null);

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

  const handleEditShift = () => {
    setMenuVisible(false);
    setShiftForm('edit');
    onAction('edit');
  }

  const handleAddShift = () => {
    setMenuVisible(false);
    onAction('add');
  };

  const handleChangeShift = () => {
    setMenuVisible(false);
    setShiftForm('swap');
    onAction('swap');
  };

  const handleDeleteClick = () => {
    setMenuVisible(false);
    setShiftForm('remove');
  };

  const onReset = () => {
    setShiftForm(null);
    setTriggerVisible(false);
  }

  const handleDelete = async () => {
    if (shift && shiftFormOpened === 'remove') {
      await deleteShift({
        userId: shift.userId,
        shiftId: shift.id,
      });
    }
    onReset();
    fetchUsers(dispatch);

  }

  const isMatch = searchFor
    ? userName.toLowerCase().includes(searchFor.toLowerCase())
    : false;

  const range = getPostTimeRange(shift);

  return (
    <div
      className={`schedule__cell ${isMatch ? 'schedule__cell--active' : ''}`}
      style={{ flexDirection: range ? 'column' : 'row' }}
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
          {
            shift
            ?
            <>
              <button
                className="schedule__menu-btn button button--edit"
                onClick={handleEditShift}
              >
                <Pencil size={18}/>
                ערך
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
            </>
            :
            <button
              className="schedule__menu-btn button button--add"
              onClick={handleAddShift}
            >
              <CirclePlus size={18}/>
              הוסף
            </button>
          }
        </div>
      )}

      {shift && shiftFormOpened && (
        <DynamicShiftForm
          type={shiftFormOpened}
          shift={shift}
          onAccept={handleDelete}
          onClose={onReset}
        />
      )}

      <p className={`schedule__cell-text ${isMatch ? 'schedule__cell-text--active' : ''}`}>{userName}</p>
      {
        range
        &&
        <>
          <hr style={{ width: '100%', opacity: 0.2 }}/>
          <p className={`schedule__cell-text ${isMatch ? 'schedule__cell-text--active' : ''}`}>{range?.from} - {range?.to}</p>
        </>
      }
    </div>
  );
}
