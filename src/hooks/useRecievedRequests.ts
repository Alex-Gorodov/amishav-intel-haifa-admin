import { useSelector } from "react-redux";
import { useMemo } from "react";
import { RootState } from "../store/root-reducer";
import { getRequestsWithShifts } from "../utils/getRequestsWithShifts";

export default function useHasReceivedRequests() {
  const users = useSelector((state: RootState) => state.data.users);
  const allGiveRequests = useSelector((state: RootState) => state.data.giveRequests)
  const allSwapRequests = useSelector((state: RootState) => state.data.swapRequests)

  const allRequests = useMemo(() => {
    return getRequestsWithShifts(
      [...allGiveRequests, ...allSwapRequests],
      users
    );
  }, [allGiveRequests, allSwapRequests, users]);

  return {
    allRequests
  }
}
