import styles from "./LogoMark.module.css";

/**
 * The GoSync mark: a server (top) and two devices (bottom).
 *
 * Hovering or focusing the surrounding link plays GoSync's story in ~1.6s:
 * the right device drops offline and saves a change locally, reconnects,
 * the change travels device → server → other device, and all three glow in
 * sync. The animation lives entirely in CSS and is skipped for users who
 * prefer reduced motion.
 */
export default function LogoMark({ size = 32, className = "" }) {
  return (
    <svg
      className={`${styles.mark} ${className}`}
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
    >
      <line className={`${styles.link} ${styles.linkLeft}`} x1="16" y1="12" x2="10" y2="18" />
      <line className={`${styles.link} ${styles.linkRight}`} x1="16" y1="12" x2="22" y2="18" />
      <line className={`${styles.link} ${styles.linkBottom}`} x1="12" y1="22" x2="20" y2="22" />

      {/* local save while offline */}
      <circle className={styles.ripple} cx="24" cy="22" r="4" />

      <circle className={`${styles.node} ${styles.server}`} cx="16" cy="8" r="4" />
      <circle className={`${styles.node} ${styles.deviceLeft}`} cx="8" cy="22" r="4" />
      <circle className={`${styles.node} ${styles.deviceRight}`} cx="24" cy="22" r="4" />

      {/* the change, travelling right device → server → left device */}
      <circle className={`${styles.packet} ${styles.packetUp}`} cx="24" cy="22" r="1.7" />
      <circle className={`${styles.packet} ${styles.packetDown}`} cx="16" cy="8" r="1.7" />
    </svg>
  );
}
