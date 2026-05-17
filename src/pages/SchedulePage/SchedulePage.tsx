import Layout from "../../components/Layout/Layout";
import { useSelector } from "react-redux";
import { RootState } from "../../store/root-reducer";
import { useEffect, useMemo, useState } from "react";
import ScheduleGrid from "../../components/ScheduleGrid/ScheduleGrid";
import { getIsoLocalDateKey, getWeekByOffset } from "../../utils/getWeekDates";
import { ArrowLeft, ArrowRight, PlusCircle } from "lucide-react";
import { Shift } from "../../types/Shift";
import CreatePostForm from "../../components/CreatePostForm/CreatePostForm";
import { Colors, DertPostsOrder, OccPostsOrder, SecurityPostsOrder } from "../../const";
import { TripleToggle } from "../../components/ui/TrippleToggle";
import { isSameDay } from "../../utils/dateUtils";

export default function SchedulePage() {
  const users = useSelector((state: RootState) => state.data.users);

  const [weekOffset, setWeekOffset] = useState(0);

  const weekDates = useMemo(() => getWeekByOffset(weekOffset), [weekOffset]);

  const dateKeys = useMemo(() => weekDates.map(getIsoLocalDateKey), [weekDates]);

  const [searchValue, setSearchValue] = useState('');

  const [isPostFormOpen, setIsPostFormOpen] = useState(false);

  const [scheduleScreen, setScheduleScreen] = useState<'security' | 'occ' | 'dert'>('security')

  const securityPosts = useSelector((state: RootState) => state.data.securityPosts);
  const occPosts = useSelector((state: RootState) => state.data.controllCenterPosts);
  const dertPosts = useSelector((state: RootState) => state.data.dertPosts);

  const currentPosts = useMemo(() => {
    switch (scheduleScreen) {
      case 'security':
        return securityPosts;

      case 'occ':
        return occPosts;

      case 'dert':
        return dertPosts;

      default:
        return [];
    }
  }, [scheduleScreen, securityPosts, occPosts, dertPosts]);

  const postOrder = useMemo(() => {
    let targetOrder: { id: string }[] = [];

    switch (scheduleScreen) {
      case 'security':
        targetOrder = SecurityPostsOrder;
        break;
      case 'occ':
        targetOrder = OccPostsOrder;
        break;
      case 'dert':
        targetOrder = DertPostsOrder;
        break;
      default:
        targetOrder = [];
    }

    // Create a fast-lookup Map of id -> index array position
    return new Map(targetOrder.map((p, index) => [p.id, index]));
  }, [scheduleScreen]);

  const rows = useMemo(() => {
    return [...currentPosts]
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
                isSameDay(s.date, day) &&
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
  }, [users, dateKeys, weekDates, currentPosts]);

  return (
    <Layout>
      <div className="page__header">
        <div className="schedule__navigation-buttons">

          <button className="button button--with-icon button--add schedule__btn--add-post" onClick={() => setIsPostFormOpen(true)}>
            הוסף עמדה
            <PlusCircle size={18} color={'currentColor'}/>
          </button>

          <label htmlFor="search-in-schedule" className="visually-hidden"/>
          <input className="form__input form__input--self schedule__search-field" id="search-in-schedule" type="search" value={searchValue} onChange={(e) => setSearchValue(e.target.value)}/>

          <button
            className="button button--with-icon button--add schedule__btn--prev-week"
            onClick={() => setWeekOffset(prev => prev - 1)}
            // style={{ color: isAI ? '#0abcc7' : '#ffffff'}}
          >
            <ArrowRight size={18} color={'currentColor'}/>
            שבוע הקודם
          </button>

          <button
            className="button button--with-icon button--add schedule__btn--next-week"
            onClick={() => setWeekOffset(prev => prev + 1)}
            disabled={weekOffset >= 1}
          >
            שבוע הבא
            <ArrowLeft size={18} color={weekOffset >= 1 ? Colors.GrayDark : 'currentColor'}/>
          </button>
        </div>
        <TripleToggle
          value={scheduleScreen}
          onChange={(v) => setScheduleScreen(v)}
          options={[
            { label: "בקרה", value: "occ" },
            { label: "חירום", value: "dert" },
            { label: "ביטחון", value: "security" },
          ]}
        />

      </div>
      {isPostFormOpen && (
        <CreatePostForm onClose={() => setIsPostFormOpen(false)} />
      )}
      <ScheduleGrid dates={dateKeys} scheduleType={scheduleScreen} rows={rows} searchFor={searchValue}/>
    </Layout>
  );
}
