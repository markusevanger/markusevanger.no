import type { Locale } from "@/i18n/config";

interface FooterLanguageTextProps {
  text_en?: string | null;
  text_no?: string | null;
  locale: Locale;
  className?: string;
}

export default function FooterLanguageText({
  text_en,
  text_no,
  locale,
  className,
}: FooterLanguageTextProps) {
  const text = locale === "en" ? text_en : text_no;

  return <span className={className}>{text}</span>;
}
