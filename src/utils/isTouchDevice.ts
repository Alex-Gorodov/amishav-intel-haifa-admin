export function isTouchDevice() {
  return (
    ('ontouchstart' in window ||
    navigator.maxTouchPoints > 0) && window.innerWidth <= 768
  );
}
