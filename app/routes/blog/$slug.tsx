import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import Layout from "~/components/Layout";
import { getPost } from "~/models/post.server";

import { Post } from "~/components/Post";

export const meta: MetaFunction = (data) => {
  return {
    title: "Kyle Goggin (.com)",
  };
};

export const loader = async (props: LoaderArgs) => {
  const slug = props.params.slug;
  const post = slug && (await getPost(slug));

  if (!post) {
    throw new Response("Not found", { status: 404 });
  }

  return json({ post });
};

export default function PostPage() {
  const { post } = useLoaderData<typeof loader>();

  return (
    <Layout>
      <Post key={post._id} post={post} />
    </Layout>
  );
}
