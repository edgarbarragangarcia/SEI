"use client";

import { UserNav } from "@/components/user-nav";
import { Sheet } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();

  return (
    <div className="fixed top-4 left-0 right-0 z-50">
      <div className="container mx-auto px-4 md:px-6">
  <header className="flex items-center justify-between h-16 rounded-full bg-gradient-to-r from-rose-100 to-teal-100 text-gray-800 shadow-lg -mx-4 md:-mx-6 px-6 md:px-8">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="flex items-center gap-2" aria-label="Dashboard">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-lg">
              SS
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              SheetSyncSEI
            </span>
          </Link>
        </div>
        
        <nav className="flex items-center gap-2 text-sm font-bold p-1 rounded-full bg-white/30 backdrop-blur-sm">
          <Link 
            href="/dashboard" 
            className={cn(
              "transition-colors px-4 py-1.5 rounded-full",
              pathname === "/dashboard" ? "bg-white/70" : "hover:bg-white/50"
            )}
          >
            Dashboard
          </Link>
          <Link 
            href="/agenda-naranja" 
            className={cn(
              "transition-colors px-4 py-1.5 rounded-full",
              pathname === "/agenda-naranja" ? "bg-white/70" : "hover:bg-white/50"
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
  );
}
