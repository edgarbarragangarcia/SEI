"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GoogleIcon } from "@/components/icons";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AuthForm() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="relative flex flex-col min-h-screen overflow-hidden bg-black text-white">
      <div className="fixed inset-0 -z-20">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-black to-purple-900/20" />
        <div
          className="absolute w-96 h-96 rounded-full blur-3xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 animate-pulse"
          style={{
            top: `${mousePosition.y - 192}px`,
            left: `${mousePosition.x - 192}px`,
            transition: "top 0.1s ease-out, left 0.1s ease-out",
          }}
        />
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl bg-gradient-to-l from-purple-500/10 to-pink-500/10 animate-pulse" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full blur-3xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10 animate-pulse" />
      </div>

      <div className="fixed inset-0 -z-10 opacity-5">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <header className="relative z-10 container mx-auto px-6 py-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-lg">
            SS
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            SheetSyncSEI
          </span>
        </div>
        <nav className="ml-auto flex gap-8 items-center">
          <Link
            href="/"
            className="text-sm font-medium text-gray-300 hover:text-cyan-400 transition-colors duration-300"
          >
            Features
          </Link>
          <Link
            href="/auth"
            className="text-sm font-medium px-6 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 shadow-lg hover:shadow-cyan-500/50"
          >
            Login
          </Link>
        </nav>
      </header>

      <main className="relative z-10 flex-1 flex items-center justify-center px-6">
        <div className="max-w-5xl w-full flex items-center justify-center py-20">
          <Card className="w-full max-w-sm">
            <CardHeader>
              <CardTitle className="text-2xl">Login</CardTitle>
              <CardDescription>
                Sign in with your Google account to continue.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" onClick={() => signIn("google", { callbackUrl: "/dashboard" })}>
                <GoogleIcon className="mr-2 h-4 w-4" />
                Sign in with Google
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="relative z-10 border-t border-cyan-500/20 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-8 text-center text-gray-500 text-sm">
          <p>© 2025 SheetSyncSEI. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
