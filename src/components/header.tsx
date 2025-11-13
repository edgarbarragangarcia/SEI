"use client";

import { UserNav } from "@/components/user-nav";
import { Logo } from "@/components/logo";
import { Sheet } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();

  return (
    <div className="fixed top-4 left-0 right-0 z-50">
      <div className="container mx-auto px-4 md:px-6">
              <div className="rounded-full bg-gradient-to-r from-white/95 via-white/90 to-white/95 shadow-lg px-4 md:px-6 py-2 border border-white/10 backdrop-blur-md">
            <header className="flex items-center justify-between h-16 bg-transparent text-gray-800 px-2 md:px-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="flex items-center gap-2" aria-label="Dashboard">
            <Logo variant="default" size="md" showText={true} />
          </Link>
        </div>
        
        <nav className="flex items-center gap-2 text-sm font-semibold p-1 rounded-full bg-white/30 backdrop-blur-sm">
          <Link 
            href="/dashboard" 
            className={cn(
              "relative transition-colors px-4 py-1.5 rounded-full",
              pathname === "/dashboard"
                ? "bg-white/90 text-gray-900 ring-2 ring-cyan-300/15 shadow-[0_8px_30px_rgba(59,130,246,0.06)]"
                : "hover:bg-white/40"
            )}
          >
            Dashboard
          </Link>
          <Link 
            href="/agenda-naranja" 
            className={cn(
              "relative transition-colors px-4 py-1.5 rounded-full",
              pathname === "/agenda-naranja"
                ? "bg-white/90 text-gray-900 ring-2 ring-cyan-300/15 shadow-[0_8px_30px_rgba(59,130,246,0.06)]"
                : "hover:bg-white/40"
            )}
          >
            Agenda Naranja
          </Link>
        </nav>

        <div className="flex items-center justify-end">
          <UserNav />
        </div>
      </header>
        </div>
      </div>
    </div>
  );
}
