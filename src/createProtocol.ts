import { doc, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import { toPascalCase } from './toCamelCase';

export const createProtocol = async (data: {
  title: string;
  content: string;
  group: string;
  images?: string[];
  headerImage?: string;
}) => {
  try {
    const createId = (group: string, title: string) =>
      group + toPascalCase(title);

    await setDoc(doc(db, 'protocols', createId(data.group, data.title)), {
      title: data.title,
      content: data.content,
      headerImage: data.headerImage || '',
      images: data.images || [],
    });

    await setDoc(doc(db, 'protocolsHeaders', createId(data.group, data.title)), {
      title: data.title,
      group: data.group,
    });

    console.log('✅ Protocol created');
  } catch (e) {
    console.error('❌ Error creating protocol:', e);
  }
};
