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
          <Link href="/dashboard" className="flex items-center justify-center w-10 h-10 bg-white/50 rounded-full backdrop-blur-sm" aria-label="Home">
            {/* Modern inline SVG logo with subtle gradient */}
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">
              <defs>
                <linearGradient id="logoGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#4F46E5" />
                  <stop offset="100%" stopColor="#06B6D4" />
                </linearGradient>
              </defs>
              <rect x="2" y="2" width="20" height="20" rx="4" fill="url(#logoGrad)" opacity="0.12" />
              <g transform="translate(4,4)">
                <rect x="0" y="0" width="6" height="6" rx="1.2" fill="#ffffff" opacity="0.95" />
                <rect x="8" y="0" width="6" height="6" rx="1.2" fill="#ffffff" opacity="0.8" />
                <rect x="0" y="8" width="6" height="6" rx="1.2" fill="#ffffff" opacity="0.8" />
                <rect x="8" y="8" width="6" height="6" rx="1.2" fill="#ffffff" opacity="0.95" />
              </g>
              <rect x="3.5" y="3.5" width="17" height="17" rx="3.2" stroke="url(#logoGrad)" strokeWidth="1.2" opacity="0.9" />
            </svg>
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
