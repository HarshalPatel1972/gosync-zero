import ExampleShowcase from "@/components/examples/ExampleShowcase";
import styles from "./page.module.css";

export const metadata = {
  title: "Examples | GoSync",
  description: "Real-world patterns demonstrating offline-first architecture, conflict resolution, and WebSocket performance.",
};

export default function ExamplesPage() {
  return (
    <main className={styles.main}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.headline}>See GoSync in Action.</h1>
          <p className={styles.subheadline}>
            Real-world patterns demonstrating offline-first architecture,
            <br />
            conflict resolution, and WebSocket performance.
          </p>
        </div>
      </section>

      {/* Examples Grid */}
      <ExampleShowcase />
    </main>
  );
}
