import { getKnowledgeBase } from "@/lib/catalog";
import { buildLlmsTxt } from "@/lib/knowledge-files";

export const revalidate = 3600;

export async function GET() {
  const knowledge = await getKnowledgeBase();
  return new Response(buildLlmsTxt(knowledge), {
    headers: {
      "content-type": "text/plain; charset=utf-8",
    },
  });
}
