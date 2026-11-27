import { noteApi } from "@/lib/api/note-service";

type RouteContext = {
  params: Promise<{ userId: string }>;
};

export async function GET(request: Request, { params }: RouteContext) {
  const { userId } = await params;
  return noteApi.getUserNotes(request, userId);
}
