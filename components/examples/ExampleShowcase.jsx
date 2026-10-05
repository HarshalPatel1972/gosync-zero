"use client";

import { motion } from "framer-motion";
import { 
  CheckCircle, 
  MessageSquare, 
  FileText,
  ExternalLink,
  Github,
  Bell,
  BookOpen
} from "lucide-react";
import styles from "./ExampleShowcase.module.css";

export default function ExampleShowcase() {
  const examples = [
    {
      id: "todo",
      title: "Offline-First Task Manager",
      description:
        "The classic 'Hello World' of sync. Create, complete and delete tasks while offline, open it in two tabs or two browsers, and watch everything converge when the connection returns.",
      icon: CheckCircle,
      tags: ["JavaScript", "WASM", "IndexedDB"],
      status: "available",
      primaryButton: {
        label: "Run It Locally",
        href: "https://github.com/HarshalPatel1972/GoSync#try-the-demo",
        icon: ExternalLink,
        external: true,
      },
      secondaryButton: {
        label: "View Source",
        href: "https://github.com/HarshalPatel1972/GoSync/tree/main/examples/todo",
        icon: Github,
        external: true,
      },
    },
    {
      id: "chat",
      title: "Live Team Messaging",
      description:
        "A Slack-style chat app showing real-time delivery across devices and hybrid-logical-clock message ordering.",
      icon: MessageSquare,
      tags: ["Next.js", "Go", "WebSockets"],
      status: "coming-soon",
      primaryButton: {
        label: "Notify Me",
        href: "#",
        icon: Bell,
        disabled: true,
      },
      secondaryButton: {
        label: "View Architecture",
        href: "/docs/server-setup",
        icon: BookOpen,
      },
    },
    {
      id: "notes",
      title: "Secure Markdown Notes",
      description:
        "Offline notes with large documents, collection-scoped sync, and per-field conflict resolution for concurrent edits.",
      icon: FileText,
      tags: ["Markdown", "Offline", "Partial Sync"],
      status: "coming-soon",
      primaryButton: {
        label: "Coming Soon",
        href: "#",
        icon: null,
        disabled: true,
      },
      secondaryButton: null,
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
    <section className={styles.section}>
      <div className={styles.container}>
        <motion.div
          className={styles.grid}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {examples.map((example) => (
            <motion.article
              key={example.id}
              className={styles.card}
              variants={itemVariants}
            >
              {/* Image/Icon Placeholder */}
              <div className={styles.imageArea}>
                <div className={styles.iconWrapper}>
                  <example.icon size={48} strokeWidth={1.5} />
                </div>
              </div>

              {/* Content */}
              <div className={styles.content}>
                {/* Status Badge */}
                <div className={styles.statusRow}>
                  <span
                    className={`${styles.status} ${
                      example.status === "available"
                        ? styles.statusAvailable
                        : styles.statusSoon
                    }`}
                  >
                    <span className={styles.statusDot} />
                    {example.status === "available" ? "Available" : "Coming Soon"}
                  </span>
                </div>

                {/* Title */}
                <h3 className={styles.title}>{example.title}</h3>

                {/* Description */}
                <p className={styles.description}>{example.description}</p>

                {/* Tags */}
                <div className={styles.tags}>
                  {example.tags.map((tag) => (
                    <span key={tag} className={styles.tag}>
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Buttons */}
                <div className={styles.buttons}>
                  {example.primaryButton && (
                    <a
                      href={example.primaryButton.disabled ? undefined : example.primaryButton.href}
                      className={`${styles.btnPrimary} ${
                        example.primaryButton.disabled ? styles.btnDisabled : ""
                      }`}
                      target={example.primaryButton.external ? "_blank" : undefined}
                      rel={example.primaryButton.external ? "noopener noreferrer" : undefined}
                    >
                      {example.primaryButton.icon && (
                        <example.primaryButton.icon size={16} />
                      )}
                      {example.primaryButton.label}
                    </a>
                  )}
                  {example.secondaryButton && (
                    <a
                      href={example.secondaryButton.disabled ? undefined : example.secondaryButton.href}
                      className={`${styles.btnSecondary} ${
                        example.secondaryButton.disabled ? styles.btnDisabled : ""
                      }`}
                      target={example.secondaryButton.external ? "_blank" : undefined}
                      rel={example.secondaryButton.external ? "noopener noreferrer" : undefined}
                    >
                      {example.secondaryButton.icon && (
                        <example.secondaryButton.icon size={16} />
                      )}
                      {example.secondaryButton.label}
                    </a>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
