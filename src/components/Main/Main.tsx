import { useState } from 'react';
import { AppRoute, Forms } from '../../const';
import CreateEmployeeForm from '../CreateEmployeeForm/CreateEmployeeForm';
import CreateProtocolForm from '../CreateProtocolForm/CreateProtocolForm';
import { Link } from 'react-router-dom';
import Layout from '../Layout/Layout';
import AddShiftModal from '../AddShiftModal/AddShiftModal';

export function App() {
  const [openedForm, setOpenedForm] = useState<Forms | null>(null)

  return (
    <Layout>
      <div className="wrapper">
        <div className='buttons-wrapper buttons-wrapper--main'>
          <button className='button' onClick={() => setOpenedForm('protocol')}>הוסף נוהל</button>
          <button className='button' onClick={() => setOpenedForm('newEmployee')}>הוסף עובד חדש</button>
          <button className='button' onClick={() => setOpenedForm('newShift')}>הוסף משמרת</button>
          <Link to={AppRoute.Requests} className='button'>אישור בקשות</Link>
          <button className='button'>ביצוע שינוים בסידור</button>
          <Link to={AppRoute.Employees} className='button'>רשימת עובדים</Link>
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
    </Layout>
  );
}

export default App;
