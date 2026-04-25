import React, { useEffect, useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../services/firebase';
import { Roles } from '../../const';
import { isTouchDevice } from '../../utils/isTouchDevice';
import { fetchUsers } from '../../store/api/fetchUsers.api';
import { useDispatch } from 'react-redux';

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
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleRole = (value: string) => {
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
      setError('Fill required fields');
      return;
    }

    if (selectedRoles.length === 0) {
      setError('Select at least one role');
      return;
    }

    try {
      setLoading(true);

      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCred.user.uid;

      await setDoc(doc(db, 'users', uid), {
        id: uid,
        passportId: passport,
        firstName,
        secondName,
        email,
        roles: selectedRoles,
        shifts: [],
        isAdmin: false,
        phoneNumber: phone,
        avatarUrl: null,
        createdAt: serverTimestamp(),
      });

      resetForm();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error creating user');
    } finally {
      fetchUsers(dispatch);
      setLoading(false);
    }
  };

  return (
    <div className='form__overlay' onClick={onClose}>
      <div className='form__modal form__modal--employee' onClick={(e) => e.stopPropagation()}>
        <div className="form__wrapper">

          <h2 className='form__title'>עובד חדש</h2>

          {error && <p className='form__error'>{error}</p>}

          <div className='form__wrapper'>
            <input className='form__input' placeholder="שם פרטי" value={firstName} onChange={e => setFirstName(e.target.value)} autoFocus={!isTouchDevice()}/>
            <input className='form__input' placeholder="שם משפחה" value={secondName} onChange={e => setSecondName(e.target.value)}/>
            <input className='form__input' placeholder="ת.ז." value={passport} onChange={e => setPassport(e.target.value)}/>
            <input className='form__input' placeholder="אימייל" value={email} onChange={e => setEmail(e.target.value)}/>
            <input className='form__input' placeholder="טלפון" value={phone} onChange={e => setPhone(e.target.value)}/>
            <input className='form__input' placeholder="סיסמה (מספר עובד עמישב)" type="password" value={password} onChange={e => setPassword(e.target.value)}/>
          </div>

          <div className="form__wrapper">
            <p>תפקיד:</p>
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

            <button className='button button--wide button--cancel' onClick={onClose}>
              ביטול
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
