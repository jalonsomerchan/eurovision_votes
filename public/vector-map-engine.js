export function createVectorMapEngine({ viewport, layer, minScale = 0.8, maxScale = 5 }) {
  const pointers = new Map();
  let state = { scale: 1, x: 0, y: 0 };
  let lastPinchDistance = 0;

  function apply() {
    layer.style.transform = `translate(${state.x}px, ${state.y}px) scale(${state.scale})`;
  }

  function zoom(delta, originX = 0, originY = 0) {
    const nextScale = Math.min(maxScale, Math.max(minScale, state.scale + delta));
    const ratio = nextScale / state.scale;
    state = {
      scale: nextScale,
      x: originX - (originX - state.x) * ratio,
      y: originY - (originY - state.y) * ratio,
    };
    apply();
  }

  function reset() {
    state = { scale: 1, x: 0, y: 0 };
    apply();
  }

  viewport.addEventListener('wheel', (event) => {
    event.preventDefault();
    const rect = viewport.getBoundingClientRect();
    zoom(event.deltaY > 0 ? -0.18 : 0.18, event.clientX - rect.left, event.clientY - rect.top);
  }, { passive: false });

  viewport.addEventListener('pointerdown', (event) => {
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    viewport.setPointerCapture(event.pointerId);
    viewport.classList.add('is-dragging');
  });

  viewport.addEventListener('pointermove', (event) => {
    const previous = pointers.get(event.pointerId);
    if (!previous) return;
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (pointers.size === 1) {
      state.x += event.clientX - previous.x;
      state.y += event.clientY - previous.y;
      apply();
      return;
    }

    const values = [...pointers.values()];
    const distance = Math.hypot(values[0].x - values[1].x, values[0].y - values[1].y);
    if (lastPinchDistance) zoom((distance - lastPinchDistance) / 180, viewport.clientWidth / 2, viewport.clientHeight / 2);
    lastPinchDistance = distance;
  });

  function endPointer(event) {
    pointers.delete(event.pointerId);
    if (!pointers.size) viewport.classList.remove('is-dragging');
    if (pointers.size < 2) lastPinchDistance = 0;
  }

  viewport.addEventListener('pointerup', endPointer);
  viewport.addEventListener('pointercancel', endPointer);

  return {
    reset,
    zoomIn: () => zoom(0.35, viewport.clientWidth / 2, viewport.clientHeight / 2),
    zoomOut: () => zoom(-0.35, viewport.clientWidth / 2, viewport.clientHeight / 2),
  };
}
