import format from "date-fns/format";
import groq from "groq";
import { markdownToHTML } from "~/markdown.server";
import { makeURI } from "~/sanity/client";
import { PostDocument, postsZ } from "~/types/post";
import type { SanityAPIResponse } from "~/types/sanity";

export type Post = PostDocument & {
  contentHTML: string;
  formattedDate: string;
};

const parsePost = (p: PostDocument): Post => {
  const dt = new Date(p.date + "T00:00:00");
  return {
    ...p,
    contentHTML: markdownToHTML(p.content),
    formattedDate: format(dt, "LLLL do, yyyy"),
  };
};

export const getPosts = async (): Promise<Post[]> => {
  const query = groq`*[_type == "post"][0...12]{
    _id,
    title,
    content,
    date,
    "slug": slug.current,
  }`;
  const uri = makeURI({ query });
  const res = await fetch(uri);
  const json: SanityAPIResponse<unknown> = await res.json();
  return postsZ.parse(json.result).map(parsePost);
};

export const getPost = async (slug: string): Promise<Post | undefined> => {
  const query = groq`*[_type == "post"][0...12]{
    _id,
    title,
    content,
    date,
    "slug": slug.current,
  }`;
  const uri = makeURI({ query });
  const res = await fetch(uri);
  const json: SanityAPIResponse<unknown> = await res.json();
  return postsZ
    .parse(json.result)
    .map(parsePost)
    .find((post) => post.slug === slug);
};
