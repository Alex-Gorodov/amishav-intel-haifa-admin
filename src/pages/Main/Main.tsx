import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import { useAITheme } from '../../hooks/useAIContext';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth } from '../../services/firebase';
import { AppRoute, GUEST_MODE_KEY } from '../../const';
import { getUserProfile } from '../../store/api/getUserProfile.api';
import { RootState } from '../../store/root-reducer';
import { setGuestMode, loadUsers, loadSecurityPosts, loadControllCenterPosts, loadDertPosts, loadRequests } from '../../store/actions';

export default function App() {

  const [date, setDate] = useState(new Date());
  const formattedTime = date.toLocaleTimeString('he-IL', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isGuestMode = useSelector((state: RootState) => state.app.isGuestMode);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);

  useEffect(() => {
    if (!user?.uid) return;

    const loadProfile = async () => {
      const data = await getUserProfile(user.uid);
      setProfile(data);
    };

    loadProfile();
  }, [user?.uid]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setDate(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    dispatch(setGuestMode({ isGuestMode: false }));
    dispatch(loadUsers({ users: [] }));
    dispatch(loadSecurityPosts({ posts: [] }));
    dispatch(loadControllCenterPosts({ posts: [] }));
    dispatch(loadDertPosts({ posts: [] }));
    dispatch(loadRequests({ type: 'swap', requests: [] }));
    dispatch(loadRequests({ type: 'give', requests: [] }));
    localStorage.removeItem(GUEST_MODE_KEY);
    await signOut(auth);
    navigate(AppRoute.Auth);
  };

  const formattedDate = date.toLocaleDateString('he-IL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

    const getTimeTheme = () => {
    const hours = date.getHours();
    if (hours < 12) return { greeting: 'בוקר טוב', icon: '🌅', theme: 'morning' };
    if (hours < 18) return { greeting: 'צהריים טובים', icon: '☀️', theme: 'afternoon' };
    return { greeting: 'ערב טוב', icon: '🌙', theme: 'night' };
  };

  const { greeting, icon, theme } = getTimeTheme();
  const getUserName = () => {
    if (!profile) return 'אורח';
    if (profile.firstName) return `${profile.firstName}`;
    return 'אורח';
  };

  const { isAI } = useAITheme();
  const className = isAI ? 'home-ai' : 'home';

  return (
    <Layout>
      <div className={`${className} ${className}--${theme}`}>

        {/* Subtle background glow */}
        <div className={`${className}__blob`} />

        <header className={`${className}__header`}>
          <span className={`${className}__icon`}>
            {icon}
          </span>

          <h1 className={`${className}__greeting`}>
            {greeting}, {getUserName()}
          </h1>

          <p className={`${className}__time`}>
            {formattedTime}
          </p>
        </header>

        <main className={`${className}__content`}>

          <div className={`${className}__card`}>
            <div className={`${className}__card-content`}>
              <p className={`${className}__label`}>
                היום שלך
              </p>

              <p className={`${className}__date`}>
                {formattedDate}
              </p>
            </div>
          </div>

          <div
            className={`${className}__card ${className}__card--accent`}
          >
            <div className={`${className}__card-content`}>
              <p className={`${className}__label`}>
                💡 תובנה יומית
              </p>

              <p className={`${className}__tip`}>
                התמדה קטנה כל יום מובילה לשינוי משמעותי.
              </p>
            </div>
          </div>


        </main>
          {
            (user || isGuestMode) &&
              <button
                className="button button--wide button--add home__logout-button"
                onClick={handleLogout}
              >
                התנתקות
              </button>
          }
      </div>
    </Layout>
  );
}
