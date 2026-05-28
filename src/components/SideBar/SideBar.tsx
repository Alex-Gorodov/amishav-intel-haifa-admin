import { CalendarClock, Users, FilePlus2, UserPlus, CalendarPlus, CheckCircle2, Home } from 'lucide-react';
import { useAITheme } from '../../hooks/useAIContext';
import { AppRoute } from '../../const';
import { NavLink } from 'react-router-dom';

interface SideBarProps {
  isCollapsed: boolean;
}

export default function SideBar({ isCollapsed }: SideBarProps) {
  const { isAI } = useAITheme();

  const getNavClass = ({ isActive }: { isActive: boolean }) => {
    let classes = "button button--side-bar";

    if (isActive) {
      classes += " button--side-bar-active";
    }

    if (isAI) {
      classes += " bar__btn--ai";
    }

    return classes;
  };

  return (
      <div className={`bar__wrapper ${isCollapsed ? 'bar__wrapper--collapsed' : ''} ${isAI ? 'bar__wrapper--ai' : ''}`}>
        <div className='buttons-wrapper'>

          <NavLink
            to={AppRoute.Root}
            className={getNavClass}
            end
          >
            <Home size={18}/>
            {!isCollapsed && <span>דף הבית</span>}
          </NavLink>

          <NavLink to={AppRoute.Employees} className={getNavClass} title="רשימת עובדים">
            <Users size={18}/>
            {!isCollapsed && <span>רשימת עובדים</span>}
          </NavLink>

          <NavLink to={AppRoute.NewProtocol} className={getNavClass} title="הוסף נוהל">
            <FilePlus2 size={18}/>
            {!isCollapsed && <span>הוסף נוהל</span>}
          </NavLink>

          <NavLink to={AppRoute.NewEmployee} className={getNavClass} title="הוסף עובד חדש">
            <UserPlus size={18}/>
            {!isCollapsed && <span>הוסף עובד חדש</span>}
          </NavLink>

          <NavLink to={AppRoute.AddShift} className={getNavClass} title="הוסף משמרת">
            <CalendarPlus size={18}/>
            {!isCollapsed && <span>הוסף משמרת</span>}
          </NavLink>

          <NavLink to={AppRoute.Requests} className={getNavClass} title="אישור בקשות">
            <CheckCircle2 size={18}/>
            {!isCollapsed && <span>אישור בקשות</span>}
          </NavLink>

          <NavLink to={AppRoute.Schedule} className={getNavClass} title="סידור עבודה">
            <CalendarClock size={18}/>
            {!isCollapsed && <span>סידור עבודה</span>}
          </NavLink>

        </div>
      </div>
  );
}
