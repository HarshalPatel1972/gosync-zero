import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const siteTitle = "GoSync: offline-first, real-time sync for web apps";
const siteDescription =
  "Self-hosted, open-source sync engine written in Go. Your web app works offline, syncs across every device and tab in real time, and resolves conflicts automatically.";

export const metadata = {
  metadataBase: new URL("https://gosync-zero.vercel.app"),
  title: {
    default: siteTitle,
    template: "%s | GoSync",
  },
  description: siteDescription,
  keywords: [
    "offline-first",
    "local-first",
    "sync engine",
    "real-time sync",
    "indexeddb",
    "websocket",
    "crdt",
    "conflict resolution",
    "self-hosted",
    "golang",
    "webassembly",
    "firebase alternative",
  ],
  authors: [{ name: "Harshal Patel", url: "https://github.com/HarshalPatel1972" }],
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    url: "/",
    siteName: "GoSync",
    type: "website",
    locale: "en_US",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "GoSync: offline-first, real-time sync for web apps" }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        <div className="noise-overlay" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
