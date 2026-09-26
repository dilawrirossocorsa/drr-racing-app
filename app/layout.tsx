import type { Metadata, Viewport } from "next";
import Link from "next/link";
import "./globals.css";
import { lingua, tt } from "@/lib/lingua";
import Lingua from "@/components/Lingua";
import Menu from "@/components/Menu";

export const metadata: Metadata = {
  title: "DRR Racing",
  description: "Dilawri Rossocorsa Racing — calendario, orari, risultati, piloti e foto.",
  icons: { icon: "/icon.png", apple: "/icon.png" },
};
export const viewport: Viewport = { themeColor: "#ffffff", width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const l = lingua();
  const voci: [string, string, string][] = [["/", "Home", "Home"], ["/calendario", "Calendario", "Calendar"], ["/piloti", "Piloti", "Drivers"], ["/classifica", "Classifica", "Standings"], ["/foto", "Foto", "Photos"]];
  return (
    <html lang={l}>
      <head>
        {/* stesso carattere dei titoli di Paddock */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@700;800;900&display=swap" />
      </head>
      <body>
        {/* Striscia di sfondo del team, come in Paddock (.app-bg-stripe in globals.css) */}
        <div className="app-bg-stripe" aria-hidden="true">
          <img src="/brand/stripe.png" alt="" />
        </div>
        <header className="testa">
          <Link href="/" className="logo"><img src="/brand/logo.png" alt="Dilawri Rossocorsa Racing" /></Link>
          <Lingua attuale={l} />
        </header>
        <div className="striscia" />
        <Menu voci={voci.map(([h, it, en]) => [h, tt(l, it, en)])} />
        <main className="pagina">{children}</main>
        <footer className="piede">Dilawri Rossocorsa Racing · Ferrari Challenge North America</footer>
      </body>
    </html>
  );
}
