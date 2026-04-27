import { useRef, useState } from "react";
import ScheduleCell from "../ui/ScheduleCell";
import AddShiftModal from "../AddShiftModal/AddShiftModal";
import { Shift } from "../../types/Shift";
import { getPostTimeRange } from "../../utils/getPostTimeRange";

type ShiftRow = {
  id: string;
  name: string;
  shifts: Record<string, Shift | null>;
};

type Props = {
  dates: string[];
  rows: ShiftRow[];
  searchFor: string;
};

export default function ScheduleGrid({ dates, rows, searchFor }: Props) {
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
    type: 'add' | 'swap' | 'remove' | 'edit' | null;
    cellData?: {
      date: string;
      postId: string;
      rowId: string;
    };
  }>({ type: null });

  return (
    <div className="page__content schedule">

      {formState.type === 'add' && formState.cellData && (
        <AddShiftModal
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
                const shift = row.shifts[d];

                return (
                  <ScheduleCell
                    key={i}
                    shift={shift}
                    searchFor={searchFor}
                    onAction={(type) =>
                      setFormState({
                        type,
                        cellData: {
                          date: d,
                          postId: row.id,
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
          {rows.map((row) => {

            return (
              <div key={row.id} className="schedule__right-cell">
                <p className="schedule__cell-text">
                  {row.name}
                </p>
              </div>
            )
          })}
        </div>

      </div>
    </div>
  );
}
