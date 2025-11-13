"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function LoginCard() {
  const router = useRouter();

  const handleSignIn = () => {
    router.push('/auth');
  };

  return (
    <div className="flex items-center justify-center flex-1 w-full p-4">
      <Card className="w-full max-w-sm shadow-xl">
          <CardHeader className="text-center">
          <CardTitle className="text-2xl font-headline">Bienvenido a SheetSync</CardTitle>
          <CardDescription>
            Inicia sesión para conectar tus Hojas de Google y ver tus datos al instante.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Inicia sesión de forma segura con tu cuenta de Google.
            </p>
          </div>
        </CardContent>
        <CardFooter>
          {/* Botón de 'Iniciar sesión' removido según solicitud */}
        </CardFooter>
      </Card>
    </div>
  );
}
