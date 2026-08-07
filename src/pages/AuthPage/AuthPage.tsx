import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useDarkTheme } from "../../hooks/useDarkThemeContext";
import { AppRoute, ErrorMessages, GUEST_MODE_KEY } from "../../const";
import { signInUser } from "../../store/api/signIn.api";
import Layout from "../../components/Layout/Layout";
import { auth } from "../../services/firebase";
import { getUserProfile } from "../../store/api/getUserProfile.api";
import { signOut } from "firebase/auth";
import { setGuestMode } from "../../store/actions";
import { loadGuestData } from "../../mocks/guestData";
import { fetchUsers } from "../../store/api/fetchUsers.api";
import { fetchSecurityPosts } from "../../store/api/fetchSecurityPosts.api";
import { fetchControllCenterPosts } from "../../store/api/fetchControllCenterPosts.api";
import { fetchDertPosts } from "../../store/api/fetchDertPosts.api";
import { fetchSwapRequests, fetchGiveRequests } from "../../store/api/fetchRequests.api";

export default function AuthPage() {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isDark } = useDarkTheme();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!identifier || !password) {
      setError("יש למלא פרטים");
      return;
    }

    try {
      setLoading(true);

      const isEmail = identifier.includes("@");

      await signInUser(
        {
          type: isEmail ? "email" : "passportId",
          value: identifier.trim(),
        },
        password
      );

      const uid = auth.currentUser?.uid;

      if (!uid) throw new Error("No user found");

      const profile = await getUserProfile(uid);

      if (!profile?.isAdmin) {
        await signOut(auth);
        setError(ErrorMessages.NO_ADMIN_PERMISSIONS);
        return;
      }

      localStorage.removeItem(GUEST_MODE_KEY);
      dispatch(setGuestMode({ isGuestMode: false }));

      await Promise.all([
        fetchUsers(dispatch),
        fetchSecurityPosts(dispatch),
        fetchControllCenterPosts(dispatch),
        fetchDertPosts(dispatch),
        fetchSwapRequests(dispatch),
        fetchGiveRequests(dispatch),
      ]);

      navigate(AppRoute.Root);

    } catch (err: any) {
      console.log("LOGIN ERROR:", err);
      setError(ErrorMessages.CHECK_LOGIN_AND_PASSWORD);
    } finally {
      setLoading(false);
    }
  };

  const handleGuestEntry = () => {
    localStorage.setItem(GUEST_MODE_KEY, "true");
    dispatch(setGuestMode({ isGuestMode: true }));
    loadGuestData(dispatch);
    navigate(AppRoute.Root);
  };

  return (
    <Layout>
      <form
        onSubmit={handleLogin}
        method="POST"
        className={`form ${isDark ? "form--dark-theme" : ""}`}
      >
        <div className="form__wrapper form__wrapper--fullscreen">
          <h1 className="form__title">התחברות</h1>

          {
            <div className={`form__message-wrapper form__message-wrapper--error ${error ? 'form__message-wrapper form__message-wrapper--error--active' : ''}`}>
              <p className='form__message form__message--error'>{error}</p>
            </div>
          }

          <input
            className="form__input"
            placeholder="תעודת זהות / אימייל"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
          />

          <input
            className="form__input"
            type="password"
            placeholder="סיסמה"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="button button--wide" type="submit" disabled={loading}>
            {loading ? "מתחבר..." : "התחבר"}
          </button>

          <button
            type="button"
            className="button button--wide button--secondary"
            onClick={handleGuestEntry}
          >
            כניסה כאורח
          </button>
        </div>
      </form>
    </Layout>
  );
}
