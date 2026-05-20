import React, { useState } from 'react';
import { Roles } from '../../const';
import Layout from '../../components/Layout/Layout';
import { isTouchDevice } from '../../utils/isTouchDevice';
import { useDispatch } from 'react-redux';
import { useAITheme } from '../../hooks/useAIContext';
import { RoleValue } from '../../types/User';
import { addEmployee } from '../../store/actions';
import { createEmployee } from '../../store/api/createEmployee.api';

export default function NewEmployeePage() {
  const dispatch = useDispatch();
  const { isAI } = useAITheme();

  const [firstName, setFirstName] = useState('');
  const [secondName, setSecondName] = useState('');
  const [passport, setPassport] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRoles, setSelectedRoles] = useState<RoleValue[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleRole = (value: RoleValue) => {
    setSelectedRoles(prev =>
      prev.includes(value)
        ? prev.filter(r => r !== value)
        : [...prev, value]
    );
  };

  const resetForm = () => {
    setFirstName('');
    setSecondName('');
    setPassport('');
    setEmail('');
    setPhone('');
    setPassword('');
    setSelectedRoles([]);
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password || !firstName || !secondName) {
      setError("יש למלא את כל שדות החובה!");
      return;
    }

    if (selectedRoles.length === 0) {
      setError('Select at least one role');
      return;
    }

    try {
      setLoading(true);

      const userData = await createEmployee({
        firstName,
        secondName,
        passportId: passport,
        email,
        phoneNumber: phone,
        password,
        roles: selectedRoles,
      });

      dispatch(addEmployee({ user: userData }));

      resetForm();
    } catch (err: any) {
      setError(err.message || 'שגיאה בתהליך יצור משתמש');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <form
        onSubmit={handleCreateUser}
        method="post"
        className={`form ${isAI ? 'form--ai-theme' : ''}`}
      >
        <div className="page__content form__wrapper form__wrapper--fullscreen">


          {
            <div className={`form__error-wrapper ${error ? 'form__error-wrapper--active' : ''}`}>
              <p className='form__error-message'>{error}</p>
            </div>
          }

          <div className='form__wrapper'>
            <input className='form__input' placeholder="שם פרטי" value={firstName} onChange={e => setFirstName(e.target.value)} autoFocus={!isTouchDevice()}/>
            <input className='form__input' placeholder="שם משפחה" value={secondName} onChange={e => setSecondName(e.target.value)}/>
            <input className='form__input' placeholder="ת.ז." value={passport} onChange={e => setPassport(e.target.value)}/>
            <input className='form__input' placeholder="אימייל" value={email} onChange={e => setEmail(e.target.value)}/>
            <input className='form__input' placeholder="טלפון" value={phone} onChange={e => setPhone(e.target.value)}/>
            <input className='form__input' placeholder="סיסמה (מספר עובד עמישב)" type="password" value={password} onChange={e => setPassword(e.target.value)}/>
          </div>

          <div className="form__wrapper">
            <p className='form__label'>בחר תפקידים:</p>
            <div className='form__roles'>
              {Roles.map(role => (
                <button
                  key={role.value}
                  type="button"
                  onClick={() => toggleRole(role.value)}
                  className={`form__role-item ${selectedRoles.includes(role.value) ? 'form__role-item--selected' : ''}`}
                >
                  {role.label}
                </button>
              ))}
            </div>
            <button className='button button--wide' onClick={handleCreateUser} type='submit'>
              {loading ? 'שולח...' : 'הוסף עובד'}
            </button>
          </div>
        </div>
      </form>
    </Layout>
  );
}
