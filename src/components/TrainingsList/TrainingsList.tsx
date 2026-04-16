import { trainingIcons } from "../../const";
import { User } from "../../types/User";

export default function TrainingsList({user}: { user: User }) {

  const getTrainingIcon = (trainingTitle: string): string => {
    return trainingIcons[trainingTitle] || "📋";
  };

  return (

    user.trainings && Object.values(user.trainings).map((training: any) =>
      training.executionDate ? (
        <span
          key={training.id}
          title={`${training.title} - ${new Date(training.executionDate.toDate()).toLocaleDateString('he-IL')}`}
        >
          {getTrainingIcon(training.title)}
        </span>
      ) : null
    )
  );
}
