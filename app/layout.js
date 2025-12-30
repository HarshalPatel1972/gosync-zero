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

export const metadata = {
  title: "GoSync - In an async world. GoSync.",
  description:
    "Write your sync logic once in Go. Deploy to server and browser. Offline-first with automatic conflict resolution, zero vendor lock-in.",
  keywords: [
    "sync",
    "golang",
    "webassembly",
    "wasm",
    "offline-first",
    "real-time",
    "distributed",
  ],
  authors: [{ name: "GoSync" }],
  openGraph: {
    title: "GoSync - In an async world. GoSync.",
    description:
      "Write your sync logic once in Go. Deploy to server and browser. Offline-first with automatic conflict resolution, zero vendor lock-in.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "GoSync - In an async world. GoSync.",
    description:
      "Write your sync logic once in Go. Deploy to server and browser. Offline-first with automatic conflict resolution, zero vendor lock-in.",
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
