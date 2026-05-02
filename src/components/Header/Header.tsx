import { useLocation } from 'react-router-dom';
import browserHistory from '../../browser-history';
import { AppRoute } from '../../const';

interface HeaderProps {
  title: string;
}

export default function Header({title}: HeaderProps) {
  const location = useLocation();
  const normalizedPath = location.pathname.replace(/\/$/, '');
  const isMainPage = normalizedPath === `${AppRoute.Root}`;

  return (
    <header className="header">

      <p className="header__title">{title}</p>
      {/* {!isMainPage && (
        <button
          className="button header__back-button"
          onClick={() => browserHistory.back()}
        >
          חזור ←
        </button>
      )} */}
    </header>
  );
}
