// store/api/createUser.api.ts

import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, serverTimestamp, setDoc, Timestamp } from 'firebase/firestore';

import { auth, db } from '../../services/firebase';
import { RoleValue, User } from '../../types/User';
import { GUEST_MODE_KEY } from '../../const';

type CreateEmployeeParams = {
  firstName: string;
  secondName: string;
  passportId: string;
  email: string;
  phoneNumber: string;
  password: string;
  roles: RoleValue[];
};

const emptyTrainings = {
  safety: {
    id: '',
    title: '',
    updatingDate: null,
    validityPeriod: 0,
  },
  roni: {
    id: '',
    title: '',
    updatingDate: null,
    validityPeriod: 0,
  },
  weapon: {
    id: '',
    title: '',
    updatingDate: null,
    validityPeriod: 0,
  },
  mada: {
    id: '',
    title: '',
    updatingDate: null,
    validityPeriod: 0,
  },
  rights: {
    id: '',
    title: '',
    updatingDate: null,
    validityPeriod: 0,
  },
};


export const createEmployee = async ({
  firstName,
  secondName,
  passportId,
  email,
  phoneNumber,
  password,
  roles,
}: CreateEmployeeParams) => {
  try {
    const isGuestMode = typeof window !== 'undefined' && localStorage.getItem(GUEST_MODE_KEY) === 'true';

    const uid = isGuestMode
      ? `guest-${Math.random().toString(36).slice(2, 10)}`
      : (await createUserWithEmailAndPassword(auth, email, password)).user.uid;

    const newUser: User = {
      id: uid,
      passportId,
      firstName,
      secondName,
      email,
      phoneNumber,
      roles,

      shifts: [],
      availability: [],
      documents: [],
      trainings: emptyTrainings,

      isAdmin: false,
      avatarUrl: '',
      createdAt: isGuestMode ? Timestamp.fromDate(new Date()) : serverTimestamp(),
    };

    if (!isGuestMode) {
      await setDoc(doc(db, 'users', uid), newUser);
    }

    return newUser;
  } catch (error) {
    console.error('❌ Failed to create user:', error);
    throw error;
  }
};
