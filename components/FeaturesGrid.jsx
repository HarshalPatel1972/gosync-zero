"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { WifiOff, Minimize2, Zap, ShieldCheck, Database, Box } from "lucide-react";
import styles from "./FeaturesGrid.module.css";

export default function FeaturesGrid() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // 6 features for perfect 3x2 symmetrical grid
  const features = [
    {
      id: "offline",
      title: "True Offline-First",
      description:
        "Apps keep reading and writing without internet. Changes sync automatically when the connection returns.",
      Icon: WifiOff,
    },
    {
      id: "bandwidth",
      title: "Bandwidth Efficient",
      description:
        "Each device downloads only what changed since its last sync and uploads only its own pending writes. Batched, compressed and safe to retry.",
      Icon: Minimize2,
    },
    {
      id: "deadlock",
      title: "Conflict-Free Merging",
      description:
        "Every field is merged independently on a hybrid logical clock. Concurrent edits to different fields both survive, and every device converges.",
      Icon: Zap,
    },
    {
      id: "typesafe",
      title: "Secure by Default",
      description:
        "JWT auth with your own secret or any JWKS provider (Auth0, Clerk, Supabase, Firebase). Every user's data is isolated on the server.",
      Icon: ShieldCheck,
    },
    {
      id: "storage",
      title: "Real Local Database",
      description:
        "Data lives in IndexedDB, not localStorage, so it isn't capped at 5 MB and survives reloads, restarts and crashes.",
      Icon: Database,
    },
    {
      id: "dependencies",
      title: "Single Binary",
      description:
        "The server compiles to a single, static binary. No JVM, no Python runtime, no complex environment setup required.",
      Icon: Box,
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
              className={styles.card}
              variants={itemVariants}
            >
              <div className={styles.cardIcon}>
                <feature.Icon size={32} strokeWidth={1.5} />
              </div>
              <h3 className={styles.cardTitle}>{feature.title}</h3>
              <p className={styles.cardDescription}>{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
