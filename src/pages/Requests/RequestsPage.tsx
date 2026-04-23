import Layout from "../../components/Layout/Layout";
import { Toggle } from "../../components/ui/Toggle";

import React, { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/root-reducer';
import { GiveShiftRequest, RequestStatus, SwapShiftRequest } from '../../types/Request';
import { RequestCard } from '../../components/RequestCard/RequestCard';
import { confirmShiftRequest, rejectShiftRequest } from '../../store/actions';
import { approveGiveRequest, approveSwapRequest, rejectRequest } from '../../store/api/requestsActions.api';

export default function RequestsPage() {
  const dispatch = useDispatch();

  const users = useSelector((state: RootState) => state.data.users);

  const swapRequests = useSelector((state: RootState) => state.data.swapRequests);
  const giveRequests = useSelector((state: RootState) => state.data.giveRequests);

  const [active, setActive] = useState<'give' | 'swap'>('swap')

  const handleToggleChange = (isGive: boolean) => {
    setActive(isGive ? 'swap' : 'give');
  };

  const requestsWithShifts = useMemo(() => {
    const source = active === 'swap' ? swapRequests : giveRequests;

    return source.map(req => {
      if (req.type === 'swap') {
        const firstShift = users.flatMap(u => u.shifts || []).find(s => s.id === req.firstShiftId) || null;
        const secondShift = users.flatMap(u => u.shifts || []).find(s => s.id === req.secondShiftId) || null;
        return { ...req, fromShift: firstShift, toShift: secondShift };
      } else {
        const firstShift = users.flatMap(u => u.shifts || []).find(s => s.id === req.shiftId) || null;
        return { ...req, fromShift: firstShift };
      }
    });
  }, [active, swapRequests, giveRequests, users]);

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

  return (
    <Layout>
      <div>
        <div className="page__header page__header--requests">
          <h1 className="page__title">בקשות לשינויים</h1>
          <Toggle value={active === 'swap'} leftLabel="בקשות החלפה" rightLabel="בקשות מסירה" onChange={handleToggleChange}/>
        </div>

        <div className="requests__grid">
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
