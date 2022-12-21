import { z } from "zod";

export const postZ = z.object({
  _id: z.string(),
  title: z.string().nullable(),
  slug: z.string().nullable(),
  content: z.string().nullable(),
});

export type PostDocument = z.infer<typeof postZ>;

export const postsZ = z.array(postZ);
