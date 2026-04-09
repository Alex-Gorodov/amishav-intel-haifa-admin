import React, { useState } from 'react';
import { createProtocol } from './createProtocol';
import { useImageUpload } from './useImageUpload';

type Group = 'controller' | 'emergency' | 'security';

export default function CreateProtocolForm() {

  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [group, setGroup] = useState<Group | ''>('');

  const [headerImage, setHeaderImage] = useState('');

  const [images, setImages] = useState<string[]>([]);

  const { handlePickImage: uploadHeader } = useImageUpload((url) => {
    setHeaderImage(url);
  });

  const { handlePickImage: uploadImages, uploading: uploadingImages  } = useImageUpload((url) => {
    setImages(prev => [...prev, url]);
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if ( !title || !content || !group) {
      alert('Fill required fields');
      return;
    }

    console.log('SENDING:', {
      headerImage,
      images,
    });

    await createProtocol({
      title,
      content,
      headerImage,
      images,
      group,
    });

    alert('Created!');
    
  };

  return (
    <form onSubmit={handleSubmit} style={styles.container}>

        <input
          id='title'
          placeholder="כותרת"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={styles.input}
        />

        <textarea
          id='content'
          placeholder="תוכן"
          required
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{ ...styles.input, height: 120 }}
        />

      <input type="file" accept="image/*" title='בחר תמונת כותרת' onChange={(e) => uploadHeader(e)} />

      <input type="file" accept="image/*" title='בחר תמונות' multiple onChange={(e) => uploadImages(e)} />
      

      {/* ✅ SELECT GROUP */}
      <select
        value={group}
        onChange={(e) => setGroup(e.target.value as Group)}
        style={styles.input}
        required
      >
        <option value="">בחר מחלקה</option>
        <option value="controller">בקרה</option>
        <option value="emergency">חירום</option>
        <option value="security">ביטחון</option>
      </select>
      
      <button
        style={styles.button}
        type="submit"
        disabled={uploadingImages}
      >
        {uploadingImages ? `טעינה...` : 'ליצור'}
      </button>
    </form>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: 16,
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    maxWidth: 400,
  },
  input: {
    border: '1px solid #ccc',
    padding: 10,
    borderRadius: 8,
    fontSize: 14,
  },
  button: {
    padding: 10,
    borderRadius: 8,
    border: 'none',
    backgroundColor: '#4f46e5',
    color: '#fff',
    cursor: 'pointer',
  },
};