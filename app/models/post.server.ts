import groq from "groq";
import { markdownToHTML } from "~/markdown.server";
import { makeURI } from "~/sanity/client";
import { postsZ } from "~/types/post";
import type { SanityAPIResponse } from "~/types/sanity";

export const getPosts = async () => {
  const query = groq`*[_type == "post"][0...12]{
    _id,
    title,
    content,
    "slug": slug.current,
  }`;
  const uri = makeURI({ query });
  const res = await fetch(uri);
  const json: SanityAPIResponse<unknown> = await res.json();
  return postsZ.parse(json.result).map((post) => ({
    ...post,
    content: markdownToHTML(post.content),
  }));
};
