"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

export default function DashboardNav({
  role,
  links,
  children,
}: {
  role: string;
  links: { href: string; label: string }[];
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex">
      <aside className="w-56 bg-gray-800 text-white flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <span className="font-semibold capitalize">{role} Dashboard</span>
        </div>
        <nav className="flex-1 p-2 space-y-1">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`block px-3 py-2 rounded ${pathname === href ? "bg-gray-600" : "hover:bg-gray-700"}`}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="p-2 border-t border-gray-700">
          <Link href="/" className="block px-3 py-2 rounded hover:bg-gray-700">Home</Link>
          <button onClick={() => signOut()} className="w-full text-left px-3 py-2 rounded hover:bg-gray-700">
            Sign out
          </button>
        </div>
      </aside>
      <main className="flex-1 p-6 bg-gray-50 overflow-auto">{children}</main>
    </div>
  );
}
