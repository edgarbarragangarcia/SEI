import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Providers from "@/components/providers";
import { Header } from "@/components/header";

export const metadata: Metadata = {
  title: "SheetSync",
  description: "Conéctate a tus Hojas de Google y visualiza tus datos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased h-screen overflow-hidden flex flex-col">
        <Providers>
          <main className="flex-grow overflow-y-auto">
            {children}
          </main>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
