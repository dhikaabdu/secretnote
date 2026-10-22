"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { href: "/", label: "Dashboard" },
  { href: "/notes", label: "My Notes" },
  { href: "/catalog", label: "Catalog" },
  { href: "/about", label: "About" },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <>
      {navigation.map(({ href, label }) => {
        const isActive =
          href === "/"
            ? pathname === href
            : pathname === href || pathname.startsWith(`${href}/`);

        return (
          <Link
            key={href}
            href={href}
            aria-current={isActive ? "page" : undefined}
            className={`text-sm font-medium hover:text-indigo-600 ${
              isActive ? "text-indigo-700" : "text-slate-600"
            }`}
          >
            {label}
          </Link>
        );
      })}
    </>
  );
}
