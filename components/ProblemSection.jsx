"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import styles from "./ProblemSection.module.css";

export default function ProblemSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

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
            The Problem
          </motion.span>
          <motion.h2 className={styles.title} variants={itemVariants}>
            You&apos;re Writing Everything Twice.
          </motion.h2>
          <motion.p className={styles.description} variants={itemVariants}>
            Every sync solution forces you to duplicate business logic. Validation in JavaScript for the frontend. The same validation again in Python, Node, or Go for the backend. When they inevitably drift apart?{" "}
            <span className={styles.highlight}>Bugs. Data corruption. Angry users.</span>
          </motion.p>
        </motion.div>

        <motion.div
          className={styles.comparison}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {/* Old Way */}
          <motion.div
            className={`${styles.codeCard} ${styles.oldWay}`}
            variants={itemVariants}
          >
            <div className={styles.cardHeader}>
              <span className={styles.cardBadge}>❌ THE OLD WAY</span>
            </div>
            <div className={styles.codeBlocks}>
              <div className={styles.codeBlock}>
                <div className={styles.codeLabel}>
                  <span className={styles.fileIcon}>📄</span>
                  Frontend (JavaScript)
                </div>
                <pre className={styles.code}>
                  <code>
                    <span className={styles.keyword}>function</span>{" "}
                    <span className={styles.function}>validateTask</span>(task) {"{"}{"\n"}
                    {"  "}<span className={styles.keyword}>if</span> (!task.title) {"{"}{"\n"}
                    {"    "}<span className={styles.keyword}>throw</span> <span className={styles.string}>&quot;Title required&quot;</span>;{"\n"}
                    {"  }"}{"\n"}
                    {"  "}<span className={styles.comment}>// 50 more lines...</span>{"\n"}
                    {"}"}
                  </code>
                </pre>
              </div>
              <div className={styles.separator}>
                <span className={styles.separatorIcon}>⚠️</span>
                <span>Duplicated!</span>
              </div>
              <div className={styles.codeBlock}>
                <div className={styles.codeLabel}>
                  <span className={styles.fileIcon}>📄</span>
                  Backend (Python)
                </div>
                <pre className={styles.code}>
                  <code>
                    <span className={styles.keyword}>def</span>{" "}
                    <span className={styles.function}>validate_task</span>(task):{"\n"}
                    {"  "}<span className={styles.keyword}>if not</span> task.title:{"\n"}
                    {"    "}<span className={styles.keyword}>raise</span> <span className={styles.string}>&quot;Title required&quot;</span>{"\n"}
                    {"  "}<span className={styles.comment}># 50 more lines...</span>
                  </code>
                </pre>
              </div>
            </div>
          </motion.div>

          {/* Arrow */}
          <motion.div className={styles.arrow} variants={itemVariants}>
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <path
                d="M20 12L32 24L20 36"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>

          {/* GoSync Way */}
          <motion.div
            className={`${styles.codeCard} ${styles.goSyncWay}`}
            variants={itemVariants}
          >
            <div className={styles.cardHeader}>
              <span className={styles.cardBadge}>✓ THE GOSYNC WAY</span>
            </div>
            <div className={styles.codeBlocks}>
              <div className={styles.codeBlock}>
                <div className={styles.codeLabel}>
                  <span className={styles.fileIcon}>🧠</span>
                  Shared Brain (Go)
                </div>
                <pre className={styles.code}>
                  <code>
                    <span className={styles.keyword}>func</span>{" "}
                    <span className={styles.function}>ValidateTask</span>(t <span className={styles.type}>*Task</span>) <span className={styles.type}>error</span> {"{"}{"\n"}
                    {"  "}<span className={styles.keyword}>if</span> t.Title == <span className={styles.string}>&quot;&quot;</span> {"{"}{"\n"}
                    {"    "}<span className={styles.keyword}>return</span> errors.New(<span className={styles.string}>&quot;required&quot;</span>){"\n"}
                    {"  }"}{"\n"}
                    {"  "}<span className={styles.comment}>// Write once, run everywhere</span>{"\n"}
                    {"}"}
                  </code>
                </pre>
              </div>
              <div className={styles.deployTargets}>
                <div className={styles.deployTarget}>
                  <div className={styles.deployIcon}>🌐</div>
                  <span>Browser (WASM)</span>
                </div>
                <div className={styles.deployLine} />
                <div className={styles.deployTarget}>
                  <div className={styles.deployIcon}>🖥️</div>
                  <span>Server (Native)</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
