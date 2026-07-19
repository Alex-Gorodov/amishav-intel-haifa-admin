import { useRef, MouseEvent } from "react";

export function useDragScroll() {
  const ref = useRef<HTMLDivElement | null>(null);

  // Локальные переменные для отслеживания состояния внутри замыкания событий
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const onMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    isDown.current = true;
    ref.current.style.cursor = "grabbing";

    // Фиксируем стартовую позицию курсора и текущий скролл контейнера
    startX.current = e.pageX - ref.current.offsetLeft;
    scrollLeft.current = ref.current.scrollLeft;
  };

  const onMouseLeave = () => {
    if (!ref.current) return;
    isDown.current = false;
    ref.current.style.cursor = "grab";
  };

  const onMouseUp = () => {
    if (!ref.current) return;
    isDown.current = false;
    ref.current.style.cursor = "grab";
  };

  const onMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDown.current || !ref.current) return;
    // e.preventDefault();

    // Вычисляем, на сколько пикселей сдвинулась мышь
    const x = e.pageX - ref.current.offsetLeft;
    const walk = (x - startX.current) * 1.5; // Скорость скролла (1.5)

    // Сдвигаем контейнер
    ref.current.scrollLeft = scrollLeft.current - walk;
  };

  // Возвращаем реф и объект со всеми необходимыми событиями
  return {
    ref,
    events: {
      onMouseDown,
      onMouseLeave,
      onMouseUp,
      onMouseMove,
    },
  };
}
