// store/api/signIn.api.ts

import { signInWithEmailAndPassword } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";

import { auth, db } from "../../services/firebase";
import { ErrorMessages } from "../../const";

export async function signInUser(
  identifier: { type: "email" | "passportId"; value: string },
  password: string
) {
  let email = identifier.value;

  if (identifier.type === "passportId") {
    const q = query(
      collection(db, "users"),
      where("passportId", "==", identifier.value)
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      throw new Error(ErrorMessages.CHECK_LOGIN_AND_PASSWORD);
    }

    email = snapshot.docs[0].data().email;
  }

  return signInWithEmailAndPassword(auth, email, password);
}
