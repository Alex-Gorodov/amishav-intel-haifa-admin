interface FormProps {
  type: 'add' | 'change' | 'remove' | null;
  onAccept?: () => void;
  onClose: () => void;
  userName?: string;
  post?: string;
  date?: string;
}

export default function DynamicForm({type, userName, post, date, onClose, onAccept}: FormProps) {
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
      <div className="form__modal form__modal--dynamic" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit} className="form__wrapper">
          {
            type === 'remove'
            &&
            <div className="form__wrapper">
              <h2 className="form__title">
                אנא אשר שברצונך למחוק את המשמרת
                <br/>
                של <span className="highlight">{userName}</span>
                <br />
                עמדה: <span className="highlight">{post}</span>
                <br />
                תאריך: <span className="highlight">{date}</span>
              </h2>
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
