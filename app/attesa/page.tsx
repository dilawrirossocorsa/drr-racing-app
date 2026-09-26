import { redirect } from "next/navigation";
import { accessoAttivo, clientServer } from "@/lib/supabase";
import { lingua, tt } from "@/lib/lingua";
import { Esci, EliminaAccount } from "@/components/Esci";

export const dynamic = "force-dynamic";

export default async function PaginaAttesa() {
  if (!accessoAttivo()) redirect("/");
  const l = lingua();
  const sb = await clientServer();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) redirect("/accedi");
  const { data: stato } = await sb.rpc("racing_accesso");
  if (stato === "team" || stato === "approvato") redirect("/");
  const rifiutato = stato === "rifiutato";
  return (
    <div className="stretta">
      <h1>{rifiutato ? tt(l, "Richiesta non accettata", "Request not accepted") : tt(l, "Richiesta inviata", "Request sent")}</h1>
      <div className="card">
        <p>{rifiutato
          ? tt(l, "Per ora il team non ha aperto l'accesso a questo account.", "For now the team has not granted access to this account.")
          : tt(l, "Grazie! Il team ha ricevuto la tua richiesta: appena la approva potrai entrare con la tua email e password.", "Thanks! The team has received your request: as soon as it's approved you can sign in with your email and password.")}</p>
        <p className="nota">{user.email}</p>
        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", marginTop: 12 }}>
          <Esci testo={tt(l, "Esci", "Sign out")} />
          <EliminaAccount en={l === "en"} />
        </div>
      </div>
    </div>
  );
}
