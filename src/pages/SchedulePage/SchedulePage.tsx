import Layout from "../../components/Layout/Layout";
import { useSelector } from "react-redux";
import { RootState } from "../../store/root-reducer";
import { useMemo, useState } from "react";
import ScheduleGrid from "../../components/ScheduleGrid/ScheduleGrid";
import { getIsoLocalDateKey, getWeekByOffset, isSameDay } from "../../utils/getWeekDates";
import { ArrowLeft, ArrowRight, PlusCircle } from "lucide-react";
import { Shift } from "../../types/Shift";
import CreatePostForm from "../../components/CreatePostForm/CreatePostForm";
import { Posts } from "../../const";

export default function SchedulePage() {
  const users = useSelector((state: RootState) => state.data.users);

  const [weekOffset, setWeekOffset] = useState(0);

  const weekDates = useMemo(() => getWeekByOffset(weekOffset), [weekOffset]);

  const dateKeys = useMemo(() => weekDates.map(getIsoLocalDateKey), [weekDates]);

  const [searchValue, setSearchValue] = useState('');

  const [isPostFormOpen, setIsPostFormOpen] = useState(false);

  const postOrder = new Map(
    Posts.map((p, index) => [p.id, index])
  );

  const posts = useSelector((state: RootState) => state.data.posts)

  const rows = useMemo(() => {
    return [...posts]
      .sort((a, b) => {
        const aIndex = postOrder.get(a.id) ?? 9999;
        const bIndex = postOrder.get(b.id) ?? 9999;
        return aIndex - bIndex;
      })
      .map((post) => {
        const shiftsMap: Record<string, Shift | null> = {};

        dateKeys.forEach((key, idx) => {
          const day = weekDates[idx];

          const shift = users
            .flatMap((u) => u.shifts || [])
            .find(
              (s) =>
                isSameDay(s.date.toDate(), day) &&
                s.post?.id === post.id
            );

          shiftsMap[key] = shift || null;
        });

        return {
          id: post.id,
          name: post.title,
          shifts: shiftsMap,
        };
      });
  }, [users, dateKeys, posts]);

  return (
    <Layout>
      <div className="page__header">
        {/* <h1 className="page__title">סידור עבודה</h1> */}
        <div className="schedule__navigation-buttons">

          <button className="button button--with-icon button--add" onClick={() => setIsPostFormOpen(true)}>
            הוסף עמדה
            <PlusCircle size={18} color={'#ffffff'}/>
          </button>

          <label htmlFor="search-in-schedule" className="visually-hidden"/>
          <input className="form__input form__input--self" id="search-in-schedule" type="search" value={searchValue} onChange={(e) => setSearchValue(e.target.value)}/>

          <button
            className="button button--with-icon"
            onClick={() => setWeekOffset(prev => prev - 1)}
          >
            <ArrowRight size={18} color={'#ffffff'}/>
            שבוע הקודם
          </button>

          <button
            className="button button--with-icon"
            onClick={() => setWeekOffset(prev => prev + 1)}
            disabled={weekOffset >= 1}
          >
            שבוע הבא
            <ArrowLeft size={18} color={weekOffset >= 1 ? '#444444' : '#ffffff'}/>
          </button>
        </div>
      </div>
      {isPostFormOpen && (
        <CreatePostForm onClose={() => setIsPostFormOpen(false)} />
      )}
      <ScheduleGrid dates={dateKeys} rows={rows} searchFor={searchValue}/>
    </Layout>
  );
}
