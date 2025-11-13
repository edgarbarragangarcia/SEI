"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession, signIn, signOut } from "next-auth/react";
import { LogOut, User as UserIcon, LogIn, Building, Settings } from "lucide-react";
import { useRouter } from "next/navigation";

export function UserNav() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return <Skeleton className="h-10 w-10 rounded-full" />;
  }

  if (!session) {
    return (
      <Button variant="ghost" onClick={() => signIn('google')} aria-label="Iniciar sesión">
        <LogIn className="h-4 w-4" />
      </Button>
    );
  }

  const { user } = session;

  if (!user) {
    return (
      <Button variant="ghost" onClick={() => signIn('google')} aria-label="Iniciar sesión">
        <LogIn className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.image ?? ""} alt={user.name ?? ""} />
            <AvatarFallback>
              <UserIcon />
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user.name}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel className="font-normal text-xs text-muted-foreground flex items-center">
              <Building className="mr-2 h-3 w-3" />
              <span>{user.sucursal} ({user.role})</span>
            </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {user.role === 'Admin' && (
            <DropdownMenuItem onClick={() => router.push('/admin')} className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Administrar usuarios</span>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/landing' })} className="cursor-pointer">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Cerrar sesión</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
