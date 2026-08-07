import { CalendarClock, Users, FilePlus2, UserPlus, CalendarPlus, CheckCircle2, Home } from 'lucide-react';
import { useDarkTheme } from '../../hooks/useDarkThemeContext';
import { AppRoute } from '../../const';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/root-reducer';
import { useState } from 'react';

interface SideBarProps {
  isCollapsed: boolean;
}

export default function SideBar({ isCollapsed }: SideBarProps) {
  const { isMobile, isDark } = useDarkTheme();

  const shouldCollapse = isMobile || isCollapsed;

  const swapRequests = useSelector((state: RootState) => state.data.swapRequests)
  const giveRequests = useSelector((state: RootState) => state.data.giveRequests)

  const isRequestsExist =
  swapRequests.length > 0 || giveRequests.length > 0;

const getNavClass =
  (hasNotification = false) =>
  ({ isActive }: { isActive: boolean }) => {
    let classes = "button button--side-bar";

    if (isActive) {
      classes += " button--side-bar-active";
    }

    if (isDark) {
      classes += " bar__btn--dark";
    }

    if (hasNotification) {
      classes += " button--side-bar-notification";
    }

    return classes;
  };



  return (
      <div className={`bar__wrapper ${shouldCollapse ? 'bar__wrapper--collapsed' : ''} ${isDark ? 'bar__wrapper--dark' : ''}`}>
        <div className='buttons-wrapper'>

          <NavLink
            to={AppRoute.Root}
            className={getNavClass()}
            end
          >
            <Home size={18}/>
            {!shouldCollapse && <span>דף הבית</span>}
          </NavLink>

          <NavLink to={AppRoute.Employees} className={getNavClass()} title="רשימת עובדים">
            <Users size={18}/>
            {!shouldCollapse && <span>רשימת עובדים</span>}
          </NavLink>

          <NavLink to={AppRoute.NewProtocol} className={getNavClass()} title="הוסף נוהל">
            <FilePlus2 size={18}/>
            {!shouldCollapse && <span>הוסף נוהל</span>}
          </NavLink>

          <NavLink to={AppRoute.NewEmployee} className={getNavClass()} title="הוסף עובד חדש">
            <UserPlus size={18}/>
            {!shouldCollapse && <span>הוסף עובד חדש</span>}
          </NavLink>

          <NavLink to={AppRoute.AddShift} className={getNavClass()} title="הוסף משמרת">
            <CalendarPlus size={18}/>
            {!shouldCollapse && <span>הוסף משמרת</span>}
          </NavLink>

          <NavLink to={AppRoute.Requests} className={getNavClass(isRequestsExist)} title="אישור בקשות">
            <CheckCircle2 size={18}/>
            {!shouldCollapse && <span>אישור בקשות</span>}
          </NavLink>

          <NavLink to={AppRoute.Schedule} className={getNavClass()} title="סידור עבודה">
            <CalendarClock size={18}/>
            {!shouldCollapse && <span>סידור עבודה</span>}
          </NavLink>

        </div>
      </div>
  );
}
