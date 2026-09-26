import { redirect } from "next/navigation";
import { accessoAttivo, clientServer } from "@/lib/supabase";
import { lingua, tt } from "@/lib/lingua";
import { Esci, EliminaAccount } from "@/components/Esci";

export const dynamic = "force-dynamic";

export default async function PaginaAccount() {
  if (!accessoAttivo()) redirect("/");
  const l = lingua();
  const sb = await clientServer();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) redirect("/accedi");
  const { data: stato } = await sb.rpc("racing_accesso");
  return (
    <div className="stretta">
      <h1>{tt(l, "Il mio account", "My account")}</h1>
      <div className="card">
        <p><b>{user.email}</b></p>
        <p className="nota">{stato === "team" ? tt(l, "Account del team DRR (lo stesso di DRR Paddock).", "DRR team account (same as DRR Paddock).") : tt(l, "Account fan di DRR Racing.", "DRR Racing fan account.")}</p>
        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", marginTop: 12 }}>
          <Esci testo={tt(l, "Esci", "Sign out")} />
          {stato !== "team" ? <EliminaAccount en={l === "en"} /> : null}
        </div>
      </div>
    </div>
  );
}
