import { useLocation } from 'react-router-dom';
import browserHistory from '../../browser-history';
import { AppRoute } from '../../const';
import { Toggle } from '../ui/Toggle';
import { useAITheme } from '../../hooks/useAIContext';

interface HeaderProps {
  title: string;
  isAI: boolean;      // Added prop
  setIsAI: (val: boolean) => void; // Added prop
}

export default function Header({ title, isAI, setIsAI }: HeaderProps) {
  const { isDesktop } = useAITheme();

  return (
    <header className={`header ${isAI ? 'header--ai' : ''}`}>
      <div className="header__inner-content">
        <div className="header__left-section">
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
