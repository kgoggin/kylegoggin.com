import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import Layout from "~/components/Layout";
import { getPosts } from "~/models/post.server";

import { Post } from "~/components/Post";

export const meta: MetaFunction = (data) => {
  return {
    title: "Kyle Goggin (.com)",
  };
};

export const loader = async (props: LoaderArgs) => {
  const posts = await getPosts();

  if (!posts) {
    throw new Response("Not found", { status: 404 });
  }

  return json({ posts });
};

export default function Index() {
  const { posts } = useLoaderData<typeof loader>();

  return (
    <Layout>
      {posts.map((post) => (
        <Post key={post._id} post={post} />
      ))}
    </Layout>
  );
}
