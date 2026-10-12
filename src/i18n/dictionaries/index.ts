import type { Locale } from "../config";
import en from "./en";
import nl from "./nl";
import ar from "./ar";

export type { Dictionary } from "./en";
export const dictionaries = { en, nl, ar } as const satisfies Record<Locale, typeof en>;
