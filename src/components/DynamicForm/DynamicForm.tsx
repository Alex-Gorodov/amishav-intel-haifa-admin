interface FormProps {
  type: 'add' | 'change' | 'remove' | null;
  onClose: () => void;
}

export default function DynamicForm({type, onClose}: FormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (type === 'add') console.log('add');
    if (type === 'change') console.log('change');
    if (type === 'remove') console.log('remove');
  };

  return (
    <div className="form__overlay" onClick={onClose}>
      <div className="form__modal" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit} className="form__wrapper">
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  )
}
