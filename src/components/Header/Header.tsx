import { useLocation } from 'react-router-dom';
import browserHistory from '../../browser-history';
import { AppRoute } from '../../const';

export default function Header() {
  const location = useLocation();
  const normalizedPath = location.pathname.replace(/\/$/, '');
  const isMainPage = normalizedPath === `${AppRoute.Root}`;

  return (
    <header className="header">
      <p className="header__title">מערכת ניהול - עמישב אינטל חיפה</p>
      {!isMainPage && (
        <button
          className="button header__back-button"
          onClick={() => browserHistory.back()}
        >
          חזור ←
        </button>
      )}
    </header>
  );
}
