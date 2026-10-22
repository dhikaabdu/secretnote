import { getItems } from "@/lib/data";
import ItemCard from "@/components/ItemCard";

export default function LatestItems() {
  const items = getItems();

  return (
    <section
      aria-label="Daftar item terbaru"
      className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
    >
      {items.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </section>
  );
}
