import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import groq from "groq";
import type { PropsWithChildren } from "react";
import Layout from "~/components/Layout";

import { getClient } from "~/sanity/client";

import type { PostDocument } from "~/types/post";
import { postsZ } from "~/types/post";

export const meta: MetaFunction = (data) => {
  return {
    title: "Kyle Goggin (.com)",
  };
};

export const loader = async (props: LoaderArgs) => {
  const query = groq`*[_type == "post"][0...12]{
    _id,
    title,
    content,
    "slug": slug.current,
  }`;

  const posts = await getClient()
    .fetch(query)
    .then((res) => (res ? postsZ.parse(res) : null));

  if (!posts) {
    throw new Response("Not found", { status: 404 });
  }

  return json({ posts });
};

function Post(props: PropsWithChildren<{ post: PostDocument }>) {
  return (
    <article>
      <h2>{props.post.title}</h2>
      {props.post.content && <div>{props.post.content}</div>}
    </article>
  );
}

export default function Index() {
  const { posts } = useLoaderData<typeof loader>();
  console.log(posts);

  return (
    <Layout>
      {posts.map((post) => (
        <Post key={post._id} post={post} />
      ))}
    </Layout>
  );
}
