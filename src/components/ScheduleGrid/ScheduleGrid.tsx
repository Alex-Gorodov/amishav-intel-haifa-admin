import { useRef, useState } from "react";

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

  const [isMarked, setIsMarked] = useState(false);

  // sync horizontal scroll
  const handleScroll = () => {
    if (headerRef.current && bodyRef.current) {
      headerRef.current.scrollLeft = bodyRef.current.scrollLeft;
    }
  };

  // sync vertical scroll
  const handleVerticalScroll = () => {
    if (rightRef.current && bodyRef.current) {
      rightRef.current.scrollTop = bodyRef.current.scrollTop;
    }
  };

  return (
    <div className="schedule">

      {/* HEADER */}
      {/* <div className="schedule__header">
        <div className="schedule__header-scroll" ref={headerRef}>
          {[...dates].reverse().map((d, i) => (
            <div key={i} className="schedule__cell grid__cell--header" >
              <p>
                {d}
              </p>
            </div>
          ))}
        </div>

      </div> */}

      <div className="schedule__header">
        <div className="schedule__header-scroll" ref={headerRef}>
          {[...dates].reverse().map((d, i) => (
            <div key={i} className="schedule__cell grid__cell--header">
              <p>{d}</p>
            </div>
          ))}
        </div>

        {/* NEW: fixed right header */}
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
                  <div
                    key={i}
                    className="schedule__cell"
                  >
                    <p className="schedule__cell-text">
                      {value}
                    </p>
                  </div>
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
