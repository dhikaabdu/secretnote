import { noteApi } from "@/lib/api/note-service";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(request: Request, { params }: RouteContext) {
  const { id } = await params;
  return noteApi.getById(request, id);
}

export async function PATCH(request: Request, { params }: RouteContext) {
  const { id } = await params;
  return noteApi.patch(request, id);
}

export async function DELETE(request: Request, { params }: RouteContext) {
  const { id } = await params;
  return noteApi.delete(request, id);
}
