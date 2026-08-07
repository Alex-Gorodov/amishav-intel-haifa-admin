import React, { useEffect, useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp, FieldValue } from 'firebase/firestore';
import { auth, db } from '../../services/firebase';
import { ErrorMessages, FirebaseErrorMessages, Roles, SuccessMessages } from '../../const';
import { isTouchDevice } from '../../utils/isTouchDevice';
import { fetchUsers } from '../../store/api/fetchUsers.api';
import { useDispatch } from 'react-redux';
import { createEmployee } from '../../store/api/createEmployee.api';
import { addEmployee, setStateSuccess } from '../../store/actions';
import { RoleValue } from '../../types/User';
import { useDarkTheme } from '../../hooks/useDarkThemeContext';
import { FirebaseError } from 'firebase/app';

interface Props {
  onClose: () => void;
}

export default function CreateEmployeeForm({ onClose }: Props) {
  const dispatch = useDispatch();

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

  const userData = {
    firstName,
    secondName,
    passportId: passport,
    email,
    phoneNumber: phone,
    password,
    roles: selectedRoles,
  }

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password || !firstName || !secondName) {
      setError(ErrorMessages.FIELDS_REQUIRED);
      return;
    }

    if (selectedRoles.length === 0) {
      setError('Select at least one role');
      return;
    }

    try {
      setLoading(true);

      const createdUser = await createEmployee(userData);

      dispatch(addEmployee({ user: createdUser }));
      dispatch(setStateSuccess({message: SuccessMessages.USER_CREATED}));

      resetForm();
      onClose();
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
    <div className='form__overlay' onClick={onClose}>
      <div className='form__modal form__modal--employee' onClick={(e) => e.stopPropagation()}>
        <div className="form__wrapper">

          <h2 className='form__title'>עובד חדש</h2>

          {
            <div className={`form__message-wrapper form__message-wrapper--error ${error ? 'form__message-wrapper--active' : ''}`}>
              <p className='form__message form__message--error'>{error}</p>
            </div>
          }

          {
            <div className={`form__message-wrapper form__message-wrapper--success ${success ? 'form__message-wrapper--active' : ''}`}>
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
            <p className='form__label'>תפקיד:</p>
            <div className='form__roles'>
              {Roles.map(role => (
                <button
                  key={role.value}
                  onClick={() => toggleRole(role.value)}
                  className={`form__role-item ${selectedRoles.includes(role.value) ? 'form__role-item--selected' : ''}`}
                >
                  {role.label}
                </button>
              ))}
            </div>
          </div>

          <div className="buttons-wrapper">
            <button className='button button--wide' onClick={handleCreateUser} type='submit'>
              {loading ? 'שולח...' : 'הוסף עובד'}
            </button>

            <button className='button button--cancel' onClick={onClose}>
              ביטול
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
