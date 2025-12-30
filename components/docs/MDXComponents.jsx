"use client";

import Link from "next/link";
import CodeBlock from "./CodeBlock";
import styles from "./MDXComponents.module.css";

// Pre wrapper - uses the dedicated CodeBlock component
function Pre({ children }) {
  // Extract code content and language from the MDX structure
  if (children?.props) {
    const { className, children: codeContent } = children.props;
    const language = className?.replace("language-", "") || "text";
    
    // Flatten children if it's an array (multi-line code)
    const code = Array.isArray(codeContent) 
      ? codeContent.join("")
      : (typeof codeContent === "string" ? codeContent : String(codeContent || ""));
    
    return <CodeBlock language={language}>{code}</CodeBlock>;
  }
  
  // Fallback for simple pre tags
  return <pre className={styles.pre}>{children}</pre>;
}

// Inline code - only for `code` elements NOT inside pre
function InlineCode({ children, className }) {
  // If it has a language class, it's a code block (handled by Pre)
  if (className?.startsWith("language-")) {
    return <code className={className}>{children}</code>;
  }
  return <code className={styles.inlineCode}>{children}</code>;
}

// Custom Link
function CustomLink({ href, children }) {
  const isExternal = href?.startsWith("http");
  
  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={styles.link}>
        {children}
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={styles.externalIcon}>
          <path d="M3 9L9 3M9 3H4M9 3V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>
    );
  }
  
  return (
    <Link href={href || "/"} className={styles.link}>
      {children}
    </Link>
  );
}

// Blockquote
function Blockquote({ children }) {
  return <blockquote className={styles.blockquote}>{children}</blockquote>;
}

// Table
function Table({ children }) {
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>{children}</table>
    </div>
  );
}

// Headings with IDs for TOC
function H1({ children }) {
  return <h1 className={styles.h1}>{children}</h1>;
}

function H2({ children }) {
  const text = typeof children === "string" ? children : "";
  const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  return <h2 id={id} className={styles.h2}>{children}</h2>;
}

function H3({ children }) {
  const text = typeof children === "string" ? children : "";
  const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  return <h3 id={id} className={styles.h3}>{children}</h3>;
}

// Paragraph
function P({ children }) {
  return <p className={styles.p}>{children}</p>;
}

// Lists
function Ul({ children }) {
  return <ul className={styles.ul}>{children}</ul>;
}

function Ol({ children }) {
  return <ol className={styles.ol}>{children}</ol>;
}

function Li({ children }) {
  return <li className={styles.li}>{children}</li>;
}

// Horizontal Rule
function Hr() {
  return <hr className={styles.hr} />;
}

// Strong/Bold
function Strong({ children }) {
  return <strong className={styles.strong}>{children}</strong>;
}

// Export all components
export const mdxComponents = {
  h1: H1,
  h2: H2,
  h3: H3,
  p: P,
  a: CustomLink,
  pre: Pre,
  code: InlineCode,
  blockquote: Blockquote,
  table: Table,
  ul: Ul,
  ol: Ol,
  li: Li,
  hr: Hr,
  strong: Strong,
};
