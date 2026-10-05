import ExampleShowcase from "@/components/examples/ExampleShowcase";
import styles from "./page.module.css";

export const metadata = {
  title: "Examples",
  description: "Example apps built with GoSync: offline-first tasks, real-time messaging and notes.",
  alternates: { canonical: "/examples" },
  openGraph: {
    title: "Examples | GoSync",
    description: "Example apps built with GoSync: offline-first tasks, real-time messaging and notes.",
    url: "/examples",
    siteName: "GoSync",
    images: ["/og-image.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Examples | GoSync",
    description: "Example apps built with GoSync: offline-first tasks, real-time messaging and notes.",
    images: ["/og-image.jpg"],
  },
};

export default function ExamplesPage() {
  return (
    <main id="main" className={styles.main}>
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
