"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import styles from "./StackCompare.module.css";

// What each option asks you to deploy and operate. Every claim links to its
// source; re-verify before changing (VERIFIED is shown on the page).
const VERIFIED = "October 2026";

const OPTIONS = [
  {
    id: "gosync",
    name: "GoSync",
    tagline: "Offline sync engine, self-hosted",
    run: ["gosync-server (one binary)", "SQLite file, or your Postgres"],
    offline: { level: "yes", text: "Built in: outbox, retries, per-field merge" },
    cost: "Free, MIT licensed. You pay only for your own server.",
    when: "Offline writes on servers you control, with the least to operate.",
    sources: [{ label: "GoSync docs", href: "/docs/production" }],
    ours: true,
  },
  {
    id: "firebase",
    name: "Firebase",
    tagline: "Google's managed database",
    managed: ["Runs on Google Cloud. Can't be self-hosted."],
    offline: { level: "yes", text: "Built in (Firestore offline persistence)" },
    cost: "Free tier, then billed per document read, write and delete, plus storage.",
    when: "You want nothing to operate and Google Cloud is acceptable.",
    sources: [
      { label: "Firebase pricing", href: "https://firebase.google.com/pricing" },
      { label: "No self-hosting", href: "https://www.bytebase.com/blog/supabase-vs-firebase/" },
    ],
  },
  {
    id: "powersync",
    name: "PowerSync",
    tagline: "Sync layer for your existing database",
    run: ["PowerSync service", "Storage database (Postgres or MongoDB)", "Your source database", "Your write API (uploadData)"],
    offline: { level: "yes", text: "Built in; writes go through an API you build" },
    cost: "Open Edition free (source-available). Cloud from $49/month.",
    when: "An existing Postgres, MongoDB or MySQL must stay the source of truth.",
    sources: [
      { label: "Setup guide", href: "https://docs.powersync.com/intro/setup-guide" },
      { label: "Pricing", href: "https://www.powersync.com/pricing" },
    ],
  },
  {
    id: "zero",
    name: "Zero",
    tagline: "Instant, query-driven sync over Postgres",
    run: ["zero-cache (replication manager + view syncers)", "Postgres with logical replication", "Your query and mutate API"],
    offline: { level: "no", text: "Offline writes not supported, by design" },
    cost: "Open source (Apache 2.0). Hosted plans available.",
    when: "Online collaborative apps that want instant UI over Postgres.",
    sources: [
      { label: "When to use Zero", href: "https://zero.rocicorp.dev/docs/when-to-use" },
      { label: "Self-hosting", href: "https://zero.rocicorp.dev/docs/self-host" },
    ],
  },
  {
    id: "electric",
    name: "ElectricSQL",
    tagline: "Streams Postgres data to clients",
    run: ["Electric sync service", "Postgres with logical replication", "Your own write path"],
    offline: { level: "diy", text: "Reads sync; offline writes are yours to build" },
    cost: "Open source (Apache 2.0). Electric Cloud is winding down after the Databricks acquisition.",
    when: "Streaming Postgres data into clients, with writes handled your way.",
    sources: [
      { label: "Joining Databricks", href: "https://electric.ax/blog/2026/08/11/electric-joining-databricks" },
      { label: "Write patterns", href: "https://kanopylabs.com/blog/tanstack-db-vs-electricsql-vs-zero-sync" },
    ],
  },
  {
    id: "supabase",
    name: "Supabase",
    tagline: "Hosted Postgres platform",
    managed: ["Hosted Postgres platform (or self-host its stack)"],
    offline: { level: "diy", text: "Not built in: add PowerSync or build your own" },
    cost: "Free tier, then paid plans.",
    when: "Your app is mostly online and built on Postgres.",
    sources: [{ label: "Offline with Supabase", href: "https://powersync.com/blog/bringing-offline-first-to-supabase" }],
  },
];

const WEAKER = [
  "Young project with one maintainer. The others have teams and years in production.",
  "Merges per field: two people typing in the same text field keep one version. Use Yjs or Automerge for that.",
  "No file or photo attachments yet. Upload those separately and sync their URLs.",
  "Each user syncs their whole dataset, or chosen collections. There are no per-record queries yet.",
  "The browser engine is Go compiled to WebAssembly: about 0.8 MB compressed. It loads once and is then cached.",
  "Web apps only. There are no native iOS or Android SDKs; it works on phones as a web app or PWA.",
  "Offline data lives in browser storage, which browsers can clear (for example Safari after 7 days without a visit, unless the app is added to the home screen).",
];

const OFFLINE_LABEL = { yes: "Offline writes", no: "No offline writes", diy: "Offline writes: DIY" };

export default function StackCompare() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-120px" });

  return (
    <section className={styles.section} id="compare" ref={ref} aria-labelledby="compare-title">
      <div className={styles.container}>
        <header className={styles.head}>
          <span className={styles.kicker}>The honest comparison</span>
          <h2 id="compare-title" className={styles.title}>
            What you&apos;d actually have to <em>run</em>.
          </h2>
          <p className={styles.lede}>
            Every option below is good at something. The difference is what you deploy, what you operate, and whether people can keep working offline. Outlined blocks are things you run yourself.
          </p>
        </header>

        <div className={styles.grid}>
          {OPTIONS.map((o, i) => (
            <motion.article
              key={o.id}
              className={`${styles.card} ${o.ours ? styles.cardOurs : ""}`}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className={styles.cardHead}>
                <h3>{o.name}</h3>
                <span>{o.tagline}</span>
              </div>

              <div className={styles.stackLabel}>
                {o.run ? `You run ${o.run.length} ${o.run.length === 1 ? "thing" : "things"}` : "Vendor runs it"}
              </div>
              <ul className={styles.stack}>
                {(o.run || o.managed).map((item, j) => (
                  <li key={item} className={o.run ? styles.slabYours : styles.slabManaged} style={{ "--i": j }}>
                    {item}
                  </li>
                ))}
              </ul>

              <div className={`${styles.offline} ${styles[`offline_${o.offline.level}`]}`}>
                <strong>{OFFLINE_LABEL[o.offline.level]}</strong>
                <span>{o.offline.text}</span>
              </div>

              <dl className={styles.facts}>
                <dt>Cost</dt>
                <dd>{o.cost}</dd>
                <dt>Pick it when</dt>
                <dd>{o.when}</dd>
              </dl>

              <div className={styles.sources}>
                {o.sources.map((s) => (
                  <a
                    key={s.href}
                    href={s.href}
                    {...(s.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    {s.label} ↗
                  </a>
                ))}
              </div>
            </motion.article>
          ))}
        </div>

        <aside className={styles.weaker}>
          <h3>Where GoSync is weaker</h3>
          <ul>
            {WEAKER.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        </aside>

        <p className={styles.verified}>
          Facts checked against each project&apos;s own docs and announcements, {VERIFIED}. Spotted something out of date?{" "}
          <a href="https://github.com/HarshalPatel1972/GoSync-zero/issues" target="_blank" rel="noopener noreferrer">
            Tell us
          </a>
          .
        </p>
      </div>
    </section>
  );
}
