// Arrastar com o dedo (pointer events), pensado para mãos pequenas: o objeto
// segue o dedo e, se o destino não aceitar, volta devagar para o lugar.

export interface DragOptions {
  /** Chamado ao soltar. Retorne true para deixar o objeto onde caiu. */
  onDrop(clientX: number, clientY: number): boolean;
  onStart?(): void;
  onMove?(clientX: number, clientY: number): void;
}

export function makeDraggable(el: HTMLElement | SVGElement, options: DragOptions): () => void {
  let startX = 0;
  let startY = 0;
  let pointerId: number | null = null;

  const setOffset = (dx: number, dy: number) => {
    el.style.transform = `translate(${dx}px, ${dy}px)`;
  };

  const down = (e: PointerEvent) => {
    if (pointerId !== null) return;
    e.preventDefault();
    pointerId = e.pointerId;
    startX = e.clientX;
    startY = e.clientY;
    el.setPointerCapture?.(e.pointerId);
    el.classList.add("dragging");
    el.style.transition = "none";
    options.onStart?.();
  };

  const move = (e: PointerEvent) => {
    if (e.pointerId !== pointerId) return;
    setOffset(e.clientX - startX, e.clientY - startY);
    options.onMove?.(e.clientX, e.clientY);
  };

  const up = (e: PointerEvent) => {
    if (e.pointerId !== pointerId) return;
    pointerId = null;
    el.classList.remove("dragging");
    const keep = options.onDrop(e.clientX, e.clientY);
    if (!keep) {
      el.style.transition = "transform 350ms ease-out";
      setOffset(0, 0);
    }
  };

  const target = el as HTMLElement;
  target.addEventListener("pointerdown", down);
  target.addEventListener("pointermove", move);
  target.addEventListener("pointerup", up);
  target.addEventListener("pointercancel", up);
  return () => {
    target.removeEventListener("pointerdown", down);
    target.removeEventListener("pointermove", move);
    target.removeEventListener("pointerup", up);
    target.removeEventListener("pointercancel", up);
  };
}

export function isInside(el: Element, clientX: number, clientY: number, padding = 0): boolean {
  const r = el.getBoundingClientRect();
  return (
    clientX >= r.left - padding &&
    clientX <= r.right + padding &&
    clientY >= r.top - padding &&
    clientY <= r.bottom + padding
  );
}
