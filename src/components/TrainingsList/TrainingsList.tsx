import { trainingIcons } from "../../const";
import { Training } from "../../types/Training";
import { User } from "../../types/User";

interface TrainingsListProps {
  user: User;
  isCollapsed?: boolean;
}

export default function TrainingsList({user, isCollapsed = true}: TrainingsListProps) {

  const getTrainingIcon = (trainingTitle: string): string => {
    return trainingIcons[trainingTitle] || "📋";
  };

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
    <div className={`trainings-list ${!isCollapsed ? 'trainings-list--uncollapsed' : ''}`}>
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
                  {getTrainingIcon(training.title)}
                </span>
                :
                <div className="trainings-list__item" key={training.id}>
                  <span
                    key={training.id}
                    title={`${training.title} - ${new Date(training.executionDate.toDate()).toLocaleDateString('he-IL')}`}
                  >
                    {getTrainingIcon(training.title)}
                  </span>
                  <span>{training.title} - {getExpirationDate(training)?.toLocaleDateString('he-IL')}</span>
                </div>

            ) : null

          )
        }
        )
      }
    </div>
  );
}
