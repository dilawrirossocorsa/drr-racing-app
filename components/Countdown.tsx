"use client";

import { useEffect, useState } from "react";

// Conto alla rovescia che scorre da solo (fino all'inizio o alla fine).
export default function Countdown({ a, lingua, finoA }: { a: string; lingua: "it" | "en"; finoA?: string | null }) {
  const [ora, setOra] = useState<number | null>(null);
  useEffect(() => { setOra(Date.now()); const t = setInterval(() => setOra(Date.now()), 1000); return () => clearInterval(t); }, []);
  if (ora === null) return <span className="cd">&nbsp;</span>;
  const inizio = new Date(a).getTime();
  const fine = finoA ? new Date(finoA).getTime() : null;
  if (ora >= inizio) {
    if (fine && ora < fine) return <span className="cd live">{lingua === "en" ? "LIVE NOW" : "IN CORSO"}</span>;
    return <span className="cd fatto">{lingua === "en" ? "Finished" : "Finita"}</span>;
  }
  let s = Math.floor((inizio - ora) / 1000);
  const g = Math.floor(s / 86400); s -= g * 86400;
  const h = Math.floor(s / 3600); s -= h * 3600;
  const m = Math.floor(s / 60); s -= m * 60;
  const d2 = (n: number) => String(n).padStart(2, "0");
  return <span className="cd">{g ? `${g}${lingua === "en" ? "d" : "g"} ` : ""}{d2(h)}:{d2(m)}:{d2(s)}</span>;
}
