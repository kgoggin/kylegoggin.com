import { z } from "zod";

export const postZ = z.object({
  _id: z.string(),
  title: z.string(),
  slug: z.string(),
  content: z.string(),
});

export type PostDocument = z.infer<typeof postZ>;

export const postsZ = z.array(postZ);
