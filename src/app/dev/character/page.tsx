import { notFound } from "next/navigation";
import character from "@/data/character.json";
import CharacterEditor from "@/components/dev/character-editor";

// Dev-only: tune the figure every animation uses, and save it to src/data/character.json.
export default function CharacterPage() {
  if (process.env.NODE_ENV !== "development") notFound();
  return <CharacterEditor initial={character} />;
}
