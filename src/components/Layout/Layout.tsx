import React, { useEffect } from 'react'
import Header from '../../components/Header/Header'
import ExcellentIcon from '../../assets/img/icons/Excellent-header-icon.png'
import ExcellentTitle from '../../assets/img/icons/Excellent-title.svg'
import { useLocation } from 'react-router-dom';
import { Titles } from '../../const';

interface LayoutProps {
  children?: React.ReactNode;
}

export default function Layout({children}: LayoutProps) {
  const location = useLocation();
  const routeTitle = Titles[location.pathname] ?? "Excellent | 404";

  useEffect(() => {
    document.title = routeTitle;
  }, [routeTitle]);

  return (
    <div className="page">
      <div className="page__content">
        <Header/>
        <main className='main'>
          {children}
        </main>
      </div>
    </div>
  )
}
