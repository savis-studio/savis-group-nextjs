import type { Metadata } from "next";
import { Sora, Inter } from "next/font/google";
import "@/styles/generated/tokens.css";
import "@/styles/savis.css";
import "@/styles/layout.css";
import "./globals.css";
import { AppHeader } from "@/components/layout/AppHeader";
import { AppFooter } from "@/components/layout/AppFooter";
import { getCatalog } from "@/lib/cms";

const sora = Sora({ subsets: ["latin"], weight: ["600", "700"], variable: "--font-sora", display: "swap" });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-inter", display: "swap" });

// Rendered per request. The CMS is not reachable while the Docker image is built, so nothing may be prerendered from it.
// Header and footer data is cached for 60 s and refreshed on every catalogue edit (see getCatalog).
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "SAVIS Group",
  description: "Trusted Digital Infrastructure for a Smarter World",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const catalog = await getCatalog();
  return (
    <html lang="en" className={`${sora.variable} ${inter.variable}`}>
      <body style={{ margin: 0, background: "var(--bg)", color: "var(--text)", font: "400 16px/1.6 var(--font-body)" }}>
        <a href="#main" className="sr-only focus:not-sr-only">Skip to content</a>
        <AppHeader {...catalog} />
        <div id="main">{children}</div>
        <AppFooter {...catalog} />
      </body>
    </html>
  );
}
