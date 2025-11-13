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
    <div className="relative flex flex-col min-h-screen overflow-hidden bg-white text-gray-900">
      <div className="fixed inset-0 -z-20">
        <div className="absolute inset-0 bg-gradient-to-br from-white to-indigo-50" />
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
        {/* Navegación simplificada: enlaces de inicio de sesión removidos */}
      </header>

      <main className="relative z-10 flex-1 flex items-center justify-center px-6">
        <div className="max-w-5xl w-full flex items-center justify-center py-20">
          <Card className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2">
            {/* Left: brand / benefits */}
            <div className="hidden md:flex flex-col items-start justify-center gap-6 p-8 rounded-l-lg bg-gradient-to-br from-cyan-700/30 to-blue-700/20">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-lg shadow-md">
                SS
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Bienvenido a SheetSyncSEI</h3>
                <p className="mt-2 text-sm text-gray-700">Sincroniza, administra y colabora con tus hojas de Google en tiempo real.</p>
              </div>

              <ul className="mt-4 space-y-3 text-sm text-gray-800">
                <li className="flex items-start gap-3">
                  <span className="text-xl">⚡</span>
                  <span className="font-medium">Sincronización automática</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-xl">🔒</span>
                  <span className="font-medium">Acceso seguro con Google</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-xl">🎯</span>
                  <span className="font-medium">Interfaz limpia y moderna</span>
                </li>
              </ul>
            </div>

            {/* Right: form */}
            <div className="flex items-center justify-center p-8">
              <div className="w-full max-w-md">
                <div className="mb-6">
                  <h2 className="text-3xl font-bold text-gray-900">Inicia sesión</h2>
                  <p className="mt-1 text-sm text-gray-600">Accede con tu cuenta de Google o usa tu correo.</p>
                </div>

                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                  <div>
                    <label className="text-sm font-bold text-gray-900 mb-2 block">Correo electrónico</label>
                    <input
                      type="email"
                      placeholder="tucorreo@ejemplo.com"
                      className="w-full rounded-lg border-2 border-gray-200 bg-white/95 px-4 py-2.5 text-base text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-bold text-gray-900 mb-2 block">Contraseña</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full rounded-lg border-2 border-gray-200 bg-white/95 px-4 py-2.5 text-base text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                      required
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                      <input type="checkbox" className="h-4 w-4 rounded border-2 border-gray-300 bg-white text-cyan-500 focus:ring-2 focus:ring-cyan-400" />
                      <span>Recordarme</span>
                    </label>
                    {/* Enlace de 'Olvidaste tu contraseña' removido según solicitud */}
                  </div>

                  <div className="flex flex-col gap-3">
                    <Button variant="default" className="w-full py-3" onClick={() => alert('Login no implementado - usar Google Sign In')}>
                      Entrar con correo
                    </Button>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center" aria-hidden>
                        <div className="w-full border-t border-white/10" />
                      </div>
                      <div className="relative flex justify-center text-xs text-gray-400"> o </div>
                    </div>

                    <Button variant="outline" className="w-full py-3 flex items-center justify-center" onClick={() => signIn('google', { callbackUrl: '/dashboard' })}>
                      <GoogleIcon className="mr-2 h-4 w-4" />
                      Continuar con Google
                    </Button>
                  </div>
                </form>

                {/* Texto de registro removido según solicitud */}
              </div>
            </div>
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
