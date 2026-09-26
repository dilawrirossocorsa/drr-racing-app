"use client";

import { useState } from "react";
import { clientBrowser } from "@/lib/supabase";

export function Esci({ testo }: { testo: string }) {
  return <button type="button" className="btn" onClick={async () => { await clientBrowser().auth.signOut(); location.href = "/accedi"; }}>{testo}</button>;
}

// Solo per i fan: cancella l'account (gli store lo chiedono)
export function EliminaAccount({ en }: { en: boolean }) {
  const [err, setErr] = useState("");
  const t = (it: string, e: string) => (en ? e : it);
  return (
    <div>
      <button type="button" className="link errore" onClick={async () => {
        if (!confirm(t("Eliminare il tuo account DRR Racing? Non si può annullare.", "Delete your DRR Racing account? This cannot be undone."))) return;
        const r = await fetch("/api/elimina", { method: "POST" });
        const j = await r.json().catch(() => ({ ok: false }));
        if (j.ok) { location.href = "/accedi"; return; }
        setErr(t("Non è stato possibile eliminare l'account.", "Could not delete the account."));
      }}>{t("Elimina il mio account", "Delete my account")}</button>
      {err ? <p className="errore">{err}</p> : null}
    </div>
  );
}
