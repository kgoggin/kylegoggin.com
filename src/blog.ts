import { getCollection, getEntry } from "astro:content";

export const getAllBlogPosts = async ({ limit }: { limit?: number } = {}) => {
  const posts = (await getCollection("blog")).sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime()
  );
  return limit ? posts.slice(0, limit) : posts;
};

export const getPost = async (slug: string) => {
  const post = (await getEntry("blog", slug)) as Post;
  return post;
};

export type Post = Awaited<ReturnType<typeof getAllBlogPosts>>[number];
