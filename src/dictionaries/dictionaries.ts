import "server-only";

import { enUS, ko } from "date-fns/locale";
import { headers } from "next/headers";
import { cache } from "react";
import type { Locale } from "../i18n-config";

const dictionaries = {
  en: () => import("@/dictionaries/en.json").then((module) => module.default),
  ko: () => import("@/dictionaries/ko.json").then((module) => module.default),
};

export const getLocale = cache(async (locale?: Locale) => {
  let currentLocal: Locale = "en";
  if (!locale) {
    const headersList = headers();
    currentLocal = (headersList.get("locale") as Locale) || "en";
  } else {
    currentLocal = locale;
  }
  return currentLocal;
});

export const getDateLocale = cache(async (defaultLocale?: Locale) => {
  const locale = await getLocal(defaultLocale);
  return locale === "en" ? enUS : ko;
});

export const getLocal = cache(async (locale?: Locale) => {
  return getLocale(locale);
});

export const getDateLocal = cache(async (defaultLocale?: Locale) => {
  return getDateLocale(defaultLocale);
});

export const getDictionary = cache(async (defaultLocale?: Locale) => {
  const locale = await getLocal(defaultLocale);
  return dictionaries?.[locale]?.() ?? dictionaries.en();
});
