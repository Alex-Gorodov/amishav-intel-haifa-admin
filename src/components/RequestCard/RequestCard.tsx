// import { useEffect, useRef, useState } from "react";
// import { StatusLabels } from "../../const";
// import { useAITheme } from "../../hooks/useAIContext";
// import { GiveRequestWithShift, RequestStatus, SwapRequestWithShifts } from "../../types/Request";

// interface RequestCardProps {
//   req: GiveRequestWithShift | SwapRequestWithShifts;
//   isReceived: boolean;
//   usersMap: Record<string, any>;
//   onConfirm?: (req: any) => void;
//   onReject?: (req: any) => void;
//   onDelete?: (req: any) => void;
// }

// export const RequestCard = ({
//   req,
//   isReceived,
//   usersMap,
//   onConfirm,
//   onReject,
//   onDelete,
// }: RequestCardProps) => {
//   const { isAI } = useAITheme();

//   const firstUser = usersMap[0];
//   const secondUser = usersMap[1];

//   const isSwap = req.type === 'swap';

//   const formatDate = (date: any) => {
//     if (!date) return 'לא ידוע';
//     const d = date.seconds ? new Date(date.seconds * 1000) : new Date(date);
//     return d.toLocaleDateString('he-IL');
//   };

//   const shiftRef = useRef<HTMLDivElement | null>(null);

//   const [width, setWidth] = useState<number>();

//   useEffect(() => {
//     if (!shiftRef.current) return;

//     const rawWidth = shiftRef.current.offsetWidth;
//     const adjusted = Math.ceil(rawWidth / 25) * 25;

//     setWidth(adjusted);
//   }, []);

//   return (
//     <div className={`request-card ${isAI ? 'request-card--ai' : ''}`}>

//       {/* Users and icon */}
//       <div className="request-card__users">
//         <span className="request-card__text request-card__text--bold request-card__text--first-user">
//           {firstUser ? `${firstUser.firstName} ${firstUser.secondName}` : 'לא ידוע'}
//         </span>

//         <span className="request-card__icon">
//           {isSwap ? '⇄' : '←'}
//         </span>

//         <span className="request-card__text request-card__text--bold request-card__text--second-user">
//           {secondUser ? `${secondUser.firstName} ${secondUser.secondName}` : 'לא ידוע'}
//         </span>
//       </div>

//       {
//         isSwap ? (
//           <div className="request-card__shifts">
//             {/* ✅ Wrap FIRST shift in shift-block */}
//             <div className="request-card__shift-block" ref={shiftRef} style={{ minWidth: isAI ? width : '' }}>
//               <span className="request-card__text request-card__text--bold">
//                 {req.fromShift?.post?.title || 'לא ידוע'}
//               </span>
//               {/* ✅ Add className="request-card__date" here */}
//               <span className="request-card__text request-card__date">
//                 {formatDate(req.fromShift?.date)}
//               </span>
//             </div>

//             {/* ✅ Wrap SECOND shift in shift-block */}
//             <div className="request-card__shift-block" ref={shiftRef} style={{ minWidth: isAI ? width : '' }}>
//               <span className="request-card__text request-card__text--bold">
//                 {req.toShift?.post?.title || 'לא ידוע'}
//               </span>
//               {/* ✅ Add className="request-card__date" here */}
//               <span className="request-card__text request-card__date">
//                 {formatDate(req.toShift?.date)}
//               </span>
//             </div>
//           </div>
//         ) : (
//           <div className="request-card__shifts">
//             {/* ✅ Non-swap needs wrap too, just single column */}
//             <div className="request-card__shift-block request-card__shift-block--single">
//               <span className="request-card__text request-card__text--bold">
//                 {req.fromShift?.post?.title || 'לא ידוע'}
//               </span>
//               <span className="request-card__text request-card__date">
//                 {formatDate(req.fromShift?.date)}
//               </span>
//             </div>
//           </div>
//         )
//       }


//       <span className="request-card__label-wrap">
//         <span className="request-card__text request-card__label">סטטוס:</span>{' '}
//         <span className={`request-card__text request-card__status-tag request-card__status-tag--${req.status}`}>
//           {StatusLabels[req.status]}
//         </span>
//       </span>

//       {(isReceived && req.status !== RequestStatus.Rejected) && (
//         <div className="request-card__buttons">
//           <button
//             onClick={() => onConfirm?.(req)}
//             className="request-card__button request-card__button--confirm"
//             style={{ minWidth: isAI ? width : '' }}
//           >
//             <span className="request-card__button-text">אשר</span>
//           </button>

//           <button
//             onClick={() => onReject?.(req)}
//             className="request-card__button request-card__button--reject"
//             style={{ minWidth: isAI ? width : '' }}
//           >
//             <span className="request-card__button-text">סרב</span>
//           </button>
//         </div>
//       )}

//       {req.status === RequestStatus.Rejected && (
//         <button
//           onClick={() => onDelete?.(req)}
//           className="request-card__button request-card__button--delete"
//         >
//           🗑️
//         </button>
//       )}
//     </div>
//   );
// };




import { StatusLabels } from "../../const";
import { useAITheme } from "../../hooks/useAIContext";
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
  const { isAI } = useAITheme();

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
    // We only calculate the dynamic width if AI mode is active
    if (!shiftsRef.current || !isAI) return;

    const idealWidth = shiftsRef.current.offsetWidth;
    // Round UP to the nearest multiple of 25 (e.g., 101 -> 125, 99 -> 100)
    const multipleOf25 = Math.ceil(idealWidth / 25) * 25;

    // Apply the multiple logic
    setQuantizedWidth(multipleOf25);
  }, [isAI]); // Recalculate if theme changes

  return (
    <div className={`request-card ${isAI ? 'request-card--ai' : ''}`}>

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
            {/* ✅ AI Mode injects the multiple width inline */}
            <div className="request-card__shift-block" style={isAI ? { width: quantizedWidth } : undefined}>
              <span className="request-card__text request-card__text--bold">
                {req.fromShift?.post?.title || 'לא ידוע'}
              </span>
              <span className="request-card__text request-card__date">
                {formatDate(req.fromShift?.date)}
              </span>
            </div>

            <div className="request-card__shift-block" style={isAI ? { width: quantizedWidth } : undefined}>
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
            {/* ✅ AI Mode injects the multiple width inline */}
            <div className="request-card__shift-block" style={isAI ? { width: quantizedWidth } : undefined}>
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

      <div className="request-card__divider" /> {/* Added divider for semantic clarity */}

      <div className="request-card__footer"> {/* Added semantic footer wrap */}
        <span className="request-card__label-wrap">
          <span className="request-card__text request-card__label">סטטוס:</span>{' '}
          <span className={`request-card__text request-card__status-tag request-card__status-tag--${req.status}`}>
            {StatusLabels[req.status]}
          </span>
        </span>

        {(isReceived && req.status !== RequestStatus.Rejected) && (
          <div className="request-card__buttons">
            {/* ✅ AI Mode injects the multiple width inline */}
            <button
              onClick={() => onConfirm?.(req)}
              className="request-card__button request-card__button--confirm"
              // style={isAI ? { width: quantizedWidth } : undefined}
            >
              <span className="request-card__button-text">אשר</span>
            </button>

            <button
              onClick={() => onReject?.(req)}
              className="request-card__button request-card__button--reject"
              // style={isAI ? { width: quantizedWidth } : undefined}
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
