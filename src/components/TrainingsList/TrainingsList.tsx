import { CircleX, Pencil, PlusCircle, RefreshCw } from "lucide-react";
import { Training } from "../../types/Training";
import { User } from "../../types/User";
import { getIcon } from "../../utils/getIcon";
import { useEffect, useState } from "react";

interface TrainingsListProps {
  user: User;
  isCollapsed?: boolean;
}

export default function TrainingsList({user, isCollapsed = true}: TrainingsListProps) {

  const getExpirationDate = (training: Training) => {
    if (!training.executionDate) return null;

    const executionDate = training.executionDate.toDate();
    const expirationDate = new Date(executionDate);

    expirationDate.setDate(
      expirationDate.getDate() + training.validityPeriod
    );

    return expirationDate;
  };

  const trainingLabels: Record<string, string> = {
    safety: 'הדרכת בטיחות',
    roni: 'רענון רוני',
    weapon: 'רענון נשק',
    mada: 'רענון אזרה ראשונה',
    rights: 'הדרכת סמכויות',
  };

  const [openMenuKey, setOpenMenuKey] = useState<string | null>(null);

  useEffect(() => {
    const handleClick = () => setOpenMenuKey(null);
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <ul className={`trainings-list ${!isCollapsed ? 'trainings-list--uncollapsed' : ''}`}>
      {Object.keys(trainingLabels).map((key) => {
        const training = user.trainings[key as keyof typeof user.trainings];

        if (training?.executionDate) {
          return isCollapsed ? (
            <span
              key={key}
              title={`${training.title} - ${new Date(
                training.executionDate.toDate()
              ).toLocaleDateString('he-IL')}`}
            >
              {getIcon(training.title)}
            </span>
          ) : (
            <li
              className="trainings__item-wrapper"
              key={key}
            >
              <button
                className="trainings__item"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenMenuKey(prev => (prev === key ? null : key));
                }}
              >
                <span>
                  {getIcon(training.title)}
                </span>

                <span>
                  {training.title} -{" "}
                  {getExpirationDate(training)?.toLocaleDateString('he-IL')}
                </span>

              </button>
              {
                openMenuKey === key
                &&
                <div className="trainings__item-menu">
                  <button
                    className="trainings__menu-btn button button--with-icon button--edit"
                    // onClick={handleEditShift}
                  >
                    <Pencil size={18}/>
                    ערך
                  </button>
                  <button
                    className="trainings__menu-btn button button--with-icon button--change"
                    // onClick={handleChangeShift}
                  >
                    <RefreshCw size={18}/>
                    חילוף
                  </button>
                  <button
                    className="trainings__menu-btn button button--with-icon button--delete"
                    // onClick={handleDeleteClick}
                  >
                    <CircleX size={18}/>
                    מחיקה
                  </button>
                </div>
              }
            </li>
          );
        }

        return isCollapsed ? null : (
          <button
            key={key}
            className="button button--with-icon button--add"
            onClick={(e) => e.stopPropagation()}
          >
              <span>
                {getIcon(trainingLabels[key])}
              </span>
            {trainingLabels[key]}
            <PlusCircle size={18} color="#ffffff" />
          </button>
        );
      })}
    </ul>
  );
}
