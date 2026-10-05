"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./Navigation.module.css";
import LogoMark from "./LogoMark";

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // On the homepage the logo returns to the top; elsewhere it navigates home.
  const onLogoClick = (e) => {
    if (pathname !== "/") return;
    e.preventDefault();
    setMobileMenuOpen(false);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    if (window.location.hash) history.replaceState(null, "", "/");
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#story", label: "Story" },
    { href: "#fit", label: "Is it for you?" },
    { href: "#compare", label: "Compare" },
    { href: "/docs", label: "Docs" },
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
          <Link href="/" className={styles.logo} onClick={onLogoClick} aria-label="GoSync home">
            <LogoMark className={styles.logoIcon} />
            <span className={styles.logoText}>GoSync</span>
          </Link>

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
          <Link href="/docs/quick-start" className={`${styles.ctaButton} gs-btn gs-btn-primary`}>
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
          </Link>

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
            <Link
              href="/docs/quick-start"
              className={`${styles.ctaButton} ${styles.mobileCta} gs-btn gs-btn-primary`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Get Started
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
