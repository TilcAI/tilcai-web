import type { Copy, Locale } from "./types";
import { en } from "./en";
import { es } from "./es";

export const locales = ["en", "es"] as const satisfies readonly Locale[];
export const defaultLocale: Locale = "en";

const dictionaries: Record<Locale, Copy> = { en, es };

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function getCopy(locale: Locale): Copy {
  return dictionaries[locale];
}

export type { Copy, Locale } from "./types";
