"use client";

import { usePathname } from "next/navigation";
import MenuButton from "@/components/menu-button";
import WaveGuy from "@/components/wave-guy";

// Bottom-left menu; the button for the open menu shows its hover state.
export default function SiteNav() {
  const path = usePathname();
  return (
    <nav className="boot-fade fixed bottom-6 left-6 z-30 flex flex-col items-start gap-3">
      <MenuButton href="/blog" label="Blog" current={path.startsWith("/blog")}>
        Blog
      </MenuButton>
      <MenuButton href="/about" label="About" current={path.startsWith("/about")}>
        About
        {/* slot opens on hover; closes after he's ducked out of sight */}
        <WaveGuy
          size={99}
          className="mt-[7px] w-0 self-start overflow-hidden transition-[width,margin] delay-[450ms] duration-300 ease-out group-hover:-mr-3 group-hover:ml-2 group-hover:w-[99px] group-hover:delay-0 group-focus-visible:-mr-3 group-focus-visible:ml-2 group-focus-visible:w-[99px] group-focus-visible:delay-0"
        />
      </MenuButton>
    </nav>
  );
}
