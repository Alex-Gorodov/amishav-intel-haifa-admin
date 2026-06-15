import React, { useState } from 'react';
import { ErrorMessages, FirebaseErrorMessages, Roles, SuccessMessages } from '../../const';
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
  const [success, setSuccess] = useState<string | null>(null);

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
      setError(ErrorMessages.FIELDS_REQUIRED);
      return;
    }

    if (selectedRoles.length === 0) {
      setError(ErrorMessages.ROLE_REQUIRED);
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

      setSuccess(SuccessMessages.USER_CREATED)

      resetForm();
    } catch (err: any) {
      if (err.message === FirebaseErrorMessages.SIGN_UP_EMAIL) {
        setError(ErrorMessages.USER_CREATING_WRONG_EMAIL);
      } else if (err.message === FirebaseErrorMessages.SIGN_UP_PASSWORD) {
        setError(ErrorMessages.USER_CREATING_SHORT_PASSWORD);
      } else if (err.message === FirebaseErrorMessages.SIGN_UP_EMAIL_EXIST) {
        setError(ErrorMessages.USER_CREATING_EMAIL_EXIST);
      } else {
        setError(err.message);
      }
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
            <div className={`form__message-wrapper form__message-wrapper--error ${error ? 'form__message-wrapper form__message-wrapper--active' : ''}`}>
              <p className='form__message form__message--error'>{error}</p>
            </div>
          }

          {
            <div className={`form__message-wrapper form__message-wrapper--success ${success ? 'form__message-wrapper form__message-wrapper--active' : ''}`}>
              <p className='form__message form__message--success'>{success}</p>
            </div>
          }

          <div className='form__wrapper'>
            <input className='form__input' placeholder="שם פרטי" value={firstName} onChange={e => setFirstName(e.target.value)} autoFocus={!isTouchDevice()}/>
            <input className='form__input' placeholder="שם משפחה" value={secondName} onChange={e => setSecondName(e.target.value)}/>
            <input className='form__input' placeholder="ת.ז." value={passport} onChange={e => setPassport(e.target.value)}/>
            <input className='form__input' placeholder="אימייל" value={email} onChange={e => setEmail(e.target.value)}/>
            <input className='form__input' placeholder="טלפון" value={phone} onChange={e => setPhone(e.target.value)}/>
            <input className='form__input' placeholder="סיסמה (מספר עובד)" type="password" value={password} onChange={e => setPassword(e.target.value)}/>
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
