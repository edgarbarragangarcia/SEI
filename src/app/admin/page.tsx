"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { useAuth } from "@/hooks/use-auth";
import { mockUsers as initialUsers, roles, sucursales } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function AdminPage() {
  const { user: currentUser } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState(initialUsers);

  if (currentUser?.role !== "Admin") {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex flex-col items-center justify-center flex-1 text-center">
            <h1 className="text-2xl font-bold">Access Denied</h1>
            <p className="text-muted-foreground">You do not have permission to view this page.</p>
            <Button onClick={() => router.push('/')} className="mt-4">Go to Dashboard</Button>
        </main>
      </div>
    );
  }

  const handleRoleChange = (userId: string, newRole: typeof roles[number]) => {
    setUsers(users.map(u => u.uid === userId ? { ...u, role: newRole } : u));
  };

  const handleSucursalChange = (userId: string, newSucursal: typeof sucursales[number]) => {
    setUsers(users.map(u => u.uid === userId ? { ...u, sucursal: newSucursal } : u));
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="container mx-auto py-8 px-4 md:px-6 w-full">
        <div className="space-y-4">
            <Button variant="ghost" onClick={() => router.push('/')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
            </Button>
            <Card className="shadow-lg">
            <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                Edit user roles and branches. Changes are not saved.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="relative w-full overflow-auto rounded-md border">
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Branch</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.uid}>
                                <TableCell className="font-medium">{user.displayName}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    <Select 
                                        value={user.role} 
                                        onValueChange={(value: typeof roles[number]) => handleRoleChange(user.uid, value)}
                                    >
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Select role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {roles.map(role => <SelectItem key={role} value={role}>{role}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </TableCell>
                                <TableCell>
                                    <Select 
                                        value={user.sucursal} 
                                        onValueChange={(value: typeof sucursales[number]) => handleSucursalChange(user.uid, value)}
                                    >
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Select branch" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {sucursales.map(sucursal => <SelectItem key={sucursal} value={sucursal}>{sucursal}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
            </Card>
        </div>
      </main>
    </div>
  );
}
