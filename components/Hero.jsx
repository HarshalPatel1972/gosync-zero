"use client";

import { motion } from "framer-motion";
import ParticleField from "./ParticleField";
import styles from "./Hero.module.css";

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
  };

  const gosyncLetters = "GoSync".split("");

  return (
    <section className={styles.hero}>
      <ParticleField />

      <motion.div
        className={styles.content}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Badge */}
        <motion.div className={styles.badge} variants={itemVariants}>
          <span className={styles.badgeDot} />
          Now in Public Beta
        </motion.div>

        {/* Tagline */}
        <motion.p className={styles.tagline} variants={itemVariants}>
          In an async world.
        </motion.p>

        {/* Product Name */}
        <motion.h1 className={styles.title} variants={itemVariants}>
          {gosyncLetters.map((letter, i) => (
            <motion.span
              key={i}
              custom={i}
              variants={letterVariants}
              className={styles.letter}
            >
              {letter}
            </motion.span>
          ))}
        </motion.h1>

        {/* Subtitle */}
        <motion.p className={styles.subtitle} variants={itemVariants}>
          Write your sync logic once in Go. Deploy to server and browser.
          <br />
          Offline-first. Automatic conflict resolution. Zero vendor lock-in.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div className={styles.ctas} variants={itemVariants}>
          <a href="#roadmap" className={styles.ctaPrimary}>
            Get Started Free
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M7.5 5L12.5 10L7.5 15"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
          <a
            href="https://github.com/gosync/gosync"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.ctaSecondary}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            View on GitHub
          </a>
        </motion.div>

        {/* Honest Badges */}
        <motion.div className={styles.socialProof} variants={itemVariants}>
          <div className={styles.proofItem}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 1L10 5H14L11 8L12 13L8 10L4 13L5 8L2 5H6L8 1Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
            </svg>
            <span>Open Source (MIT)</span>
          </div>
          <span className={styles.proofDivider} />
          <div className={styles.proofItem}>
            <span>100% Go + WASM</span>
          </div>
          <span className={styles.proofDivider} />
          <div className={styles.proofItem}>
            <span>Self-Hosted</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className={styles.scrollIndicator}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <motion.span
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M7 10L12 15L17 10"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.span>
      </motion.div>
    </section>
  );
}
