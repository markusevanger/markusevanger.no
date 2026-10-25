"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, ViewTransition, type ReactNode } from "react";

// Game-style menu window over the forest. Opening: a line expands, then the window opens
// vertically (CSS animation on mount, so it also plays on a direct load). Closing: the reverse,
// as a view-transition exit. Switching menus keeps the window and glitches the content across.
// Animations are in globals.css (.menu-panel, .panel-close, .menu-swap, .menu-body).

const TITLES: Record<string, ReactNode> = {
  about: "A130UT",
  blog: (
    <>
      <span className="tracking-[-1.6px]">13</span>L0G
    </>
  ),
};

// Same chamfered corner as the menu buttons
const CHAMFER = "polygon(0 0, 100% 0, 100% calc(100% - 13.7px), calc(100% - 8.6px) 100%, 0 100%)";

export default function MenuPanel({ children }: { children: ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const section = path.split("/")[1];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") router.push("/"); };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [router]);

  return (
    <ViewTransition exit="panel-close" default="none">
      <section
        aria-label={section}
        className="menu-panel fixed top-[8vh] left-1/2 z-40 w-[min(620px,calc(100vw-2rem))] -translate-x-1/2"
      >
        <div className="relative flex max-h-[64vh] flex-col bg-black/60 backdrop-blur-sm" style={{ clipPath: CHAMFER }}>
          <span aria-hidden className="absolute inset-y-0 left-0 w-[7px] bg-[#d9d9d9]" />
          <header className="flex items-end justify-between border-b border-white/15 pt-4 pr-5 pb-3 pl-9">
            <h1 className="font-serif text-[52px] leading-none text-white">{TITLES[section] ?? section}</h1>
            <Link href="/" className="font-mono text-xs text-white/60 hover:text-white">
              [ESC] close
            </Link>
          </header>
          <ViewTransition key={path} name="menu-content" share="menu-swap" default="none">
            <div className="menu-body overflow-y-auto py-5 pr-6 pl-9 font-mono text-sm leading-relaxed text-white/85">
              {children}
            </div>
          </ViewTransition>
        </div>
      </section>
    </ViewTransition>
  );
}
