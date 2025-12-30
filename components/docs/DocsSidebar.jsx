"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./DocsSidebar.module.css";

const navItems = [
  { slug: "introduction", title: "Introduction", icon: "📖" },
  { slug: "quick-start", title: "Quick Start", icon: "⚡" },
  { slug: "server-setup", title: "Server Setup", icon: "🖥️" },
  { slug: "conflict-resolution", title: "Conflict Resolution", icon: "⚔️" },
];

export default function DocsSidebar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const currentSlug = pathname.split("/").pop() || "introduction";

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className={styles.mobileMenuButton}
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle navigation"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          {mobileMenuOpen ? (
            <path d="M6 6L18 18M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          ) : (
            <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          )}
        </svg>
        <span>Menu</span>
      </button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className={styles.mobileOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={`${styles.sidebar} ${mobileMenuOpen ? styles.open : ""}`}
        initial={false}
      >
        <div className={styles.sidebarHeader}>
          <Link href="/" className={styles.logoLink}>
            <span className={styles.logoIcon}>↩</span>
            Back to Home
          </Link>
        </div>

        <nav className={styles.nav}>
          <div className={styles.navSection}>
            <span className={styles.navSectionTitle}>Getting Started</span>
            <ul className={styles.navList}>
              {navItems.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={`/docs/${item.slug}`}
                    className={`${styles.navItem} ${currentSlug === item.slug ? styles.active : ""}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className={styles.navIcon}>{item.icon}</span>
                    <span className={styles.navLabel}>{item.title}</span>
                    {currentSlug === item.slug && (
                      <motion.div
                        className={styles.activeIndicator}
                        layoutId="activeNav"
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.navSection}>
            <span className={styles.navSectionTitle}>Resources</span>
            <ul className={styles.navList}>
              <li>
                <a
                  href="https://github.com/HarshalPatel1972/GoSync"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.navItem}
                >
                  <span className={styles.navIcon}>📦</span>
                  <span className={styles.navLabel}>GitHub</span>
                  <svg className={styles.externalIcon} width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M3 9L9 3M9 3H4M9 3V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </li>
              <li>
                <a
                  href="https://www.npmjs.com/package/@harshalpatel2868/gosync-client"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.navItem}
                >
                  <span className={styles.navIcon}>📚</span>
                  <span className={styles.navLabel}>NPM Package</span>
                  <svg className={styles.externalIcon} width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M3 9L9 3M9 3H4M9 3V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </li>
            </ul>
          </div>
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.versionBadge}>
            <span>v0.1.0</span>
            <span className={styles.betaTag}>Beta</span>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
