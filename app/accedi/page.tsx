import Accesso from "@/components/Accesso";
import { lingua, tt } from "@/lib/lingua";

export default function PaginaAccedi() {
  const l = lingua();
  return (
    <div className="stretta">
      <h1>{tt(l, "Benvenuto in DRR Racing", "Welcome to DRR Racing")}</h1>
      <p className="sotto">{tt(l, "L'app del team Dilawri Rossocorsa Racing: orari, risultati, piloti e foto.", "The Dilawri Rossocorsa Racing team app: schedule, results, drivers and photos.")}</p>
      <Accesso en={l === "en"} />
    </div>
  );
}
