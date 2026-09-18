// R3F enumerates native events, including Firefox's deprecated getters.
// Forward the standard event properties without reading those legacy fields.
export function pointerEventSnapshot(event) {
  const snapshot = Object.create(null);
  for (const key in event) {
    if (key === "mozPressure" || key === "mozInputSource") continue;
    const value = event[key];
    snapshot[key] = typeof value === "function" ? value.bind(event) : value;
  }
  return snapshot;
}
