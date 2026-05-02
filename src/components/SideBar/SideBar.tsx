import { useState } from 'react';
import { AppRoute, Forms } from '../../const';
import CreateEmployeeForm from '../CreateEmployeeForm/CreateEmployeeForm';
import CreateProtocolForm from '../CreateProtocolForm/CreateProtocolForm';
import { NavLink } from 'react-router-dom';
import { CalendarClock, Users, FilePlus2, UserPlus, CalendarPlus, CheckCircle2, Home, ChevronRight, ChevronLeft } from 'lucide-react';
import AddShiftModal from '../AddShiftModal/AddShiftModal';

interface SideBarProps {
  isCollapsed: boolean;
}

export default function SideBar({ isCollapsed }: SideBarProps) {
  const [openedForm, setOpenedForm] = useState<Forms | null>(null);

  const getNavClass = ({ isActive }: { isActive: boolean }) =>
    `button button--side-bar ${isActive ? "button--active" : ""}`;

  return (
      <div className={`bar__wrapper ${isCollapsed ? 'bar__wrapper--collapsed' : ''}`}>
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
