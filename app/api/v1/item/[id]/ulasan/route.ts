import { itemApi } from "@/lib/api/item-service";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(request: Request, { params }: RouteContext) {
  const { id } = await params;
  return itemApi.getReviews(request, id);
}
