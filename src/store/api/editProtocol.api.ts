import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../services/firebase";

type EditProtocolParams = {
  protocolId: string;
  title?: string;
  content?: string;
  headerImage?: string;
  images?: string[];
  group?: string;
};

export const editProtocol = async ({
  protocolId,
  title,
  content,
  headerImage,
  images,
  group,
}: EditProtocolParams) => {
  try {
    const protocolRef = doc(db, "protocols", protocolId);
    const protocolHeaderRef = doc(db, "protocolsHeaders", protocolId);

    const updateData = {
      ...(title !== undefined && { title }),
      ...(content !== undefined && { content }),
      ...(headerImage !== undefined && { headerImage }),
      ...(images !== undefined && { images }),
      ...(group !== undefined && { group }),
      updatedAt: new Date().toISOString(),
    };

    const updateHeader = {
      ...(title !== undefined && { title }),
      updatedAt: new Date().toISOString(),
    }

    // update both collections
    await Promise.all([
      updateDoc(protocolRef, updateData),
      updateDoc(protocolHeaderRef, updateHeader),
    ]);

    return true;
  } catch (error) {
    console.error("❌ Failed to edit protocol:", error);
    throw error;
  }
};
