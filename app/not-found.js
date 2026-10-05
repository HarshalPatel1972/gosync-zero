import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import styles from "./not-found.module.css";

export const metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <>
      <Navigation />
      <main id="main" className={styles.main}>
        <div className={styles.signal} aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
        </div>
        <p className={styles.code}>404 · no signal</p>
        <h1 className={styles.title}>This page went offline, and isn&apos;t coming back.</h1>
        <p className={styles.text}>
          Unlike your users&apos; data, it wasn&apos;t waiting in an outbox. The link may be old or mistyped.
        </p>
        <div className={styles.actions}>
          <Link href="/" className={`${styles.primary} gs-btn gs-btn-primary`}>
            Back to the homepage
          </Link>
          <Link href="/docs" className={`${styles.secondary} gs-btn gs-btn-ghost`}>
            Read the docs
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
