"use client";

import { useAuth } from "@/hooks/use-auth";
import { Header } from "@/components/header";
import { LoginCard } from "@/components/login-card";
import { SheetSyncDashboard } from "@/components/sheet-sync-dashboard";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet } from "lucide-react";

const LoadingState = () => (
  <div className="flex flex-col items-center justify-center flex-1 w-full gap-8 p-4 md:p-8">
    <div className="w-full max-w-2xl space-y-4">
      <Skeleton className="h-12 w-1/3" />
      <Skeleton className="h-8 w-2/3" />
      <Skeleton className="h-10 w-full" />
    </div>
    <div className="w-full max-w-5xl space-y-4 mt-8">
        <Skeleton className="h-48 w-full" />
    </div>
  </div>
);


export default function Home() {
  const { user, loading } = useAuth();

  const renderContent = () => {
    if (loading) {
      return <LoadingState />;
    }

    if (!user) {
      return <LoginCard />;
    }

    return <SheetSyncDashboard />;
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex flex-col items-center flex-1">
        {renderContent()}
      </main>
    </div>
  );
}
