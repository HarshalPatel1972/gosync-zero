"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import styles from "./Pricing.module.css";

export default function Pricing() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // GoSync is open source with no paid tiers. Don't add paid plans here
  // until the support, billing and SLA behind them actually exist.
  const plans = [
    {
      id: "opensource",
      name: "Open Source",
      price: "$0",
      period: "forever",
      description: "The complete sync engine, self-hosted on your infrastructure.",
      features: [
        "Full sync engine, client and server",
        "MIT licensed: use it commercially",
        "Unlimited users, devices and data",
        "No per-seat or per-request fees",
        "Your data never leaves your servers",
        "Community support on GitHub",
      ],
      cta: "Get Started",
      ctaHref: "/docs/quick-start",
      highlighted: true,
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
    <section className={styles.section} id="pricing" ref={ref}>
      <div className={styles.container}>
        <motion.div
          className={styles.header}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.span className={styles.label} variants={itemVariants}>
            Pricing
          </motion.span>
          <motion.h2 className={styles.title} variants={itemVariants}>
            Free. Forever.
          </motion.h2>
          <motion.p className={styles.description} variants={itemVariants}>
            GoSync is open source. You run it, you own it, and there&apos;s no bill as you grow.
          </motion.p>
        </motion.div>

        <motion.div
          className={`${styles.grid} ${styles.single}`}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {plans.map((plan) => (
            <motion.div
              key={plan.id}
              className={`${styles.card} ${plan.highlighted ? styles.highlighted : ""}`}
              variants={itemVariants}
            >
              {plan.badge && <span className={styles.badge}>{plan.badge}</span>}
              <h3 className={styles.planName}>{plan.name}</h3>
              <div className={styles.priceContainer}>
                <span className={styles.price}>{plan.price}</span>
                <span className={styles.period}>{plan.period}</span>
              </div>
              <p className={styles.planDescription}>{plan.description}</p>
              <ul className={styles.features}>
                {plan.features.map((feature, i) => (
                  <li key={i} className={styles.feature}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M3 8L6 11L13 4"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <a
                href={plan.ctaHref}
                className={`${styles.cta} ${plan.highlighted ? styles.ctaPrimary : styles.ctaSecondary}`}
              >
                {plan.cta}
              </a>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
