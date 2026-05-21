// components/ProtectedRoute/ProtectedRoute.tsx

import { ReactNode, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { onAuthStateChanged, User } from "firebase/auth";

import { auth } from "../../services/firebase";
import { AppRoute } from "../../const";

interface Props {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: Props) {
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });

    return unsubscribe;
  }, []);

  // LOADING → don't redirect yet
  if (user === undefined) return null; // or spinner

  // NOT AUTHENTICATED
  if (!user) {
    return <Navigate to={AppRoute.Auth} replace />;
  }

  // AUTHENTICATED
  return <>{children}</>;
}
