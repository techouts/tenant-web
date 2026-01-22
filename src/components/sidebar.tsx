"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  {
    label: "Overview",
    href: "/admin",
  },
  {
    label: "Client Onboarding",
    href: "/admin/clients",
  },
  {
    label: "Subscription Plans",
    href: "/admin/subscriptions",
  },
  {
    label: "Manage Apis Quota",
    href: "/admin/api-quota",
  },
];

export function SuperAdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
      <nav className="px-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center rounded-md px-4 py-2 text-sm font-medium
                transition-colors
                ${
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "hover:bg-sidebar-accent/60"
                }
              `}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
