import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";
import TableOfContents from "@/components/docs/TableOfContents";
import CodeBlock from "@/components/docs/CodeBlock";
import styles from "./page.module.css";
import mdxStyles from "@/components/docs/MDXComponents.module.css";

// Map slugs to file names
const slugToFile = {
  introduction: "01-introduction.mdx",
  "quick-start": "02-quick-start.mdx",
  "server-setup": "03-server-setup.mdx",
  "conflict-resolution": "04-conflict-resolution.mdx",
};

// Get all doc slugs for static generation
export async function generateStaticParams() {
  return Object.keys(slugToFile).map((slug) => ({
    slug: [slug],
  }));
}

// Generate metadata
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slugArray = resolvedParams?.slug || ["introduction"];
  const slug = slugArray[0] || "introduction";
  const fileName = slugToFile[slug];

  if (!fileName) {
    return { title: "Not Found | GoSync Docs" };
  }

  const filePath = path.join(process.cwd(), "content/docs", fileName);
  
  try {
    const fileContent = fs.readFileSync(filePath, "utf8");
    const { data } = matter(fileContent);
    
    return {
      title: `${data.title} | GoSync Docs`,
      description: data.description,
    };
  } catch {
    return { title: "Documentation | GoSync" };
  }
}

// Custom components for MDX - defined here for RSC compatibility
const components = {
  h1: ({ children }) => <h1 className={mdxStyles.h1}>{children}</h1>,
  h2: ({ children }) => {
    const text = typeof children === "string" ? children : "";
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    return <h2 id={id} className={mdxStyles.h2}>{children}</h2>;
  },
  h3: ({ children }) => {
    const text = typeof children === "string" ? children : "";
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    return <h3 id={id} className={mdxStyles.h3}>{children}</h3>;
  },
  p: ({ children }) => <p className={mdxStyles.p}>{children}</p>,
  a: ({ href, children }) => {
    const isExternal = href?.startsWith("http");
    if (isExternal) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={mdxStyles.link}>
          {children}
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={mdxStyles.externalIcon}>
            <path d="M3 9L9 3M9 3H4M9 3V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      );
    }
    return <a href={href || "/"} className={mdxStyles.link}>{children}</a>;
  },
  pre: ({ children }) => {
    // Extract code props from children
    if (children?.props) {
      const { className, children: codeContent } = children.props;
      const language = className?.replace("language-", "") || "text";
      const code = Array.isArray(codeContent) 
        ? codeContent.join("")
        : String(codeContent || "");
      return <CodeBlock language={language}>{code}</CodeBlock>;
    }
    return <pre className={mdxStyles.pre}>{children}</pre>;
  },
  code: ({ children, className }) => {
    // Inline code only (code blocks are handled by pre)
    if (className?.startsWith("language-")) {
      return <code className={className}>{children}</code>;
    }
    return <code className={mdxStyles.inlineCode}>{children}</code>;
  },
  blockquote: ({ children }) => <blockquote className={mdxStyles.blockquote}>{children}</blockquote>,
  table: ({ children }) => (
    <div className={mdxStyles.tableWrapper}>
      <table className={mdxStyles.table}>{children}</table>
    </div>
  ),
  ul: ({ children }) => <ul className={mdxStyles.ul}>{children}</ul>,
  ol: ({ children }) => <ol className={mdxStyles.ol}>{children}</ol>,
  li: ({ children }) => <li className={mdxStyles.li}>{children}</li>,
  hr: () => <hr className={mdxStyles.hr} />,
  strong: ({ children }) => <strong className={mdxStyles.strong}>{children}</strong>,
};

export default async function DocsPage({ params }) {
  const resolvedParams = await params;
  const slugArray = resolvedParams?.slug || ["introduction"];
  const slug = slugArray[0] || "introduction";
  const fileName = slugToFile[slug];

  if (!fileName) {
    notFound();
  }

  const filePath = path.join(process.cwd(), "content/docs", fileName);
  
  let fileContent;
  try {
    fileContent = fs.readFileSync(filePath, "utf8");
  } catch {
    notFound();
  }

  const { content } = matter(fileContent);

  const { content: mdxContent } = await compileMDX({
    source: content,
    components,
  });

  return (
    <div className={styles.pageWrapper}>
      <article className={styles.article}>
        {mdxContent}
      </article>
      <TableOfContents content={content} />
    </div>
  );
}
