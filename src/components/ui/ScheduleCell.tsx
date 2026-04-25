import { EllipsisVertical } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface ScheduleCellProps {
  value: string | null;
}

export default function ScheduleCell({ value }: ScheduleCellProps) {
  const [isTriggerVisible, setTriggerVisible] = useState(false);
  const [isMenuVisible, setMenuVisible] = useState(false);

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
          onClick={() => setMenuVisible((prev) => !prev)}
        >
          <EllipsisVertical size={18} />
        </button>
      )}

      {isMenuVisible && (
        <div className="schedule__cell-menu" ref={menuRef}>
          <button>1</button>
          <button>2</button>
          <button>3</button>
        </div>
      )}

      <p className="schedule__cell-text">{value}</p>
    </div>
  );
}
