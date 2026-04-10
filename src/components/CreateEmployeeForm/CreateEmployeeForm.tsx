import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../services/firebase';
import { Roles } from '../../const';

interface Props {
  onClose: () => void;
}

export default function CreateEmployeeForm({ onClose }: Props) {
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

  const handleCreateUser = async () => {
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
      setLoading(false);
    }
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.container} onClick={(e) => e.stopPropagation()}>
        <h2 style={styles.title}>עובד חדש</h2>

        {error && <p style={styles.error}>{error}</p>}

        <div style={styles.form}>
          <input placeholder="שם פרטי" value={firstName} onChange={e => setFirstName(e.target.value)} style={styles.input}/>
          <input placeholder="שם משפחה" value={secondName} onChange={e => setSecondName(e.target.value)} style={styles.input}/>
          <input placeholder="ת.ז." value={passport} onChange={e => setPassport(e.target.value)} style={styles.input}/>
          <input placeholder="אימייל" value={email} onChange={e => setEmail(e.target.value)} style={styles.input}/>
          <input placeholder="טלפון" value={phone} onChange={e => setPhone(e.target.value)} style={styles.input}/>
          <input placeholder="סיסמט (מספר עובד עמישב)" type="password" value={password} onChange={e => setPassword(e.target.value)} style={styles.input}/>
        </div>

        <p style={styles.label}>תפקיד:</p>
        <div style={styles.roles}>
          {Roles.map(role => (
            <button
              key={role.value}
              onClick={() => toggleRole(role.value)}
              style={{
                ...styles.roleItem,
                ...(selectedRoles.includes(role.value) ? styles.roleSelected : {})
              }}
            >
              {role.label}
            </button>
          ))}
        </div>

        <button onClick={handleCreateUser} style={styles.submit}>
          {loading ? 'שולח...' : 'הוסף עובד'}
        </button>

        <button onClick={onClose} style={styles.cancel}>
          ביטול
        </button>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    background: '#fff',
    padding: 20,
    borderRadius: 16,
    width: 400,
  },
  title: {
    marginBottom: 12,
    textAlign: 'center',
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  input: {
    padding: 10,
    borderRadius: 8,
    border: '1px solid #ccc',
  },
  label: {
    marginTop: 12,
  },
  roles: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  roleItem: {
    padding: 8,
    borderRadius: 8,
    border: '1px solid #ccc',
    cursor: 'pointer',
  },
  roleSelected: {
    background: '#c7f0d8',
  },
  submit: {
    width: '100%',
    padding: 10,
    background: '#4f46e5',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
  },
  cancel: {
    marginTop: 8,
    width: '100%',
    padding: 10,
    background: '#eee',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
  },
};
