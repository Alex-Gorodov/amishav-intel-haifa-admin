// components/ProtectedRoute/ProtectedRoute.tsx

import { ReactNode, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { onAuthStateChanged, User } from "firebase/auth";
import { useSelector } from "react-redux";

import { auth } from "../../services/firebase";
import { AppRoute } from "../../const";
import { RootState } from "../../store/root-reducer";

interface Props {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: Props) {
  const isGuestMode = useSelector((state: RootState) => state.app.isGuestMode);
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });

    return unsubscribe;
  }, []);

  // LOADING → don't redirect yet
  if (user === undefined && !isGuestMode) return null; // or spinner

  // NOT AUTHENTICATED
  if (!user && !isGuestMode) {
    return <Navigate to={AppRoute.Auth} replace />;
  }

  // AUTHENTICATED OR GUEST MODE
  return <>{children}</>;
}
