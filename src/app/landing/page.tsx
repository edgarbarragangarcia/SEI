"use client";

import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function LandingPage() {
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
      {/* Vibrant animated gradient background */}
      <div className="fixed inset-0 -z-20">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950/50 to-purple-950/50" />
        {/* Mouse follower gradient - more vibrant */}
        <div
          className="absolute w-[600px] h-[600px] rounded-full blur-3xl bg-gradient-to-r from-cyan-500/30 to-blue-600/30 animate-pulse opacity-70"
          style={{
            top: `${mousePosition.y - 300}px`,
            left: `${mousePosition.x - 300}px`,
            transition: "top 0.3s ease-out, left 0.3s ease-out",
          }}
        />
        {/* Additional static gradients - more vibrant */}
        <div className="absolute -top-48 -right-48 w-[600px] h-[600px] rounded-full blur-3xl bg-gradient-to-l from-purple-600/20 to-pink-600/20 animate-pulse" />
        <div className="absolute -bottom-40 left-1/4 w-[500px] h-[500px] rounded-full blur-3xl bg-gradient-to-r from-blue-600/30 to-cyan-600/30 animate-pulse" />
        <div className="absolute top-1/2 left-1/3 w-[400px] h-[400px] rounded-full blur-3xl bg-gradient-to-br from-indigo-600/20 to-purple-600/20 animate-pulse animation-delay-2000" />
      </div>

      {/* Grid pattern overlay */}
      <div className="fixed inset-0 -z-10 opacity-[0.15]">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" className="text-cyan-400/10" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Navigation */}
      <header className="relative z-10 container mx-auto px-6 py-8 flex items-center justify-between backdrop-blur-sm">
        <Logo variant="default" size="md" showText={true} />
        <nav className="ml-auto flex gap-4 items-center">
          <Link href="/auth">
            <Button className="px-6 py-2.5 text-sm rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white border-0 shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/40 transition-all duration-300 hover:scale-105">
              Iniciar sesión
            </Button>
          </Link>
        </nav>
      </header>

      {/* Main content */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-6">
        <div className="max-w-5xl w-full">
          {/* Hero section */}
          <div className={`text-center space-y-8 py-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* Badge with glow effect */}
            <div className="inline-block animate-fadeIn">
              <div className="px-5 py-2.5 rounded-full border-2 border-cyan-400/50 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-md shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-105">
                <span className="text-sm font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                  ✨ Tecnología de Vanguardia
                </span>
              </div>
            </div>

            {/* Main heading with vibrant gradient */}
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight">
              <div className="text-white">
                Sincroniza tus Hojas
              </div>
              <div className="mt-2 bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 bg-clip-text text-transparent animate-gradient">
                de Google sin Esfuerzo
              </div>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-medium">
              Gestiona tu inventario en tiempo real con una interfaz intuitiva y potente.
              <span className="text-cyan-400 font-semibold"> Sincronización automática, segura y confiable.</span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Link href="/auth">
                <Button className="px-10 py-6 text-lg font-bold rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-600 hover:via-blue-700 hover:to-purple-700 text-white border-0 shadow-2xl shadow-cyan-500/50 hover:shadow-cyan-500/70 transition-all duration-300 hover:scale-105 hover:-translate-y-1">
                  Comenzar Ahora
                  <span className="ml-2">→</span>
                </Button>
              </Link>
              <Link href="#features">
                <Button variant="outline" className="px-10 py-6 text-lg font-semibold rounded-xl border-2 border-cyan-400/60 bg-cyan-500/10 backdrop-blur-md text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-400/80 transition-all duration-300 hover:scale-105 shadow-lg">
                  Conocer Más
                </Button>
              </Link>
            </div>
          </div>

          {/* Feature cards with improved styling */}
          <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-8 py-20">
            {[
              {
                title: "Sincronización en Tiempo Real",
                description: "Mantén tus datos siempre actualizados sin retrasos",
                icon: "⚡",
                gradient: "from-yellow-400/20 to-orange-400/20",
                hoverGradient: "group-hover:from-yellow-400/30 group-hover:to-orange-400/30",
                borderColor: "border-yellow-500/30",
                hoverBorder: "hover:border-yellow-500/60",
              },
              {
                title: "Interfaz Intuitiva",
                description: "Diseñada para ser fácil de usar desde el primer momento",
                icon: "🎨",
                gradient: "from-cyan-400/20 to-blue-400/20",
                hoverGradient: "group-hover:from-cyan-400/30 group-hover:to-blue-400/30",
                borderColor: "border-cyan-500/30",
                hoverBorder: "hover:border-cyan-500/60",
              },
              {
                title: "Seguridad Garantizada",
                description: "Encriptación de grado empresarial para tus datos",
                icon: "🔒",
                gradient: "from-purple-400/20 to-pink-400/20",
                hoverGradient: "group-hover:from-purple-400/30 group-hover:to-pink-400/30",
                borderColor: "border-purple-500/30",
                hoverBorder: "hover:border-purple-500/60",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className={`group relative p-8 rounded-2xl border-2 ${feature.borderColor} ${feature.hoverBorder} bg-gradient-to-br ${feature.gradient} backdrop-blur-md bg-slate-900/40 transition-all duration-300 hover:scale-105 hover:-translate-y-2 shadow-xl hover:shadow-2xl cursor-pointer`}
              >
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.hoverGradient} transition-all duration-300 opacity-0 group-hover:opacity-100`} />
                <div className="relative z-10 space-y-4">
                  <div className="text-5xl transform group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-white group-hover:text-white transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 text-base leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
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
