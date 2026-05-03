import React, { useRef, useState } from 'react';
import { createProtocol } from '../../store/api/createProtocol.api';
import { useImageUpload } from '../../hooks/useImageUpload';
import Layout from '../../components/Layout/Layout';
import { isTouchDevice } from '../../utils/isTouchDevice';
import { useDispatch } from 'react-redux';
import { setSuccess } from '../../store/actions';
import { SuccessMessages } from '../../const';

type Group = 'controller' | 'emergency' | 'security';

export default function NewProtocolPage() {
  const dispatch = useDispatch();

  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [group, setGroup] = useState<Group | ''>('');

  const [headerImage, setHeaderImage] = useState('');
  const [headerImageHovered, setHeaderImageHovered] = useState(false);

  const [images, setImages] = useState<string[]>([]);
  const [imageHoveredIndex, setImageHoveredIndex] = useState<number | null>(null);

  const onMouseDown = (e: React.MouseEvent) => {
    const el = scrollRef.current;
    if (!el) return;

    isDragging.current = true;
    startX.current = e.pageX - el.offsetLeft;
    scrollLeft.current = el.scrollLeft;
  };

  const onMouseLeave = () => {
    isDragging.current = false;
  };

  const onMouseUp = () => {
    isDragging.current = false;
  };

  const onMouseMove = (e: React.MouseEvent) => {
    const el = scrollRef.current;
    if (!el || !isDragging.current) return;

    e.preventDefault();

    const x = e.pageX - el.offsetLeft;
    const walk = (x - startX.current) * 1.5; // speed multiplier

    el.scrollLeft = scrollLeft.current - walk;
  };

  const { handlePickImage: uploadHeader } = useImageUpload((url) => {
    setHeaderImage(url);
  });

  const { handlePickImage: uploadImages, uploading: uploadingImages  } = useImageUpload((url) => {
    setImages(prev => [...prev, url]);
  });

   const resetForm = () => {
    setTitle('');
    setContent('');
    setGroup('');
    setHeaderImage('');
    setImages([]);
  }

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      if ( !title || !content || !group) {
        alert('Fill required fields');
        return;
      }

      await createProtocol({
        title,
        content,
        headerImage,
        images,
        group,
      });

      resetForm();

      dispatch(setSuccess({message: SuccessMessages.PROTOCOL_ADDED}))

    };


  return (
    <Layout>
      <form onSubmit={handleSubmit} method="post">

        <div className="form__wrapper form__wrapper--fullscreen page__content">

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
                  <img className="form__uploaded-image" src={headerImage} draggable={false} />

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
            <div className="form__upload-wrapper form__upload-wrapper--content">

              <span
                className="form__upload-title"
                onClick={() => fileInputRef.current?.click()}
              >
                בחר תמונות תוכן
              </span>

              <input
                ref={fileInputRef}
                className="visually-hidden"
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => uploadImages(e)}
              />

              {images.length > 0 && (
                <div
                  ref={scrollRef}
                  className="form__small-images-wrapper"
                  onMouseDown={onMouseDown}
                  onMouseLeave={onMouseLeave}
                  onMouseUp={onMouseUp}
                  onMouseMove={onMouseMove}
                  onClick={(e) => e.stopPropagation()}
                >
                  {images.map((img, index) => (
                    <div
                      key={index}
                      className="form__image-wrapper"
                      onMouseEnter={() => setImageHoveredIndex(index)}
                      onMouseLeave={() => setImageHoveredIndex(null)}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <img
                        src={img}
                        className="form__uploaded-image form__uploaded-image--small"
                         draggable={false}
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
            </div>
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
