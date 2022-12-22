import type { LinksFunction, LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";

import tailwindStylesheetUrl from "./styles/tailwind.css";
import override from "./styles/override.css";
import { getUser } from "./session.server";

export const links: LinksFunction = () => {
  return [
    { rel: "preconnect", href: "https://fonts.googleapis.com" },
    {
      rel: "preconnect",
      href: "https://fonts.gstatic.com",
      // crossOrigin: "true",
    },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Martian+Mono:wght@400;700&family=Source+Sans+Pro:ital,wght@0,400;0,700;1,400;1,700&display=swap",
    },
    {
      rel: "stylesheet",
      href: "https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.7.0/build/styles/atom-one-dark-reasonable.min.css",
    },
    { rel: "stylesheet", href: tailwindStylesheetUrl },
    { rel: "stylesheet", href: override },
  ];
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Remix Notes",
  viewport: "width=device-width,initial-scale=1",
});

export async function loader({ request }: LoaderArgs) {
  return json({
    user: await getUser(request),
    ENV: {
      SANITY_PUBLIC_PROJECT_ID: process.env.SANITY_PUBLIC_PROJECT_ID,
      SANITY_PUBLIC_DATASET: process.env.SANITY_PUBLIC_DATASET,
      SANITY_PUBLIC_API_VERSION: process.env.SANITY_PUBLIC_API_VERSION,
    },
  });
}

export default function App() {
  const { ENV } = useLoaderData<typeof loader>();
  return (
    <html lang="en" className="h-full">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="h-full bg-slate-50 font-source-sans-pro">
        <Outlet />
        <ScrollRestoration />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(ENV)}`,
          }}
        />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
