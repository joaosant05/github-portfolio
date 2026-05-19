import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { LuLanguages } from "react-icons/lu";
import { FiMenu, FiX } from "react-icons/fi";
import "./Navbar.css";

const Motion = motion;

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("#home");
  const menuRef = useRef(null);
  const toggleRef = useRef(null);

  const { t, i18n } = useTranslation();

  const navItems = useMemo(
    () => [
      { key: "home", href: "#home", label: t("navbar.home") },
      { key: "about", href: "#about", label: t("navbar.about") },
      { key: "work", href: "#portfolio", label: t("navbar.work") },
      { key: "contact", href: "#contact", label: t("navbar.contact") },
    ],
    [t]
  );

  useEffect(() => {
    localStorage.setItem("language", i18n.language);
  }, [i18n.language]);

  useEffect(() => {
    let raf = 0;

    const updateActiveSection = () => {
      const sections = navItems
        .map((item) => document.querySelector(item.href))
        .filter(Boolean);

      if (!sections.length) return;

      const navbarOffset = 140;
      const currentScroll = window.scrollY + navbarOffset;

      let currentSection = "#home";

      for (const section of sections) {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionBottom = sectionTop + sectionHeight;
        const sectionId = `#${section.id}`;

        if (currentScroll >= sectionTop && currentScroll < sectionBottom) {
          currentSection = sectionId;
          break;
        }
      }

      const pageBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 10;

      if (pageBottom) {
        currentSection = navItems[navItems.length - 1]?.href || "#contact";
      }

      setActiveSection((current) =>
        current === currentSection ? current : currentSection
      );
    };

    const scheduleActiveSectionUpdate = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        updateActiveSection();
      });
    };

    updateActiveSection();

    window.addEventListener("scroll", scheduleActiveSectionUpdate, {
      passive: true,
    });
    window.addEventListener("resize", scheduleActiveSectionUpdate);

    return () => {
      window.removeEventListener("scroll", scheduleActiveSectionUpdate);
      window.removeEventListener("resize", scheduleActiveSectionUpdate);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [navItems]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const closeOnOutsidePointer = (event) => {
      const menu = menuRef.current;
      const toggle = toggleRef.current;
      const target = event.target;

      if (menu?.contains(target) || toggle?.contains(target)) {
        return;
      }

      setIsOpen(false);
    };

    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", closeOnOutsidePointer);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("pointerdown", closeOnOutsidePointer);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen]);

  const closeMenu = () => setIsOpen(false);

  const toggleLanguage = () => {
    const nextLanguage = i18n.language === "pt-BR" ? "en-US" : "pt-BR";
    i18n.changeLanguage(nextLanguage);
  };

  const currentLanguageLabel =
    i18n.language === "pt-BR"
      ? t("navbar.languageShort.ptBr")
      : t("navbar.languageShort.enUs");

  return (
    <Motion.header
      className="navbar"
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="c-space">
        <div className="navbar__shell">
          <a className="navbar__brand" href="#home" onClick={closeMenu}>
            <span className="navbar__brand-dot" aria-hidden="true" />
            <span className="navbar__brand-text">{t("navbar.brand")}</span>
          </a>

          <nav
            className="navbar__desktop"
            aria-label={t("navbar.primaryNavigation")}
          >
            <ul className="navbar__list">
              {navItems.map((item) => {
                const isActive = activeSection === item.href;

                return (
                  <li key={item.key} className="navbar__item">
                    <a
                      href={item.href}
                      className={`navbar__link ${isActive ? "is-active" : ""}`}
                      aria-current={isActive ? "page" : undefined}
                    >
                      <span>{item.label}</span>

                      {isActive && (
                        <Motion.span
                          layoutId="navbar-active-pill"
                          className="navbar__active-pill"
                          transition={{
                            type: "spring",
                            stiffness: 380,
                            damping: 30,
                          }}
                        />
                      )}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="navbar__actions">
            <Motion.button
              whileTap={{ scale: 0.96 }}
              whileHover={{ y: -1 }}
              className="navbar__action-btn navbar__language-btn navbar__language-btn--desktop"
              type="button"
              onClick={toggleLanguage}
              aria-label={t("navbar.changeLanguage")}
              title={t("navbar.changeLanguage")}
            >
              <LuLanguages size={18} />
              <span>{currentLanguageLabel}</span>
            </Motion.button>

            <button
              ref={toggleRef}
              className="navbar__toggle"
              type="button"
              aria-label={isOpen ? t("navbar.closeMenu") : t("navbar.openMenu")}
              aria-expanded={isOpen}
              aria-controls="navbar-mobile-menu"
              onClick={() => setIsOpen((prev) => !prev)}
            >
              {isOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </div>

        <div
          ref={menuRef}
          id="navbar-mobile-menu"
          className={`navbar__mobile ${isOpen ? "is-open" : ""}`}
          data-state={isOpen ? "open" : "closed"}
          role="dialog"
          aria-modal="false"
          aria-hidden={!isOpen}
          aria-label={t("navbar.primaryNavigation")}
        >
          <nav aria-label={t("navbar.primaryNavigation")}>
            <ul className="navbar__mobile-list">
              {navItems.map((item) => {
                const isActive = activeSection === item.href;

                return (
                  <li key={item.key}>
                    <a
                      href={item.href}
                      className={`navbar__mobile-link ${
                        isActive ? "is-active" : ""
                      }`}
                      aria-current={isActive ? "page" : undefined}
                      tabIndex={isOpen ? undefined : -1}
                      onClick={closeMenu}
                    >
                      <span>{item.label}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="navbar__mobile-actions">
            <button
              className="navbar__action-btn navbar__language-btn"
              type="button"
              onClick={toggleLanguage}
              aria-label={t("navbar.changeLanguage")}
              tabIndex={isOpen ? undefined : -1}
            >
              <LuLanguages size={18} />
              <span>{currentLanguageLabel}</span>
            </button>
          </div>
        </div>
      </div>
    </Motion.header>
  );
}

export default Navbar;
