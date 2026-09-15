import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import {
  FiArrowLeft,
  FiArrowRight,
  FiCheck,
  FiLock,
  FiMaximize2,
  FiPause,
  FiPlay,
  FiVolume2,
  FiVolumeX,
  FiX,
} from "react-icons/fi";
import ProjectSiteLink from "./ProjectSiteLink";

function formatTime(seconds) {
  const value = Math.floor(Number.isFinite(seconds) ? seconds : 0);
  return `${Math.floor(value / 60)}:${String(value % 60).padStart(2, "0")}`;
}

function DemoPlayer({ project }) {
  const { t } = useTranslation();
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    let disposed = false;
    video.muted = true;
    video.play().catch(() => {
      if (!disposed) setLoading(false);
    });
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) video.pause();
    });
    observer.observe(video);
    const onVisibility = () => {
      if (document.hidden) video.pause();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      disposed = true;
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      video.pause();
      video.removeAttribute("src");
      video.load();
    };
  }, []);

  const togglePlayback = () => {
    const video = videoRef.current;
    if (video.paused) video.play().catch(() => setError(true));
    else video.pause();
  };

  return (
    <div className={`project-detail__player ${playing ? "is-playing" : ""}`}>
      <video
        ref={videoRef}
        src={project.video.src}
        poster={project.images[0]}
        playsInline
        muted={muted}
        controls={false}
        disablePictureInPicture
        preload="none"
        aria-label={t("work.videoAria", { project: t(project.titleKey) })}
        onPlaying={() => {
          setPlaying(true);
          setLoading(false);
        }}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onWaiting={() => setLoading(true)}
        onCanPlay={() => setLoading(false)}
        onDurationChange={(event) => {
          const value = event.currentTarget.duration;
          setDuration(Number.isFinite(value) ? value : 0);
        }}
        onTimeUpdate={(event) =>
          setCurrentTime(event.currentTarget.currentTime)
        }
        onSeeking={() => setLoading(true)}
        onSeeked={() => setLoading(false)}
        onError={() => {
          setError(true);
          setLoading(false);
        }}
      />
      {loading ? (
        <span className="project-detail__video-loading" role="status">
          <span className="portfolio__spinner" />
          {t("work.loadingPreview")}
        </span>
      ) : null}
      {error ? (
        <p className="project-detail__video-error">
          {t("work.previewUnavailable")}{" "}
          <a href={project.video.src} target="_blank" rel="noopener noreferrer">
            {t("work.watchVideo")}
          </a>
        </p>
      ) : (
        <button
          type="button"
          className="project-detail__play-toggle"
          onClick={togglePlayback}
          aria-label={t(playing ? "work.pauseVideo" : "work.watchVideo")}
        >
          {playing ? <FiPause /> : <FiPlay />}
        </button>
      )}
      <div className="project-detail__video-controls">
        <span className="project-detail__video-time" aria-hidden="true">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
        <input
          className="project-detail__seek"
          type="range"
          min="0"
          max={duration || 1}
          step="0.1"
          value={Math.min(currentTime, duration)}
          disabled={!duration || error}
          aria-label={t("work.seekVideo")}
          aria-valuetext={`${formatTime(currentTime)} / ${formatTime(duration)}`}
          style={{
            "--video-progress": `${duration ? (currentTime / duration) * 100 : 0}%`,
          }}
          onChange={(event) => {
            const time = Number(event.target.value);
            videoRef.current.currentTime = time;
            setCurrentTime(time);
          }}
        />
        <button
          type="button"
          className="project-detail__sound"
          onClick={() => setMuted(!muted)}
          aria-label={t(muted ? "work.unmute" : "work.mute")}
        >
          {muted ? <FiVolumeX /> : <FiVolume2 />}
        </button>
      </div>
    </div>
  );
}

function ProjectGallery({ project }) {
  const { t } = useTranslation();
  const [active, setActive] = useState(0);
  const isVideo = active === project.images.length;
  const captions = t(project.galleryKey, { returnObjects: true });
  const caption = isVideo ? t("work.fullDemo") : captions[active];
  const move = (direction) =>
    setActive(
      (current) =>
        (current + direction + project.images.length + 1) %
        (project.images.length + 1),
    );

  return (
    <section
      className="project-detail__gallery"
      aria-label={t("work.mediaAria", { project: t(project.titleKey) })}
    >
      <div className="project-detail__gallery-top">
        <span className="project-detail__window-dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span>
          {t(project.titleKey)}{" "}
          <span className="project-detail__gallery-divider">/</span> {caption}
        </span>
        <span>
          {String(active + 1).padStart(2, "0")} /{" "}
          {String(project.images.length + 1).padStart(2, "0")}
        </span>
      </div>
      <div className="project-detail__screen">
        {isVideo ? (
          <DemoPlayer project={project} />
        ) : (
          <a
            href={project.images[active]}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t("work.zoomImage", { caption })}
          >
            <img
              src={project.images[active]}
              width="1920"
              height="1080"
              alt={caption}
              decoding="async"
            />
            <span className="project-detail__zoom">
              <FiMaximize2 aria-hidden="true" />
            </span>
          </a>
        )}
      </div>
      <div className="project-detail__gallery-bottom">
        <div
          className="project-detail__thumbnails"
          onKeyDown={(event) => {
            if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
              event.preventDefault();
              move(event.key === "ArrowRight" ? 1 : -1);
            }
          }}
        >
          {project.images.map((image, index) => (
            <button
              key={image}
              type="button"
              className={active === index ? "is-active" : ""}
              aria-pressed={active === index}
              aria-label={captions[index]}
              onClick={() => setActive(index)}
            >
              <img
                src={project.previewImages?.[index] || image}
                alt=""
                loading="lazy"
                decoding="async"
              />
              <span>{String(index + 1).padStart(2, "0")}</span>
            </button>
          ))}
          <button
            type="button"
            className={`project-detail__video-thumb ${isVideo ? "is-active" : ""}`}
            aria-pressed={isVideo}
            aria-label={t("work.fullDemo")}
            onClick={() => setActive(project.images.length)}
          >
            <FiPlay aria-hidden="true" />
            <span>{project.video.duration}</span>
          </button>
        </div>
        <div className="project-detail__gallery-arrows">
          <button
            type="button"
            aria-label={t("work.previousMedia")}
            onClick={() => move(-1)}
          >
            <FiArrowLeft />
          </button>
          <button
            type="button"
            aria-label={t("work.nextMedia")}
            onClick={() => move(1)}
          >
            <FiArrowRight />
          </button>
        </div>
      </div>
    </section>
  );
}

export default function ProjectDetails({ project, onClose }) {
  const { t } = useTranslation();
  const dialogRef = useRef(null);
  const title = t(project.titleKey);
  const highlights = project.highlightKeys.map((key) => t(key));

  useEffect(() => {
    const dialog = dialogRef.current;
    const previousFocus = document.activeElement;
    dialog.showModal();
    document.body.classList.add("portfolio-modal-open");
    return () => {
      dialog.close();
      document.body.classList.remove("portfolio-modal-open");
      previousFocus?.focus({ preventScroll: true });
    };
  }, []);

  return createPortal(
    <dialog
      ref={dialogRef}
      className="project-detail"
      style={{ "--project-accent": project.accent }}
      aria-labelledby="project-detail-title"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="project-detail__inner">
        <div className="project-detail__topbar">
          <span>
            <span className="project-detail__dot" />
            {t("work.projectDetails")}
          </span>
          <button
            type="button"
            autoFocus
            onClick={onClose}
            aria-label={t("work.closeProjectModal")}
          >
            <FiX aria-hidden="true" />
          </button>
        </div>
        <header className="project-detail__heading">
          <div>
            <div className="project-detail__eyebrow">
              {t(project.typeKey)}
              <span> / </span>
              {t(project.visibilityKey)}
            </div>
            <h2 id="project-detail-title">
              {title}
              <span>.</span>
            </h2>
            <p>{t(project.roleKey)}</p>
          </div>
          {project.link ? (
            <ProjectSiteLink url={project.link} />
          ) : (
            <span className="project-detail__private">
              <FiLock aria-hidden="true" />
              {t("work.privateAccess")}
            </span>
          )}
        </header>
        <ProjectGallery project={project} />
        <div className="project-detail__editorial">
          <section className="project-detail__overview">
            <span className="project-detail__section-number">
              01 / {t("work.overviewTitle")}
            </span>
            <h3>{t(project.statementKey)}</h3>
            <p>{t(project.descriptionKey)}</p>
          </section>
          <section className="project-detail__stack">
            <span className="project-detail__section-number">
              02 / {t("work.technologiesTitle")}
            </span>
            {project.technologyGroups.map((group) => (
              <div className="project-detail__tech-group" key={group.labelKey}>
                <h4>{t(group.labelKey)}</h4>
                <div>
                  {group.tagKeys.map((key) => (
                    <span key={key}>{t(`work.projectTags.${key}`)}</span>
                  ))}
                </div>
              </div>
            ))}
          </section>
        </div>
        <section className="project-detail__highlights">
          <span className="project-detail__section-number">
            03 / {t("work.highlightsTitle")}
          </span>
          <div>
            {highlights.map((highlight, index) => (
              <article key={highlight}>
                <span>
                  <FiCheck aria-hidden="true" />
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p>{highlight}</p>
              </article>
            ))}
          </div>
        </section>
        <footer className="project-detail__footer">
          <span>
            {title} / {t("work.eyebrow")}
          </span>
          <button type="button" onClick={onClose}>
            {t("work.backProjects")}
            <FiArrowRight aria-hidden="true" />
          </button>
        </footer>
      </div>
    </dialog>,
    document.body,
  );
}
