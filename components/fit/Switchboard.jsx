"use client";

import { useState } from "react";
import styles from "./Switchboard.module.css";

// An honest decision tree. Each switch answers one question; the lit wire
// shows where that combination leads, including when the answer is not
// GoSync. Recommending the right tool is what makes "use GoSync" credible.

const QUESTIONS = [
  {
    id: "collab",
    label: "Do several people type in the same document at the same moment?",
    hint: "Like Google Docs. Not: different people editing different records.",
  },
  {
    id: "offline",
    label: "Must people keep working with no connection, and sync later?",
    hint: "Fieldwork, shops, travel, unreliable networks.",
  },
  {
    id: "ownServers",
    label: "Must the data live on servers you control?",
    hint: "Your own cloud account, office machine or data centre. Not a vendor's service.",
  },
  {
    id: "existingDb",
    label: "Must an existing database stay the source of truth?",
    hint: "E.g. a Postgres your other systems already read and write.",
  },
];

const LEAVES = {
  yjs: {
    name: "Yjs or Automerge",
    verdict: "Use a text CRDT",
    why: "Many people typing in one document at once needs character-level merging. GoSync merges per field, so one person's paragraph would win. You can still use GoSync for the app's other records.",
    href: "https://yjs.dev",
  },
  zero: {
    name: "Zero",
    verdict: "Use Zero",
    why: "Online-only with an existing Postgres: Zero gives instant, query-driven sync on top of it. By design it doesn't support offline writes, which is fine for you.",
    href: "https://zero.rocicorp.dev/docs/when-to-use",
  },
  realtime: {
    name: "Firebase or Supabase Realtime",
    verdict: "Use a managed realtime database",
    why: "Online-only with no database to keep: a hosted realtime service is the least work. You don't need an offline sync engine.",
    href: "https://firebase.google.com/docs/firestore",
  },
  powersyncCloud: {
    name: "PowerSync Cloud",
    verdict: "Use PowerSync",
    why: "Offline writes on top of your existing Postgres, MongoDB or MySQL, and a managed service is acceptable. Cloud plans start at $49/month.",
    href: "https://www.powersync.com/pricing",
  },
  firebase: {
    name: "Firebase",
    verdict: "Use Firebase",
    why: "Offline writes, nothing to operate, and Google's cloud is acceptable. It can't be self-hosted, and you pay per read and write as you grow.",
    href: "https://firebase.google.com/docs/firestore/manage-data/enable-offline",
  },
  powersyncOpen: {
    name: "PowerSync Open Edition",
    verdict: "Use PowerSync, self-hosted",
    why: "Your existing database must stay the source of truth, on your servers. Plan to run the PowerSync service, a storage database and your own write API.",
    href: "https://docs.powersync.com/intro/setup-guide",
  },
  gosync: {
    name: "GoSync",
    verdict: "This is what GoSync is for",
    why: "Offline writes, on servers you control, without adopting a database platform: one small binary with SQLite or Postgres, and a client that handles the outbox, merging and tabs for you.",
    href: "/docs/quick-start",
    ours: true,
  },
};

// Geometry (viewBox 1190 × 500). Nodes are questions (q*) or leaves.
const NODES = {
  start: { x: 30, y: 250 },
  collab: { x: 190, y: 250, q: 1 },
  offline: { x: 370, y: 300, q: 2 },
  existingA: { x: 720, y: 150, q: 4 },
  ownServers: { x: 540, y: 380, q: 3 },
  existingB: { x: 720, y: 300, q: 4 },
  existingC: { x: 720, y: 440, q: 4 },
  yjs: { x: 880, y: 45, leaf: true },
  zero: { x: 880, y: 115, leaf: true },
  realtime: { x: 880, y: 185, leaf: true },
  powersyncCloud: { x: 880, y: 270, leaf: true },
  firebase: { x: 880, y: 330, leaf: true },
  powersyncOpen: { x: 880, y: 410, leaf: true },
  gosync: { x: 880, y: 470, leaf: true },
};

const EDGES = [
  { from: "start", to: "collab" },
  { from: "collab", to: "yjs", label: "yes" },
  { from: "collab", to: "offline", label: "no" },
  { from: "offline", to: "existingA", label: "no" },
  { from: "offline", to: "ownServers", label: "yes" },
  { from: "existingA", to: "zero", label: "yes" },
  { from: "existingA", to: "realtime", label: "no" },
  { from: "ownServers", to: "existingB", label: "no" },
  { from: "ownServers", to: "existingC", label: "yes" },
  { from: "existingB", to: "powersyncCloud", label: "yes" },
  { from: "existingB", to: "firebase", label: "no" },
  { from: "existingC", to: "powersyncOpen", label: "yes" },
  { from: "existingC", to: "gosync", label: "no" },
];

// Walk the tree with the current answers; returns visited nodes and the leaf.
function route(a) {
  const path = ["start", "collab"];
  if (a.collab) return { path: [...path, "yjs"], leaf: "yjs", asked: ["collab"] };
  path.push("offline");
  if (!a.offline) {
    const leaf = a.existingDb ? "zero" : "realtime";
    return { path: [...path, "existingA", leaf], leaf, asked: ["collab", "offline", "existingDb"] };
  }
  path.push("ownServers");
  const q4 = a.ownServers ? "existingC" : "existingB";
  const leaf = a.ownServers ? (a.existingDb ? "powersyncOpen" : "gosync") : a.existingDb ? "powersyncCloud" : "firebase";
  return { path: [...path, q4, leaf], leaf, asked: ["collab", "offline", "ownServers", "existingDb"] };
}

function edgePath(a, b) {
  const mx = (a.x + b.x) / 2;
  return `M ${a.x} ${a.y} C ${mx} ${a.y}, ${mx} ${b.y}, ${b.x} ${b.y}`;
}

export default function Switchboard() {
  const [answers, setAnswers] = useState({ collab: false, offline: true, ownServers: true, existingDb: false });
  const { path, leaf, asked } = route(answers);
  const onPath = new Set(path);
  const result = LEAVES[leaf];

  const toggle = (id) => setAnswers((a) => ({ ...a, [id]: !a[id] }));

  return (
    <section className={styles.section} id="fit" aria-labelledby="fit-title">
      <div className={styles.container}>
        <header className={styles.head}>
          <span className={styles.kicker}>Honest routing</span>
          <h2 id="fit-title" className={styles.title}>
            Is GoSync the right tool? <em>Flip the switches.</em>
          </h2>
          <p className={styles.lede}>
            GoSync isn&apos;t for every app. Answer four questions about yours and follow the lit wire. If another tool fits better, we&apos;ll tell you which.
          </p>
        </header>

        <div className={styles.board}>
          <ol className={styles.questions}>
            {QUESTIONS.map((q, i) => {
              const relevant = asked.includes(q.id);
              const on = answers[q.id];
              return (
                <li key={q.id} className={relevant ? undefined : styles.irrelevant}>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={on}
                    className={styles.switchRow}
                    onClick={() => toggle(q.id)}
                  >
                    <span className={styles.qNum}>Q{i + 1}</span>
                    <span className={styles.qText}>
                      <span className={styles.qLabel}>{q.label}</span>
                      <span className={styles.qHint}>{relevant ? q.hint : "Doesn't change the answer for this route."}</span>
                    </span>
                    <span className={`${styles.toggle} ${on ? styles.toggleOn : ""}`} aria-hidden="true">
                      <span className={styles.toggleText}>{on ? "Yes" : "No"}</span>
                      <span className={styles.knob} />
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>

          <div className={styles.diagramWrap}>
            <svg className={styles.diagram} viewBox="0 0 1190 500" role="img" aria-label={`Decision path leads to ${result.name}`}>
              {EDGES.map((e) => {
                const lit = onPath.has(e.from) && onPath.has(e.to);
                const a = NODES[e.from];
                const b = NODES[e.to];
                return (
                  <g key={`${e.from}-${e.to}`} className={lit ? styles.edgeLit : styles.edge}>
                    <path d={edgePath(a, b)} />
                    {lit && <path d={edgePath(a, b)} className={styles.flow} />}
                    {e.label && (
                      <text x={a.x + 16} y={b.y < a.y ? a.y - 10 : a.y + 20} className={styles.edgeLabel}>
                        {e.label}
                      </text>
                    )}
                  </g>
                );
              })}
              {Object.entries(NODES).map(([id, n]) => {
                const lit = onPath.has(id);
                if (n.leaf) {
                  const l = LEAVES[id];
                  return (
                    <g key={id} className={`${styles.leaf} ${lit ? styles.leafLit : ""} ${l.ours ? styles.leafOurs : ""}`}>
                      <circle cx={n.x} cy={n.y} r={lit ? 9 : 6} />
                      <text x={n.x + 18} y={n.y + 5}>{l.name}</text>
                    </g>
                  );
                }
                return (
                  <g key={id} className={`${styles.node} ${lit ? styles.nodeLit : ""}`}>
                    <circle cx={n.x} cy={n.y} r={id === "start" ? 7 : 15} />
                    {n.q && (
                      <text x={n.x} y={n.y + 4} textAnchor="middle">
                        Q{n.q}
                      </text>
                    )}
                  </g>
                );
              })}
              <text x={NODES.start.x - 4} y={NODES.start.y + 30} className={styles.startLabel}>
                your app
              </text>
            </svg>

            <div className={`${styles.result} ${result.ours ? styles.resultOurs : ""}`} aria-live="polite">
              <span className={styles.resultKicker}>{result.verdict}</span>
              <h3>{result.name}</h3>
              <p>{result.why}</p>
              <a
                href={result.href}
                className={styles.resultLink}
                {...(result.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                {result.ours ? "Start with the Quick Start →" : `Learn about ${result.name} →`}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
