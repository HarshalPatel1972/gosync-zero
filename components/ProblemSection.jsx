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
            Offline Sync Is a Trap.
          </motion.h2>
          <motion.p className={styles.description} variants={itemVariants}>
            Making an app work offline sounds simple: cache the data, queue the writes, retry later. Then come two tabs, two devices, flaky networks, skewed clocks and edits that collide. Hand-rolled sync breaks in exactly the moments users care about.{" "}
            <span className={styles.highlight}>Lost edits. Duplicates. Data that never matches.</span>
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
              <span className={styles.cardBadge}>❌ THE HAND-ROLLED WAY</span>
            </div>
            <div className={styles.codeBlocks}>
              <div className={styles.codeBlock}>
                <div className={styles.codeLabel}>
                  <span className={styles.fileIcon}>📄</span>
                  offline-queue.js
                </div>
                <pre className={styles.code}>
                  <code>
                    <span className={styles.keyword}>async function</span>{" "}
                    <span className={styles.function}>save</span>(task) {"{"}{"\n"}
                    {"  "}cache.<span className={styles.function}>put</span>(task); queue.<span className={styles.function}>push</span>(task);{"\n"}
                    {"  "}<span className={styles.keyword}>try</span> {"{"} <span className={styles.keyword}>await</span> <span className={styles.function}>fetch</span>(<span className={styles.string}>&quot;/api/tasks&quot;</span>, ...) {"}"}{"\n"}
                    {"  "}<span className={styles.keyword}>catch</span> {"{"} <span className={styles.function}>retryLater</span>() {"}"} <span className={styles.comment}>{"// twice? out of order?"}</span>{"\n"}
                    {"}"}
                  </code>
                </pre>
              </div>
              <div className={styles.separator}>
                <span className={styles.separatorIcon}>⚠️</span>
                <span>Then the edge cases</span>
              </div>
              <div className={styles.codeBlock}>
                <div className={styles.codeLabel}>
                  <span className={styles.fileIcon}>📄</span>
                  merge.js
                </div>
                <pre className={styles.code}>
                  <code>
                    <span className={styles.keyword}>if</span> (remote.updatedAt {">"} local.updatedAt) local = remote;{"\n"}
                    <span className={styles.comment}>{"// wrong clock? both edited different fields?"}</span>{"\n"}
                    <span className={styles.comment}>{"// another tab? a delete while offline? ..."}</span>
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
                  <span className={styles.fileIcon}>⚡</span>
                  app.js
                </div>
                <pre className={styles.code}>
                  <code>
                    <span className={styles.keyword}>await</span> db.<span className={styles.function}>set</span>(<span className={styles.string}>&quot;tasks&quot;</span>, id, task);{"\n"}
                    db.<span className={styles.function}>watch</span>(<span className={styles.string}>&quot;tasks&quot;</span>, render);{"\n"}
                    {"\n"}
                    <span className={styles.comment}>{"// Offline queue, retries, real-time updates,"}</span>{"\n"}
                    <span className={styles.comment}>{"// conflicts, clocks and tabs: handled."}</span>
                  </code>
                </pre>
              </div>
              <div className={styles.deployTargets}>
                <div className={styles.deployTarget}>
                  <div className={styles.deployIcon}>🌐</div>
                  <span>Every Browser &amp; Tab</span>
                </div>
                <div className={styles.deployLine} />
                <div className={styles.deployTarget}>
                  <div className={styles.deployIcon}>🖥️</div>
                  <span>Your Go Server</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
