"use client";

import { useState } from "react";

interface CopyEmailProps {
  email: string;
}

export default function CopyEmail({ email }: CopyEmailProps) {
  const [copied, setCopied] = useState(false);
  const [fading, setFading] = useState(false);

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
    <div className="flex items-center gap-2">
      <a
        href={`mailto:${email}`}
        aria-label={`Send email to ${email}`}
        className="font-bold hover:opacity-80 transition-opacity duration-200"
      >
        {email}
      </a>

      <button
        onClick={copyMail}
        className="group p-1 -m-1 transition-all duration-200 cursor-pointer"
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
              className={`transition-opacity duration-200 ${fading ? "opacity-0" : "opacity-100"} group-hover:opacity-80`}
            >
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
          )}
        </button>
    </div>
  );
}
