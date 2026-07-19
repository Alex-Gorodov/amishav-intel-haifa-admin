import { useEffect, useState } from 'react';
import Header from '../../components/Header/Header';
import { useLocation } from 'react-router-dom';
import { Colors, Titles } from '../../const';
import SideBar from '../SideBar/SideBar';
import { ChevronLeft, ChevronRight, CircleChevronLeft, CircleChevronRight } from 'lucide-react';
import ToastMessage from '../ui/ToastMessage';
import { useAITheme } from '../../hooks/useAIContext';

interface LayoutProps {
  children?: React.ReactNode;
}

export default function Layout({children}: LayoutProps) {
  const location = useLocation();
  const normalizedPath = location.pathname.replace(/\/+$/, "") || "/";
  const routeTitle = Titles[normalizedPath] ?? "אינטל חיפה | 404";

  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem('sidebar-collapsed') === 'true';
  });

  const { isAI, isMobile } = useAITheme();

  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', String(isCollapsed));
  }, [isCollapsed]);

  useEffect(() => {
    document.title = routeTitle;
  }, [normalizedPath]);

  const headerTitle = isMobile ? routeTitle.replace('אינטל חיפה ביטחון\u00A0|\u00A0', '') : routeTitle;

  return (
    <div className={`page ${isAI ? 'page--ai' : ''}`}>
      <div className={`header__wrapper ${isCollapsed ? 'header__wrapper--collapsed' : ''}`} style={{ background: isAI ? '#0a192f' : '#0068B5'}}>
        {
          !isMobile &&
          <button
          className={`bar__toggle ${isCollapsed ? 'bar__toggle--collapsed' : ''}`}
          onClick={() => setIsCollapsed(prev => !prev)}
        >
          <div className="bar__toggle-icon">
            {isCollapsed ? <CircleChevronLeft size={32} color={Colors.White}/> : <CircleChevronRight size={32} color={Colors.White}/>}
          </div>
        </button>
        }
        <Header title={headerTitle}/>
      </div>
      <main className='main'>
        <SideBar isCollapsed={isCollapsed}/>
        <div className="page__wrapper">
          {children}
        </div>
      </main>
      <ToastMessage/>
    </div>
  )
}
