import FloorGuy from "@/components/floor-guy";
import ForestScene from "@/components/forest-scene";
import SiteNav from "@/components/site-nav";

// The forest, grid, menu and sitting guy persist across pages; menus open over them.
export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <ForestScene />
      <div aria-hidden className="grid-overlay pointer-events-none fixed inset-0 z-10" />
      <SiteNav />
      <div className="boot-fade">
        <FloorGuy size={200} className="pointer-events-none fixed right-6 bottom-6 z-30" />
      </div>
      {children}
    </>
  );
}
