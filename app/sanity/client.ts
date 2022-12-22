import SanityClient from "@sanity/client";
import { projectDetails } from "~/sanity/projectDetails";

export const client = new SanityClient({
  ...projectDetails(),
  // useCdn: true,
  token: process.env.SANITY_READ_TOKEN,
});

// export const previewClient = new SanityClient({
//   ...projectDetails(),
//   useCdn: false,
//   token: process.env.SANITY_READ_TOKEN,
// });

export const getClient = () => client;

// export const writeClient = new SanityClient({
//   ...projectDetails(),
//   useCdn: false,
//   token: process.env.SANITY_WRITE_TOKEN,
// });

export const makeURI = ({
  query,
  useCdn = false,
  variables,
}: {
  query: string;
  useCdn?: boolean;
  variables?: Record<string, string>;
}) => {
  const { projectId, dataset, apiVersion } = projectDetails();
  const domain = useCdn ? "apicdn" : "api";
  const vars = variables ? "&" + new URLSearchParams(variables).toString() : "";
  return `https://${projectId}.${domain}.sanity.io/v${apiVersion}/data/query/${dataset}?query=${encodeURIComponent(
    query
  )}${vars}`;
};
