import EmployeeItem from "../../components/EmployeeItem/EmployeeItem";
import Layout from "../../components/Layout/Layout";
import { useSelector } from "react-redux";
import { RootState } from "../../store/root-reducer";
import { useMemo, useState } from "react";
import ScheduleGrid from "../../components/ScheduleGrid/ScheduleGrid";
import { Posts } from "../../const";
import { getIsoLocalDateKey, getWeekByOffset, isSameDay } from "../../utils/getWeekDates";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function SchedulePage() {
  const users = useSelector((state: RootState) => state.data.users);
  const [isFormOpened, setFormOpened] = useState(false);
  const [weekOffset, setWeekOffset] = useState(0);

  const weekDates = useMemo(() => getWeekByOffset(weekOffset), [weekOffset]);

  const dateKeys = useMemo(() => weekDates.map(getIsoLocalDateKey), [weekDates]);

  const rows = useMemo(() => {
    return Posts.map((post) => {
      const shiftsMap: Record<string, string | null> = {};
      dateKeys.forEach((key, idx) => {
        const day = weekDates[idx];

        const names = users
          .filter((u) => u.shifts?.some((s) => isSameDay(s.date.toDate(), day) && s.post?.id === post.id))
          .map((u) => `${u.firstName} ${u.secondName}`);
        shiftsMap[key] = names.length ? names.join(', ') : null;
      });

      return {
        id: post.id,
        name: post.title,
        shifts: shiftsMap,
      };
    });
  }, [users, dateKeys]);

  return (
    <Layout>
      <div className="page__header">
        <h1 className="page__title">סידור עבודה</h1>
        <div className="schedule__navigation-buttons">
          <button
            className="button button--menu"
            onClick={() => setWeekOffset(prev => prev - 1)}
          >
            <ArrowRight size={18} color={'#ffffff'}/>
            שבוע שעבר
          </button>

          <button
            className="button button--menu"
            onClick={() => setWeekOffset(prev => prev + 1)}
            disabled={weekOffset >= 1}
          >
            שבוע הבא
            <ArrowLeft size={18} color={weekOffset >= 1 ? '#444444' : '#ffffff'}/>
          </button>
        </div>
      </div>
      <ScheduleGrid dates={dateKeys} rows={rows}/>
    </Layout>
  );
}
