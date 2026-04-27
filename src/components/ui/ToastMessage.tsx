import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/root-reducer";
import { setError, setSuccess } from "../../store/actions";

export default function ToastMessage() {
  const dispatch = useDispatch();
  const error = useSelector((state: RootState) => state.app.error);
  const success = useSelector((state: RootState) => state.app.success);

  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [show, setShow] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const newMessage = success ?? error;
    if (!newMessage) return;

    setMessage(newMessage);
    setIsError(!!error && !success);
    setVisible(true);

    // trigger animation
    setTimeout(() => setShow(true), 10);

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      setShow(false);

      setTimeout(() => {
        setVisible(false);
        setMessage(null);
        setIsError(false);
      }, 300);

      if (success) dispatch(setSuccess({ message: null }));
      if (error) dispatch(setError({ message: null }));
    }, 3000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [error, success, dispatch]);

  if (!visible || !message) return null;

  return (
    <div className={`toast ${show ? "toast--show" : ""} ${isError ? "toast--error" : "toast--success"}`}>
      {message}
    </div>
  );
}
