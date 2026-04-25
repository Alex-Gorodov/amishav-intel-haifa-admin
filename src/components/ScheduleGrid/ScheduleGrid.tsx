import { useRef, useState } from "react";
import ScheduleCell from "../ui/ScheduleCell";
import DynamicForm from "../DynamicForm/DynamicForm";
import AddShiftModal from "../AddShiftModal/AddShiftModal";

type ShiftRow = {
  id: string;
  name: string;
  shifts: Record<string, string | null>;
};

type Props = {
  dates: string[];
  rows: ShiftRow[];
  cellWidth?: number;
};

export default function ScheduleGrid({ dates, rows }: Props) {
  const headerRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (headerRef.current && bodyRef.current) {
      headerRef.current.scrollLeft = bodyRef.current.scrollLeft;
    }
  };

  const handleVerticalScroll = () => {
    if (rightRef.current && bodyRef.current) {
      rightRef.current.scrollTop = bodyRef.current.scrollTop;
    }
  };


  const [formState, setFormState] = useState<{
    type: 'add' | 'change' | 'remove' | null;
    cellData?: {
      date: string;
      postId: string;
      rowId: string;
    };
  }>({ type: null });

  return (
    <div className="page__content schedule">

      {formState.type && formState.type !== 'add' && (
        <DynamicForm
          type={formState.type}
          onClose={() => setFormState({ type: null })}
        />
      )}

      {formState.type === 'add' && formState.cellData && (
        <AddShiftModal
          isOpened={true}
          onClose={() => setFormState({ type: null })}
          initialDate={formState.cellData.date}
          initialPostId={formState.cellData.postId}
        />
      )}

      {/* HEADER */}
      <div className="schedule__header">
        <div className="schedule__header-scroll" ref={headerRef}>
          {[...dates].reverse().map((d, i) => {
            const dateObj = new Date(d);

            const weekday = dateObj.toLocaleDateString('he-IL', {
              weekday: 'long',
            });

            const day = dateObj.getDate();
            const month = dateObj.getMonth() + 1;

            return (
              <div key={i} className="schedule__cell grid__cell--header">
                <p>{weekday} {day}.{month}</p>
              </div>
            );
          })}
        </div>

        <div className="schedule__right-header">

        </div>
      </div>

      {/* BODY */}
      <div className="schedule__body">

        {/* MAIN SCROLL */}
        <div
          className="schedule__main"
          ref={bodyRef}
          onScroll={() => {
            handleScroll();
            handleVerticalScroll();
          }}
        >
          {rows.map((row) => (
            <div key={row.id} className="schedule__row">
              {[...dates].reverse().map((d, i) => {
                const value = row.shifts[d];

                return (
                  <ScheduleCell
                    key={i}
                    value={value}
                    onAction={(type) =>
                      setFormState({
                        type,
                        cellData: {
                          date: d,
                          postId: row.id,   // or whatever represents the post
                          rowId: row.id,
                        },
                      })
                    }
                  />
                );
              })}
            </div>
          ))}
        </div>

        {/* RIGHT COLUMN */}
        <div className="schedule__right" ref={rightRef}>
          {rows.map((row) => (
            <div key={row.id} className="schedule__right-cell">
              <p className="schedule__cell-text">
                {row.name}
              </p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
