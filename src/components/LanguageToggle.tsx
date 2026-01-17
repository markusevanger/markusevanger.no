"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import type { Locale } from "@/i18n/config";
import {
  LanguagesIcon,
  type LanguagesIconHandle,
} from "@/components/ui/languages";

interface LanguageToggleProps {
  locale: Locale;
  showText?: boolean;
  variant?: "default" | "light" | "dark";
}

function getLocalePath(pathname: string, targetLocale: Locale): string {
  const segments = pathname.split("/");
  if (segments.length >= 2 && (segments[1] === "no" || segments[1] === "en")) {
    segments[1] = targetLocale;
  }
  return segments.join("/") || `/${targetLocale}`;
}

export default function LanguageToggle({
  locale,
  showText = true,
  variant = "default",
}: LanguageToggleProps) {
  const currentPath = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const toggleBtnRef = useRef<HTMLButtonElement>(null);
  const norskLinkRef = useRef<HTMLAnchorElement>(null);
  const englishLinkRef = useRef<HTMLAnchorElement>(null);
  const languagesIconRef = useRef<LanguagesIconHandle>(null);

  const closeDropdown = useCallback(() => {
    setIsOpen(false);
    setFocusedIndex(null);
    toggleBtnRef.current?.focus();
  }, []);

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
          setFocusedIndex(0);
          norskLinkRef.current?.focus();
          break;
        case "ArrowRight":
          event.preventDefault();
          setFocusedIndex(1);
          englishLinkRef.current?.focus();
          break;
        case "Escape":
          event.preventDefault();
          closeDropdown();
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeDropdown]);

  // Focus first link when opening
  useEffect(() => {
    if (isOpen) {
      const initialIndex = locale === "no" ? 0 : 1;
      setFocusedIndex(initialIndex);
      setTimeout(() => {
        if (initialIndex === 0) {
          norskLinkRef.current?.focus();
        } else {
          englishLinkRef.current?.focus();
        }
      }, 150);
    }
  }, [isOpen, locale]);

  const noPath = getLocalePath(currentPath, "no");
  const enPath = getLocalePath(currentPath, "en");
  const router = useRouter();

  // Prefetch both language routes when hovering/focusing the toggle
  const handlePrefetch = useCallback(() => {
    router.prefetch(noPath);
    router.prefetch(enPath);
  }, [router, noPath, enPath]);

  const variantStyles = {
    default: {
      container: "bg-white/30",
      button: "hover:bg-white/35 focus:bg-white/35 focus:ring-white/60",
      icon: "opacity-100",
      text: "text-current",
      optionActive: "bg-white/90 text-markus-red",
      optionInactive:
        "bg-transparent hover:bg-white/35 focus:bg-white/40 text-white",
      focusRing: "focus:ring-white/70",
    },
    light: {
      container: "bg-white border border-black",
      button: "hover:bg-black/5 focus:bg-black/5 focus:ring-markus-red",
      icon: "opacity-80 group-hover:opacity-100",
      text: "text-black",
      optionActive: "bg-markus-red text-white",
      optionInactive:
        "bg-transparent hover:bg-black/5 focus:bg-black/10 text-black",
      focusRing: "focus:ring-markus-red",
    },
    dark: {
      container: "bg-white/30",
      button: "hover:bg-white/35 focus:bg-white/35 focus:ring-white/60",
      icon: "opacity-100",
      text: "text-white",
      optionActive: "bg-white/90 text-markus-red",
      optionInactive:
        "bg-transparent hover:bg-white/35 focus:bg-white/40 text-white",
      focusRing: "focus:ring-white/70",
    },
  };

  const styles = variantStyles[variant];

  return (
    <div
      ref={dropdownRef}
      className={`group flex items-center ${styles.container} rounded-xl ${styles.button} transition-colors duration-200 ease-out cursor-pointer`}
      onClick={() => setIsOpen(!isOpen)}
      onMouseEnter={() => {
        languagesIconRef.current?.startAnimation();
        handlePrefetch();
      }}
      onMouseLeave={() => languagesIconRef.current?.stopAnimation()}
      onFocus={handlePrefetch}
    >
      <button
        ref={toggleBtnRef}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
            e.preventDefault();
            setIsOpen(true);
          }
        }}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label={`Language: ${
          locale === "en" ? "English" : "Norsk"
        }. Press arrow keys to change.`}
        className="flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-markus-red px-3 py-2 rounded-lg cursor-pointer"
      >
        <LanguagesIcon
          ref={languagesIconRef}
          size={18}
          className={`${styles.icon} transition-opacity duration-200 ease-out`}
        />
        {showText && (
          <>
            <span className={`font-medium ${styles.text}`}>
              {locale === "en" ? "English" : "Norsk"}
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
              className={`opacity-80 transition-transform duration-150 ease-out ${
                isOpen ? "rotate-90" : ""
              }`}
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </>
        )}
      </button>

      <div
        className="grid transition-[grid-template-columns] duration-200 ease-out"
        style={{ gridTemplateColumns: isOpen ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <div
            role="menu"
            aria-label="Select language"
            className={`flex items-center gap-1 py-0.5 pr-0.5 transition-opacity duration-150 ease-out ${
              isOpen ? "opacity-100" : "opacity-0"
            }`}
          >
            <Link
              ref={norskLinkRef}
              href={noPath}
              onFocus={() => setFocusedIndex(0)}
              role="menuitem"
              aria-current={locale === "no" ? "page" : undefined}
              tabIndex={isOpen ? 0 : -1}
              hrefLang="no"
              className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-inset ${
                styles.focusRing
              } ${
                locale === "no" ? styles.optionActive : styles.optionInactive
              }`}
            >
              Norsk
            </Link>
            <Link
              ref={englishLinkRef}
              href={enPath}
              onFocus={() => setFocusedIndex(1)}
              role="menuitem"
              aria-current={locale === "en" ? "page" : undefined}
              tabIndex={isOpen ? 0 : -1}
              hrefLang="en"
              className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-inset ${
                styles.focusRing
              } ${
                locale === "en" ? styles.optionActive : styles.optionInactive
              }`}
            >
              English
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
