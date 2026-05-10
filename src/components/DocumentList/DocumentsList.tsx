import { useEffect, useState } from "react";
import { User } from "../../types/User";
import { X, File, Image } from "lucide-react";
import { useAITheme } from "../../hooks/useAIContext";
import { Link } from "react-router-dom";

interface DocumentsListProps {
  user: User;
  isCollapsed?: boolean;
}

export default function DocumentsList({user, isCollapsed}: DocumentsListProps) {
  const { isAI } = useAITheme();

  const [iconColor, setIconColor] = useState('');

  useEffect(() => {
    setIconColor(isAI ? '#0abcc7' : '#000000')
  }, [ isAI ])

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
          <span style={{ color: iconColor }}>
            {user.documents.length}
          </span>
          <span>
            <File size={18} color={iconColor}/>
          </span>
        </li>
        :

        user.documents.map((d) => {
          return (

            <li
              key={d.url}
              className="document"
              title={d.name}
              role="link"
              onClick={(e) => {
                e.stopPropagation();

                const optimizedUrl = isPdf(d.url) ? d.url : d.url.replace(
                  "/upload/",
                  "/upload/f_auto,q_auto/"
                );

                window.open(optimizedUrl, "_blank");
              }}
            >
                {isPdf(d.url) ? (
                  <File
                    size={18}
                    className="document__icon document__icon--pdf"
                  />
                ) : (
                  <Image
                    size={18}
                    className="document__icon"
                  />
                )}

                {!isCollapsed && (
                  <span
                    className="document__name"
                    style={{ color: iconColor }}
                  >
                    {d.name}
                  </span>
                )}
            </li>
          );
        })}


    </ul>
  )
}


