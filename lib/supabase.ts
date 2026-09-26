import { createBrowserClient, createServerClient, type CookieOptions } from "@supabase/ssr";

// Accesso a DRR Racing (Billy, 26 settembre 2026): stesso sistema di
// accesso di DRR Paddock ("DRR app" su Supabase). Il team entra con la
// sua email e password di Paddock; i fan si iscrivono e aspettano l'ok.
// Senza le due variabili l'app resta aperta a tutti, come prima.
export const URL_SB = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
export const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
export const accessoAttivo = () => !!(URL_SB && ANON);

export function clientBrowser() {
  return createBrowserClient(URL_SB, ANON);
}

export async function clientServer() {
  const { cookies } = await import("next/headers");
  const c = cookies();
  return createServerClient(URL_SB, ANON, {
    cookies: {
      get: (n: string) => c.get(n)?.value,
      set: (n: string, v: string, o: CookieOptions) => { try { c.set({ name: n, value: v, ...o }); } catch { /* in una pagina non si scrive */ } },
      remove: (n: string, o: CookieOptions) => { try { c.set({ name: n, value: "", ...o }); } catch { /* idem */ } },
    },
  });
}

export type Accesso = "team" | "approvato" | "in_attesa" | "rifiutato" | "nessuno";
