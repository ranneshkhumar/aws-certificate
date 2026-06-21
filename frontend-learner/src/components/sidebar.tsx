"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Award, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = pathname === "/" || pathname === "/certifications" || pathname.startsWith("/certifications");

  const sidebarContent = (
    <div className="flex h-full flex-col bg-[#111827] text-white">
      {/* Brand Logo */}
      <div className="flex h-16 items-center gap-2.5 border-b border-white/10 px-6">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#ff9900] text-sm font-black text-[#232f3e] shrink-0">
          AWS
        </span>
        <span className="font-bold text-sm tracking-tight text-white">
          Career Explorer
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-4 py-6">
        <Link
          href="/"
          onClick={() => setMobileOpen(false)}
          className={cn(
            "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-extrabold transition-all duration-200 cursor-pointer",
            isActive
              ? "bg-[#ff9900]/10 text-[#ff9900] border border-[#ff9900]/20"
              : "text-zinc-400 hover:bg-white/5 hover:text-white border border-transparent"
          )}
        >
          <Award className="h-5 w-5 shrink-0" />
          <span>Certifications</span>
        </Link>
      </nav>

      {/* Footer */}
      <div className="border-t border-white/10 px-6 py-4">
        <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-black">
          AWS SBG REC
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Top Bar */}
      <header className="fixed top-0 left-0 right-0 z-40 flex h-14 items-center justify-between border-b border-white/10 bg-[#111827] px-4 text-white md:hidden">
        <Link href="/" className="flex items-center gap-2 font-bold text-sm tracking-tight">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#ff9900] text-xs font-black text-[#232f3e]">
            AWS
          </span>
          <span>Career Explorer</span>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-lg p-1.5 text-zinc-400 hover:bg-white/5 hover:text-white"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>

      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-white/10 md:block">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Slide-out */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          {/* Sidebar Panel */}
          <aside className="relative flex w-64 max-w-[80vw] flex-col border-r border-white/10 shadow-2xl animate-in slide-in-from-left duration-200">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 z-50 rounded-lg p-1 text-zinc-400 hover:bg-white/5 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
