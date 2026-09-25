import { lazy, Suspense, useCallback, useEffect, useReducer, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import ModelErrorBoundary from "../About/ModelErrorBoundary";
import { initialModelLoadState, MODEL_LOAD_TIMEOUT, modelLoadReducer } from "../../utils/modelLoadState";

const HeroScene = lazy(() => import("./HeroScene"));

function ModelLoadDialog({ active }) {
  const { t } = useTranslation();
  const dialogRef = useRef(null);
  const [dismissed, setDismissed] = useState(false);
  useEffect(() => {
    const dialog = dialogRef.current;
    if (active && !dismissed && !dialog.open) dialog.showModal();
    if (!active && dialog.open) dialog.close();
  }, [active, dismissed]);
  const dismiss = () => {
    setDismissed(true);
    dialogRef.current.close();
  };
  return createPortal(
    <dialog ref={dialogRef} className="hero__model-dialog" aria-labelledby="model-error-title"
      aria-describedby="model-error-description" onCancel={dismiss}>
      <h2 id="model-error-title">{t("hero.modelErrorTitle")}</h2>
      <p id="model-error-description">{t("hero.modelErrorDescription")}</p>
      <div className="hero__model-dialog-actions">
        <button type="button" onClick={dismiss}>{t("hero.modelErrorDismiss")}</button>
        <button type="button" className="hero__model-reload" onClick={() => window.location.reload()}>
          {t("hero.modelErrorReload")}
        </button>
      </div>
    </dialog>, document.body,
  );
}

export default function HeroModel({ active, ...sceneProps }) {
  const [state, dispatch] = useReducer(modelLoadReducer, initialModelLoadState);
  const { attempt, status, failures } = state;
  const ready = useCallback(() => dispatch({ type: "ready", attempt }), [attempt]);
  const fail = useCallback(() => dispatch({ type: "error", attempt }), [attempt]);

  useEffect(() => {
    if (status === "retrying") {
      const timer = window.setTimeout(() => dispatch({ type: "retry", attempt }), failures * 1500);
      return () => window.clearTimeout(timer);
    }
    // An offscreen/hidden page must not time out while rendering is deliberately paused.
    if (status !== "loading" || !active) return;
    const timer = window.setTimeout(fail, MODEL_LOAD_TIMEOUT);
    return () => window.clearTimeout(timer);
  }, [status, attempt, failures, active, fail]);

  return (
    <>
      {(status === "loading" || status === "retrying") && (
        <div className="hero__model-loader" aria-hidden="true">
          <span className="hero__model-loader-ring" />
          <span className="hero__model-loader-core" />
          <span className="hero__model-loader-shadow" />
        </div>
      )}
      {(status === "loading" || status === "ready") && (
        <ModelErrorBoundary key={attempt} onError={fail}>
          <Suspense fallback={null}>
            <HeroScene {...sceneProps} attempt={attempt} onReady={ready} onError={fail} />
          </Suspense>
        </ModelErrorBoundary>
      )}
      {status === "failed" && <ModelLoadDialog active={active} />}
    </>
  );
}
