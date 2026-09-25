export const MODEL_LOAD_TIMEOUT = 20000;
export const MODEL_LOAD_ATTEMPTS = 3;
export const initialModelLoadState = { attempt: 0, failures: 0, status: "loading" };

export function modelLoadReducer(state, event) {
  if (event.attempt !== state.attempt) return state;
  if (event.type === "ready" && state.status === "loading") {
    return { ...state, failures: 0, status: "ready" };
  }
  if (event.type === "error" && ["loading", "ready"].includes(state.status)) {
    const failures = state.failures + 1;
    return { ...state, failures, status: failures < MODEL_LOAD_ATTEMPTS ? "retrying" : "failed" };
  }
  if (event.type === "retry" && state.status === "retrying") {
    return { ...state, attempt: state.attempt + 1, status: "loading" };
  }
  return state;
}
