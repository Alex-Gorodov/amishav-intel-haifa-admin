import { useState } from 'react';
import { AppRoute, Forms } from '../../const';
import CreateEmployeeForm from '../CreateEmployeeForm/CreateEmployeeForm';
import CreateProtocolForm from '../CreateProtocolForm/CreateProtocolForm';
import { Link } from 'react-router-dom';
import Layout from '../Layout/Layout';
import AddShiftModal from '../AddShiftModal/AddShiftModal';

export default function SideBar() {
  const [openedForm, setOpenedForm] = useState<Forms | null>(null)

  return (
      <div className="bar__wrapper">
        <div className='buttons-wrapper'>
          <Link to={AppRoute.Employees} className='button'>רשימת עובדים</Link>
          <Link to={AppRoute.NewProtocol} className='button'>הוסף נוהל</Link>
          <Link to={AppRoute.NewEmployee} className='button'>הוסף עובד חדש</Link>
          <Link to={AppRoute.AddShift} className='button'>הוסף משמרת</Link>
          <Link to={AppRoute.Requests} className='button'>אישור בקשות</Link>
          <button className='button'>ביצוע שינוים בסידור</button>
          <Link to={AppRoute.Root} className='button button--home'>דף הבית</Link>
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
