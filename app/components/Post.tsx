import { useMemo } from "react";
import type { PropsWithChildren } from "react";
import type { PostDocument } from "~/types/post";

export function Post({ post }: PropsWithChildren<{ post: PostDocument }>) {
  const html = useMemo(() => ({ __html: post.content }), [post.content]);
  return (
    <article className="prose prose-sm mx-auto my-auto prose-headings:font-martian-mono prose-headings:text-slate-700 prose-a:text-sky-800 prose-code:rounded-md prose-code:bg-slate-300 prose-code:p-1 prose-code:font-martian-mono prose-code:text-xs prose-code:font-normal prose-code:text-slate-600 lg:prose-base">
      <h1>{post.title}</h1>
      {post.content && <div dangerouslySetInnerHTML={html} />}
    </article>
  );
}
