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
          <CardTitle className="text-2xl font-headline">Welcome to SheetSync</CardTitle>
          <CardDescription>
            Sign in to connect your Google Sheets and view your data instantly.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Securely login with your Google account.
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleSignIn}>
            Sign in
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
