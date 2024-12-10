import rss from "@astrojs/rss";
import { getRSSItems } from "../blog";

export async function GET(context) {
  const items = await getRSSItems();
  return rss({
    title: "Kyle Goggin's Blog",
    description:
      "My thoughts, musings, ideas, and anything else I feel like writing about.",
    site: context.site,
    items,
  });
}
