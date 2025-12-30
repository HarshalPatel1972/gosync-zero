import DocsSidebar from "@/components/docs/DocsSidebar";
import styles from "./layout.module.css";

export const metadata = {
  title: "Documentation | GoSync",
  description: "Learn how to build offline-first applications with GoSync",
};

export default function DocsLayout({ children }) {
  return (
    <div className={styles.docsWrapper}>
      <DocsSidebar />
      <main className={styles.docsMain}>
        {children}
      </main>
    </div>
  );
}
