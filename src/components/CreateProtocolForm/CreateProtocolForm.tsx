import React, { useState } from 'react';
import { createProtocol } from '../../store/api/createProtocol.api';
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
  const [headerImageHovered, setHeaderImageHovered] = useState(false);

  const [images, setImages] = useState<string[]>([]);
  const [imageHoveredIndex, setImageHoveredIndex] = useState<number | null>(null);

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
  // <div style={styles.overlay} onClick={onClose}>
  //   <div style={styles.modal} onClick={(e) => e.stopPropagation()}>

  //     <form onSubmit={handleSubmit} style={styles.form}>
  //       <h2 style={styles.title}>הוסף נוהל חדש</h2>

  //         <input
  //           id='title'
  //           placeholder="כותרת"
  //           required
  //           value={title}
  //           onChange={(e) => setTitle(e.target.value)}
  //           style={styles.input}
  //         />

  //         <textarea
  //           id='content'
  //           placeholder="תוכן"
  //           required
  //           value={content}
  //           onChange={(e) => setContent(e.target.value)}
  //           style={{ ...styles.input, height: 120 }}
  //         />

  //         <div style={styles.imagesWrapper}>

  //           <label style={styles.uploadWrapper} htmlFor="headerImage">
  //             <span style={{...styles.uploadTitle, paddingBottom: headerImage ? 24 : 0}}>בחר תמונה ראשית</span>
  //             <input style={{ display: 'none' }} type="file" id="headerImage" accept="image/*" title='בחר תמונת כותרת' onChange={(e) => uploadHeader(e)} />
  //             {
  //               headerImage
  //               &&
  //               <div
  //                 style={styles.imageWrapper}
                  // onMouseEnter={() => setHeaderImageHovered(true)}
                  // onMouseLeave={() => setHeaderImageHovered(false)}
  //               >
  //                 <img style={styles.uploadedImage} src={headerImage} width={320}/>
                  // {
                  //   headerImageHovered
                  //   &&
                  //   <button
                  //     style={styles.deleteBtn}
                  //     onClick={() => setHeaderImage('')}
                  //   >×</button>
                  // }
  //               </div>
  //             }
  //           </label>

  //           <label style={styles.uploadWrapper} htmlFor="articleImages">
  //             <span style={styles.uploadTitle}>בחר תמונות תוכן</span>
  //             <input style={{display: 'none'}} type="file" id="articleImages" accept="image/*" title='בחר תמונות' multiple onChange={(e) => uploadImages(e)} />
  //             {
  //               images.length > 0
  //               &&
  //               <div style={styles.smallImagesWrapper}>
  //                 {
  //                   images.map((i, index) => {
  //                     return (
                        // <div
                        //   key={index}
                        //   style={styles.imageWrapper}
                        //   onMouseEnter={() => setImageHoveredIndex(index)}
                        //   onMouseLeave={() => setImageHoveredIndex(null)}
                        // >
  //                         <img style={{...styles.uploadedImage, ...styles.smallUploadedImage}} src={i} width={320} />

                          // {imageHoveredIndex === index && (
                          //   <button
                          //     style={styles.deleteBtn}
                          //     onClick={() =>
                          //       setImages(prev => prev.filter((_, idx) => idx !== index))
                          //     }
                          //   >
                          //     ×
                          //   </button>
                          // )}
  //                       </div>
  //                     );
  //                   })
  //                 }
  //               </div>
  //             }
  //           </label>

  //         </div>


  //         {/* ✅ SELECT GROUP */}
  //         <select
  //           value={group}
  //           onChange={(e) => setGroup(e.target.value as Group)}
  //           style={styles.input}
  //           required
  //         >
  //           <option value="">בחר מחלקה</option>
  //           <option value="controller">בקרה</option>
  //           <option value="emergency">חירום</option>
  //           <option value="security">ביטחון</option>
  //         </select>

  //         <button
  //           className='button'
  //           type="submit"
  //           disabled={uploadingImages}
  //         >
  //           {uploadingImages ? `טעינה...` : 'ליצור'}
  //         </button>
  //       </form>
  //     </div>
  //   </div>

    <div className="create-protocol__overlay" onClick={onClose}>
      <div className="create-protocol__modal" onClick={(e) => e.stopPropagation()}>

        <form onSubmit={handleSubmit} className="create-protocol__form">
          <h2 className="create-protocol__title">הוסף נוהל חדש</h2>

          <input
            id="title"
            placeholder="כותרת"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="create-protocol__input"
          />

          <textarea
            id="content"
            placeholder="תוכן"
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="create-protocol__input input--textarea"
          />

          <div className="create-protocol__images-wrapper">

            {/* HEADER IMAGE */}
            <label className="create-protocol__upload-wrapper" htmlFor="headerImage">
              <span className="create-protocol__upload-title" style={{ paddingBottom: headerImage ? 24 : 0}}>בחר תמונה ראשית</span>

              <input
                className="create-protocol__file-input"
                type="file"
                id="headerImage"
                accept="image/*"
                onChange={(e) => uploadHeader(e)}
              />

              {headerImage && (
                <div
                  className="create-protocol__image-wrapper"
                  onMouseEnter={() => setHeaderImageHovered(true)}
                  onMouseLeave={() => setHeaderImageHovered(false)}
                >
                  <img className="create-protocol__uploaded-image" src={headerImage} />

                  {
                    headerImageHovered
                    &&
                    <button
                      style={styles.deleteBtn}
                      onClick={() => setHeaderImage('')}
                    >×</button>
                  }
                </div>
              )}
            </label>

            {/* CONTENT IMAGES */}
            <label className="create-protocol__upload-wrapper" htmlFor="articleImages">
              <span className="create-protocol__upload-title" style={{ paddingBottom: images.length > 0 ? 24 : 0}}>בחר תמונות תוכן</span>

              <input
                className="create-protocol__file-input"
                type="file"
                id="articleImages"
                multiple
                accept="image/*"
                onChange={(e) => uploadImages(e)}
              />

              {images.length > 0 && (
                <div className="create-protocol__small-images-wrapper">
                  {images.map((img, index) => (
                    <div
                      key={index}
                      className="create-protocol__image-wrapper"
                      onMouseEnter={() => setImageHoveredIndex(index)}
                      onMouseLeave={() => setImageHoveredIndex(null)}
                    >
                      <img
                        src={img}
                        className="create-protocol__uploaded-image create-protocol__uploaded-image--small"
                      />

                      {imageHoveredIndex === index && (
                        <button
                          style={styles.deleteBtn}
                          onClick={() =>
                            setImages(prev => prev.filter((_, idx) => idx !== index))
                          }
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </label>
          </div>

          <select
            value={group}
            onChange={(e) => setGroup(e.target.value as Group)}
            className="create-protocol__input"
            required
          >
            <option value="">בחר מחלקה</option>
            <option value="controller">בקרה</option>
            <option value="emergency">חירום</option>
            <option value="security">ביטחון</option>
          </select>

          <button
            className="button"
            type="submit"
            disabled={uploadingImages}
          >
            {uploadingImages ? 'טעינה...' : 'ליצור'}
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
    width: '90%',
    maxWidth: 900,
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
  uploadTitle: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 600,
  },
  imagesWrapper: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    alignItems: 'flex-start',
    gap: 8,
  },
  uploadWrapper: {
    display: 'flex',
    maxWidth: 560,
    flexDirection: 'column',
    padding: 24,
    border: '1px solid #ccc',
    borderRadius: 8,
    overflow: 'hidden',
  },
  imageWrapper: {
    position: 'relative',
  },
  uploadedImage: {
    width: '100%',
    border: '1px solid black',
    borderRadius: 16,
    boxShadow: '0 10px 40px rgba(0,0,0,0.25)',
  },
  smallImagesWrapper: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  smallUploadedImage: {
    maxWidth: 180
  },
  deleteBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 24,
    height: 24,
    fontSize: 24,
    cursor: 'pointer',
    border: 'none',
    borderRadius: 50,
    backgroundColor: '#fff',
    boxShadow: '0 10px 40px rgba(0,0,0,0.25)',

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
