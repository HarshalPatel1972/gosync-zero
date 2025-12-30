"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import styles from "./SolutionSection.module.css";

export default function SolutionSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const steps = [
    {
      number: "01",
      icon: (
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <path
            d="M24 4L6 14V34L24 44L42 34V14L24 4Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M24 20V28M24 32V32.01"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      ),
      title: "Define Your Logic",
      description:
        "Write your business rules, validation, and conflict resolution in pure Go. No special syntax. No framework lock-in.",
    },
    {
      number: "02",
      icon: (
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <rect
            x="6"
            y="8"
            width="36"
            height="32"
            rx="4"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M6 16H42M16 8V16M32 8V16"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M18 28L22 32L30 24"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      title: "Compile Once",
      description:
        "GoSync builds both a WASM module for browsers and a native binary for servers. One command, two targets, zero config.",
    },
    {
      number: "03",
      icon: (
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <circle cx="12" cy="24" r="6" stroke="currentColor" strokeWidth="2" />
          <circle cx="36" cy="12" r="6" stroke="currentColor" strokeWidth="2" />
          <circle cx="36" cy="36" r="6" stroke="currentColor" strokeWidth="2" />
          <path
            d="M18 22L30 14M18 26L30 34"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      ),
      title: "Deploy Everywhere",
      description:
        "Run the same logic on your server and in every client browser. Changes sync automatically via Merkle Tree deltas.",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section className={styles.section} ref={ref}>
      <div className={styles.container}>
        <motion.div
          className={styles.header}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.span className={styles.label} variants={itemVariants}>
            How It Works
          </motion.span>
          <motion.h2 className={styles.title} variants={itemVariants}>
            Three Steps. Infinite Possibilities.
          </motion.h2>
        </motion.div>

        <motion.div
          className={styles.steps}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              className={styles.stepCard}
              variants={itemVariants}
            >
              <span className={styles.stepNumber}>{step.number}</span>
              <div className={styles.stepIcon}>{step.icon}</div>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDescription}>{step.description}</p>
              
              {index < steps.length - 1 && (
                <div className={styles.connector}>
                  <svg width="100%" height="4" viewBox="0 0 100 4" preserveAspectRatio="none">
                    <line
                      x1="0"
                      y1="2"
                      x2="100"
                      y2="2"
                      stroke="url(#gradient)"
                      strokeWidth="2"
                      strokeDasharray="8 4"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="var(--sync-cyan)" />
                        <stop offset="100%" stopColor="var(--merkle-purple)" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
