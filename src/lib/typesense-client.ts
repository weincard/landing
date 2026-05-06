import Typesense from "typesense";

const typesenseClient = new Typesense.Client({
  nodes: [
    {
      host: process.env.NEXT_PUBLIC_TYPESENSE_HOST!,
      port: parseInt(process.env.NEXT_PUBLIC_TYPESENSE_PORT || "443"),
      protocol: (process.env.NEXT_PUBLIC_TYPESENSE_PROTOCOL || "https") as
        | "http"
        | "https",
    },
  ],
  apiKey: process.env.NEXT_PUBLIC_TYPESENSE_SEARCH_API_KEY!,
  connectionTimeoutSeconds: 5,
});

export default typesenseClient;
