import { useMemo } from "react";
import type { PropsWithChildren } from "react";
import type { PostDocument } from "~/types/post";
import { Link } from "@remix-run/react";

export function Post({ post }: PropsWithChildren<{ post: PostDocument }>) {
  const html = useMemo(() => ({ __html: post.content }), [post.content]);
  return (
    <article className="prose prose-sm mx-auto my-auto prose-headings:font-martian-mono prose-headings:text-slate-700 prose-h1:text-sky-800 prose-h1:no-underline prose-a:text-sky-800 prose-code:rounded-md prose-code:bg-slate-300 prose-code:p-1 prose-code:font-martian-mono prose-code:text-xs prose-code:font-normal prose-code:text-slate-600 lg:prose-base">
      <Link to={`/blog/${post.slug}`} className="post-title">
        <h1>{post.title}</h1>
      </Link>
      {post.content && <div dangerouslySetInnerHTML={html} />}
    </article>
  );
}
