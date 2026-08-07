import { useLocation } from 'react-router-dom';
import browserHistory from '../../browser-history';
import { AppRoute } from '../../const';
import { Toggle } from '../ui/Toggle';
import { BrainCircuit, Circle, Paintbrush, Power } from 'lucide-react';
import { useDarkTheme } from '../../hooks/useDarkThemeContext';

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  const { isMobile, isDark, setIsDark } = useDarkTheme();

  return (
    <header className={`header ${isDark ? 'header--dark' : ''}`}>
      <div className="header__inner-content">
        <div className="header__left-section">
          <p className="header__title">{title}</p>
        </div>

        <div className={`header__toggle-area ${isDark ? 'header__toggle-area--dark' : ''}`}>
          <Toggle
            leftLabel={isMobile ?  <BrainCircuit size={18}/> : "Dark"}
            rightLabel={isMobile ?  <Paintbrush size={18}/> : "Light"}
            value={isDark}
            onChange={() => setIsDark(!isDark)}
            // className='visually-hidden'
          />
        </div>

      </div>
    </header>
  );
}
