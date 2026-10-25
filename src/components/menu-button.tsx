import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  href: string;
  label: string; // accessible name; children is the stylised text
  current?: boolean; // its menu is open: shown in the hover state
  children: ReactNode;
};

// Chamfered bottom-right corner (the Figma "mask shape"): a fixed 8.6 x 13.7 px cut, so the
// angle stays the same whatever the label width.
const CHAMFER = "polygon(0 0, 100% 0, 100% calc(100% - 13.7px), calc(100% - 8.6px) 100%, 0 100%)";

// Idle: thin light bar, 30% black. Hover/focus/current: bar widens, fill darkens to 45%.
export default function MenuButton({ href, label, current, children }: Props) {
  return (
    <Link
      href={href}
      aria-label={label}
      aria-current={current ? "page" : undefined}
      className="group relative flex h-[97.9px] items-center bg-black/30 pr-7 pl-9 font-serif text-[68.7px] leading-none whitespace-nowrap text-white transition-colors duration-200 outline-none hover:bg-black/45 focus-visible:bg-black/45 aria-[current=page]:bg-black/45"
      style={{ clipPath: CHAMFER }}
    >
      <span
        aria-hidden
        className="absolute inset-y-0 left-0 w-[7px] bg-[#d9d9d9] transition-[width] duration-200 ease-out group-hover:w-[20.6px] group-focus-visible:w-[20.6px] group-aria-[current=page]:w-[20.6px]"
      />
      {children}
    </Link>
  );
}
