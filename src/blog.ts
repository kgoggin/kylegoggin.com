import { getCollection, getEntry } from "astro:content";
import type { RSSFeedItem } from "@astrojs/rss";

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

export const getRSSItems = async (): Promise<RSSFeedItem[]> => {
  const posts = await getAllBlogPosts();
  return posts.map((post) => ({
    title: post.data.title,
    description: post.data.summary,
    pubDate: post.data.date,
    link: `/blog/${post.id}`,
    content: post.rendered?.html,
  }));
};

export type Post = Awaited<ReturnType<typeof getAllBlogPosts>>[number];
