import { useEffect, useState } from 'react';
import Header from '../../components/Header/Header';
import { useLocation } from 'react-router-dom';
import { Titles } from '../../const';
import SideBar from '../SideBar/SideBar';
import { ChevronLeft, ChevronRight, CircleChevronLeft, CircleChevronRight } from 'lucide-react';
import ToastMessage from '../ui/ToastMessage';

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
    console.log('norm: ', normalizedPath)
    console.log('routeTitle: ', routeTitle)
  }, [normalizedPath]);

  return (
    <div className="page">
      <div className={`header__wrapper ${isCollapsed ? 'header__wrapper--collapsed' : ''}`}>
        <button
          className={`bar__toggle ${isCollapsed ? 'bar__toggle--collapsed' : ''}`}
          onClick={() => setIsCollapsed(prev => !prev)}
        >
          <div className="bar__toggle-icon">
            {isCollapsed ? <CircleChevronLeft size={32} color={'#000000'}/> : <CircleChevronRight size={32} color={'#000000'}/>}
          </div>
        </button>
        <Header title={routeTitle}/>
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
