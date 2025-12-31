"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent, AnimatePresence } from "framer-motion";
import styles from "./RoadmapEvolution.module.css";

// ============================================
// ROADMAP STAGES DATA
// ============================================
const stages = [
  {
    id: "v1.0",
    version: "v1.0",
    label: "The Foundation",
    headline: "Core Engine",
    body: "The immutable Merkle Tree foundation. Ensuring efficient delta-sync and zero data loss.",
    status: "live",
  },
  {
    id: "v1.1",
    version: "v1.1",
    label: "Developer Experience",
    headline: "CLI Inspector",
    body: "Debug your sync logic. A local terminal tool to watch the queue, inspect hashes, and replay failed packets.",
    status: "in-progress",
  },
  {
    id: "v1.2",
    version: "v1.2",
    label: "Advanced Logic",
    headline: "Custom Resolvers",
    body: "Programmatic conflict logic. Inject your own Go functions to merge complex data types beyond Last-Write-Wins.",
    status: "planned",
  },
  {
    id: "v2.0",
    version: "v2.0",
    label: "Production Scale",
    headline: "Metrics Dashboard",
    body: "Production observability. A self-hosted UI to track active connections, storage usage, and sync health.",
    status: "planned",
  },
];

// ============================================
// SCHEMATIC FRAME (reusable wrapper)
// ============================================
function SchematicFrame({ children, title }) {
  return (
    <div className={styles.schematicFrame}>
      {title && <div className={styles.schematicTitle}>{title}</div>}
      <div className={styles.schematicContent}>
        {children}
      </div>
    </div>
  );
}

// ============================================
// STAGE 0: MERKLE TREE VISUALIZATION
// ============================================
function MerkleTreeSchematic() {
  const [activeNodes, setActiveNodes] = useState([]);
  const [syncingPath, setSyncingPath] = useState([]);

  // Simulate sync animation
  useEffect(() => {
    const interval = setInterval(() => {
      // Pick a random leaf node (4-7)
      const leafNode = Math.floor(Math.random() * 4) + 4;
      setActiveNodes([leafNode]);

      // Animate up the tree
      setTimeout(() => {
        const parentNode = Math.floor((leafNode - 1) / 2);
        setSyncingPath([leafNode, parentNode]);
      }, 300);

      setTimeout(() => {
        const parentNode = Math.floor((leafNode - 1) / 2);
        const rootPath = parentNode <= 2 ? [leafNode, parentNode, 0] : [leafNode, parentNode, Math.floor((parentNode - 1) / 2), 0];
        setSyncingPath(rootPath);
      }, 600);

      setTimeout(() => {
        setActiveNodes([]);
        setSyncingPath([]);
      }, 1500);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  // Node positions for a binary tree
  const nodes = [
    { id: 0, x: 160, y: 30, label: "Root" },    // Root
    { id: 1, x: 80, y: 90 },                     // Level 1
    { id: 2, x: 240, y: 90 },
    { id: 3, x: 40, y: 150 },                    // Level 2
    { id: 4, x: 120, y: 150 },
    { id: 5, x: 200, y: 150 },
    { id: 6, x: 280, y: 150 },
    { id: 7, x: 20, y: 210, label: "A1" },       // Leaves
    { id: 8, x: 60, y: 210, label: "A2" },
    { id: 9, x: 100, y: 210, label: "B1" },
    { id: 10, x: 140, y: 210, label: "B2" },
    { id: 11, x: 180, y: 210, label: "C1" },
    { id: 12, x: 220, y: 210, label: "C2" },
    { id: 13, x: 260, y: 210, label: "D1" },
    { id: 14, x: 300, y: 210, label: "D2" },
  ];

  // Edges connecting parent to children
  const edges = [
    [0, 1], [0, 2],
    [1, 3], [1, 4], [2, 5], [2, 6],
    [3, 7], [3, 8], [4, 9], [4, 10],
    [5, 11], [5, 12], [6, 13], [6, 14],
  ];

  const getNodeState = (nodeId) => {
    if (activeNodes.includes(nodeId)) return "changed";
    if (syncingPath.includes(nodeId)) return "syncing";
    return "idle";
  };

  return (
    <SchematicFrame title="Merkle Tree Status">
      <svg viewBox="0 0 320 240" className={styles.merkleSvg}>
        {/* Edges */}
        {edges.map(([from, to], i) => {
          const fromNode = nodes[from];
          const toNode = nodes[to];
          const isActive = syncingPath.includes(from) && syncingPath.includes(to);
          return (
            <motion.line
              key={i}
              x1={fromNode.x}
              y1={fromNode.y}
              x2={toNode.x}
              y2={toNode.y}
              stroke={isActive ? "#00E699" : "#3a3a4a"}
              strokeWidth={isActive ? 2 : 1}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: i * 0.02 }}
            />
          );
        })}

        {/* Nodes */}
        {nodes.map((node) => {
          const state = getNodeState(node.id);
          const isLeaf = node.id >= 7;
          return (
            <g key={node.id}>
              <motion.circle
                cx={node.x}
                cy={node.y}
                r={isLeaf ? 8 : 12}
                fill={state === "changed" ? "#ef4444" : state === "syncing" ? "#00E699" : "#1a1a2e"}
                stroke={state === "syncing" ? "#00E699" : "#4a5568"}
                strokeWidth={state === "syncing" ? 2 : 1}
                animate={{
                  scale: state === "changed" ? [1, 1.3, 1] : 1,
                  boxShadow: state === "syncing" ? "0 0 10px #00E699" : "none",
                }}
                transition={{ duration: 0.3 }}
              />
              {node.label && (
                <text
                  x={node.x}
                  y={node.y + 4}
                  textAnchor="middle"
                  className={styles.nodeLabel}
                  fill={state === "syncing" ? "#00E699" : "#9ca3af"}
                >
                  {node.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      <div className={styles.merkleStatus}>
        <span className={styles.statusDot} /> All nodes synced
      </div>
    </SchematicFrame>
  );
}

// ============================================
// STAGE 1: TERMINAL CLI SCHEMATIC
// ============================================
function TerminalSchematic() {
  const [lines, setLines] = useState([]);
  const [currentLine, setCurrentLine] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  const terminalSequence = [
    { type: "command", text: "$ gosync inspect --watch" },
    { type: "output", text: "[INFO]  Starting inspector on port 9090..." },
    { type: "success", text: "[SYNC]  2 items received from server" },
    { type: "output", text: "[HASH]  Root: 0x7f3a...c4b2" },
    { type: "success", text: "[SYNC]  Delta applied: +3 nodes" },
    { type: "warning", text: "[QUEUE] 1 item pending retry" },
    { type: "success", text: "[SYNC]  Retry successful" },
    { type: "output", text: "[QUEUE] 0 pending | 847 synced" },
  ];

  useEffect(() => {
    let lineIndex = 0;
    let charIndex = 0;
    let timer;

    const typeNextChar = () => {
      if (lineIndex >= terminalSequence.length) {
        // Restart after delay
        setTimeout(() => {
          setLines([]);
          setCurrentLine("");
          lineIndex = 0;
          charIndex = 0;
          timer = setTimeout(typeNextChar, 500);
        }, 3000);
        return;
      }

      const currentText = terminalSequence[lineIndex].text;
      
      if (charIndex < currentText.length) {
        setCurrentLine(currentText.slice(0, charIndex + 1));
        charIndex++;
        timer = setTimeout(typeNextChar, terminalSequence[lineIndex].type === "command" ? 50 : 20);
      } else {
        setLines((prev) => [...prev, terminalSequence[lineIndex]]);
        setCurrentLine("");
        lineIndex++;
        charIndex = 0;
        timer = setTimeout(typeNextChar, terminalSequence[lineIndex - 1].type === "command" ? 800 : 400);
      }
    };

    timer = setTimeout(typeNextChar, 1000);
    return () => clearTimeout(timer);
  }, []);

  const getLineClass = (type) => {
    switch (type) {
      case "command": return styles.termCommand;
      case "success": return styles.termSuccess;
      case "warning": return styles.termWarning;
      default: return styles.termOutput;
    }
  };

  return (
    <SchematicFrame>
      <div className={styles.terminal}>
        {/* Window Controls */}
        <div className={styles.terminalHeader}>
          <div className={styles.terminalDots}>
            <span className={styles.dotRed} />
            <span className={styles.dotYellow} />
            <span className={styles.dotGreen} />
          </div>
          <span className={styles.terminalTitle}>gosync-cli — zsh</span>
        </div>

        {/* Terminal Body */}
        <div className={styles.terminalBody}>
          {lines.map((line, i) => (
            <div key={i} className={getLineClass(line.type)}>
              {line.text}
            </div>
          ))}
          {currentLine && (
            <div className={styles.termCommand}>
              {currentLine}
              <span className={styles.cursor}>▋</span>
            </div>
          )}
        </div>
      </div>
    </SchematicFrame>
  );
}

// ============================================
// STAGE 2: CODE DIFF SCHEMATIC
// ============================================
function DiffSchematic() {
  const [phase, setPhase] = useState(0); // 0=separate, 1=merging, 2=merged

  useEffect(() => {
    const timer = setInterval(() => {
      setPhase((p) => (p + 1) % 3);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  return (
    <SchematicFrame title="Conflict Resolution">
      <div className={styles.diffContainer}>
        {/* Left Side - Local */}
        <motion.div
          className={styles.diffPanel}
          animate={{
            x: phase === 1 ? 60 : 0,
            opacity: phase === 2 ? 0 : 1,
          }}
          transition={{ duration: 0.6 }}
        >
          <div className={styles.diffHeader}>
            <span className={styles.diffLabel}>LOCAL</span>
          </div>
          <pre className={styles.diffCode}>
            <span className={styles.diffBrace}>{"{"}</span>{"\n"}
            {"  "}<span className={styles.diffKey}>"status"</span>: <span className={styles.diffValueOld}>"draft"</span>,{"\n"}
            {"  "}<span className={styles.diffKey}>"editedAt"</span>: <span className={styles.diffValue}>"10:42"</span>{"\n"}
            <span className={styles.diffBrace}>{"}"}</span>
          </pre>
        </motion.div>

        {/* Center - Resolver Function */}
        <motion.div
          className={styles.resolverBox}
          animate={{
            scale: phase === 1 ? 1.1 : 1,
            borderColor: phase === 1 ? "#00E699" : "#3a3a4a",
          }}
        >
          <code className={styles.resolverCode}>
            <span className={styles.goKeyword}>func</span> <span className={styles.goFunc}>Resolve</span>()
          </code>
        </motion.div>

        {/* Right Side - Remote */}
        <motion.div
          className={styles.diffPanel}
          animate={{
            x: phase === 1 ? -60 : 0,
            opacity: phase === 2 ? 0 : 1,
          }}
          transition={{ duration: 0.6 }}
        >
          <div className={styles.diffHeader}>
            <span className={styles.diffLabel}>REMOTE</span>
          </div>
          <pre className={styles.diffCode}>
            <span className={styles.diffBrace}>{"{"}</span>{"\n"}
            {"  "}<span className={styles.diffKey}>"status"</span>: <span className={styles.diffValueNew}>"published"</span>,{"\n"}
            {"  "}<span className={styles.diffKey}>"editedAt"</span>: <span className={styles.diffValue}>"10:45"</span>{"\n"}
            <span className={styles.diffBrace}>{"}"}</span>
          </pre>
        </motion.div>

        {/* Merged Result */}
        <AnimatePresence>
          {phase === 2 && (
            <motion.div
              className={styles.mergedResult}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.4 }}
            >
              <div className={styles.diffHeader}>
                <span className={styles.diffLabelSuccess}>✓ RESOLVED</span>
              </div>
              <pre className={styles.diffCode}>
                <span className={styles.diffBrace}>{"{"}</span>{"\n"}
                {"  "}<span className={styles.diffKey}>"status"</span>: <span className={styles.diffValueNew}>"published"</span>,{"\n"}
                {"  "}<span className={styles.diffKey}>"editedAt"</span>: <span className={styles.diffValue}>"10:45"</span>,{"\n"}
                {"  "}<span className={styles.diffKey}>"history"</span>: <span className={styles.diffArray}>["draft"]</span>{"\n"}
                <span className={styles.diffBrace}>{"}"}</span>
              </pre>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </SchematicFrame>
  );
}

// ============================================
// STAGE 3: DASHBOARD SCHEMATIC
// ============================================
function DashboardSchematic() {
  const [dataPoints, setDataPoints] = useState([40, 45, 42, 48, 44, 50, 47, 52, 49]);
  const [clientCount, setClientCount] = useState(847);

  useEffect(() => {
    const interval = setInterval(() => {
      setDataPoints((prev) => {
        const newPoints = [...prev.slice(1), prev[prev.length - 1] + (Math.random() - 0.5) * 10];
        return newPoints.map(p => Math.max(20, Math.min(80, p)));
      });
      setClientCount((prev) => prev + Math.floor(Math.random() * 3) - 1);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  // Generate SVG path for the line chart
  const pathD = useMemo(() => {
    const width = 280;
    const height = 80;
    const stepX = width / (dataPoints.length - 1);
    
    return dataPoints
      .map((point, i) => {
        const x = i * stepX;
        const y = height - (point / 100) * height;
        return `${i === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");
  }, [dataPoints]);

  return (
    <SchematicFrame title="GoSync Observability">
      <div className={styles.dashboard}>
        {/* Stats Row */}
        <div className={styles.statsRow}>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Active Clients</span>
            <motion.span
              className={styles.statValue}
              key={clientCount}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {clientCount.toLocaleString()}
            </motion.span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Sync Latency</span>
            <span className={styles.statValue}>
              <span className={styles.statGreen}>12ms</span>
            </span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Queue</span>
            <span className={styles.statValue}>0</span>
          </div>
        </div>

        {/* Line Chart */}
        <div className={styles.chartContainer}>
          <div className={styles.chartLabel}>Sync Events / min</div>
          <svg viewBox="0 0 280 80" className={styles.chart}>
            {/* Grid lines */}
            {[0, 1, 2, 3].map((i) => (
              <line
                key={i}
                x1="0"
                y1={i * 26.6}
                x2="280"
                y2={i * 26.6}
                stroke="#2a2a3a"
                strokeDasharray="4 4"
              />
            ))}
            
            {/* Area under the line */}
            <motion.path
              d={`${pathD} L 280 80 L 0 80 Z`}
              fill="url(#chartGradient)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
            />
            
            {/* The line itself */}
            <motion.path
              d={pathD}
              fill="none"
              stroke="#00E699"
              strokeWidth="2"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1 }}
            />
            
            {/* Gradient definition */}
            <defs>
              <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#00E699" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#00E699" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </SchematicFrame>
  );
}

// ============================================
// STAGE CARD COMPONENT
// ============================================
function StageCard({ stage }) {
  const statusConfig = {
    live: { label: "Live", className: styles.statusLive },
    "in-progress": { label: "In Progress", className: styles.statusInProgress },
    planned: { label: "Planned", className: styles.statusPlanned },
  };

  const { label, className } = statusConfig[stage.status] || statusConfig.planned;

  return (
    <motion.div
      className={styles.stageCard}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className={styles.versionRow}>
        <span className={styles.version}>{stage.version}</span>
        <span className={styles.versionLabel}>{stage.label}</span>
        <span className={className}>{label}</span>
      </div>
      <h3 className={styles.headline}>{stage.headline}</h3>
      <p className={styles.body}>{stage.body}</p>
    </motion.div>
  );
}

// ============================================
// PROGRESS TRACK WITH TRAVELING INDICATOR
// ============================================
function ProgressDots({ activeStage }) {
  // Calculate traveling dot position (0 to 100%)
  const travelPosition = (activeStage / (stages.length - 1)) * 100;
  
  return (
    <div className={styles.progressTrack}>
      {/* The continuous line/track */}
      <div className={styles.trackLine}>
        {/* Filled portion of the track */}
        <motion.div 
          className={styles.trackFill}
          animate={{ width: `${travelPosition}%` }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
      
      {/* Fixed milestone dots */}
      {stages.map((stage, i) => (
        <div
          key={stage.id}
          className={`${styles.milestoneDot} ${i <= activeStage ? styles.milestonePassed : ""}`}
        />
      ))}
      
      {/* The traveling glowing indicator */}
      <motion.div 
        className={styles.travelingDot}
        animate={{ left: `${travelPosition}%` }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  );
}

// ============================================
// THE SCHEMATIC RENDERER
// ============================================
function SchematicRenderer({ activeStage }) {
  const schematics = [
    <MerkleTreeSchematic key="merkle" />,
    <TerminalSchematic key="terminal" />,
    <DiffSchematic key="diff" />,
    <DashboardSchematic key="dashboard" />,
  ];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeStage}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.4 }}
        className={styles.schematicWrapper}
      >
        {schematics[activeStage]}
      </motion.div>
    </AnimatePresence>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================
export default function RoadmapEvolution() {
  const containerRef = useRef(null);
  const [activeStage, setActiveStage] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const progress = useTransform(scrollYProgress, [0, 1], [0, 1]);

  useMotionValueEvent(progress, "change", (latest) => {
    if (latest < 0.25) setActiveStage(0);
    else if (latest < 0.5) setActiveStage(1);
    else if (latest < 0.75) setActiveStage(2);
    else setActiveStage(3);
  });

  return (
    <section className={styles.section} id="roadmap" ref={containerRef}>
      <div className={styles.stickyContainer}>
        {/* Left Column - Narrative */}
        <div className={styles.narrativeColumn}>
          <div className={styles.narrativeContent}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionLabel}>Roadmap</span>
              <h2 className={styles.sectionTitle}>The Evolution</h2>
            </div>

            <ProgressDots activeStage={activeStage} />

            <div className={styles.cardContainer}>
              <AnimatePresence mode="wait">
                <StageCard key={stages[activeStage].id} stage={stages[activeStage]} />
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Right Column - Schematic */}
        <div className={styles.schematicColumn}>
          <SchematicRenderer activeStage={activeStage} />
        </div>

        {/* Scroll Hint */}
        <motion.div
          className={styles.scrollHint}
          animate={{ opacity: activeStage === 0 ? 1 : 0 }}
        >
          <span>Scroll to explore</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </motion.div>
      </div>
    </section>
  );
}
