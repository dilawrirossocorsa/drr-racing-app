import { cookies } from "next/headers";
export type Lingua = "it" | "en";
export function lingua(): Lingua {
  return cookies().get("drr_lang")?.value === "en" ? "en" : "it";
}
export const tt = (l: Lingua, it: string, en: string) => (l === "en" ? en : it);
