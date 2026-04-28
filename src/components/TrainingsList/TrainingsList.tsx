import { Training } from "../../types/Training";
import { User } from "../../types/User";
import { getIcon } from "../../utils/getIcon";

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

  return (
    <ul className={`trainings-list ${!isCollapsed ? 'trainings-list--uncollapsed' : ''}`}>
      {
        user.trainings && Object.values(user.trainings).map((training: Training) => {
          return (
            training.executionDate ? (

                isCollapsed
                ?
                <span
                  key={training.id}
                  title={`${training.title} - ${new Date(training.executionDate.toDate()).toLocaleDateString('he-IL')}`}
                >
                  {getIcon(training.title)}
                </span>
                :
                <li className="trainings-list__item" key={training.id}>
                  <span
                    key={training.id}
                    title={`${training.title} - ${new Date(training.executionDate.toDate()).toLocaleDateString('he-IL')}`}
                  >
                    {getIcon(training.title)}
                  </span>
                  <span>{training.title} - {getExpirationDate(training)?.toLocaleDateString('he-IL')}</span>
                </li>

            ) : null

          )
        }
        )
      }
    </ul>
  );
}
