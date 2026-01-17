"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Locale } from "@/i18n/config";
import LanguageToggle from "./LanguageToggle";

interface HeaderProps {
  locale: Locale;
}

export default function Header({ locale }: HeaderProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <header
      className={`fixed top-2 left-2 right-2 md:top-5 md:left-5 md:right-5 z-50 flex justify-between items-center transition-all duration-300 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none"
      }`}
    >
      <Link href={`/${locale}`}>
        <Image
          src="/v5-red-small.webp"
          alt="Home"
          width={64}
          height={64}
          className="w-auto h-10 md:h-16 hover:scale-110 transition-transform"
          unoptimized
        />
      </Link>
      <LanguageToggle locale={locale} showText={false} variant="light" />
    </header>
  );
}
