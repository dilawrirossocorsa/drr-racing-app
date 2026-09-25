import type { Metadata, Viewport } from "next";
import Link from "next/link";
import "./globals.css";
import { lingua, tt } from "@/lib/lingua";
import Lingua from "@/components/Lingua";

export const metadata: Metadata = {
  title: "DRR Racing",
  description: "Dilawri Rossocorsa Racing — calendario, orari, risultati, piloti e foto.",
  icons: { icon: "/icon.png", apple: "/icon.png" },
};
export const viewport: Viewport = { themeColor: "#0b2a55", width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const l = lingua();
  const voci: [string, string, string][] = [["/", "Home", "Home"], ["/calendario", "Calendario", "Calendar"], ["/piloti", "Piloti", "Drivers"], ["/classifica", "Classifica", "Standings"], ["/foto", "Foto", "Photos"]];
  return (
    <html lang={l}>
      <body>
        <header className="testa">
          <Link href="/" className="logo"><img src="/brand/logo.png" alt="Dilawri Rossocorsa Racing" /></Link>
          <Lingua attuale={l} />
        </header>
        <div className="striscia" />
        <nav className="menu">
          {voci.map(([h, it, en]) => <Link key={h} href={h}>{tt(l, it, en)}</Link>)}
        </nav>
        <main className="pagina">{children}</main>
        <footer className="piede">Dilawri Rossocorsa Racing · Ferrari Challenge North America</footer>
      </body>
    </html>
  );
}
