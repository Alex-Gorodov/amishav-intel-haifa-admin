import { doc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

export const createProtocol = async (data: {
  id: string;
  title: string;
  content: string;
  group: string;
  headerImage?: string;
}) => {
  try {
    await setDoc(doc(db, 'protocols', data.id), {
      title: data.title,
      content: data.content,
      headerImage: data.headerImage || '',
      images: [],
    });

    await setDoc(doc(db, 'protocolsHeaders', data.id), {
      title: data.title,
      group: data.group,
    });

    console.log('✅ Protocol created');
  } catch (e) {
    console.error('❌ Error creating protocol:', e);
  }
};
