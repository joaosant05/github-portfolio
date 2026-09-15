import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

// Mounted only after deliberate hover. Removing src on cleanup also cancels
// a pending download when someone quickly moves to a different card.
export default function ProjectPreview({ project, onStop }) {
  const { t } = useTranslation();
  const videoRef = useRef(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const video = videoRef.current;
    let disposed = false;
    video.muted = true;
    video.play().catch(() => {
      if (!disposed) setStatus("error");
    });
    const timeout = window.setTimeout(() => {
      if (!disposed && video.readyState < 3) {
        video.pause();
        setStatus("error");
      }
    }, 15000);
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) onStop();
    });
    observer.observe(video);
    const onVisibility = () => {
      if (document.hidden) onStop();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      disposed = true;
      clearTimeout(timeout);
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      video.pause();
      video.removeAttribute("src");
      video.load();
    };
  }, [onStop]);

  return (
    <>
      <video
        ref={videoRef}
        className={`portfolio__preview-video ${status === "playing" ? "is-playing" : ""}`}
        src={project.video.previewSrc}
        muted
        loop
        playsInline
        preload="auto"
        disablePictureInPicture
        controls={false}
        aria-hidden="true"
        tabIndex={-1}
        onPlaying={() => setStatus("playing")}
        onWaiting={() => setStatus("loading")}
        onError={() => setStatus("error")}
      />
      {status !== "playing" ? (
        <span className="portfolio__preview-status" role="status">
          {status === "loading" ? (
            <span className="portfolio__spinner" />
          ) : null}
          {t(
            status === "loading"
              ? "work.loadingPreview"
              : "work.previewUnavailable",
          )}
        </span>
      ) : null}
    </>
  );
}
