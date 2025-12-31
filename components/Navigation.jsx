"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./Navigation.module.css";

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#features", label: "Features" },
    { href: "#demo", label: "Demo" },
    { href: "/docs", label: "Docs" },
    { href: "#roadmap", label: "Roadmap" },
    { href: "https://github.com/HarshalPatel1972/GoSync", label: "GitHub", external: true },
  ];

  return (
    <>
      <motion.nav
        className={`${styles.nav} ${scrolled ? styles.scrolled : ""}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className={styles.container}>
          {/* Logo */}
          <a href="#" className={styles.logo}>
            <svg
              className={styles.logoIcon}
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
            >
              <circle cx="16" cy="8" r="4" fill="currentColor" />
              <circle cx="8" cy="22" r="4" fill="currentColor" />
              <circle cx="24" cy="22" r="4" fill="currentColor" />
              <line
                x1="16"
                y1="12"
                x2="10"
                y2="18"
                stroke="currentColor"
                strokeWidth="2"
              />
              <line
                x1="16"
                y1="12"
                x2="22"
                y2="18"
                stroke="currentColor"
                strokeWidth="2"
              />
              <line
                x1="12"
                y1="22"
                x2="20"
                y2="22"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
            <span className={styles.logoText}>GoSync</span>
          </a>

          {/* Desktop Navigation */}
          <div className={styles.navLinks}>
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={styles.navLink}
                {...(link.external && {
                  target: "_blank",
                  rel: "noopener noreferrer",
                })}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* CTA Button */}
          <a href="#roadmap" className={styles.ctaButton}>
            Get Started
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M6 3L11 8L6 13"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>

          {/* Mobile Menu Button */}
          <button
            className={styles.menuButton}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            <span className={`${styles.menuLine} ${mobileMenuOpen ? styles.open : ""}`} />
            <span className={`${styles.menuLine} ${mobileMenuOpen ? styles.open : ""}`} />
            <span className={`${styles.menuLine} ${mobileMenuOpen ? styles.open : ""}`} />
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className={styles.mobileMenu}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {navLinks.map((link, index) => (
              <motion.a
                key={link.href}
                href={link.href}
                className={styles.mobileLink}
                onClick={() => setMobileMenuOpen(false)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                {...(link.external && {
                  target: "_blank",
                  rel: "noopener noreferrer",
                })}
              >
                {link.label}
              </motion.a>
            ))}
            <a
              href="#roadmap"
              className={`${styles.ctaButton} ${styles.mobileCta}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Get Started
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
