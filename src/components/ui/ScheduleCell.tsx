import { CirclePlus, CircleX, DeleteIcon, EllipsisVertical, RefreshCw, ReplaceIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import DynamicForm from "../DynamicForm/DynamicForm";

interface ScheduleCellProps {
  value: string | null;
  onAction: (type: 'add' | 'change' | 'remove') => void;
}

export default function ScheduleCell({ value, onAction }: ScheduleCellProps) {
  const [isTriggerVisible, setTriggerVisible] = useState(false);
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [openUp, setOpenUp] = useState(false);
  const [shiftFormOpened, setShiftForm] = useState<'add' | 'change' | 'remove' | null>(null);

  const handleToggleMenu = () => {
    if (!isMenuVisible && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();

      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;

      const menuHeight = 170; // approximate or measure later

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
    onAction('change');
  };

  const handleRemoveShift = () => {
    setMenuVisible(false);
    onAction('remove');
  };

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
            className="schedule__menu-btn button"
            onClick={handleChangeShift}
          >
            <RefreshCw size={18}/>
            חילוף
          </button>
          <button
            className="schedule__menu-btn button button--delete"
            onClick={handleRemoveShift}
          >
            <CircleX size={18}/>
            מחיקה
          </button>
        </div>
      )}

      {shiftFormOpened && (
        <DynamicForm
          type={shiftFormOpened}
          onClose={() => setShiftForm(null)}
        />
      )}

      <p className="schedule__cell-text">{value}</p>
    </div>
  );
}
