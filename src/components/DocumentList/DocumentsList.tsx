import { useState } from "react";
import { User } from "../../types/User";
import { X, File } from "lucide-react";

interface DocumentsListProps {
  user: User;
  isCollapsed?: boolean;
}

export default function DocumentsList({user, isCollapsed}: DocumentsListProps) {
  const [preview, setPreview] = useState<string | null>(null);

    const isImage = (url: string) =>
    /\.(jpg|jpeg|png|webp|gif)$/i.test(url);

  const isPdf = (url: string) =>
    /\.pdf$/i.test(url);

  return(
    <ul className={`trainings-list ${!isCollapsed ? 'trainings-list--uncollapsed' : ''}`}>
      {
        !user.documents || user.documents.length < 1
        ?
        ''
        :
        isCollapsed
        ?
        <li style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>
            {user.documents.length}
          </span>
          <span>
            <File size={18}/>
          </span>
        </li>
        :

        user.documents.map((d) => {
          return (

            <li
              key={d.url}
              className="document"
              title={d.name}
              onClick={(e) => {
                e.stopPropagation();
                if (isImage(d.url)) {
                  e.stopPropagation();
                  setPreview(d.url);
                } else {
                  e.stopPropagation();
                  window.open(d.url, "_blank");
                }
              }}
            >
              {isPdf(d.url) ? (
                <File size={18} className="document__icon document__icon--pdf" />
              ) : (
                <File size={18} className="document__icon" />
              )}

              {!isCollapsed && (
                <span className="document__name">
                  {d.name}
                </span>
              )}
            </li>
          );
        })}

        {preview && (
          <div className="doc-preview" onClick={(e) => {
            e.stopPropagation();
            setPreview(null)}}
          >
            {isPdf(preview) ? (
              <iframe src={preview} title="doc" />
            ) : (
              <img src={preview} alt="" />
            )}
          </div>
        )}

    </ul>
  )
}


