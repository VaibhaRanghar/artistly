"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/src/lib/utils";
import { UserButton } from "@clerk/nextjs";
import { 
  LayoutDashboard, 
  Briefcase, 
  User, 
  Users,
  ShoppingBag,
  Calendar,
  Search,
} from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: "ARTIST" | "HIRER" | "ADMIN";
}

export function DashboardLayout({ children, role }: DashboardLayoutProps) {
  const pathname = usePathname();

  const links = {
    ARTIST: [
      { href: "/dashboard/artist",         label: "Overview",       icon: LayoutDashboard },
      { href: "/dashboard/artist/gigs",    label: "My Gigs",        icon: Briefcase },
      { href: "/dashboard/artist/orders",  label: "Orders",         icon: ShoppingBag },
      { href: "/dashboard/artist/events",  label: "Browse Events",  icon: Search },
      { href: "/dashboard/artist/profile", label: "Profile",        icon: User },
    ],
    HIRER: [
      { href: "/dashboard/hirer",           label: "Overview",   icon: LayoutDashboard },
      { href: "/dashboard/hirer/events",    label: "My Events",  icon: Calendar },
      { href: "/dashboard/hirer/orders",    label: "My Orders",  icon: ShoppingBag },
      { href: "/dashboard/hirer/favorites", label: "Favorites",  icon: User },
    ],
    ADMIN: [
      { href: "/dashboard/admin",          label: "Overview", icon: LayoutDashboard },
      { href: "/dashboard/admin/users",    label: "Users",    icon: Users },
      { href: "/dashboard/admin/reports",  label: "Reports",  icon: Briefcase },
    ],
  };

  const currentLinks = links[role] || [];

  const roleColor = { ARTIST: "#f5e642", HIRER: "#ff2a6d", ADMIN: "#00ffcc" };
  const accent = roleColor[role];

  return (
    <div className="flex min-h-screen bg-[#0d0d0d]">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 bg-[#0d0d0d] hidden md:flex flex-col">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-white/10">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 border-2 flex items-center justify-center transition-colors"
              style={{ borderColor: accent }}>
              <span className="font-black text-sm" style={{ color: accent }}>A</span>
            </div>
            <span className="font-black text-white tracking-tight">Artistly</span>
          </Link>
        </div>

        {/* Role badge */}
        <div className="px-4 py-3 border-b border-white/10">
          <span
            className="text-xs font-black uppercase tracking-widest px-2 py-1"
            style={{ backgroundColor: accent + "22", color: accent, border: `1px solid ${accent}40` }}
          >
            {role}
          </span>
        </div>
        
        {/* Nav links */}
        <nav className="flex-1 py-4 px-3 space-y-1">
          {currentLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
            
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 text-sm font-semibold transition-all group",
                  isActive
                    ? "text-black"
                    : "text-white/50 hover:text-white"
                )}
                style={isActive ? { backgroundColor: accent } : undefined}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-2 py-2">
            <UserButton afterSignOutUrl="/" />
            <div className="text-sm">
              <p className="font-bold text-white">My Account</p>
              <p className="text-xs text-white/40 uppercase tracking-wide">{role.toLowerCase()}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Mobile header */}
        <header className="h-14 border-b border-white/10 bg-[#0d0d0d] flex items-center justify-between px-4 md:hidden">
          <Link href="/" className="font-black text-white">Artistly</Link>
          <UserButton />
        </header>
        <div className="flex-1 overflow-y-auto p-6 bg-[#0d0d0d]">
          {children}
        </div>
      </main>
    </div>
  );
}
