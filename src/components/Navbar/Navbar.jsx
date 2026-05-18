import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { LuLanguages } from "react-icons/lu";
import { FiMenu, FiX } from "react-icons/fi";
import "./Navbar.css";

const Motion = motion;

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("#home");

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

      setActiveSection(currentSection);
    };

    updateActiveSection();

    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);

    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, [navItems]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const closeOnScrollIntent = () => setIsOpen(false);
    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("scroll", closeOnScrollIntent, { passive: true });
    window.addEventListener("wheel", closeOnScrollIntent, { passive: true });
    window.addEventListener("touchmove", closeOnScrollIntent, { passive: true });
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      window.removeEventListener("scroll", closeOnScrollIntent);
      window.removeEventListener("wheel", closeOnScrollIntent);
      window.removeEventListener("touchmove", closeOnScrollIntent);
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

        <AnimatePresence>
          {isOpen && (
            <Motion.div
              id="navbar-mobile-menu"
              className="navbar__mobile"
              role="dialog"
              aria-modal="false"
              aria-label={t("navbar.primaryNavigation")}
              initial={{ opacity: 0, y: -14, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              <nav aria-label={t("navbar.primaryNavigation")}>
                <ul className="navbar__mobile-list">
                  {navItems.map((item, index) => {
                    const isActive = activeSection === item.href;

                    return (
                  <Motion.li
                        key={item.key}
                        initial={{ opacity: 0, x: -14 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ delay: index * 0.04 }}
                      >
                        <a
                          href={item.href}
                          className={`navbar__mobile-link ${
                            isActive ? "is-active" : ""
                          }`}
                          aria-current={isActive ? "page" : undefined}
                          onClick={closeMenu}
                        >
                          <span>{item.label}</span>
                        </a>
                  </Motion.li>
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
                >
                  <LuLanguages size={18} />
                  <span>{currentLanguageLabel}</span>
                </button>
              </div>
            </Motion.div>
          )}
        </AnimatePresence>
      </div>
    </Motion.header>
  );
}

export default Navbar;
