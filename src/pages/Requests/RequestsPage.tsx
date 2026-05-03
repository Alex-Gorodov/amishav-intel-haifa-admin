import Layout from "../../components/Layout/Layout";
import { Toggle } from "../../components/ui/Toggle";

import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/root-reducer';
import { GiveShiftRequest, RequestStatus, SwapShiftRequest } from '../../types/Request';
import { RequestCard } from '../../components/RequestCard/RequestCard';
import { confirmShiftRequest, rejectShiftRequest } from '../../store/actions';
import { approveGiveRequest, approveSwapRequest, deleteRequest, rejectRequest } from '../../store/api/requestsActions.api';

export default function RequestsPage() {
  const dispatch = useDispatch();

  const users = useSelector((state: RootState) => state.data.users);

  const swapRequests = useSelector((state: RootState) => state.data.swapRequests);
  const giveRequests = useSelector((state: RootState) => state.data.giveRequests);

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

    // Build shifts map once
    const shiftsMap = new Map(
      users
        .flatMap(user => user.shifts || [])
        .map(shift => [shift.id, shift])
    );

    return source
      .map(req => {
        if (req.type === 'swap') {
          const firstShift = shiftsMap.get(req.firstShiftId) || null;
          const secondShift = shiftsMap.get(req.secondShiftId) || null;

          return {
            ...req,
            fromShift: firstShift,
            toShift: secondShift,
          };
        } else {
          const firstShift = shiftsMap.get(req.shiftId) || null;

          return {
            ...req,
            fromShift: firstShift,
          };
        }
      })
      .filter(req => {
        // GIVE REQUEST
        if (req.type === 'give') {
          if (!req.fromShift) return false;

          const shiftDate = req.fromShift.date;

          return shiftDate >= new Date();
        }

        // SWAP REQUEST
        if (!req.fromShift || !req.toShift) return false;

        const firstDate = req.fromShift.date;
        const secondDate = req.toShift.date;

        // Keep request only if BOTH shifts are still upcoming
        return firstDate >= new Date() && secondDate >= new Date();
      });
  }, [active, swapRequests, giveRequests, users]);

  useEffect(() => {
    const shiftsMap = new Map(
      users
        .flatMap(user => user.shifts || [])
        .map(shift => [shift.id, shift])
    );

    const checkAndDeleteExpiredRequests = async () => {
      const allRequests = [...swapRequests, ...giveRequests];

      for (const req of allRequests) {
        let shouldDelete = false;

        if (req.type === 'give') {
          const shift = shiftsMap.get(req.shiftId);

          if (!shift) {
            shouldDelete = true;
          } else {
            shouldDelete = shift.date < new Date();
          }
        }

        if (req.type === 'swap') {
          const firstShift = shiftsMap.get(req.firstShiftId);
          const secondShift = shiftsMap.get(req.secondShiftId);

          if (!firstShift || !secondShift) {
            shouldDelete = true;
          } else {
            shouldDelete =
              firstShift.date < new Date() ||
              secondShift.date < new Date();
          }
        }

        if (shouldDelete) {
          try {
            await deleteRequest(req);

            // optional redux cleanup
            dispatch(rejectShiftRequest({ request: req }));

            console.log(`Deleted expired request ${req.id}`);
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
      <div>
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
