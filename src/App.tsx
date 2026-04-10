import { useState } from 'react';
import CreateProtocolForm from './components/CreateProtocolForm/CreateProtocolForm';
import { Forms } from './const';

function App() {
  const [openedForm, setOpenedForm] = useState<Forms | null>(null)

  return (
    <div className="App">
      <div className='button__wrapper'>
        <button className='button' onClick={() => setOpenedForm('protocol')}>הוסף נוהל</button>
        <button className='button'>הוסף עובד חדש</button>
        <button className='button'>הוסף משמרת</button>
      </div>
      {
        openedForm === 'protocol'
        ?
        <CreateProtocolForm/>
        :
        null
      }
    </div>
  );
}

export default App;
