"use client";

import type { Locale } from "@/i18n/config";

interface ScrollToTopButtonProps {
  locale: Locale;
}

export default function ScrollToTopButton({ locale }: ScrollToTopButtonProps) {
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="group flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity duration-300 ease-out"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="transition-opacity shrink-0"
      >
        <path d="M12 19V5" />
        <path d="M5 12l7-7 7 7" />
      </svg>
      <span className="font-bold whitespace-nowrap">
        {locale === "en" ? "To the top? :D" : "Til toppen? :D"}
      </span>
    </button>
  );
}
