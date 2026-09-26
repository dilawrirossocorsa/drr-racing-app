import Accesso from "@/components/Accesso";
import { lingua, tt } from "@/lib/lingua";
import { redirect } from "next/navigation";
import { accessoAttivo } from "@/lib/supabase";

export const dynamic = "force-dynamic";

// Chi e' gia' collegato a Paddock entra da solo (Billy, 26 settembre 2026):
// alla prima apertura si passa da Paddock, che rimanda qui con l'accesso
// pronto; se non sei collegato a Paddock torni qui con ?ponte=0 e vedi il modulo.
const PADDOCK = (process.env.PADDOCK_URL || "https://app.dilawrirossocorsa.com").replace(/\/+$/, "");

export default function PaginaAccedi({ searchParams }: { searchParams?: { ponte?: string } }) {
  if (accessoAttivo() && searchParams?.ponte === undefined) redirect(`${PADDOCK}/api/racing/ponte`);
  const l = lingua();
  return (
    <div className="stretta">
      <h1>{tt(l, "Benvenuto in DRR Racing", "Welcome to DRR Racing")}</h1>
      <p className="sotto">{tt(l, "L'app del team Dilawri Rossocorsa Racing: orari, risultati, piloti e foto.", "The Dilawri Rossocorsa Racing team app: schedule, results, drivers and photos.")}</p>
      <p><a className="btn" href={`${PADDOCK}/api/racing/ponte?login=1`}>{tt(l, "Sei del team? Entra con DRR Paddock", "Team member? Sign in with DRR Paddock")}</a></p>
      <Accesso en={l === "en"} />
    </div>
  );
}
