import { useLocation } from 'react-router-dom';
import browserHistory from '../../browser-history';
import { AppRoute } from '../../const';
import { useAITheme } from '../../context/AIThemeContext';
import { Toggle } from '../ui/Toggle';

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  const location = useLocation();
  const normalizedPath = location.pathname.replace(/\/$/, '');
  const isMainPage = normalizedPath === `${AppRoute.Root}`;
  const { isDesktop, isAI, setIsAI } = useAITheme();

  return (
    // We keep 'header' and its wrapper logic exactly as you had it
    <header className={`header ${isAI ? 'header--ai' : ''}`}>
      <div className={`header__wrapper ${/* add your collapsed logic here if needed */ ''}`}>
        <div className="header__left-section">
          {!isMainPage && (
            <button
              className="header__back-circle"
              onClick={() => browserHistory.back()}
            >
              ←
            </button>
          )}
          <p className="header__title">{title}</p>
        </div>

        {isDesktop && (
          <div className={`header__toggle-area ${isAI ? 'header__toggle-area--ai' : ''}`}>
            <Toggle
              leftLabel="AI Styled"
              rightLabel="No AI"
              value={isAI}
              onChange={() => setIsAI(!isAI)}
            />
          </div>
        )}
      </div>
    </header>
  );
}
