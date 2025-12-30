"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import styles from "./Roadmap.module.css";

export default function Roadmap() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const roadmapItems = [
    {
      status: "done",
      version: "v1.0",
      title: "Core Engine",
      description: "Merkle Tree sync, LWW conflict resolution, IndexedDB storage, WebSocket transport.",
      features: ["WASM compilation", "Offline-first", "Real-time sync"],
    },
    {
      status: "current",
      version: "v1.1",
      title: "Developer Experience",
      description: "CLI tooling, better error messages, TypeScript SDK improvements.",
      features: ["gosync CLI", "Type generation", "Debug mode"],
    },
    {
      status: "planned",
      version: "v1.2",
      title: "Advanced Conflict Resolution",
      description: "Custom merge strategies, CRDT support, conflict callbacks.",
      features: ["Custom resolvers", "CRDT types", "Merge hooks"],
    },
    {
      status: "planned",
      version: "v2.0",
      title: "GoSync Cloud (Optional)",
      description: "Managed hosting, team dashboards, analytics. Self-hosted remains free forever.",
      features: ["Managed sync", "Team admin", "Usage metrics"],
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
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
    <section className={styles.section} id="roadmap" ref={ref}>
      <div className={styles.container}>
        <motion.div
          className={styles.header}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.span className={styles.label} variants={itemVariants}>
            Roadmap
          </motion.span>
          <motion.h2 className={styles.title} variants={itemVariants}>
            Where We&apos;re Headed
          </motion.h2>
          <motion.p className={styles.description} variants={itemVariants}>
            GoSync is open source and community-driven. Here&apos;s what&apos;s next.
          </motion.p>
        </motion.div>

        <motion.div
          className={styles.timeline}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {roadmapItems.map((item, index) => (
            <motion.div
              key={item.version}
              className={`${styles.timelineItem} ${styles[item.status]}`}
              variants={itemVariants}
            >
              <div className={styles.timelineMarker}>
                <div className={styles.markerDot} />
                {index < roadmapItems.length - 1 && <div className={styles.markerLine} />}
              </div>
              <div className={styles.timelineContent}>
                <div className={styles.versionBadge}>{item.version}</div>
                <h3 className={styles.itemTitle}>{item.title}</h3>
                <p className={styles.itemDescription}>{item.description}</p>
                <div className={styles.features}>
                  {item.features.map((feature) => (
                    <span key={feature} className={styles.featureTag}>
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className={styles.cta}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.a
            href="https://github.com/gosync/gosync"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.ctaButton}
            variants={itemVariants}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            Star on GitHub
          </motion.a>
          <motion.a
            href="#"
            className={styles.ctaSecondary}
            variants={itemVariants}
          >
            Join Discord Community
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
