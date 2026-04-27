import { getKnowledgeBase } from "@/lib/catalog";
import { buildLlmsFullTxt } from "@/lib/knowledge-files";

export const revalidate = 3600;

export async function GET() {
  const knowledge = await getKnowledgeBase();
  return new Response(buildLlmsFullTxt(knowledge), {
    headers: {
      "content-type": "text/plain; charset=utf-8",
    },
  });
}
