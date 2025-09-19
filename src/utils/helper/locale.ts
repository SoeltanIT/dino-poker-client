import { Locale, i18n } from "@/i18n-config";

export function getLocale(request: Request): Locale {
  let currentLocale: Locale = i18n.defaultLocale;

  i18n.locales.every((locale) => {
    let match = request?.headers?.get("Accept-Language") !== locale;
    if (!match) {
      currentLocale = locale;
    }
    return match;
  });

  return currentLocale;
}
