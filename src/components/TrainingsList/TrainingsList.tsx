import { trainingIcons } from "../../const";
import { User } from "../../types/User";

interface TrainingsListProps {
  user: User;
  isCollapsed?: boolean;
}

export default function TrainingsList({user, isCollapsed = true}: TrainingsListProps) {

  const getTrainingIcon = (trainingTitle: string): string => {
    return trainingIcons[trainingTitle] || "📋";
  };

  return (
    <div className={`trainings-list ${!isCollapsed ? 'trainings-list--uncollapsed' : ''}`}>
      {
        user.trainings && Object.values(user.trainings).map((training: any) =>
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
                <span>{training.title} - {new Date(training.executionDate.toDate()).toLocaleDateString('he-IL')}</span>
              </div>

          ) : null
        )
      }
    </div>
  );
}
