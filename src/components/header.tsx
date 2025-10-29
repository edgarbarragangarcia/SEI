"use client";

import { UserNav } from "@/components/user-nav";
import { Sheet } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95vw] max-w-7xl">
      <header className="flex items-center justify-between h-16 px-6 rounded-full bg-gradient-to-r from-rose-100 to-teal-100 text-gray-800 shadow-lg">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center justify-center w-10 h-10 bg-white/50 rounded-full backdrop-blur-sm">
            <Sheet className="h-6 w-6 text-black" />
          </Link>
        </div>
        
        <nav className="flex items-center gap-2 text-sm font-bold p-1 rounded-full bg-white/30 backdrop-blur-sm">
          <Link 
            href="/" 
            className={cn(
              "transition-colors px-4 py-1.5 rounded-full",
              pathname === "/" ? "bg-white/70" : "hover:bg-white/50"
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
  );
}
