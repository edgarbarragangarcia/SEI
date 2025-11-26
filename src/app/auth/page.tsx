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
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    setIsVisible(true);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="relative flex flex-col min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950">
      {/* Vibrant background gradients */}
      <div className="fixed inset-0 -z-20">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950/50 to-purple-950/50" />
        {/* Mouse follower - more vibrant */}
        <div
          className="absolute w-[600px] h-[600px] rounded-full blur-3xl bg-gradient-to-r from-cyan-500/25 to-blue-600/25 animate-pulse"
          style={{
            top: `${mousePosition.y - 300}px`,
            left: `${mousePosition.x - 300}px`,
            transition: "top 0.3s ease-out, left 0.3s ease-out",
          }}
        />
        {/* Static gradients - more vibrant */}
        <div className="absolute -top-48 -right-48 w-[600px] h-[600px] rounded-full blur-3xl bg-gradient-to-l from-purple-600/15 to-pink-600/15 animate-pulse" />
        <div className="absolute -bottom-40 left-1/4 w-[500px] h-[500px] rounded-full blur-3xl bg-gradient-to-r from-blue-600/25 to-cyan-600/25 animate-pulse" />
      </div>

      {/* Grid pattern */}
      <div className="fixed inset-0 -z-10 opacity-[0.08]">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" className="text-cyan-400/8" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Header */}
      <header className="relative z-10 container mx-auto px-6 py-8 flex items-center justify-between backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-xl shadow-lg shadow-cyan-500/30">
            SS
          </div>
          <span className="text-2xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            SheetSyncSEI
          </span>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-6 py-12">
        <div className={`max-w-5xl w-full flex items-center justify-center transition-all duration-1000 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <Card className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 overflow-hidden border-2 border-cyan-500/30 shadow-2xl shadow-cyan-500/20 bg-slate-900/60 backdrop-blur-xl">
            {/* Left: brand / benefits with vibrant gradient */}
            <div className="hidden md:flex flex-col items-start justify-center gap-8 p-10 rounded-l-xl bg-gradient-to-br from-cyan-500/80 via-blue-600/80 to-purple-600/80 relative overflow-hidden">
              {/* Overlay pattern */}
              <div className="absolute inset-0 opacity-10">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse">
                      <circle cx="2" cy="2" r="1" fill="white" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#dots)" />
                </svg>
              </div>

              <div className="relative z-10 space-y-8">
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-2xl shadow-lg border border-white/30 text-white">
                  SS
                </div>
                <div>
                  <h3 className="text-3xl font-extrabold text-white drop-shadow-lg">Bienvenido a SheetSyncSEI</h3>
                  <p className="mt-3 text-base text-white/90 font-medium">Sincroniza, administra y colabora con tus hojas de Google en tiempo real.</p>
                </div>

                <ul className="space-y-4 text-base text-white">
                  <li className="flex items-start gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <span className="text-2xl">⚡</span>
                    <span className="font-semibold">Sincronización automática y en tiempo real</span>
                  </li>
                  <li className="flex items-start gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <span className="text-2xl">🔒</span>
                    <span className="font-semibold">Acceso seguro con autenticación Google</span>
                  </li>
                  <li className="flex items-start gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <span className="text-2xl">🎯</span>
                    <span className="font-semibold">Interfaz moderna y fácil de usar</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right: form */}
            <div className="flex items-center justify-center p-10 bg-slate-900/80 backdrop-blur-md">
              <div className="w-full max-w-md">
                <div className="mb-8">
                  <h2 className="text-4xl font-extrabold text-white">Inicia sesión</h2>
                  <p className="mt-2 text-base text-gray-300 font-medium">Accede con tu cuenta de Google o usa tu correo.</p>
                </div>

                <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                  <div>
                    <label className="text-sm font-bold text-white mb-2 block">Correo electrónico</label>
                    <input
                      type="email"
                      placeholder="tucorreo@ejemplo.com"
                      className="w-full rounded-xl border-2 border-slate-700 bg-slate-800/50 px-4 py-3.5 text-base text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all shadow-sm hover:border-cyan-500/50"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-bold text-white mb-2 block">Contraseña</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full rounded-xl border-2 border-slate-700 bg-slate-800/50 px-4 py-3.5 text-base text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all shadow-sm hover:border-cyan-500/50"
                      required
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm text-gray-300 font-semibold cursor-pointer">
                      <input type="checkbox" className="h-4 w-4 rounded border-2 border-gray-400 bg-white text-cyan-600 focus:ring-2 focus:ring-cyan-500 cursor-pointer" />
                      <span>Recuérdame</span>
                    </label>
                  </div>

                  <div className="flex flex-col gap-4 pt-2">
                    <Button
                      variant="default"
                      className="w-full py-3.5 text-base font-bold rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white border-0 shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-[1.02]"
                      onClick={() => alert('Login no implementado - usar Google Sign In')}
                    >
                      Entrar con correo
                    </Button>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center" aria-hidden>
                        <div className="w-full border-t-2 border-slate-700" />
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="bg-slate-900 px-4 text-gray-400 font-semibold">o</span>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      className="w-full py-3.5 text-base font-semibold rounded-xl flex items-center justify-center border-2 border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-white hover:border-slate-600 transition-all duration-300 shadow-sm hover:shadow-md hover:scale-[1.02]"
                      onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
                    >
                      <GoogleIcon className="mr-2 h-5 w-5" />
                      Continuar con Google
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t-2 border-cyan-500/20 backdrop-blur-md bg-slate-900/30">
        <div className="container mx-auto px-6 py-8 text-center text-gray-400 text-sm font-medium">
          <p>© 2025 SheetSyncSEI. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
