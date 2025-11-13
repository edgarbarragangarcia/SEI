"use client";

import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function LandingPage() {
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
      {/* Animated gradient background */}
      <div className="fixed inset-0 -z-20">
        <div className="absolute inset-0 bg-gradient-to-br from-white to-indigo-50" />
        <div
          className="absolute w-96 h-96 rounded-full blur-3xl bg-gradient-to-r from-cyan-200/40 to-blue-200/30 animate-pulse"
          style={{
            top: `${mousePosition.y - 192}px`,
            left: `${mousePosition.x - 192}px`,
            transition: "top 0.1s ease-out, left 0.1s ease-out",
          }}
        />
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl bg-gradient-to-l from-purple-200/30 to-pink-200/30 animate-pulse" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full blur-3xl bg-gradient-to-r from-blue-200/30 to-cyan-200/30 animate-pulse" />
      </div>

      {/* Grid pattern overlay */}
      <div className="fixed inset-0 -z-10 opacity-20 text-gray-200">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Navigation */}
      <header className="relative z-10 container mx-auto px-6 py-8 flex items-center justify-between">
        <Logo variant="default" size="md" showText={true} />
        <nav className="ml-auto flex gap-8 items-center">
          {/* Navegación simplificada: enlaces de inicio de sesión removidos */}
        </nav>
      </header>

      {/* Main content */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-6">
        <div className="max-w-5xl w-full">
          {/* Hero section */}
          <div className="text-center space-y-8 py-20">
            {/* Badge */}
            <div className="inline-block">
              <div className="px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/5 backdrop-blur-sm">
                <span className="text-xs font-semibold text-cyan-400">
                  ✨ Tecnología de Vanguardia
                </span>
              </div>
            </div>

            {/* Main heading */}
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight space-y-2 text-gray-900">
              <div>
                Sincroniza tus Hojas
              </div>
              <div>
                de Google sin Esfuerzo
              </div>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Gestiona tu inventario en tiempo real con una interfaz intuitiva y potente. Sincronización automática, segura y confiable.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Link
                href="#"
                className="px-8 py-4 text-lg font-semibold rounded-lg border border-cyan-200/60 text-cyan-600 hover:bg-cyan-50 transition-all duration-300"
              >
                Conocer Más
              </Link>
            </div>
          </div>

          {/* Feature cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-20">
            {[
              {
                title: "Sincronización en Tiempo Real",
                description: "Mantén tus datos siempre actualizados sin retrasos",
                icon: "⚡",
              },
              {
                title: "Interfaz Intuitiva",
                description: "Diseñada para ser fácil de usar desde el primer momento",
                icon: "🎨",
              },
              {
                title: "Seguridad Garantizada",
                description: "Encriptación de grado empresarial para tus datos",
                icon: "🔒",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group relative p-6 rounded-xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 hover:border-cyan-500/50 transition-all duration-300 hover:bg-gradient-to-br hover:from-cyan-500/10 hover:to-blue-500/10"
              >
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-500/0 to-blue-500/0 group-hover:from-cyan-500/5 group-hover:to-blue-500/5 transition-all duration-300" />
                <div className="relative z-10 space-y-4">
                  <div className="text-3xl">{feature.icon}</div>
                  <h3 className="text-lg font-semibold text-cyan-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 text-sm">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-cyan-500/20 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-8 text-center text-gray-500 text-sm">
          <p>© 2025 SheetSyncSEI. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
