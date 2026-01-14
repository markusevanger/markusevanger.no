"use client";

import { useLanguage } from "@/context/LanguageContext";

interface FooterLanguageTextProps {
  text_en?: string | null;
  text_no?: string | null;
  className?: string;
}

export default function FooterLanguageText({
  text_en,
  text_no,
  className,
}: FooterLanguageTextProps) {
  const { language } = useLanguage();
  const text = language === "en" ? text_en : text_no;

  return <span className={className}>{text}</span>;
}
