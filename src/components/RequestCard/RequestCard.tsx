import { StatusLabels } from "../../const";
import { useDarkTheme } from "../../hooks/useDarkThemeContext";
import { GiveRequestWithShift, RequestStatus, SwapRequestWithShifts } from "../../types/Request";
// ✅ Restore measurement imports
import { useRef, useEffect, useState } from "react";

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
  const { isDark, isMobile } = useDarkTheme();

  const firstUser = usersMap[0];
  const secondUser = usersMap[1];

  const isSwap = req.type === 'swap';

  const formatDate = (date: any) => {
    if (!date) return 'לא ידוע';
    const d = date.seconds ? new Date(date.seconds * 1000) : new Date(date);
    return d.toLocaleDateString('he-IL');
  };

  // ✅ Place Ref on the parent shifts comparison container for measuring ideal width
  const shiftsRef = useRef<HTMLDivElement | null>(null);

  // ✅ state to hold the ideal calculated width Multiple
  const [quantizedWidth, setQuantizedWidth] = useState<number>();

  useEffect(() => {

    if (!shiftsRef.current || !isDark) return;

    const idealWidth = shiftsRef.current.offsetWidth;
    // Round UP to the nearest multiple of 25 (e.g., 101 -> 125, 99 -> 100)
    const multipleOf25 = Math.ceil(idealWidth / 25) * 25;

    // Apply the multiple logic
    setQuantizedWidth(multipleOf25);
  }, [isDark, isMobile]); // Recalculate if theme changes

  return (
    <div className={`request-card ${isDark ? 'request-card--dark' : ''}`}>

      {/* Users and icon */}
      <div className="request-card__users">
        <span className="request-card__text request-card__text--bold request-card__text--first-user">
          {firstUser ? `${firstUser.firstName} ${firstUser.secondName}` : 'לא ידוע'}
        </span>

        <span className="request-card__icon">
          {isSwap ? '⇄' : '←'}
        </span>

        <span className="request-card__text request-card__text--bold request-card__text--second-user">
          {secondUser ? `${secondUser.firstName} ${secondUser.secondName}` : 'לא ידוע'}
        </span>
      </div>

      <div className="request-card__divider" /> {/* Added divider for semantic clarity */}

      {/* ✅ CORRECT JSX: Single Ref on container, logic applies to blocks */}
      {
        isSwap ? (
          <div className="request-card__shifts request-card__shifts--swap" ref={shiftsRef}>

            <div className="request-card__shift-block" style={isDark ? { width: isMobile ? '100%' : quantizedWidth } : undefined}>
              <span className="request-card__text request-card__text--bold">
                {req.fromShift?.post?.title || 'לא ידוע'}
              </span>
              <span className="request-card__text request-card__date">
                {formatDate(req.fromShift?.date)}
              </span>
            </div>

            <div className="request-card__shift-block" style={isDark ? { width: isMobile ? '100%' : quantizedWidth } : undefined}>
              <span className="request-card__text request-card__text--bold">
                {req.toShift?.post?.title || 'לא ידוע'}
              </span>
              <span className="request-card__text request-card__date">
                {formatDate(req.toShift?.date)}
              </span>
            </div>
          </div>
        ) : (
          <div className="request-card__shifts request-card__shifts--give" ref={shiftsRef}>

            <div className="request-card__shift-block" style={isDark ? { width: isMobile ? '100%' : quantizedWidth } : undefined}>
              <span className="request-card__text request-card__text--bold">
                {req.fromShift?.post?.title || 'לא ידוע'}
              </span>
              <span className="request-card__text request-card__date">
                {formatDate(req.fromShift?.date)}
              </span>
            </div>
          </div>
        )
      }

      <div className="request-card__divider" />

      <div className="request-card__footer">
        <span className="request-card__label-wrap">
          <span className="request-card__text request-card__label">סטטוס:</span>{' '}
          <span className={`request-card__text request-card__status-tag request-card__status-tag--${req.status}`}>
            {StatusLabels[req.status]}
          </span>
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
    </div>
  );
};
