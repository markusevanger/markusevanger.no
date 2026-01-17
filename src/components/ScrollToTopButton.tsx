"use client";

import type { Locale } from "@/i18n/config";

interface ScrollToTopButtonProps {
  locale: Locale;
}

export default function ScrollToTopButton({ locale }: ScrollToTopButtonProps) {
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="group flex items-center gap-2 bg-white/30 hover:bg-white/40 px-4 py-2.5 rounded-lg cursor-pointer transition-all duration-300 ease-out"
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
        className="opacity-80 group-hover:opacity-100 transition-opacity shrink-0"
      >
        <path d="M12 19V5" />
        <path d="M5 12l7-7 7 7" />
      </svg>
      <span className="font-medium whitespace-nowrap">
        {locale === "en" ? "To the top? :D" : "Til toppen? :D"}
      </span>
    </button>
  );
}
