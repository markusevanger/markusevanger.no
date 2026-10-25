import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { marked } from "marked";

// Site content lives in content/ as Markdown with a small frontmatter block:
//   ---
//   title: Hello
//   date: 2026-10-25
//   summary: One line for the blog list
//   ---

const ROOT = path.join(process.cwd(), "content");

export type Meta = { title?: string; date?: string; summary?: string };
export type Post = Meta & { slug: string };

function parse(source: string) {
  const match = source.match(/^---\n([\s\S]*?)\n---\n?/);
  const meta: Record<string, string> = {};
  for (const line of match?.[1].split("\n") ?? []) {
    const i = line.indexOf(":");
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  const body = match ? source.slice(match[0].length) : source;
  return { meta: meta as Meta, html: marked.parse(body, { async: false }) };
}

export async function getPage(name: string) {
  "use cache";
  return parse(await readFile(path.join(ROOT, `${name}.md`), "utf8"));
}

export async function getPosts(): Promise<Post[]> {
  "use cache";
  const files = (await readdir(path.join(ROOT, "blog"))).filter((f) => f.endsWith(".md"));
  const posts = await Promise.all(
    files.map(async (f) => {
      const { meta } = parse(await readFile(path.join(ROOT, "blog", f), "utf8"));
      return { ...meta, slug: f.replace(/\.md$/, "") };
    }),
  );
  return posts.sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));
}

// null when there's no such post (slugs are checked, so they can't reach outside content/blog)
export async function getPost(slug: string) {
  "use cache";
  if (!/^[a-z0-9-]+$/.test(slug)) return null;
  try {
    return parse(await readFile(path.join(ROOT, "blog", `${slug}.md`), "utf8"));
  } catch {
    return null;
  }
}
