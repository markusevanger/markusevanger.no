import MenuPanel from "@/components/menu-panel";

// About and Blog open as a game-style menu panel; it stays open while switching between them.
export default function MenuLayout({ children }: LayoutProps<"/">) {
  return <MenuPanel>{children}</MenuPanel>;
}
