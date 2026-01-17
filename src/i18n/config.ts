export const locales = ["no", "en"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "no";

export const localeNames: Record<Locale, string> = {
  no: "Norsk",
  en: "English",
};

// Maps locale to OpenGraph locale format
export const ogLocales: Record<Locale, string> = {
  no: "no_NO",
  en: "en_US",
};

// Metadata translations
export const siteMetadata: Record<
  Locale,
  { title: string; description: string }
> = {
  no: {
    title: "Markus Evanger",
    description: "Utvikler og designer for Kult Byrå",
  },
  en: {
    title: "Markus Evanger",
    description: "Developer and Designer for Kult Byrå",
  },
};

export const cvMetadata: Record<
  Locale,
  { title: string; description: string }
> = {
  no: {
    title: "CV",
    description: "CV for Markus Evanger",
  },
  en: {
    title: "CV",
    description: "CV for Markus Evanger",
  },
};

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}
