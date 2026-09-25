// R3F enumerates native events, including Firefox's deprecated getters.
// Discover safe keys once per browser event prototype instead of walking the
// whole prototype chain for every pointer movement.
const safeKeysByPrototype = new WeakMap();

function getSafeKeys(event) {
  const prototype = Object.getPrototypeOf(event);
  const cached = prototype && safeKeysByPrototype.get(prototype);
  if (cached) return cached;

  const keys = [];
  for (const key in event) {
    if (key !== "mozPressure" && key !== "mozInputSource") keys.push(key);
  }
  if (prototype) safeKeysByPrototype.set(prototype, keys);
  return keys;
}

export function pointerEventSnapshot(event) {
  const snapshot = Object.create(null);
  for (const key of getSafeKeys(event)) {
    const value = event[key];
    snapshot[key] = typeof value === "function" ? value.bind(event) : value;
  }
  return snapshot;
}
