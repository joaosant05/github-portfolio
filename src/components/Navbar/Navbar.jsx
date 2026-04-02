import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { HiOutlineMoon, HiOutlineSun } from "react-icons/hi2";
import { LuLanguages } from "react-icons/lu";
import { FiMenu, FiX } from "react-icons/fi";
import { useTheme } from "../../contexts/ThemeContext";
import "./Navbar.css";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("#home");

  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();

  const navItems = useMemo(
    () => [
      { key: "home", href: "#home", label: t("navbar.home") },
      { key: "about", href: "#about", label: t("navbar.about") },
      { key: "work", href: "#portfolio", label: t("navbar.work") },
      { key: "achievements", href: "#achievements", label: t("navbar.achievements") },
      { key: "contact", href: "#footer", label: t("navbar.contact") },
    ],
    [t]
  );

  useEffect(() => {
    localStorage.setItem("language", i18n.language);
  }, [i18n.language]);

  useEffect(() => {
    const sections = navItems
      .map((item) => document.querySelector(item.href))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries.find((entry) => entry.isIntersecting);

        if (visibleEntry?.target?.id) {
          setActiveSection(`#${visibleEntry.target.id}`);
        }
      },
      {
        rootMargin: "-35% 0px -45% 0px",
        threshold: 0.2,
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [navItems]);

  const closeMenu = () => setIsOpen(false);

  const toggleLanguage = () => {
    const nextLanguage = i18n.language === "pt-BR" ? "en-US" : "pt-BR";
    i18n.changeLanguage(nextLanguage);
  };

  const currentLanguageLabel = i18n.language === "pt-BR" ? "PT" : "EN";

  return (
    <motion.header
      className="navbar"
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="c-space">
        <div className="navbar__shell">
          <a href="#home" className="navbar__brand" onClick={closeMenu}>
            <span className="navbar__brand-dot" />
            <span className="navbar__brand-text">{t("navbar.brand")}</span>
          </a>

          <nav className="navbar__desktop" aria-label="Primary">
            <ul className="navbar__list">
              {navItems.map((item) => {
                const isActive = activeSection === item.href;

                return (
                  <li key={item.key} className="navbar__item">
                    <a
                      href={item.href}
                      className={`navbar__link ${isActive ? "is-active" : ""}`}
                    >
                      <span>{item.label}</span>

                      {isActive && (
                        <motion.span
                          layoutId="navbar-active-pill"
                          className="navbar__active-pill"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="navbar__actions">
            <motion.button
              whileTap={{ scale: 0.96 }}
              whileHover={{ y: -1 }}
              className="navbar__action-btn"
              type="button"
              onClick={toggleLanguage}
              aria-label={t("navbar.changeLanguage")}
              title={t("navbar.changeLanguage")}
            >
              <LuLanguages size={18} />
              <span>{currentLanguageLabel}</span>
            </motion.button>

            {/* <motion.button
              whileTap={{ scale: 0.96 }}
              whileHover={{ y: -1 }}
              className="navbar__theme-btn"
              type="button"
              onClick={toggleTheme}
              aria-label={t("navbar.changeTheme")}
              title={t("navbar.changeTheme")}
            >
              <motion.div
                className="navbar__theme-thumb"
                animate={{ x: theme === "dark" ? 0 : 26 }}
                transition={{ type: "spring", stiffness: 320, damping: 22 }}
              >
                {theme === "dark" ? <HiOutlineMoon size={14} /> : <HiOutlineSun size={14} />}
              </motion.div>
            </motion.button> */}

            <button
              className="navbar__toggle"
              type="button"
              aria-label={isOpen ? t("navbar.closeMenu") : t("navbar.openMenu")}
              onClick={() => setIsOpen((prev) => !prev)}
            >
              {isOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="navbar__mobile"
              initial={{ opacity: 0, y: -14, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              <ul className="navbar__mobile-list">
                {navItems.map((item, index) => (
                  <motion.li
                    key={item.key}
                    initial={{ opacity: 0, x: -14 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ delay: index * 0.04 }}
                  >
                    <a
                      href={item.href}
                      className={`navbar__mobile-link ${
                        activeSection === item.href ? "is-active" : ""
                      }`}
                      onClick={closeMenu}
                    >
                      {item.label}
                    </a>
                  </motion.li>
                ))}
              </ul>

              <div className="navbar__mobile-actions">
                <button
                  className="navbar__action-btn"
                  type="button"
                  onClick={toggleLanguage}
                  aria-label={t("navbar.changeLanguage")}
                >
                  <LuLanguages size={18} />
                  <span>{currentLanguageLabel}</span>
                </button>

                <button
                  className="navbar__action-btn"
                  type="button"
                  onClick={toggleTheme}
                  aria-label={t("navbar.changeTheme")}
                >
                  {theme === "dark" ? <HiOutlineMoon size={18} /> : <HiOutlineSun size={18} />}
                  <span>{theme === "dark" ? t("navbar.dark") : t("navbar.light")}</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}

export default Navbar;