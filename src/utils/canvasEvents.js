import { events } from "@react-three/fiber";
import { pointerEventSnapshot } from "./pointerEventSnapshot";

export function canvasEvents(store) {
  const manager = events(store);
  for (const name of Object.keys(manager.handlers)) {
    const handler = manager.handlers[name];
    if (name !== "onPointerMove") {
      manager.handlers[name] = (event) => handler(pointerEventSnapshot(event));
      continue;
    }

    // Pointer devices can dispatch faster than the canvas can paint. Keep the
    // newest coordinates and raycast at most once per visual frame.
    let pendingEvent = null;
    let frame = 0;
    manager.handlers[name] = (event) => {
      pendingEvent = pointerEventSnapshot(event);
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const nextEvent = pendingEvent;
        pendingEvent = null;
        if (nextEvent) handler(nextEvent);
      });
    };
  }
  return manager;
}
