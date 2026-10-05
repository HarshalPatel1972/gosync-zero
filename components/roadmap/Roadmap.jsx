"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import styles from "./Roadmap.module.css";

// Where GoSync has been and where it's going. Every "next" item closes a gap
// that the comparison section admits, so the two sections tell one story.
// No dates: order follows what people building with GoSync ask for.
const PHASES = [
  {
    id: "shipped",
    label: "Shipped",
    note: "Live today",
    items: [
      {
        tag: "v1.0",
        title: "The prototype",
        what: "Go compiled to WebAssembly, syncing IndexedDB over WebSockets.",
        why: "It proved the idea, and showed what was missing: anyone could read anyone's data, and old writes could overwrite new ones. So v2 started from scratch.",
      },
      {
        tag: "v2.0",
        title: "The production engine",
        what: "Offline outbox, per-field conflict merging, auth, multi-tab, PostgreSQL scale-out, metrics.",
        why: "Tested in Chromium, Firefox and WebKit, and under load: 1,000+ writes a second with p99 under 100 ms.",
      },
    ],
  },
  {
    id: "next",
    label: "Next",
    note: "What we're building toward",
    items: [
      {
        tag: "Attachments",
        title: "Photos and files",
        what: "Sync images and documents with the records they belong to.",
        why: "Field work runs on evidence: a receipt, a crop, an ID card. Today you upload those separately.",
        gap: true,
      },
      {
        tag: "Per-person data",
        title: "Sync only what's yours",
        what: "Rules that decide which records each person downloads.",
        why: "A health worker needs her own households, not the whole region's, on a small phone.",
        gap: true,
      },
      {
        tag: "React",
        title: "React hooks",
        what: "useCollection('todos') instead of wiring watch() to state yourself.",
        why: "Less glue code in the most common way GoSync is used.",
      },
    ],
  },
  {
    id: "later",
    label: "Exploring",
    note: "Ideas we're weighing",
    items: [
      {
        tag: "Tooling",
        title: "Sync inspector",
        what: "A command-line view of a device's outbox, cursor and recent changes.",
        why: "When something looks wrong in the field, you should see exactly what's waiting and why.",
      },
      {
        tag: "Collaboration",
        title: "Collaborative text fields",
        what: "Character-level merging for fields many people edit at once.",
        why: "Shared notes shouldn't lose a paragraph when two people type together.",
        gap: true,
      },
      {
        tag: "Mobile",
        title: "Native mobile clients",
        what: "Android and iOS libraries alongside the web client.",
        why: "GoSync works on phones as a web app today; some teams need native apps.",
        gap: true,
      },
    ],
  },
];

export default function Roadmap() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-120px" });

  return (
    <section className={styles.section} id="roadmap" ref={ref} aria-labelledby="roadmap-title">
      <div className={styles.container}>
        <header className={styles.head}>
          <span className={styles.kicker}>Built in the open</span>
          <h2 id="roadmap-title" className={styles.title}>
            Where GoSync has been, and <em>where it&apos;s going</em>.
          </h2>
          <p className={styles.lede}>
            Each next step closes a gap we listed above. No promised dates: the order follows what people building with GoSync need most.
          </p>
        </header>

        <div className={`${styles.track} ${inView ? styles.trackOn : ""}`}>
          {PHASES.map((phase, pi) => (
            <div key={phase.id} className={`${styles.phase} ${styles[phase.id]}`}>
              <div className={styles.station}>
                <span className={styles.dot} aria-hidden="true" />
                {phase.id === "next" && <span className={styles.here}>You are here</span>}
                <div className={styles.phaseLabel}>
                  <strong>{phase.label}</strong>
                  <span>{phase.note}</span>
                </div>
              </div>

              <ol className={styles.items}>
                {phase.items.map((item, i) => (
                  <motion.li
                    key={item.title}
                    className={styles.item}
                    initial={{ opacity: 0, y: 18 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.55, delay: 0.25 + pi * 0.18 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className={styles.itemTop}>
                      <span className={styles.tag}>{item.tag}</span>
                      {item.gap && <span className={styles.gap}>closes a gap</span>}
                    </div>
                    <h3>{item.title}</h3>
                    <p className={styles.what}>{item.what}</p>
                    <p className={styles.why}>{item.why}</p>
                  </motion.li>
                ))}
              </ol>
            </div>
          ))}
        </div>

        <p className={styles.ask}>
          Building something that needs one of these, or something else?{" "}
          <a href="https://github.com/HarshalPatel1972/GoSync/issues" target="_blank" rel="noopener noreferrer">
            Tell us what you&apos;re building →
          </a>
        </p>
      </div>
    </section>
  );
}
