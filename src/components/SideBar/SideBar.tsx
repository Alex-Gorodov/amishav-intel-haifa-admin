import { useState } from 'react';
import { AppRoute, Forms } from '../../const';
import CreateEmployeeForm from '../CreateEmployeeForm/CreateEmployeeForm';
import CreateProtocolForm from '../CreateProtocolForm/CreateProtocolForm';
import { NavLink } from 'react-router-dom';
import { CalendarClock, Users, FilePlus2, UserPlus, CalendarPlus, CheckCircle2, Home, ChevronRight, ChevronLeft } from 'lucide-react';
import AddShiftModal from '../AddShiftModal/AddShiftModal';
import { useAITheme } from '../../hooks/useAIContext';

interface SideBarProps {
  isCollapsed: boolean;
}

export default function SideBar({ isCollapsed }: SideBarProps) {
  const { isAI } = useAITheme();
  const [openedForm, setOpenedForm] = useState<Forms | null>(null);

  // const getNavClass = ({ isActive }: { isActive: boolean }) =>
  //   ` ${isActive ? "button--side-bar-active" : "button button--side-bar"} ${isAI ? "bar__btn" : "button button--side-bar"}`;

  const getNavClass = ({ isActive }: { isActive: boolean }) => {
    // 1. Start with the base class that is ALWAYS there
    let classes = "button button--side-bar";

    // 2. Add the active state modifier
    if (isActive) {
      classes += " button--side-bar-active";
    }

    // 3. Add the AI styling modifier
    if (isAI) {
      classes += " bar__btn--ai"; // Using a modifier pattern is cleaner
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
        {
          openedForm === 'protocol'
          ?
          <CreateProtocolForm onClose={() => setOpenedForm(null)}/>
          :
          null
        }
        {
          openedForm === 'newEmployee'
          ?
          <CreateEmployeeForm onClose={() => setOpenedForm(null)}/>
          :
          null
        }
        {
          openedForm === 'newShift'
          ?
          <AddShiftModal onClose={() => setOpenedForm(null)}/>
          :
          null
        }
      </div>
  );
}
