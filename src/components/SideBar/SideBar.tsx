import { useState } from 'react';
import { AppRoute, Forms } from '../../const';
import CreateEmployeeForm from '../CreateEmployeeForm/CreateEmployeeForm';
import CreateProtocolForm from '../CreateProtocolForm/CreateProtocolForm';
import { Link } from 'react-router-dom';
import { CalendarClock, Users, FilePlus2, UserPlus, CalendarPlus, CheckCircle2, Home, ChevronRight, ChevronLeft } from 'lucide-react';
import AddShiftModal from '../AddShiftModal/AddShiftModal';

interface SideBarProps {
  isCollapsed: boolean;
}

export default function SideBar({ isCollapsed }: SideBarProps) {
  const [openedForm, setOpenedForm] = useState<Forms | null>(null);

  return (
      <div className={`bar__wrapper ${isCollapsed ? 'bar__wrapper--collapsed' : ''}`}>
        <div className='buttons-wrapper'>

          <Link to={AppRoute.Root} className='button button--menu' title="דף הבית">
            <Home size={18} />
            {!isCollapsed && <span>דף הבית</span>}
          </Link>

          <Link to={AppRoute.Employees} className='button button--menu' title="רשימת עובדים">
            <Users size={18} />
            {!isCollapsed && <span>רשימת עובדים</span>}
          </Link>

          <Link to={AppRoute.NewProtocol} className='button button--menu' title="הוסף נוהל">
            <FilePlus2 size={18} />
            {!isCollapsed && <span>הוסף נוהל</span>}
          </Link>

          <Link to={AppRoute.NewEmployee} className='button button--menu' title="הוסף עובד חדש">
            <UserPlus size={18} />
            {!isCollapsed && <span>הוסף עובד חדש</span>}
          </Link>

          <Link to={AppRoute.AddShift} className='button button--menu' title="הוסף משמרת">
            <CalendarPlus size={18} />
            {!isCollapsed && <span>הוסף משמרת</span>}
          </Link>

          <Link to={AppRoute.Requests} className='button button--menu' title="אישור בקשות">
            <CheckCircle2 size={18} />
            {!isCollapsed && <span>אישור בקשות</span>}
          </Link>

          <button className='button button--menu' title="ביצוע שינוים בסידור">
            <CalendarClock size={18} />
            {!isCollapsed && <span>ביצוע שינוים בסידור</span>}
          </button>

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
          <AddShiftModal onClose={() => setOpenedForm(null)} isOpened={false}/>
          :
          null
        }
      </div>
  );
}
