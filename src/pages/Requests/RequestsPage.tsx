import Layout from "../../components/Layout/Layout";
import { Toggle } from "../../components/ui/Toggle";

import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/root-reducer';
import { GiveShiftRequest, RequestStatus, SwapShiftRequest } from '../../types/Request';
import { RequestCard } from "../../components/RequestCard/RequestCard";
import { confirmShiftRequest, rejectShiftRequest } from '../../store/actions';
import { approveGiveRequest, approveSwapRequest, deleteRequest, rejectRequest } from '../../store/api/requestsActions.api';
import { useAITheme } from "../../hooks/useAIContext";
import { normalizeDate } from "../../utils/dateUtils";

export default function RequestsPage() {
  const dispatch = useDispatch();
  const { isAI } = useAITheme();

  const users = useSelector((state: RootState) => state.data.users);

  const swapRequests = useSelector((state: RootState) => state.data.swapRequests);
  const giveRequests = useSelector((state: RootState) => state.data.giveRequests);

  console.log('swap', swapRequests);
  console.log('give', giveRequests);


  const [active, setActive] = useState<'give' | 'swap'>('swap')

  const handleToggleChange = (isGive: boolean) => {
    setActive(isGive ? 'swap' : 'give');
  };

  const handleConfirm = async (req: SwapShiftRequest | GiveShiftRequest) => {
    try {
      if (req.type === "give") {
        await approveGiveRequest(req);
      } else {
        await approveSwapRequest(req);
      }
      dispatch(confirmShiftRequest({ request: req }));
    } catch (err: any) {
      console.error('Error request confirming: ', err);
    }
  };

  const handleReject = async (req: SwapShiftRequest | GiveShiftRequest) => {
    try {
      await rejectRequest(req);
      dispatch(rejectShiftRequest({ request: req }));
    } catch (err: any) {
      console.error('Error request rejecting: ', err);
    }
  };

  const requestsWithShifts = useMemo(() => {
  const source = active === 'swap' ? swapRequests : giveRequests;

  // 1. Build shifts map once
  const shiftsMap = new Map(
    users
      .flatMap(user => user.shifts || [])
      .map(shift => [shift.id, shift])
  );

  // Helper to ensure we have a valid timestamp for comparison
  const getTimestamp = (dateValue: any) => {
    if (!dateValue) return 0;
    // Handle Firebase Timestamps (.toDate()) or standard Date/Strings
    const date = dateValue.seconds ? new Date(dateValue.seconds * 1000) : new Date(dateValue);
    return date.getTime();
  };

  // Get start of today (00:00:00) to avoid filtering out today's shifts
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const comparisonTime = startOfToday.getTime();

  return source
    .map(req => {
      if (req.type === 'swap') {
        const firstShift = shiftsMap.get((req as SwapShiftRequest).firstShiftId) || null;
        const secondShift = shiftsMap.get((req as SwapShiftRequest).secondShiftId) || null;

        return {
          ...req,
          fromShift: firstShift,
          toShift: secondShift,
        };
      } else {
        const firstShift = shiftsMap.get((req as GiveShiftRequest).shiftId) || null;

        return {
          ...req,
          fromShift: firstShift,
        };
      }
    })
    .filter(req => {
      // If we couldn't find the associated shift in the users array, don't show the request
      if (!req.fromShift) return false;

      // GIVE REQUEST logic
      if (req.type === 'give') {
        return getTimestamp(req.fromShift.date) >= comparisonTime;
      }

      // SWAP REQUEST logic
      if (req.type === 'swap') {
        if (!req.toShift) return false;

        const firstDateTs = getTimestamp(req.fromShift.date);
        const secondDateTs = getTimestamp(req.toShift.date);

        // Show only if BOTH shifts are today or in the future
        return firstDateTs >= comparisonTime && secondDateTs >= comparisonTime;
      }

      return false;
    });
}, [active, swapRequests, giveRequests, users]);

  function combineDateAndTime(
    date: Date | any,
    time: string
  ): Date {
    const normalizedDate = normalizeDate(date);

    const [hours, minutes] = time.split(":").map(Number);

    const combined = new Date(normalizedDate);

    combined.setHours(hours);
    combined.setMinutes(minutes);
    combined.setSeconds(0);
    combined.setMilliseconds(0);

    return combined;
  }

  useEffect(() => {
    const shiftsMap = new Map(
      users
        .flatMap(user => user.shifts || [])
        .map(shift => [shift.id, shift])
    );

    const checkAndDeleteExpiredRequests = async () => {
      const allRequests = [...swapRequests, ...giveRequests];
      const currentTime = new Date().getTime();

      for (const req of allRequests) {
        let shouldDelete = false;

        if (req.type === 'give') {
          const shift = shiftsMap.get(req.shiftId);

          if (!shift) {
            shouldDelete = true;
          } else {
            const shiftStart = combineDateAndTime(
              shift.date,
              shift.startTime
            ).getTime();

            shouldDelete = shiftStart < currentTime;
          }
        }

        if (req.type === 'swap') {
          const firstShift = shiftsMap.get(req.firstShiftId);
          const secondShift = shiftsMap.get(req.secondShiftId);

          if (!firstShift || !secondShift) {
            shouldDelete = true;
          } else {
            const firstShiftStart = combineDateAndTime(
              firstShift.date,
              firstShift.startTime
            ).getTime();

            const secondShiftStart = combineDateAndTime(
              secondShift.date,
              secondShift.startTime
            ).getTime();

            console.log(firstShiftStart, secondShiftStart)

            shouldDelete =
              firstShiftStart < currentTime ||
              secondShiftStart < currentTime;
          }
        }


        if (shouldDelete) {
          try {
            await deleteRequest(req);

            // optional redux cleanup
            dispatch(rejectShiftRequest({ request: req }));

          } catch (err) {
            console.error('Failed deleting expired request:', err);
          }
        }
      }
    };

    checkAndDeleteExpiredRequests();
  }, [swapRequests, giveRequests, users, dispatch]);

  return (
    <Layout>
      <div className={`${isAI ? 'page--ai' : ''}`}>

        <div className="page__header page__header--requests">
          <Toggle value={active === 'swap'} leftLabel="בקשות החלפה" rightLabel="בקשות מסירה" onChange={handleToggleChange}/>
        </div>

        <div className="page__content requests__grid">
          {
            requestsWithShifts.length === 0 && (
              <p className="requests__message">לא נמצאו בקשות {active === 'swap' ? 'להחלפה' : 'למסירה'}</p>
            )
          }
          {requestsWithShifts.map(req => {
            const firstUser = users.find(u => u.id === req.firstUserId);
            const secondUser = users.find(u => u.id === req.secondUserId);

            return (
              <RequestCard
                key={req.id}
                req={req}
                isReceived={req.status === RequestStatus.PendingAdmin}
                usersMap={[firstUser, secondUser]}
                onConfirm={handleConfirm}
                onReject={handleReject}
              />
            );
          })}
        </div>
      </div>
    </Layout>
  )
}
