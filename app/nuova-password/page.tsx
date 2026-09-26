"use client";

import { useEffect, useState } from "react";
import { clientBrowser } from "@/lib/supabase";

// Arrivo dal messaggio "password dimenticata": si sceglie la nuova password.
export default function NuovaPassword() {
  const [pw, setPw] = useState("");
  const [pronto, setPronto] = useState(false);
  const [msg, setMsg] = useState("");
  useEffect(() => {
    const sb = clientBrowser();
    sb.auth.getSession().then(({ data }) => setPronto(!!data.session));
    const { data: sub } = sb.auth.onAuthStateChange((_e, s) => { if (s) setPronto(true); });
    return () => sub.subscription.unsubscribe();
  }, []);
  return (
    <div className="stretta">
      <h1>Nuova password · New password</h1>
      <div className="card">
        {!pronto ? <p className="nota">Apri questa pagina dal link ricevuto per email. · Open this page from the link in your email.</p> : (
          <form className="accesso-form" onSubmit={async (e) => {
            e.preventDefault();
            if (pw.length < 8) { setMsg("Almeno 8 caratteri · At least 8 characters"); return; }
            const { error } = await clientBrowser().auth.updateUser({ password: pw });
            if (error) { setMsg(error.message); return; }
            location.href = "/";
          }}>
            <label>Password<input type="password" value={pw} onChange={(e) => setPw(e.target.value)} autoComplete="new-password" required /></label>
            <button className="btn rosso">Salva · Save</button>
            {msg ? <p className="errore">{msg}</p> : null}
          </form>
        )}
      </div>
    </div>
  );
}
