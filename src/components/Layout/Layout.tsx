import React, { useEffect } from 'react'
import Header from '../../components/Header/Header'
import ExcellentIcon from '../../assets/img/icons/Excellent-header-icon.png'
import ExcellentTitle from '../../assets/img/icons/Excellent-title.svg'
import { useLocation } from 'react-router-dom';
import { Titles } from '../../const';
import SideBar from '../SideBar/SideBar';

interface LayoutProps {
  children?: React.ReactNode;
}

export default function Layout({children}: LayoutProps) {
  const location = useLocation();
  const normalizedPath = location.pathname.replace(/\/$/, '');
  const routeTitle = Titles[normalizedPath] ?? "עמישב אינטל חיפה | 404";

  useEffect(() => {
    document.title = routeTitle;
  }, [normalizedPath]);

  return (
    <div className="page">
        <Header/>
        <main className='main'>
          <SideBar/>
      <div className="page__content">
          {children}
      </div>
        </main>
    </div>
  )
}
