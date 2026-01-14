"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const toggleBtnRef = useRef<HTMLButtonElement>(null);
  const norskBtnRef = useRef<HTMLButtonElement>(null);
  const englishBtnRef = useRef<HTMLButtonElement>(null);

  const languages = ["no", "en"] as const;

  const selectLanguage = useCallback(
    (lang: "en" | "no") => {
      if (lang !== language) {
        toggleLanguage();
      }
      setIsOpen(false);
      setFocusedIndex(null);
      toggleBtnRef.current?.focus();
    },
    [language, toggleLanguage]
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setFocusedIndex(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowLeft":
          event.preventDefault();
          setFocusedIndex(0); // Norsk
          norskBtnRef.current?.focus();
          break;
        case "ArrowRight":
          event.preventDefault();
          setFocusedIndex(1); // English
          englishBtnRef.current?.focus();
          break;
        case "Enter":
        case " ":
          if (focusedIndex !== null) {
            event.preventDefault();
            selectLanguage(languages[focusedIndex]);
          }
          break;
        case "Escape":
          event.preventDefault();
          setIsOpen(false);
          setFocusedIndex(null);
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, focusedIndex, selectLanguage]);

  // Focus first button when opening
  useEffect(() => {
    if (isOpen) {
      const initialIndex = language === "no" ? 0 : 1;
      setFocusedIndex(initialIndex);
      setTimeout(() => {
        if (initialIndex === 0) {
          norskBtnRef.current?.focus();
        } else {
          englishBtnRef.current?.focus();
        }
      }, 150);
    }
  }, [isOpen, language]);

  return (
    <div
      ref={dropdownRef}
      className="flex items-center bg-white/10 rounded-xl p-1 transition-all duration-200"
    >
      <button
        ref={toggleBtnRef}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
            e.preventDefault();
            setIsOpen(true);
          }
        }}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label={`Language: ${language === "en" ? "English" : "Norsk"}. Press arrow keys to change.`}
        className="group flex items-center gap-2 hover:bg-white/10 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/40 px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer"
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
          className="opacity-60 group-hover:opacity-100 transition-opacity"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
        <span className="font-medium">
          {language === "en" ? "English" : "Norsk"}
        </span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`opacity-60 transition-transform duration-200 ease-out ${
            isOpen ? "rotate-90" : ""
          }`}
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>

      <div
        className={`transition-all duration-200 ease-out overflow-hidden ${
          isOpen ? "opacity-100 max-w-48" : "opacity-0 max-w-0"
        }`}
      >
        <div
          role="listbox"
          aria-label="Select language"
          className="flex items-center gap-1 py-0.5 pr-0.5"
        >
          <button
            ref={norskBtnRef}
            onClick={() => selectLanguage("no")}
            onFocus={() => setFocusedIndex(0)}
            role="option"
            aria-selected={language === "no"}
            tabIndex={isOpen ? 0 : -1}
            className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-300 ease-out cursor-pointer focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white/50 ${
              language === "no"
                ? "bg-white/90 text-markus-red"
                : "bg-transparent hover:bg-white/15 focus:bg-white/20 text-white"
            } ${isOpen ? "animate-fade-in-left" : ""}`}
            style={{ animationDelay: "50ms" }}
          >
            Norsk
          </button>
          <button
            ref={englishBtnRef}
            onClick={() => selectLanguage("en")}
            onFocus={() => setFocusedIndex(1)}
            role="option"
            aria-selected={language === "en"}
            tabIndex={isOpen ? 0 : -1}
            className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-300 ease-out cursor-pointer focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white/50 ${
              language === "en"
                ? "bg-white/90 text-markus-red"
                : "bg-transparent hover:bg-white/15 focus:bg-white/20 text-white"
            } ${isOpen ? "animate-fade-in-left" : ""}`}
            style={{ animationDelay: "100ms" }}
          >
            English
          </button>
        </div>
      </div>
    </div>
  );
}
