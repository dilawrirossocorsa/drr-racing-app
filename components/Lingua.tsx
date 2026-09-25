"use client";
export default function Lingua({ attuale }: { attuale: "it" | "en" }) {
  const vai = (l: string) => { document.cookie = `drr_lang=${l}; path=/; max-age=31536000; samesite=lax`; location.reload(); };
  return (
    <span className="lingua">
      <button className={attuale === "it" ? "on" : ""} onClick={() => vai("it")}>IT</button>
      <button className={attuale === "en" ? "on" : ""} onClick={() => vai("en")}>EN</button>
    </span>
  );
}
