import { NextResponse, type NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { URL_SB, ANON } from "@/lib/supabase";

// Ritorno da Paddock (vedi app/api/racing/ponte in drr-paddock-app): con
// l'accesso usa-e-getta preparato da Paddock si apre la sessione di Racing
// senza chiedere di nuovo email e password (Billy, 26 settembre 2026).
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const hash = req.nextUrl.searchParams.get("token_hash");
  const casa = new URL("/", req.url);
  const modulo = new URL("/accedi?ponte=0", req.url);
  if (!hash || !URL_SB || !ANON) return NextResponse.redirect(modulo);
  let res = NextResponse.redirect(casa);
  const sb = createServerClient(URL_SB, ANON, {
    cookies: {
      get: (n: string) => req.cookies.get(n)?.value,
      set: (n: string, v: string, o: CookieOptions) => { res.cookies.set({ name: n, value: v, ...o }); },
      remove: (n: string, o: CookieOptions) => { res.cookies.set({ name: n, value: "", ...o }); },
    },
  });
  const { error } = await sb.auth.verifyOtp({ token_hash: hash, type: "magiclink" });
  if (error) { res = NextResponse.redirect(modulo); }
  return res;
}
