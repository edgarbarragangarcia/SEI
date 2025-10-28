import { UserNav } from "@/components/user-nav";
import { Sheet } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card">
      <div className="container flex h-16 items-center px-4 md:px-6">
        <div className="flex items-center gap-2">
            <Sheet className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold tracking-tight font-headline">SheetSync</h1>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-1">
            <UserNav />
          </nav>
        </div>
      </div>
    </header>
  );
}
