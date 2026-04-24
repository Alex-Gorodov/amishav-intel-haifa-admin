import React, { useState } from 'react';
import { createProtocol } from '../../store/api/createProtocol.api';
import { useImageUpload } from '../../hooks/useImageUpload';
import Layout from '../../components/Layout/Layout';
import { isTouchDevice } from '../../utils/isTouchDevice';

type Group = 'controller' | 'emergency' | 'security';

export default function NewProtocolPage() {

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
    <Layout>
      <form onSubmit={handleSubmit} method="post">
        <div className="page__header">
          <h2 className="form__title">הוסף נוהל חדש</h2>
        </div>

        <div className="form__wrapper form__wrapper--fullscreen">

          <input
            id="title"
            placeholder="כותרת"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form__input"
            autoFocus={!isTouchDevice()}
          />

          <textarea
            id="content"
            placeholder="תוכן"
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="form__input form__input--textarea"
          />

          <div className="form__images-wrapper">

            {/* HEADER IMAGE */}
            <label className="form__upload-wrapper" htmlFor="headerImage">
              <span className="form__upload-title" style={{ paddingBottom: headerImage ? 24 : 0}}>בחר תמונה ראשית</span>

              <input
                className="visually-hidden"
                type="file"
                id="headerImage"
                accept="image/*"
                onChange={(e) => uploadHeader(e)}
              />

              {headerImage && (
                <div
                  className="form__image-wrapper"
                  onMouseEnter={() => setHeaderImageHovered(true)}
                  onMouseLeave={() => setHeaderImageHovered(false)}
                >
                  <img className="form__uploaded-image" src={headerImage} />

                  {
                    headerImageHovered
                    &&
                    <button
                      className='form__delete-btn'
                      onClick={() => setHeaderImage('')}
                    >×</button>
                  }
                </div>
              )}
            </label>

            {/* CONTENT IMAGES */}
            <label className="form__upload-wrapper" htmlFor="articleImages">
              <span className="form__upload-title" style={{ paddingBottom: images.length > 0 ? 24 : 0}}>בחר תמונות תוכן</span>

              <input
                className="visually-hidden"
                type="file"
                id="articleImages"
                multiple
                accept="image/*"
                onChange={(e) => uploadImages(e)}
              />

              {images.length > 0 && (
                <div className="form__small-images-wrapper">
                  {images.map((img, index) => (
                    <div
                      key={index}
                      className="form__image-wrapper"
                      onMouseEnter={() => setImageHoveredIndex(index)}
                      onMouseLeave={() => setImageHoveredIndex(null)}
                    >
                      <img
                        src={img}
                        className="form__uploaded-image form__uploaded-image--small"
                      />

                      {imageHoveredIndex === index && (
                        <button
                          className='form__delete-btn'
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
            className="form__input"
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
        </div>
      </form>
    </Layout>
  );
}
