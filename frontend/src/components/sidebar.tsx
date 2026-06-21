"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Calendar,
  FileText,
  Route,
  MessageSquare,
  Award,
  Database,
  Key,
  Bell,
  LogOut,
  Menu,
} from "lucide-react";

const mainNavigation = [
  { name: "Events", icon: Calendar, href: "#" },
  { name: "News", icon: FileText, href: "#" },
  { name: "Roadmap Builder", icon: Route, href: "/career-pathways" },
  { name: "Chat", icon: MessageSquare, href: "#" },
  { name: "Certifications", icon: Award, href: "/certifications" },
  { name: "Services", icon: Database, href: "#" },
  { name: "Access Control", icon: Key, href: "#" },
];

const footerNavigation = [
  { name: "Announcements", icon: Bell, href: "#" },
  { name: "Sign Out", icon: LogOut, href: "#" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-[#0B0F19] text-slate-300 border-r border-[#1e293b]/20">
      {/* User Header Profile */}
      <div className="flex h-20 items-center justify-between px-6 border-b border-[#1e293b]/30">
        <div>
          <h2 className="text-sm font-bold text-white tracking-wide">Pranav Ranjan</h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Core Admin</p>
        </div>
        <button className="text-slate-400 hover:text-white transition-colors cursor-pointer">
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 space-y-1.5 px-3 py-6">
        {mainNavigation.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : item.href !== "#" && pathname.startsWith(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 py-3 px-4 text-xs font-semibold uppercase tracking-wider transition-all select-none border-l-2",
                isActive
                  ? "border-[#FF9900] text-[#FF9900] bg-[#FF9900]/5"
                  : "border-transparent text-slate-400 hover:text-white hover:bg-white/[0.02]"
              )}
            >
              <item.icon className={cn("h-4 w-4 shrink-0", isActive ? "text-[#FF9900]" : "text-slate-400")} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Navigation */}
      <div className="border-t border-[#1e293b]/30 px-3 py-4 space-y-1.5">
        {footerNavigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex items-center gap-3 py-3 px-4 text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-white hover:bg-white/[0.02] transition-colors border-l-2 border-transparent"
          >
            <item.icon className="h-4 w-4 shrink-0 text-slate-400" />
            <span>{item.name}</span>
          </Link>
        ))}
      </div>
    </aside>
  );
}
