import NoteField from "@/components/NoteField";

export default function CatalogTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NoteField label="Template Note" />
      {children}
    </>
  );
}
