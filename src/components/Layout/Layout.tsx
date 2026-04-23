import { useEffect, useState } from 'react';
import Header from '../../components/Header/Header';
import { useLocation } from 'react-router-dom';
import { Titles } from '../../const';
import SideBar from '../SideBar/SideBar';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface LayoutProps {
  children?: React.ReactNode;
}

export default function Layout({children}: LayoutProps) {
  const location = useLocation();
  const normalizedPath = location.pathname.replace(/\/$/, '');
  const routeTitle = Titles[normalizedPath] ?? "עמישב אינטל חיפה | 404";

  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem('sidebar-collapsed') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', String(isCollapsed));
  }, [isCollapsed]);

  useEffect(() => {
    document.title = routeTitle;
  }, [normalizedPath]);

  return (
    <div className="page">
      <div className="header__wrapper" style={{paddingRight: isCollapsed ? '72px' : '142px'}}>
        <button
          className={`bar__toggle ${isCollapsed ? 'bar__toggle--collapsed' : ''}`}
          onClick={() => setIsCollapsed(prev => !prev)}
        >
          <div className="bar__toggle-icon">
            {isCollapsed ? <ChevronLeft size={18}/> : <ChevronRight size={18}/>}
          </div>
        </button>
        <Header/>
      </div>
      <main className='main'>
        <SideBar isCollapsed={isCollapsed}/>
        <div className="page__content">
            {children}
        </div>
      </main>
    </div>
  )
}
