import React, { useEffect, useRef, useState } from 'react';
import { createProtocol } from '../../store/api/createProtocol.api';
import { useImageUpload } from '../../hooks/useImageUpload';
import Layout from '../../components/Layout/Layout';
import { isTouchDevice } from '../../utils/isTouchDevice';
import { ErrorMessages, SuccessMessages } from '../../const';
import { useDarkTheme } from '../../hooks/useDarkThemeContext';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/root-reducer';
import { CircleX, Pencil } from 'lucide-react';
import { addProtocol, deleteProtocol, setStateSuccess } from '../../store/actions';
import { deleteApiProtocol } from '../../store/api/deleteProtocol.api';
import { Protocol } from '../../types/Protocol';
import { editProtocol } from '../../store/api/editProtocol.api';
import { fetchProtocols } from '../../store/api/fetchProtocols.api';

type Group = 'controller' | 'emergency' | 'security';

export default function NewProtocolPage() {
  const { isDark } = useDarkTheme();

  const dispatch = useDispatch();

  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const GROUP_OPTIONS: { value: Group; label: string }[] = [
    { value: 'controller', label: 'בקרה' },
    { value: 'emergency', label: 'חירום' },
    { value: 'security', label: 'ביטחון' },
  ];

  const protocols = useSelector((state: RootState) => state.data.protocols)

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

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

   const resetForm = () => {
    setTitle('');
    setContent('');
    setGroup('');
    setHeaderImage('');
    setImages([]);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title || !content || !group) {
      setError(ErrorMessages.FIELDS_REQUIRED);
      return;
    }

    try {
      await createProtocol({
        title,
        content,
        headerImage,
        images,
        group,
      });

      dispatch(addProtocol({ protocol: {
        id: group + title,
        title,
        content,
        headerImage,
        images,
      }}))

      resetForm();

      setSuccess(SuccessMessages.PROTOCOL_ADDED)
      fetchProtocols(dispatch)
    } catch (err: any) {
      setError(err?.message || ErrorMessages.PROTOCOL_CREATING_ERROR);
    }
  };

  const handleDelete = async (id: string) => {
    console.log(id)
    await deleteApiProtocol({protocolId: id})
    dispatch(deleteProtocol({protocolId: id}))
    dispatch(setStateSuccess({ message: SuccessMessages.PROTOCOL_DELETED}))
  }

  const [isEditing, setEditing] = useState(false)
  const [protocolToEdit, setProtocolToEdit] = useState<Protocol | null>(null)

  const [newTitle, setNewTitle] = useState(protocolToEdit?.title || '')
  const [newContent, setNewContent] = useState('');

  const clearEditing = () => {
    const original = protocolToEdit;

    setEditing(false);
    setProtocolToEdit(null);

    setNewTitle(original?.title ?? '');
  };

  useEffect(() => {
    if (protocolToEdit) {
      setNewTitle(protocolToEdit.title);
      setNewContent(protocolToEdit.content);
    }
  }, [protocolToEdit]);

const handleEdit = async () => {
  if (!protocolToEdit) return;

  try {
    await editProtocol({
      protocolId: protocolToEdit.id,
      title: newTitle,
      content: newContent,
    });

    fetchProtocols(dispatch)
    dispatch(setStateSuccess({message: SuccessMessages.PROTOCOL_EDITED}))

    clearEditing();
  } catch (err) {
    console.error(err);
  }
};

  return (
    <Layout>
      <form
        method="post"
        onSubmit={handleSubmit}
        className={`form ${isDark ? 'form--dark-theme' : ''}`}
      >
        <div className="form__wrapper form__wrapper--fullscreen page__content">

          {
            <div className={`form__message-wrapper form__message-wrapper--error ${error ? 'form__message-wrapper--active' : ''}`}>
              <p className='form__message form__message--error'>{error}</p>
            </div>
          }

          {
            <div className={`form__message-wrapper form__message-wrapper--success ${success ? 'form__message-wrapper--active' : ''}`}>
              <p className='form__message form__message--success'>{success}</p>
            </div>
          }

          <input
            id="title"
            placeholder="כותרת"
            // required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form__input"
            autoFocus={!isTouchDevice()}
          />

          <textarea
            id="content"
            placeholder="תוכן"
            // required
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
            <label className="form__upload-wrapper form__upload-wrapper--content">

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
            </label>
          </div>

          <select
            value={group}
            onChange={(e) => setGroup(e.target.value as Group)}
            className="visually-hidden"
          >
            <option value="">בחר מחלקה</option>
            <option value="controller">בקרה</option>
            <option value="emergency">חירום</option>
            <option value="security">ביטחון</option>
          </select>

          {/* GROUP SELECTION BUTTONS */}
          <div className="form__groups-wrapper" style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <p className="form__label">בחר מחלקה:</p>
            <div className='form__groups-buttons'>
              {GROUP_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`form__role-item ${group === option.value ? 'form__role-item--selected' : ''}`}
                  onClick={() => setGroup(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <button
            className="button button--add button--wide"
            type="submit"
            disabled={uploadingImages}
          >
            {uploadingImages ? 'טעינה...' : 'ליצור'}
          </button>
        </div>
        <div className='protocols'>
          {
            protocols.map((p) => {
              return (
                <div className='protocol' key={p.id}>
                  <p className='protocol__title'>{p.title}</p>
                  <div className='protocol__buttons'>
                    <button
                      className="button button--with-icon button--edit"
                      type="button"
                      onClick={() => {
                        setProtocolToEdit(p);
                        setEditing(true);
                      }
                    }
                    >
                      <Pencil size={18}/>
                        ערך
                    </button>
                    <button
                      className="button button--with-icon button--delete"
                      type="button"
                      onClick={() => handleDelete(p.id)}
                    >
                      <CircleX size={18}/>
                        מחיקה
                    </button>
                  </div>
                </div>
              )
            })
          }
        </div>
      </form>
      {
        isEditing
        &&
        <div className="form__overlay" onClick={clearEditing} >
          <div className="form__modal" onClick={(e) => {
            e.stopPropagation()
          }}>
            <form action="" className="form__wrapper">
              <h2 className='form__title'>ערך נוהל</h2>
              <label htmlFor="edit-title">
                <input className='form__input' onChange={(e) => setNewTitle(e.target.value)} type="text" name={`${protocolToEdit?.title}-title`} id="edit-title" value={newTitle}/>
              </label>
              <label htmlFor="edit-content">
                <textarea
                  className='form__input form__input--textarea'
                  value={newContent}
                  name={`${protocolToEdit?.title}-content`}
                  id="edit-content"
                  onChange={(e) => setNewContent(e.target.value)}
                />
              </label>
              <button className="button button--wide button--add" type="button" onClick={handleEdit}>שמור</button>
              <button className="button button--delete" type="button" onClick={clearEditing}>ביטול</button>
            </form>
          </div>
        </div>
      }
    </Layout>
  );
}
