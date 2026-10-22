import AppHeader from "@/components/AppHeader";
import NoteField from "@/components/NoteField";

export default function CatalogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AppHeader />
      <div className="mx-auto w-full max-w-7xl flex-1 px-5 py-8 sm:px-8">
        <NoteField label="Layout Note" />
        {children}
      </div>
    </>
  );
}
