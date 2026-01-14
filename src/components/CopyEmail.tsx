"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

interface CopyEmailProps {
  email: string;
  contactText_en: string;
  contactText_no: string;
}

export default function CopyEmail({
  email,
  contactText_en,
  contactText_no,
}: CopyEmailProps) {
  const { language } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [fading, setFading] = useState(false);
  const contactText = language === "en" ? contactText_en : contactText_no;

  const copyMail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setFading(false);
    setTimeout(() => {
      setFading(true);
      setTimeout(() => {
        setCopied(false);
        setFading(false);
      }, 200);
    }, 1300);
  };

  return (
    <div>
      <p className="text-white/80 text-sm mb-2">{contactText}</p>

      <div className="flex items-center gap-2">
        <a
          href={`mailto:${email}`}
          className="bg-white/10 px-4 py-2.5 rounded-lg font-medium hover:bg-white/20 transition-all duration-200"
        >
          {email}
        </a>

        <button
          onClick={copyMail}
          className="group p-2.5 rounded-lg transition-all duration-200 cursor-pointer bg-white/10 hover:bg-white/20"
          aria-label="Copy email"
        >
          {copied ? (
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`transition-opacity duration-200 ${fading ? "opacity-0" : "opacity-100"}`}
            >
              <polyline
                points="20 6 9 17 4 12"
                style={{
                  strokeDasharray: 24,
                  strokeDashoffset: 24,
                  animation: "draw-check 0.3s ease-out forwards",
                }}
              />
              <style>{`
                @keyframes draw-check {
                  to {
                    stroke-dashoffset: 0;
                  }
                }
              `}</style>
            </svg>
          ) : (
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`transition-opacity duration-200 ${fading ? "opacity-0" : "opacity-60"} group-hover:opacity-100`}
            >
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
