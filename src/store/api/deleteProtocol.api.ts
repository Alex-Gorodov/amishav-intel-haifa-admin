// optional safer version
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../services/firebase";

export const deleteApiProtocol = async ({ protocolId }: { protocolId: string }) => {
  try {
    const protocolRef = doc(db, "protocols", protocolId);
    const protocolHeaderRef = doc(db, 'protocolsHeaders', protocolId);

    const snap = await getDoc(protocolRef);

    if (!snap.exists()) return;

    await deleteDoc(protocolRef);
    await deleteDoc(protocolHeaderRef);

    return true;
  } catch (error) {
    console.error("❌ Failed to delete user:", error);
    throw error;
  }
};
