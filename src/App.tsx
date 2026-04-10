import { useState } from 'react';
import CreateProtocolForm from './components/CreateProtocolForm/CreateProtocolForm';
import { Forms } from './const';
import CreateEmployeeForm from './components/CreateEmployeeForm/CreateEmployeeForm';

export function App() {
  const [openedForm, setOpenedForm] = useState<Forms | null>(null)

  return (
    <div className="App">
      <div className='button__wrapper'>
        <button className='button' onClick={() => setOpenedForm('protocol')}>הוסף נוהל</button>
        <button className='button' onClick={() => setOpenedForm('newEmployee')}>הוסף עובד חדש</button>
        <button className='button'>הוסף משמרת</button>
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
    </div>
  );
}

export default App;
