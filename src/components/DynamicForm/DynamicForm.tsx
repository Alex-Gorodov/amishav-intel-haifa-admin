interface FormProps {
  type: 'add' | 'change' | 'remove' | null;
  onDecline?: () => void;
  onAccept?: () => void;
  onClose: () => void;
}

export default function DynamicForm({type, onClose, onAccept, onDecline}: FormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    {
      type === 'remove'
      &&
      onAccept?.();
    }
  };

  return (
    <div className="form__overlay" onClick={onClose}>
      <div className="form__modal" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit} className="form__wrapper">
          {
            type === 'remove'
            &&
            <div>
              <p>למחוק את המשמרת?</p>
              <div className="buttons-wrapper">
                <button className="button button--add" onClick={onAccept} type="button">למחוק</button>
                <button className="button button--delete" onClick={onClose} type="button">בטל</button>
              </div>
            </div>
          }
        </form>
      </div>
    </div>
  )
}
