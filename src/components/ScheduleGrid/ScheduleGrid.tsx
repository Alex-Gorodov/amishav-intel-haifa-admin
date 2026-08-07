import { useMemo, useRef, useState } from "react";
import ScheduleCell from "../ui/ScheduleCell";
import AddShiftModal from "../AddShiftModal/AddShiftModal";
import { Shift } from "../../types/Shift";
import { useDarkTheme } from "../../hooks/useDarkThemeContext";
import { useSelector } from "react-redux";
import { Posts } from "../../const";
import { Post } from "../../types/Post";

type ShiftRow = {
  id: string;
  name: string;
  shifts: Record<string, Shift | null>;
};

type Props = {
  dates: string[];
  rows: ShiftRow[];
  scheduleType: string;
  searchFor: string;
};

export default function ScheduleGrid({ dates, rows, searchFor, scheduleType }: Props) {
  const { isDark } = useDarkTheme();
  const headerRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

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

  const isToday = (date: string) => {
    const d = new Date(date);
    const today = new Date();

    return d.toDateString() === today.toDateString();
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
    <>
      <div className={`page__content schedule ${ isDark ? 'schedule--dark' : ''}`}>

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
                <div
                  key={i}
                  className={`schedule__cell grid__cell--header ${
                    isToday(d) ? "schedule__cell--header-today" : ""
                  }`}
                >
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
                      date={new Date(d)}
                      searchFor={searchFor}
                      allPosts={contextPosts}
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
      {formState.type === 'add' && formState.cellData && (
        <AddShiftModal
          onClose={() => setFormState({ type: null })}
          initialDate={formState.cellData.date}
          initialPostId={formState.cellData.postId}
          scheduleType={scheduleType}
        />
      )}
    </>
  );
}
