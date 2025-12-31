"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Truck, CreditCard, Users, CheckCircle } from "lucide-react";
import styles from "./Blueprints.module.css";

export default function Blueprints() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const blueprints = [
    {
      id: "field",
      title: "Field Operations",
      subtitle: "Logistics, Delivery, Inspection Apps",
      Icon: Truck,
      pain: "Signal drops in basements and rural areas. The app spins. Data is lost.",
      fixes: [
        { label: "True Offline", desc: "The driver's app writes to local storage instantly. No spinners." },
        { label: "Queueing", desc: "GoSync holds the \"Delivered\" status in a persistent queue." },
        { label: "Auto-Reconcile", desc: "The second they hit 4G, the Merkle Tree syncs just that one record." },
      ],
    },
    {
      id: "pos",
      title: "Point of Sale",
      subtitle: "Retail, Kiosks, Inventory",
      Icon: CreditCard,
      pain: "Internet goes down during the morning rush. The POS stops. Revenue stops.",
      fixes: [
        { label: "Business as Usual", desc: "The POS continues to accept orders and modify inventory locally." },
        { label: "Unified Validation", desc: "The WASM 'Brain' ensures no invalid orders, even offline." },
        { label: "Batch Sync", desc: "When online, 500 orders sync in one optimized binary packet." },
      ],
    },
    {
      id: "saas",
      title: "Collaborative SaaS",
      subtitle: "Kanban Boards, Note Taking, CRMs",
      Icon: Users,
      pain: "Two users edit the same ticket. \"Last write wins\" overwrites everything.",
      fixes: [
        { label: "Shared Logic", desc: "Both clients run the exact same Go conflict resolution code." },
        { label: "Delta Updates", desc: "GoSync detects individual field changes and merges them intelligently." },
      ],
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
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section className={styles.section} id="blueprints" ref={ref}>
      <div className={styles.container}>
        {/* Header */}
        <motion.div
          className={styles.header}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.span className={styles.label} variants={itemVariants}>
            Use Cases
          </motion.span>
          <motion.h2 className={styles.title} variants={itemVariants}>
            Built for the Real World.
          </motion.h2>
          <motion.p className={styles.description} variants={itemVariants}>
            Don&apos;t just build apps. Build resilient systems that survive the chaos of the real world.
          </motion.p>
        </motion.div>

        {/* Blueprints Grid */}
        <motion.div
          className={styles.grid}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {blueprints.map((blueprint) => (
            <motion.article
              key={blueprint.id}
              className={styles.card}
              variants={itemVariants}
            >
              {/* Card Header */}
              <div className={styles.cardHeader}>
                <div className={styles.iconWrapper}>
                  <blueprint.Icon size={28} strokeWidth={1.5} />
                </div>
                <div className={styles.cardTitles}>
                  <h3 className={styles.cardTitle}>{blueprint.title}</h3>
                  <span className={styles.cardSubtitle}>{blueprint.subtitle}</span>
                </div>
              </div>

              {/* The Pain */}
              <div className={styles.painSection}>
                <span className={styles.painLabel}>The Problem</span>
                <p className={styles.painText}>{blueprint.pain}</p>
              </div>

              {/* The Fix */}
              <div className={styles.fixSection}>
                <span className={styles.fixLabel}>The GoSync Fix</span>
                <ul className={styles.fixList}>
                  {blueprint.fixes.map((fix, index) => (
                    <li key={index} className={styles.fixItem}>
                      <CheckCircle size={16} className={styles.checkIcon} />
                      <div>
                        <strong className={styles.fixName}>{fix.label}:</strong>{" "}
                        <span className={styles.fixDesc}>{fix.desc}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
