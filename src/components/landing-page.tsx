"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2, LayoutDashboard, ShieldCheck, Zap } from "lucide-react";

export function LandingPage() {
    const router = useRouter();

    const handleLogin = () => {
        router.push("/auth");
    };

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-500/10 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/10 blur-[120px]" />
            </div>

            {/* Navbar */}
            <nav className="w-full border-b border-white/5 bg-background/50 backdrop-blur-md sticky top-0 z-50">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center">
                            <LayoutDashboard className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-xl tracking-tight">SheetSync</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" onClick={handleLogin} className="hidden sm:flex">
                            Iniciar Sesión
                        </Button>
                        <Button onClick={handleLogin} className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white border-0">
                            Comenzar Ahora
                        </Button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="flex-1 flex flex-col">
                <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 md:py-32 relative">
                    <div className="max-w-4xl mx-auto space-y-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-muted-foreground animate-fadeIn">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                            </span>
                            Nuevo: Dashboard Agenda Naranja
                        </div>

                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white via-white/90 to-white/60 pb-2">
                            Gestiona tus pacientes <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">con inteligencia</span>
                        </h1>

                        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                            Sincronización en tiempo real con Google Sheets, gestión de estados tipo Kanban y analíticas avanzadas para tu clínica.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                            <Button
                                size="lg"
                                onClick={handleLogin}
                                className="h-12 px-8 text-lg bg-white text-black hover:bg-gray-200 transition-all duration-300 rounded-full"
                            >
                                Acceder al Dashboard
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                onClick={handleLogin}
                                className="h-12 px-8 text-lg rounded-full border-white/10 hover:bg-white/5"
                            >
                                Ver Demo
                            </Button>
                        </div>
                    </div>

                    {/* Feature Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-24 w-full px-4">
                        {[
                            {
                                icon: Zap,
                                title: "Sincronización Real",
                                desc: "Tus datos siempre actualizados directamente desde Google Sheets."
                            },
                            {
                                icon: LayoutDashboard,
                                title: "Vista Kanban",
                                desc: "Organiza tus pacientes por estados visualmente y arrastra para actualizar."
                            },
                            {
                                icon: ShieldCheck,
                                title: "Seguro y Confiable",
                                desc: "Autenticación robusta y manejo seguro de la información sensible."
                            }
                        ].map((feature, i) => (
                            <div key={i} className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-500/30 hover:bg-white/10 transition-all duration-300">
                                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                    <feature.icon className="w-6 h-6 text-cyan-400" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                                <p className="text-muted-foreground">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="border-t border-white/5 py-8 bg-black/20">
                <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} SheetSync. Todos los derechos reservados.</p>
                </div>
            </footer>
        </div>
    );
}
