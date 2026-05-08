import { useEffect, useState } from 'react';
import Layout from '../Layout/Layout';

export default function App() {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setDate(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getGreeting = () => {
    const hours = date.getHours();

    if (hours < 12) return 'בוקר טוב ☀️';
    if (hours < 18) return 'צהריים טובים 🌤️';
    return 'ערב טוב 🌙';
  };

  const formattedDate = date.toLocaleDateString('he-IL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <Layout>
      <div className="home">
        <h1 className="home__greeting">{getGreeting()}</h1>

        <div className="home__card">
          <p className="home__label">תאריך</p>
          <p className="home__date">{formattedDate}</p>
        </div>

        <div className="home__card">
          <p className="home__label">💡 טיפ להיום</p>
          <p className="home__tip">
            התמדה קטנה כל יום = תוצאה גדולה
          </p>
        </div>
      </div>
    </Layout>
  );
}

