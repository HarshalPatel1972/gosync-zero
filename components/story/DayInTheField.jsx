"use client";

import { useRef, useState } from "react";
import { useScroll, useMotionValueEvent } from "framer-motion";
import {
  APP_CLOSED,
  BEATS,
  CONFLICT,
  DAY_END,
  PLACES,
  SIGNAL_SEGMENTS,
  VISITS,
  clockLabel,
  stateAt,
} from "./day";
import styles from "./DayInTheField.module.css";

const STORY_START = 30; // 07:30

function SignalBars({ bars }) {
  return (
    <span className={styles.bars} aria-label={bars ? `${bars} bars of signal` : "No signal"}>
      {[1, 2, 3, 4].map((n) => (
        <i key={n} className={n <= bars ? styles.barOn : undefined} style={{ height: 3 + n * 2 }} />
      ))}
    </span>
  );
}

function Battery({ level, charging }) {
  const low = level <= 15 && !charging;
  return (
    <span className={`${styles.battery} ${low ? styles.batteryLow : ""}`} aria-label={`Battery ${level}%${charging ? ", charging" : ""}`}>
      {charging && <span className={styles.bolt} aria-hidden="true">⚡</span>}
      {level}%
      <span className={styles.cell} aria-hidden="true">
        <i style={{ width: `${level}%` }} />
      </span>
    </span>
  );
}

// The day as a skyline: bar height is signal strength, gaps are dead zones.
function Skyline({ t }) {
  const width = DAY_END;
  return (
    <div className={styles.skyline}>
      <svg viewBox={`0 0 ${width} 56`} preserveAspectRatio="none" className={styles.skySvg} aria-hidden="true">
        <defs>
          <clipPath id="sky-past">
            <rect x="0" y="0" width={t} height="56" />
          </clipPath>
        </defs>
        <line x1="0" x2={width} y1="47.5" y2="47.5" className={styles.skyBase} />
        {[0, 1].map((layer) => (
          <g key={layer} clipPath={layer ? "url(#sky-past)" : undefined} className={layer ? styles.skyPast : styles.skyFuture}>
            {SIGNAL_SEGMENTS.map((s) =>
              s.bars === 0 ? (
                <line key={s.from} x1={s.from} x2={s.to} y1="47.5" y2="47.5" className={styles.deadZone} />
              ) : (
                <rect key={s.from} x={s.from} width={Math.max(s.to - s.from - 1, 2)} y={47 - s.bars * 10} height={s.bars * 10} rx="1" />
              ),
            )}
          </g>
        ))}
        <line x1={t} x2={t} y1="0" y2="56" className={styles.playhead} />
      </svg>
      <div className={styles.places}>
        {PLACES.map((p) => (
          <span key={`${p.name}-${p.at}`} className={p.row ? styles.placeLow : undefined} style={{ left: `${(p.at / width) * 100}%` }}>
            {p.name}
          </span>
        ))}
      </div>
    </div>
  );
}

function VisitRow({ v, t }) {
  const sent = v.syncedAt <= t;
  return (
    <li className={styles.visit}>
      <div>
        <strong>{v.name}</strong>
        <span>House {v.house} · {clockLabel(v.at)}</span>
      </div>
      <span className={sent ? styles.sent : styles.waiting} title={sent ? "On the server" : "Saved on phone, waiting for signal"}>
        {sent ? "✓✓" : "◷"}
      </span>
    </li>
  );
}

// The shared household record as each side sees it during the concurrent edit.
function ConflictCard({ s, side }) {
  const phoneNew = side === "server" ? s.supervisorEdited : s.merged;
  const doseRecorded = side === "phone" ? s.workerEdited : s.merged;
  return (
    <div className={`${styles.record} ${s.merged ? styles.recordMerged : ""}`}>
      <div className={styles.recordHead}>
        {CONFLICT.name} · House {CONFLICT.house}
        {s.merged && <span className={styles.mergedTag}>merged</span>}
      </div>
      <dl>
        <dt>Phone</dt>
        <dd className={phoneNew ? styles.fieldServer : undefined}>
          {phoneNew ? "+•• ••• 4410" : "+•• ••• 1023"}
          {phoneNew && <small>supervisor</small>}
        </dd>
        <dt>TT-2 dose</dt>
        <dd className={doseRecorded ? styles.fieldWorker : undefined}>
          {doseRecorded ? "Given 13:20" : "Not recorded"}
          {doseRecorded && <small>Amara</small>}
        </dd>
      </dl>
    </div>
  );
}

function Phone({ s, t }) {
  const showConflict = s.supervisorEdited && t < CONFLICT.mergedAt + 50;
  const justReopened = t >= APP_CLOSED.to && t < APP_CLOSED.to + 20;
  const status = !s.online
    ? { label: "Offline · saved on phone", cls: styles.pillOffline }
    : s.outbox > 0 || s.syncing
      ? { label: "Sending…", cls: styles.pillSyncing }
      : { label: "Up to date", cls: styles.pillOnline };
  const latest = [...s.recorded].reverse().slice(0, showConflict ? 2 : 4);

  return (
    <div className={styles.phone}>
      <div className={styles.statusBar}>
        <span>{s.clock}</span>
        <span className={styles.statusRight}>
          {s.network ?? ""} <SignalBars bars={s.bars} />
          <Battery level={s.battery} charging={s.charging} />
        </span>
      </div>
      {s.appOpen ? (
        <div className={styles.app}>
          <div className={styles.appHead}>
            <span className={styles.appTitle}>Today&apos;s visits</span>
            <span className={styles.count}>{s.recorded.length}<small>/23</small></span>
          </div>
          <div className={styles.appStatus}>
            <span className={`${styles.pill} ${status.cls}`}>{status.label}</span>
            {s.outbox > 0 && <span className={styles.outbox}>{s.outbox} waiting</span>}
          </div>
          {justReopened && <div className={styles.toast}>Reopened on a power bank · {s.outbox} visits still waiting</div>}
          {showConflict && <ConflictCard s={s} side="phone" />}
          <ul className={styles.visits}>
            {latest.length === 0 ? (
              <li className={styles.empty}>No visits yet</li>
            ) : (
              latest.map((v) => <VisitRow key={v.id} v={v} t={t} />)
            )}
          </ul>
          <span className={styles.recordButton} aria-hidden="true">＋ Record visit</span>
        </div>
      ) : (
        <div className={styles.closed}>
          <span>App closed</span>
          <small>{s.outbox} visits kept in the phone&apos;s storage</small>
        </div>
      )}
    </div>
  );
}

function Server({ s, t }) {
  const showConflict = s.supervisorEdited && t < CONFLICT.mergedAt + 50;
  const last = s.onServer.length ? s.onServer.reduce((a, v) => (v.syncedAt > a ? v.syncedAt : a), 0) : null;
  return (
    <div className={styles.server}>
      <div className={styles.serverHead}>
        <span className={styles.serverIcon} aria-hidden="true" />
        <div>
          <strong>Regional office</strong>
          <span>gosync-server · the office PC</span>
        </div>
      </div>
      <div className={styles.serverCount}>
        <span>{s.onServer.length}</span>
        <small>of 23 visits received</small>
      </div>
      <div className={styles.serverMeta}>{last === null ? "Nothing yet today" : `Last update ${clockLabel(last)}`}</div>
      {showConflict && <ConflictCard s={s} side="server" />}
    </div>
  );
}

function Wire({ s }) {
  return (
    <div className={`${styles.wire} ${s.online ? styles.wireUp : styles.wireDown}`} aria-hidden="true">
      <div className={styles.wireLine} />
      {s.syncing && s.appOpen && (
        <div className={styles.packets}>
          {[0, 1, 2, 3, 4].map((i) => (
            <i key={i} style={{ animationDelay: `${i * 0.18}s` }} />
          ))}
        </div>
      )}
      <span className={styles.wireLabel}>{s.online ? (s.syncing ? "sending" : "connected") : "no signal"}</span>
    </div>
  );
}

export default function DayInTheField() {
  const ref = useRef(null);
  const [t, setT] = useState(STORY_START);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    setT(Math.round(STORY_START + Math.min(Math.max(p, 0), 1) * (DAY_END - 1 - STORY_START)));
  });
  const s = stateAt(t);

  return (
    <section ref={ref} className={styles.section} id="story" aria-labelledby="story-title">
      <div className={styles.sticky}>
        <header className={styles.head}>
          <span className={styles.kicker}>A real day, scroll to live it</span>
          <h2 id="story-title" className={styles.title}>
            One day. <em>Almost no signal.</em>
          </h2>
          <div className={styles.clockRow}>
            <span className={styles.clock}>{s.clock}</span>
            <Skyline t={t} />
          </div>
        </header>

        <div className={styles.stage}>
          <div className={styles.caption} key={s.beat.title} aria-hidden="true">
            <h3>{s.beat.title}</h3>
            <p>{s.beat.body}</p>
            {s.beat.usually && (
              <p className={styles.usually}>
                <span>Without GoSync:</span> {s.beat.usually}
              </p>
            )}
          </div>
          <Phone s={s} t={t} />
          <Wire s={s} />
          <Server s={s} t={t} />
        </div>
        <p className={styles.footnote}>An illustration of how GoSync behaves, simulated in your browser. People, places and numbers are fictional.</p>
      </div>

      {/* The whole story as plain text for screen readers. */}
      <ol className={styles.srOnly}>
        {BEATS.map((b) => (
          <li key={b.title}>
            {b.title}. {b.body} {b.usually ? `Without GoSync: ${b.usually}` : ""}
          </li>
        ))}
        <li>{VISITS.length} visits recorded, all delivered.</li>
      </ol>
    </section>
  );
}
