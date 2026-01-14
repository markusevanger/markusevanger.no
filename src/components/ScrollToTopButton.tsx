"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function ScrollToTopButton() {
  const { hasToggled, language } = useLanguage();

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`group flex items-center gap-2 bg-white/10 hover:bg-white/20 py-2.5 rounded-lg cursor-pointer transition-all duration-300 ease-out overflow-hidden ${
        hasToggled
          ? "px-4 opacity-100 max-w-40"
          : "px-0 opacity-0 max-w-0"
      }`}
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
        className="opacity-60 group-hover:opacity-100 transition-opacity shrink-0"
      >
        <path d="M12 19V5" />
        <path d="M5 12l7-7 7 7" />
      </svg>
      <span className="font-medium whitespace-nowrap">
        {language === "en" ? "To the top? :D" : "Til toppen? :D"}
      </span>
    </button>
  );
}
