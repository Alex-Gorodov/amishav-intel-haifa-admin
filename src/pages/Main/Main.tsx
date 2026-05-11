import { useEffect, useState } from 'react';
import Layout from '../../components/Layout/Layout';
import { useAITheme } from '../../hooks/useAIContext';

export default function App() {

  const [date, setDate] = useState(new Date());
  const formattedTime = date.toLocaleTimeString('he-IL', {
    hour: '2-digit',
    minute: '2-digit',
  });


  useEffect(() => {
    const interval = setInterval(() => {
      setDate(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formattedDate = date.toLocaleDateString('he-IL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

    const getTimeTheme = () => {
    const hours = date.getHours();
    if (hours < 12) return { greeting: 'בוקר טוב', icon: '🌅', theme: 'morning' };
    if (hours < 18) return { greeting: 'צהריים טובים', icon: '☀️', theme: 'afternoon' };
    return { greeting: 'ערב טוב', icon: '🌙', theme: 'night' };
  };

  const { greeting, icon, theme } = getTimeTheme();

  const { isAI } = useAITheme();
  const className = isAI ? 'home-ai' : 'home';

  return (
    <Layout>
      <div className={`${className} ${className}--${theme}`}>

        {/* Subtle background glow */}
        <div className={`${className}__blob`} />

        <header className={`${className}__header`}>
          <span className={`${className}__icon`}>
            {icon}
          </span>

          <h1 className={`${className}__greeting`}>
            {greeting}
          </h1>

          <p className={`${className}__time`}>
            {formattedTime}
          </p>
        </header>

        <main className={`${className}__content`}>

          <div className={`${className}__card`}>
            <div className={`${className}__card-content`}>
              <p className={`${className}__label`}>
                היום שלך
              </p>

              <p className={`${className}__date`}>
                {formattedDate}
              </p>
            </div>
          </div>

          <div
            className={`${className}__card ${className}__card--accent`}
          >
            <div className={`${className}__card-content`}>
              <p className={`${className}__label`}>
                💡 תובנה יומית
              </p>

              <p className={`${className}__tip`}>
                התמדה קטנה כל יום מובילה לשינוי משמעותי.
              </p>
            </div>
          </div>

        </main>
      </div>
    </Layout>
  );
}
