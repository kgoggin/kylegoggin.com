// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

const redirects = [
  "announcing-reason-react-apollo",
  "typing-graphql-operations-in-reason",
  "using-belt",
  "sharing-types-in-a-reasonml-graphql-app",
  "oh-hai",
].reduce<Record<string, string>>((acc, slug) => {
  return {
    ...acc,
    [`/${slug}`]: `/blog/${slug}`,
  };
}, {});

// https://astro.build/config
export default defineConfig({
  site: "https://www.kylegoggin.com",
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [sitemap()],
  redirects,
});
