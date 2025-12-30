"use client";

import { motion } from "framer-motion";
import styles from "./Footer.module.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    Product: [
      { label: "Features", href: "#features" },
      { label: "Demo", href: "#demo" },
      { label: "Roadmap", href: "#roadmap" },
    ],
    Resources: [
      { label: "Documentation", href: "/docs" },
      { label: "Quick Start", href: "/docs/quick-start" },
      { label: "GitHub", href: "https://github.com/HarshalPatel1972/gosync-zero", external: true },
    ],
    Legal: [
      { label: "MIT License", href: "https://github.com/HarshalPatel1972/gosync-zero/blob/main/LICENSE", external: true },
      { label: "Contributing", href: "https://github.com/HarshalPatel1972/gosync-zero/blob/main/CONTRIBUTING.md", external: true },
    ],
  };

  const socialLinks = [
    {
      label: "GitHub",
      href: "https://github.com/HarshalPatel1972/gosync-zero",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
        </svg>
      ),
    },
    {
      label: "NPM",
      href: "https://www.npmjs.com/package/@harshalpatel2868/gosync-client",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M0 7.334v8h6.666v1.332H12v-1.332h12v-8H0zm6.666 6.664H5.334v-4H3.999v4H1.335V8.667h5.331v5.331zm4 0v1.336H8.001V8.667h5.334v5.332h-2.669v-.001zm12.001 0h-1.33v-4h-1.336v4h-1.335v-4h-1.33v4h-2.671V8.667h8.002v5.331zM10.665 10H12v2.667h-1.335V10z" />
        </svg>
      ),
    },
  ];

  return (
    <footer className={styles.footer}>
      {/* CTA Section */}
      <div className={styles.ctaSection}>
        <div className={styles.container}>
          <motion.h2
            className={styles.ctaTitle}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Ready to Sync Smarter?
          </motion.h2>
          <motion.div
            className={styles.ctaButtons}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <a href="/docs" className={styles.btnPrimary}>
              Get Started
            </a>
            <a 
              href="https://github.com/HarshalPatel1972/gosync-zero" 
              target="_blank"
              rel="noopener noreferrer"
              className={styles.btnSecondary}
            >
              View on GitHub
            </a>
          </motion.div>
        </div>
      </div>

      {/* Links Section */}
      <div className={styles.linksSection}>
        <div className={styles.container}>
          <div className={styles.linksGrid}>
            {/* Brand */}
            <div className={styles.brandColumn}>
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
              <p className={styles.tagline}>In an async world. GoSync.</p>
              <p className={styles.openSource}>Open Source · MIT License</p>
            </div>

            {/* Link Columns */}
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category} className={styles.linkColumn}>
                <h4 className={styles.linkCategory}>{category}</h4>
                <ul className={styles.linkList}>
                  {links.map((link) => (
                    <li key={link.label}>
                      <a 
                        href={link.href} 
                        className={styles.link}
                        target={link.external ? "_blank" : undefined}
                        rel={link.external ? "noopener noreferrer" : undefined}
                      >
                        {link.label}
                        {link.external && (
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={styles.externalIcon}>
                            <path d="M3 9L9 3M9 3H4M9 3V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className={styles.bottomBar}>
        <div className={styles.container}>
          <div className={styles.bottomContent}>
            <p className={styles.copyright}>
              © {currentYear} GoSync. Built by Harshal Patel.
            </p>
            <div className={styles.socialLinks}>
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className={styles.socialLink}
                  aria-label={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
