"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Menu delle sezioni con la voce attiva evidenziata (sottolineatura rossa).
export default function Menu({ voci }: { voci: [string, string][] }) {
  const p = usePathname() || "/";
  const attiva = (h: string) => (h === "/" ? p === "/" : p === h || p.startsWith(h + "/") || (h === "/calendario" && p.startsWith("/evento")));
  return (
    <nav className="menu">
      {voci.map(([h, t]) => <Link key={h} href={h} className={attiva(h) ? "on" : ""}>{t}</Link>)}
    </nav>
  );
}
