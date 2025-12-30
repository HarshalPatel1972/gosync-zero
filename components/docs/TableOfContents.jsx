"use client";

import { useEffect, useState } from "react";
import styles from "./TableOfContents.module.css";

export default function TableOfContents({ content }) {
  const [headings, setHeadings] = useState([]);
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    // Parse headings from content
    const regex = /^##\s+(.+)$/gm;
    const matches = [];
    let match;
    
    while ((match = regex.exec(content)) !== null) {
      const text = match[1];
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      matches.push({ text, id, level: 2 });
    }
    
    setHeadings(matches);
  }, [content]);

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-80px 0px -80% 0px" }
    );

    headings.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <aside className={styles.toc}>
      <div className={styles.tocHeader}>On this page</div>
      <nav className={styles.tocNav}>
        <ul className={styles.tocList}>
          {headings.map(({ text, id }) => (
            <li key={id}>
              <a
                href={`#${id}`}
                className={`${styles.tocLink} ${activeId === id ? styles.active : ""}`}
              >
                {text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
