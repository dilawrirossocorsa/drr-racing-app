import { NextResponse, type NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

// Chi entra in DRR Racing (Billy, 26 settembre 2026): il team (account di
// Paddock) e i fan approvati dall'admin in Paddock > Admin > DRR Racing.
// Gli altri vanno alla pagina di accesso o a quella di attesa.
const LIBERE = ["/accedi", "/auth/", "/attesa", "/nuova-password", "/api/", "/brand/", "/icon.png", "/favicon.ico", "/manifest"];

export async function middleware(req: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL, anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return NextResponse.next(); // accesso non ancora attivato: app aperta
  const path = req.nextUrl.pathname;
  let res = NextResponse.next({ request: { headers: req.headers } });
  const sb = createServerClient(url, anon, {
    cookies: {
      get: (n: string) => req.cookies.get(n)?.value,
      set: (n: string, v: string, o: CookieOptions) => { req.cookies.set({ name: n, value: v, ...o }); res = NextResponse.next({ request: { headers: req.headers } }); res.cookies.set({ name: n, value: v, ...o }); },
      remove: (n: string, o: CookieOptions) => { req.cookies.set({ name: n, value: "", ...o }); res = NextResponse.next({ request: { headers: req.headers } }); res.cookies.set({ name: n, value: "", ...o }); },
    },
  });
  const { data: { user } } = await sb.auth.getUser();
  if (LIBERE.some((p) => path.startsWith(p))) return res;
  if (!user) {
    const u = req.nextUrl.clone(); u.pathname = "/accedi"; u.search = ""; return NextResponse.redirect(u);
  }
  const { data: stato } = await sb.rpc("racing_accesso");
  if (stato === "team" || stato === "approvato") return res;
  const u = req.nextUrl.clone(); u.pathname = "/attesa"; u.search = ""; return NextResponse.redirect(u);
}

export const config = { matcher: ["/((?!_next/static|_next/image).*)"] };
