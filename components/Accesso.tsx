"use client";

import { useState } from "react";
import { clientBrowser } from "@/lib/supabase";

// Entrare in DRR Racing (Billy, 26 settembre 2026): chi e' del team usa
// email e password di DRR Paddock; i fan si iscrivono e aspettano l'ok
// dell'admin, come la richiesta per seguire un profilo privato.
type Modo = "accedi" | "iscriviti" | "password";

export default function Accesso({ en }: { en: boolean }) {
  const t = (it: string, e: string) => (en ? e : it);
  const [modo, setModo] = useState<Modo>("accedi");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; testo: string } | null>(null);
  const [attesa, setAttesa] = useState(false);

  async function invia(e: React.FormEvent) {
    e.preventDefault(); setMsg(null); setAttesa(true);
    try {
      if (modo === "accedi") {
        const { error } = await clientBrowser().auth.signInWithPassword({ email: email.trim(), password: pw });
        if (error) { setMsg({ ok: false, testo: t("Email o password non corrette.", "Wrong email or password.") }); return; }
        location.href = "/";
      } else if (modo === "iscriviti") {
        const r = await fetch("/api/iscrizione", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ nome, email, password: pw }) });
        const j = await r.json().catch(() => ({ ok: false, errore: "server" }));
        if (!j.ok) {
          const m: Record<string, string> = {
            nome: t("Scrivi nome e cognome.", "Enter your full name."),
            email: t("Email non valida.", "Invalid email."),
            password: t("La password deve avere almeno 8 caratteri.", "Password must be at least 8 characters."),
            esiste: t("Questa email è già registrata: se sei del team entra con le credenziali di Paddock, altrimenti accedi.", "This email is already registered: sign in instead."),
          };
          setMsg({ ok: false, testo: m[j.errore] || t("Qualcosa non va, riprova tra poco.", "Something went wrong, try again later.") });
          return;
        }
        await clientBrowser().auth.signInWithPassword({ email: email.trim(), password: pw });
        location.href = "/attesa";
      } else {
        await clientBrowser().auth.resetPasswordForEmail(email.trim(), { redirectTo: `${location.origin}/nuova-password` });
        setMsg({ ok: true, testo: t("Se l'email è registrata, ti arriva un messaggio per scegliere una nuova password.", "If the email is registered, you'll receive a message to choose a new password.") });
      }
    } finally { setAttesa(false); }
  }

  return (
    <div className="card accesso">
      <div className="accesso-schede">
        <button type="button" className={modo === "accedi" ? "on" : ""} onClick={() => { setModo("accedi"); setMsg(null); }}>{t("Accedi", "Sign in")}</button>
        <button type="button" className={modo === "iscriviti" ? "on" : ""} onClick={() => { setModo("iscriviti"); setMsg(null); }}>{t("Chiedi di entrare", "Request access")}</button>
      </div>
      <form onSubmit={invia} className="accesso-form">
        {modo === "iscriviti" ? (
          <>
            <p className="nota">{t("Lascia nome, email e una password: il team riceve la richiesta e ti apre l'accesso.", "Leave your name, email and a password: the team gets your request and lets you in.")}</p>
            <label>{t("Nome e cognome", "Full name")}<input value={nome} onChange={(e) => setNome(e.target.value)} autoComplete="name" required /></label>
          </>
        ) : null}
        {modo === "accedi" ? <p className="nota">{t("Del team DRR? Usa email e password di DRR Paddock.", "DRR team member? Use your DRR Paddock email and password.")}</p> : null}
        <label>Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required /></label>
        {modo !== "password" ? (
          <label>Password<input type="password" value={pw} onChange={(e) => setPw(e.target.value)} autoComplete={modo === "iscriviti" ? "new-password" : "current-password"} required minLength={modo === "iscriviti" ? 8 : undefined} /></label>
        ) : null}
        <button className="btn rosso" disabled={attesa}>
          {attesa ? "…" : modo === "accedi" ? t("Entra", "Sign in") : modo === "iscriviti" ? t("Invia la richiesta", "Send request") : t("Invia", "Send")}
        </button>
        {msg ? <p className={msg.ok ? "ok" : "errore"}>{msg.testo}</p> : null}
        {modo === "accedi" ? <button type="button" className="link" onClick={() => { setModo("password"); setMsg(null); }}>{t("Password dimenticata?", "Forgot password?")}</button> : null}
        {modo === "password" ? <button type="button" className="link" onClick={() => { setModo("accedi"); setMsg(null); }}>{t("Torna ad accedi", "Back to sign in")}</button> : null}
      </form>
    </div>
  );
}
