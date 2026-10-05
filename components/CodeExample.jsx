"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import styles from "./CodeExample.module.css";

export default function CodeExample() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [typedLines, setTypedLines] = useState(0);

  // The real v2 client API (see /docs/api-reference). Keep this in sync
  // with the published package.
  const source = [
    [["keyword", "import"], ["text", " { "], ["function", "createClient"], ["text", " } "], ["keyword", "from"], ["string", " '@harshalpatel2868/gosync-client'"], ["text", ";"]],
    [],
    [["keyword", "const"], ["text", " db = "], ["keyword", "await"], ["text", " "], ["function", "createClient"], ["text", "({"]],
    [["text", "  url: "], ["string", "'wss://sync.example.com/sync'"], ["text", ","]],
    [["text", "  "], ["function", "getToken"], ["text", ": () => auth."], ["function", "getIdToken"], ["text", "(),"]],
    [["text", "});"]],
    [],
    [["comment", "// Saved locally first: works offline, syncs when online"]],
    [["keyword", "await"], ["text", " db."], ["function", "set"], ["text", "("], ["string", "'todos'"], ["text", ", id, { title: "], ["string", "'Ship it'"], ["text", ", done: "], ["keyword", "false"], ["text", " });"]],
    [],
    [["comment", "// Live across tabs and devices; conflicts merge automatically"]],
    [["text", "db."], ["function", "watch"], ["text", "("], ["string", "'todos'"], ["text", ", (todos) => "], ["function", "render"], ["text", "(todos));"]],
  ];
  const codeLines = source.map((tokens, i) => ({
    line: i + 1,
    tokens: tokens.map(([type, text]) => ({ type, text })),
  }));

  useEffect(() => {
    if (isInView && typedLines < codeLines.length) {
      const timer = setTimeout(() => {
        setTypedLines((prev) => prev + 1);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isInView, typedLines, codeLines.length]);

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
            Developer Experience
          </motion.span>
          <motion.h2 className={styles.title} variants={itemVariants}>
            A Few Lines. That&apos;s It.
          </motion.h2>
          <motion.p className={styles.description} variants={itemVariants}>
            No schemas to declare and no sync code to write. Read and write a local database; GoSync handles offline, real-time and conflicts.
          </motion.p>
        </motion.div>

        <motion.div
          className={styles.codeWindow}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.div className={styles.windowHeader} variants={itemVariants}>
            <div className={styles.dots}>
              <span className={`${styles.dot} ${styles.red}`} />
              <span className={`${styles.dot} ${styles.yellow}`} />
              <span className={`${styles.dot} ${styles.green}`} />
            </div>
            <span className={styles.fileName}>app.js</span>
            <div className={styles.spacer} />
          </motion.div>
          <motion.div className={styles.codeContent} variants={itemVariants}>
            {codeLines.map((line, index) => (
              <div
                key={line.line}
                className={`${styles.codeLine} ${index < typedLines ? styles.visible : ""}`}
              >
                <span className={styles.lineNumber}>{line.line}</span>
                <span className={styles.lineContent}>
                  {line.tokens.map((token, i) => (
                    <span key={i} className={styles[token.type]}>
                      {token.text}
                    </span>
                  ))}
                </span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          className={styles.actions}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.a
            href="/docs"
            className={styles.btnPrimary}
            variants={itemVariants}
          >
            Read the Docs
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M6 3L11 8L6 13"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
