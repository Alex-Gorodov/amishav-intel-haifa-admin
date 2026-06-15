import { getDocs } from "firebase/firestore"
import { GUEST_MODE_KEY, PROTOCOLS, PROTOCOLS_HEADERS } from "../../const"
import { AppDispatch } from "../../types/State"
import { loadProtocols } from "../actions";
import { Protocol } from "../../types/Protocol";

export const fetchProtocols = async (dispatch: AppDispatch) => {
  if (localStorage.getItem(GUEST_MODE_KEY) === "true") return;
  try {
    const dataHeaders = await getDocs(PROTOCOLS_HEADERS);
    const data = await getDocs(PROTOCOLS);

    if (localStorage.getItem(GUEST_MODE_KEY) === "true") return;

    const protocols: Protocol[] = data.docs.map(doc => {
      const protocolData = doc.data() as Protocol;
      return {
        id: doc.id,
        title: protocolData.title || '',
        headerImage: protocolData.headerImage || null,
        images: protocolData.images || [],
        content: protocolData.content,
      } as Protocol;
    })

    dispatch(loadProtocols({ protocols }))
  } catch (error) {
    console.error("Error fetching protocols:", error);
  }
};
