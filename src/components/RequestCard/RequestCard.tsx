import { StatusLabels } from "../../const";
import { GiveRequestWithShift, RequestStatus, SwapRequestWithShifts } from "../../types/Request";

interface RequestCardProps {
  req: GiveRequestWithShift | SwapRequestWithShifts;
  isReceived: boolean;
  usersMap: Record<string, any>;
  onConfirm?: (req: any) => void;
  onReject?: (req: any) => void;
  onDelete?: (req: any) => void;
}

export const RequestCard = ({
  req,
  isReceived,
  usersMap,
  onConfirm,
  onReject,
  onDelete,
}: RequestCardProps) => {
  const firstUser = usersMap[0];
  const secondUser = usersMap[1];

  const isSwap = req.type === 'swap';

  return (
    <div className="request-card">

      {/* Users and icon */}
      <div className="request-card__users">
        <span className="request-card__text request-card__text--bold">
          {firstUser ? `${firstUser.firstName} ${firstUser.secondName}` : 'לא ידוע'}
        </span>

        <span className="request-card__icon">
          {isSwap ? '⇄' : '←'}
        </span>

        <span className="request-card__text request-card__text--bold">
          {secondUser ? `${secondUser.firstName} ${secondUser.secondName}` : 'לא ידוע'}
        </span>
      </div>

      {isSwap ? (
        <div className="request-card__shifts">
          <div className="request-card__shift">
            <span className="request-card__text request-card__text--bold">
              {req.fromShift?.post?.title || 'לא ידוע'}
            </span>
            <span className="request-card__text">
              {req.fromShift?.date?.toDate().toLocaleDateString('he-IL')}
            </span>
          </div>
          <div className="request-card__shift">
            <span className="request-card__text request-card__text--bold">
              {req.toShift?.post?.title || 'לא ידוע'}
            </span>
            <span className="request-card__text">
              {req.toShift?.date?.toDate().toLocaleDateString('he-IL')}
            </span>
          </div>
        </div>
      ) : (
        <div className="request-card__shifts">
          <div className="request-card__shift">
            <span className="request-card__text request-card__text--bold">
              {req.fromShift?.post?.title || 'לא ידוע'}
            </span>
            <span className="request-card__text">
              {req.fromShift?.date?.toDate().toLocaleDateString('he-IL')}
            </span>
          </div>
        </div>
      )}

      <span className="request-card__text">
        סטטוס: {StatusLabels[req.status]}
      </span>

      {(isReceived && req.status !== RequestStatus.Rejected) && (
        <div className="request-card__buttons">
          <button
            onClick={() => onConfirm?.(req)}
            className="request-card__button request-card__button--confirm"
          >
            <span className="request-card__button-text">אשר</span>
          </button>

          <button
            onClick={() => onReject?.(req)}
            className="request-card__button request-card__button--reject"
          >
            <span className="request-card__button-text">סרב</span>
          </button>
        </div>
      )}

      {req.status === RequestStatus.Rejected && (
        <button
          onClick={() => onDelete?.(req)}
          className="request-card__button request-card__button--delete"
        >
          🗑️
        </button>
      )}
    </div>
  );
};
