import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const FILE = path.join(process.cwd(), "src/data/character.json");

// Dev-only: writes the character from /dev/character back into the repo.
export async function POST(req: Request) {
  if (process.env.NODE_ENV !== "development") return new Response(null, { status: 404 });
  const current = JSON.parse(await readFile(FILE, "utf8"));
  const body = await req.json();
  // only known keys, with the same types as the file already has
  const next = Object.fromEntries(
    Object.entries(current).map(([k, v]) => [k, typeof body[k] === typeof v ? body[k] : v]),
  );
  await writeFile(FILE, JSON.stringify(next, null, 2) + "\n");
  return Response.json(next);
}
