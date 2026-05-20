// store/api/createUser.api.ts

import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';

import { auth, db } from '../../services/firebase';
import { RoleValue, User } from '../../types/User';

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
    const userCred = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const uid = userCred.user.uid;

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
      createdAt: serverTimestamp(),
    };
    await setDoc(doc(db, 'users', uid), newUser);

    return newUser;
  } catch (error) {
    console.error('❌ Failed to create user:', error);
    throw error;
  }
};
