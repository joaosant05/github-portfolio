import { Suspense, lazy, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ModelErrorBoundary from "./ModelErrorBoundary";

const StackModelCanvas = lazy(() => import("./StackModelCanvas"));

// Keep the Canvas mounted across technologies and while the panel is hidden.
// Only the scene inside it is replaced; loading state belongs to each item.
export default function StackModelViewer({ item, fallback, onSettled, ...props }) {
  const { t } = useTranslation();
  const [result, setResult] = useState(null);
  const status = result?.item === item ? result.status : "loading";
  const ready = useCallback(() => {
    setResult({ item, status: "ready" });
    onSettled(item.name);
  }, [item, onSettled]);
  const fail = useCallback(() => {
    setResult({ item, status: "error" });
    onSettled(item.name);
  }, [item, onSettled]);

  useEffect(() => {
    onSettled(null);
  }, [item, onSettled]);

  useEffect(() => {
    if (status !== "loading" || !props.animateModel) return;
    const timer = window.setTimeout(fail, 20000);
    return () => window.clearTimeout(timer);
  }, [status, fail, props.animateModel]);

  return (
    <div className={`about__stack-viewer is-${status}`} aria-busy={status === "loading"}>
      {status !== "ready" && fallback}
        <ModelErrorBoundary onError={fail}>
          <Suspense fallback={null}>
            <StackModelCanvas item={item} {...props} onReady={ready} onError={fail} failed={status === "error"} />
          </Suspense>
        </ModelErrorBoundary>
      {status !== "ready" && (
        <span className="about__stack-loading" role="status">
          {status === "loading" && <span className="about__stack-spinner" aria-hidden="true" />}
          {t(status === "loading" ? "about.modelLoading" : "about.modelUnavailable")}
        </span>
      )}
    </div>
  );
}
