import { CircleX, Pencil, PlusCircle, RefreshCw } from "lucide-react";
import { Training } from "../../types/Training";
import { User } from "../../types/User";
import { getIcon } from "../../utils/getIcon";
import React, { useEffect, useState } from "react";
import { setEmployeeData } from "../../store/api/setEmployeeData.api";
import { Timestamp } from "firebase/firestore";
import { TRAINING_SCHEMA, TrainingKey } from "../../const";
import { fetchUsers } from "../../store/api/fetchUsers.api";
import { useDispatch } from "react-redux";
import { getFormattedTimestamp, normalizeDate } from "../../utils/dateUtils";
import { useAITheme } from "../../hooks/useAIContext";

interface TrainingsListProps {
  user: User;
  isCollapsed?: boolean;
}

export default function TrainingsList({user, isCollapsed = true}: TrainingsListProps) {

  const dispatch = useDispatch();

  const { isAI } = useAITheme();

  const [iconColor, setIconColor] = useState('');

  useEffect(() => {
    setIconColor(isAI ? '#0abcc7' : '#000000')
  }, [ isAI ])

  const getExpirationDate = (training: Training) => {
    if (!training.updatingDate) return null;

    const updatingDate = normalizeDate(training.updatingDate);
    const expirationDate = new Date(updatingDate);

    expirationDate.setDate(
      expirationDate.getDate() + training.validityPeriod
    );

    return expirationDate;
  };

  const trainingLabels: Record<string, string> = {
    safety: 'הדרכת בטיחות',
    roni: 'רענון רוני',
    weapon: 'רענון נשק',
    mada: 'רענון עזרה ראשונה',
    rights: 'הדרכת סמכויות',
  };

  const [openMenuKey, setOpenMenuKey] = useState<string | null>(null);

  const [datePickerKey, setDatePickerKey] = useState<TrainingKey | null>(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteKey, setDeleteKey] = useState<TrainingKey | null>(null);

  useEffect(() => {
    const handleClick = () => setOpenMenuKey(null);
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  const handleSetTraining = (e: React.MouseEvent, key: TrainingKey) => {
    e.stopPropagation()
    setDatePickerKey(key)
  }


  const handleEditData = (e: React.MouseEvent, key: TrainingKey) => {
    e.stopPropagation();

    const training = user.trainings[key];

    setOpenMenuKey(null);
    setDatePickerKey(key);

    setChosenDate(
      training?.updatingDate
      ? normalizeDate(training.updatingDate)
          .toISOString()
          .split("T")[0]
      : null
        );
  };

  const handleDeleteData = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!deleteKey) return;

    await setEmployeeData(user.id, {
      [`trainings.${deleteKey}.updatingDate`]: null,
      [`trainings.${deleteKey}.title`]: TRAINING_SCHEMA[deleteKey].title,
      [`trainings.${deleteKey}.validityPeriod`]: TRAINING_SCHEMA[deleteKey].validityPeriod,
      [`trainings.${deleteKey}.id`]: `${user.id}-${deleteKey}`,
    });

    await fetchUsers(dispatch);

    setIsDeleteOpen(false);
    setDeleteKey(null);
  };

  const [chosenDate, setChosenDate] = useState<string | null>(null);

  const renderDatePicker = () => {
    if (!datePickerKey) return null;

    return (
      <div
        className="form__overlay"
        onClick={(e) => {
          e.stopPropagation();
          setDatePickerKey(null);
        }}
      >
        <div
          className="form__modal form__modal--dynamic"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="form__wrapper">
            <h3 className="form__title">
              {trainingLabels[datePickerKey]}
            </h3>

            <label
              htmlFor="training-date"
              className="form__label form__label--secondary"
            >
              תאריך ביצוע
            </label>

            <input
              id="training-date"
              type="date"
              className="form__input"
              onChange={(e) => setChosenDate(e.target.value)}
            />

            <div className="buttons-wrapper">
             <button
              className="button button--with-icon button--add"
              onClick={async (e) => {
                e.stopPropagation();

                if (!chosenDate || !datePickerKey) return;

                await setEmployeeData(user.id, {
                  [`trainings.${datePickerKey}.updatingDate`]:
                    Timestamp.fromDate(new Date(chosenDate)),

                  [`trainings.${datePickerKey}.title`]:
                    TRAINING_SCHEMA[datePickerKey].title,

                  [`trainings.${datePickerKey}.validityPeriod`]:
                    TRAINING_SCHEMA[datePickerKey].validityPeriod,

                  [`trainings.${datePickerKey}.id`]:
                    `${user.id}-${datePickerKey}`,
                });

                fetchUsers(dispatch)

                setDatePickerKey(null);
                setChosenDate(null);
              }}
            >
              שמור
            </button>

              <button
                className="button button--cancel"
                onClick={() => setDatePickerKey(null)}
              >
                ביטול
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <ul className={`trainings-list ${!isCollapsed ? 'trainings-list--uncollapsed' : ''} ${isAI ? 'trainings--ai' : ''}`}>
        {Object.keys(trainingLabels).map((key) => {
          const training = user.trainings[key as keyof typeof user.trainings];

          if (training?.updatingDate) {
            return isCollapsed ? (
              <span
                style={{display: 'flex'}}
                key={key}
                title={`${training.title} - ${getFormattedTimestamp(training.updatingDate)}`}
              >
                {getIcon(training.title, iconColor)}
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
                  <span
                    style={{display: 'flex'}}
                  >
                    {getIcon(training.title, iconColor)}
                  </span>

                  <span style={{ color: iconColor}}>
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
                      onClick={(e) => handleEditData(e, key as TrainingKey)}
                    >
                      <Pencil size={18}/>
                      ערך
                    </button>
                    <button
                      className="trainings__menu-btn button button--with-icon button--delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuKey(null);
                        setDeleteKey(key as TrainingKey);
                        setIsDeleteOpen(true); // ✅ THIS IS REQUIRED
                      }}
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
              onClick={(e) => handleSetTraining(e, key as TrainingKey)}
            >
                <span
                  style={{display: 'flex'}}
                >
                  {getIcon(trainingLabels[key], "#ffffff")}
                </span>
              {trainingLabels[key]}
              <PlusCircle size={18} color={"#ffffff"} />
            </button>
          );
        })}
      </ul>
      {
        renderDatePicker()
      }
      {isDeleteOpen && (
        <div className="form__overlay" onClick={() => {
            setIsDeleteOpen(false)
          }
        }>
          <div className="form__modal form__modal--dynamic">
            <div
              className="form__wrapper"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="buttons-wrapper">
                <button
                  className="button button--delete"
                  onClick={handleDeleteData}
                >
                  מחק
                </button>

                <button
                  className="button button--cancel"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsDeleteOpen(false);
                    setDeleteKey(null);
                    setOpenMenuKey(null);
                  }}
                >
                  ביטול
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
