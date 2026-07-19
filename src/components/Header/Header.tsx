import { useLocation } from 'react-router-dom';
import browserHistory from '../../browser-history';
import { AppRoute } from '../../const';
import { Toggle } from '../ui/Toggle';
import { useAITheme } from '../../hooks/useAIContext';
import { BrainCircuit, Circle, Paintbrush, Power } from 'lucide-react';

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  const { isMobile, isAI, setIsAI } = useAITheme();

  return (
    <header className={`header ${isAI ? 'header--ai' : ''}`}>
      <div className="header__inner-content">
        <div className="header__left-section">
          <p className="header__title">{title}</p>
        </div>

        <div className={`header__toggle-area ${isAI ? 'header__toggle-area--ai' : ''}`}>
          <Toggle
            leftLabel={isMobile ?  <BrainCircuit size={18}/> : "AI styled"}
            rightLabel={isMobile ?  <Paintbrush size={18}/> : "No AI"}
            value={isAI}
            onChange={() => setIsAI(!isAI)}
            // className='visually-hidden'
          />
        </div>

      </div>
    </header>
  );
}
