import { events } from "@react-three/fiber";
import { pointerEventSnapshot } from "./pointerEventSnapshot";

export function canvasEvents(store) {
  const manager = events(store);
  for (const name of Object.keys(manager.handlers)) {
    const handler = manager.handlers[name];
    manager.handlers[name] = (event) => handler(pointerEventSnapshot(event));
  }
  return manager;
}
