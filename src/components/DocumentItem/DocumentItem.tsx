import { useState } from "react";
import { Document } from "../../types/Document";

export default function DocumentItem({ url, name }: Document) {
  const [isOpen, setIsOpen] = useState(false);

  const isPdf = url.toLowerCase().endsWith(".pdf");

  return (
    <>
      <div className="document" onClick={() => setIsOpen(true)}>
        {name}
      </div>

      {isOpen && (
        <div className="document-modal" onClick={() => setIsOpen(false)}>
          <div
            className="document-modal__content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="document-modal__close"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>

            {isPdf ? (
              <iframe src={url} title={name} />
            ) : (
              <img src={url} alt={name} />
            )}
          </div>
        </div>
      )}
    </>
  );
}
