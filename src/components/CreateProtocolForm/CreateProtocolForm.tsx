import React, { useState } from 'react';
import { createProtocol } from '../../services/API/createProtocol.api';
import { useImageUpload } from '../../hooks/useImageUpload';

interface Props {
  onClose: () => void;
}

type Group = 'controller' | 'emergency' | 'security';

export default function CreateProtocolForm({ onClose }: Props) {

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
  <div style={styles.overlay} onClick={onClose}>
    <div style={styles.modal} onClick={(e) => e.stopPropagation()}>

      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.title}>הוסף נוהל חדש</h2>

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

          <label htmlFor="headerImage">
            בחר תמונה ראשית
            <input type="file" id="headerImage" accept="image/*" title='בחר תמונת כותרת' onChange={(e) => uploadHeader(e)} />
          </label>

          <label htmlFor="articleImages">
            בחר תמונות תוכן
            <input type="file" id="articleImages" accept="image/*" title='בחר תמונות' multiple onChange={(e) => uploadImages(e)} />
          </label>


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
            // style={styles.button}
            className='button'
            type="submit"
            disabled={uploadingImages}
          >
            {uploadingImages ? `טעינה...` : 'ליצור'}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modal: {
    background: '#fff',
    padding: 24,
    borderRadius: 20,
    width: 420,
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: '0 10px 40px rgba(0,0,0,0.25)',
  },
  container: {
    background: '#fff',
    padding: 20,
    borderRadius: 16,
    width: 400,
  },
  title: {
    marginBottom: 12,
    textAlign: 'center',
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  input: {
    padding: 10,
    borderRadius: 8,
    border: '1px solid #ccc',
    resize: 'vertical'
  },
  label: {
    marginTop: 12,
  },
  roles: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  roleItem: {
    padding: 8,
    borderRadius: 8,
    border: '1px solid #ccc',
    cursor: 'pointer',
  },
  roleSelected: {
    background: '#c7f0d8',
  },
  submit: {
    width: '100%',
    padding: 10,
    background: '#4f46e5',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
  },
  cancel: {
    marginTop: 8,
    width: '100%',
    padding: 10,
    background: '#eee',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
  },
};
