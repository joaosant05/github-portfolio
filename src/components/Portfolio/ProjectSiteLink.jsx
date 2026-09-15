import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { FiCheck, FiCopy, FiGlobe } from "react-icons/fi";

export default function ProjectSiteLink({ url }) {
  const { t } = useTranslation();
  const [status, setStatus] = useState("");
  const resetTimer = useRef(null);
  useEffect(() => () => clearTimeout(resetTimer.current), []);

  const copyUrl = async () => {
    clearTimeout(resetTimer.current);
    try {
      await navigator.clipboard.writeText(url);
      setStatus("copied");
    } catch {
      setStatus("copyFailed");
    }
    resetTimer.current = setTimeout(() => setStatus(""), 3000);
  };

  return (
    <div className="project-site-link">
      <a href={url} target="_blank" rel="noopener noreferrer" title={url}>
        <FiGlobe aria-hidden="true" />
        <span>{url}</span>
      </a>
      <button
        type="button"
        onClick={copyUrl}
        aria-label={t(status === "copied" ? "work.copied" : "work.copyUrl")}
        title={t(status === "copied" ? "work.copied" : "work.copyUrl")}
      >
        {status === "copied" ? (
          <FiCheck aria-hidden="true" />
        ) : (
          <FiCopy aria-hidden="true" />
        )}
      </button>
      <span className="project-site-link__status" role="status">
        {status ? t(`work.${status}`) : ""}
      </span>
    </div>
  );
}
