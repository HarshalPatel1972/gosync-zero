"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import styles from "./FeaturesGrid.module.css";

export default function FeaturesGrid() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const features = [
    {
      id: "offline",
      title: "True Offline-First",
      description:
        "Apps continue to work perfectly—read and write—without internet. Data syncs automatically when you're back online.",
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <circle
            cx="20"
            cy="20"
            r="16"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M20 12V20L26 26"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M8 8L32 32"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      ),
      color: "cyan",
      size: "large",
    },
    {
      id: "bandwidth",
      title: "Bandwidth Efficient",
      description:
        "Compare Merkle roots first. If they match, zero data sent. If not, drill down to only the changed items.",
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <path
            d="M20 8V32M12 16L20 8L28 16M12 24L20 32L28 24"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      color: "purple",
      size: "medium",
    },
    {
      id: "deadlock",
      title: "Deadlock-Free",
      description:
        "Custom non-blocking I/O prevents the WASM runtime from freezing your browser during heavy sync operations.",
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <circle
            cx="14"
            cy="14"
            r="6"
            stroke="currentColor"
            strokeWidth="2"
          />
          <circle
            cx="26"
            cy="26"
            r="6"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M18 18L22 22"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      ),
      color: "emerald",
      size: "medium",
    },
    {
      id: "privacy",
      title: "Privacy-Centric",
      description:
        "Self-hosted binary. Your data never touches third-party clouds. GDPR and HIPAA friendly by design.",
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <path
            d="M20 6L8 12V20C8 28 20 34 20 34C20 34 32 28 32 20V12L20 6Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M15 20L18 23L25 16"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      color: "magenta",
      size: "medium",
    },
    {
      id: "storage",
      title: "Massive Storage",
      description:
        "Bypasses LocalStorage's 5MB limit. Uses IndexedDB to store gigabytes of offline data in the browser.",
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <rect
            x="8"
            y="8"
            width="24"
            height="8"
            rx="2"
            stroke="currentColor"
            strokeWidth="2"
          />
          <rect
            x="8"
            y="16"
            width="24"
            height="8"
            rx="2"
            stroke="currentColor"
            strokeWidth="2"
          />
          <rect
            x="8"
            y="24"
            width="24"
            height="8"
            rx="2"
            stroke="currentColor"
            strokeWidth="2"
          />
          <circle cx="28" cy="12" r="2" fill="currentColor" />
          <circle cx="28" cy="20" r="2" fill="currentColor" />
          <circle cx="28" cy="28" r="2" fill="currentColor" />
        </svg>
      ),
      color: "cyan",
      size: "wide",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section className={styles.section} id="features" ref={ref}>
      <div className={styles.container}>
        <motion.div
          className={styles.header}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.span className={styles.label} variants={itemVariants}>
            Features
          </motion.span>
          <motion.h2 className={styles.title} variants={itemVariants}>
            Everything You Need. Nothing You Don&apos;t.
          </motion.h2>
        </motion.div>

        <motion.div
          className={styles.grid}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {features.map((feature) => (
            <motion.div
              key={feature.id}
              className={`${styles.card} ${styles[feature.size]} ${styles[feature.color]}`}
              variants={itemVariants}
            >
              <div className={styles.cardIcon}>{feature.icon}</div>
              <h3 className={styles.cardTitle}>{feature.title}</h3>
              <p className={styles.cardDescription}>{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
