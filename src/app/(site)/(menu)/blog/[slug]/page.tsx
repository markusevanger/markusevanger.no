import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getPost, getPosts } from "@/lib/content";

export async function generateStaticParams() {
  return (await getPosts()).map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const post = await getPost((await params).slug);
  return { title: `${post?.meta.title ?? "Blog"} · Markus Evanger` };
}

// the slug is URL data, so the post streams in behind a placeholder and navigation stays instant
export default function BlogPost({ params }: PageProps<"/blog/[slug]">) {
  return (
    <Suspense fallback={<p className="text-white/50">loading…</p>}>
      <Post params={params} />
    </Suspense>
  );
}

async function Post({ params }: { params: PageProps<"/blog/[slug]">["params"] }) {
  const post = await getPost((await params).slug);
  if (!post) notFound();
  return (
    <article className="menu-prose">
      <Link href="/blog" className="text-white/50 no-underline hover:text-white">← all posts</Link>
      <p className="text-white/50">{post.meta.date}</p>
      <h1>{post.meta.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.html }} />
    </article>
  );
}
