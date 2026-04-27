import { getKnowledgeBase } from "@/lib/catalog";
import { buildScheduleJson } from "@/lib/knowledge-files";

export const revalidate = 3600;

export async function GET() {
  const knowledge = await getKnowledgeBase();
  return Response.json(buildScheduleJson(knowledge));
}
