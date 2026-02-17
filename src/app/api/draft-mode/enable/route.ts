import { client } from "@/sanity/lib/client";
import { token } from "@/sanity/lib/token";
import { defineEnableDraftMode } from "next-sanity/draft-mode";

const handler = token
  ? defineEnableDraftMode({ client: client.withConfig({ token }) })
  : {
      GET: () =>
        new Response(
          "Draft mode unavailable – SANITY_API_READ_TOKEN is not configured.",
          { status: 503 }
        ),
    };

export const { GET } = handler;
