import type { Metadata } from "next";
import Link from "next/link";
import { getPosts } from "@/lib/content";

export const metadata: Metadata = { title: "Blog · Markus Evanger" };

export default async function Blog() {
  const posts = await getPosts();
  return (
    <ul className="menu-list">
      {posts.map((post) => (
        <li key={post.slug}>
          <Link href={`/blog/${post.slug}`} className="group block py-3">
            <span className="text-white/50">{post.date}</span>
            <span className="mt-1 block font-serif text-3xl text-white group-hover:underline">{post.title}</span>
            {post.summary && <span className="mt-1 block text-white/70">{post.summary}</span>}
          </Link>
        </li>
      ))}
    </ul>
  );
}
