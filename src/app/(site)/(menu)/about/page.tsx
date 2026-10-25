import type { Metadata } from "next";
import { getPage } from "@/lib/content";

export const metadata: Metadata = { title: "About · Markus Evanger" };

export default async function About() {
  const { html } = await getPage("about");
  return <div className="menu-prose" dangerouslySetInnerHTML={{ __html: html }} />;
}
