import Button from "@/components/Button";
import type { Locale } from "@/i18n/config";

const translations = {
  no: "Fant ikke siden du lette etter.",
  en: "Couldn't find the page you were looking for.",
};

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function NotFoundPage({ params }: Props) {
  const { locale } = await params;
  const message = translations[locale as Locale] || translations.no;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <h1 className="font-mogi text-[10rem] md:text-[16rem] leading-none text-markus-red select-none">
        404 <span className="text-4xl">:(</span>
      </h1>
      <p className="text-sm mb-8 text-center">{message}</p>
      <Button
        button={{
          text_no: "Til hjemmeside",
          text_en: "Go to homepage",
          linkType: "internal",
          internalLink: "frontpage",
          type: "primary",
        }}
        locale={locale as Locale}
      />
    </main>
  );
}
