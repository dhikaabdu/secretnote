import { itemApi } from "@/lib/api/item-service";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(request: Request, { params }: RouteContext) {
  const { id } = await params;
  return itemApi.getDetail(request, id);
}

export async function PATCH(request: Request, { params }: RouteContext) {
  const { id } = await params;
  return itemApi.patch(request, id);
}

export async function DELETE(request: Request, { params }: RouteContext) {
  const { id } = await params;
  return itemApi.delete(request, id);
}
