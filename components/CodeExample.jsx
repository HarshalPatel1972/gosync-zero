"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import styles from "./CodeExample.module.css";

export default function CodeExample() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [typedLines, setTypedLines] = useState(0);

  const codeLines = [
    { line: 1, content: 'package main', tokens: [{ type: 'keyword', text: 'package' }, { type: 'text', text: ' main' }] },
    { line: 2, content: '', tokens: [] },
    { line: 3, content: 'import "github.com/harshalpatel2868/gosync"', tokens: [{ type: 'keyword', text: 'import' }, { type: 'string', text: ' "github.com/harshalpatel2868/gosync"' }] },
    { line: 4, content: '', tokens: [] },
    { line: 5, content: 'type Task struct {', tokens: [{ type: 'keyword', text: 'type' }, { type: 'type', text: ' Task' }, { type: 'keyword', text: ' struct' }, { type: 'text', text: ' {' }] },
    { line: 6, content: '    ID        string    `gosync:"pk"`', tokens: [{ type: 'text', text: '    ID        ' }, { type: 'type', text: 'string' }, { type: 'string', text: '    `gosync:"pk"`' }] },
    { line: 7, content: '    Title     string', tokens: [{ type: 'text', text: '    Title     ' }, { type: 'type', text: 'string' }] },
    { line: 8, content: '    Completed bool', tokens: [{ type: 'text', text: '    Completed ' }, { type: 'type', text: 'bool' }] },
    { line: 9, content: '    UpdatedAt time.Time `gosync:"lww"`', tokens: [{ type: 'text', text: '    UpdatedAt ' }, { type: 'type', text: 'time.Time' }, { type: 'string', text: ' `gosync:"lww"`' }] },
    { line: 10, content: '}', tokens: [{ type: 'text', text: '}' }] },
    { line: 11, content: '', tokens: [] },
    { line: 12, content: 'func main() {', tokens: [{ type: 'keyword', text: 'func' }, { type: 'function', text: ' main' }, { type: 'text', text: '() {' }] },
    { line: 13, content: '    engine := gosync.New()', tokens: [{ type: 'text', text: '    engine := gosync.' }, { type: 'function', text: 'New' }, { type: 'text', text: '()' }] },
    { line: 14, content: '    engine.Register(&Task{})', tokens: [{ type: 'text', text: '    engine.' }, { type: 'function', text: 'Register' }, { type: 'text', text: '(&Task{})' }] },
    { line: 15, content: '    engine.Listen(":8080")  // That\'s it!', tokens: [{ type: 'text', text: '    engine.' }, { type: 'function', text: 'Listen' }, { type: 'string', text: '(":8080")' }, { type: 'comment', text: '  // That\'s it!' }] },
    { line: 16, content: '}', tokens: [{ type: 'text', text: '}' }] },
  ];

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
            It&apos;s Just Go. That&apos;s It.
          </motion.h2>
          <motion.p className={styles.description} variants={itemVariants}>
            No DSLs. No config files. No magic syntax. Define your models, register them, and you&apos;re syncing.
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
            <span className={styles.fileName}>sync.go</span>
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
            href="#"
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
          <motion.a
            href="#"
            className={styles.btnSecondary}
            variants={itemVariants}
          >
            View Examples
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
