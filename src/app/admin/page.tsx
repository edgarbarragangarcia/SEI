"use client";

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [initialUsers, setInitialUsers] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/users')
        .then(res => res.json())
        .then(data => {
          if (data) {
            // Filter out duplicate users based on email (index 0)
            const uniqueUsers = Array.from(new Map(data.map((user: any) => [user[0], user])).values());
            setUsers(uniqueUsers);
            setInitialUsers(JSON.parse(JSON.stringify(uniqueUsers)));
          }
        });
    }
  }, [status]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (session?.user?.role !== 'Admin') {
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

  const handleRoleChange = (email: string, role: string) => {
    setUsers(users.map(user => user[0] === email ? [user[0], user[1], role, user[3]] : user));
  };

  const handleSucursalChange = (email: string, sucursal: string) => {
    setUsers(users.map(user => user[0] === email ? [user[0], user[1], user[2], sucursal] : user));
  };

  const handleSaveChanges = async () => {
    try {
      await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(users),
      });
      toast({ title: 'Success', description: 'User data updated successfully.' });
      setInitialUsers(JSON.parse(JSON.stringify(users)));
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update user data.', variant: 'destructive' });
    }
  };

  const hasChanges = JSON.stringify(users) !== JSON.stringify(initialUsers);

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
                Edit user roles and branches. Changes are saved to the Google Sheet.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="relative w-full overflow-auto rounded-md border">
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Branch</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {users.slice(1).map((user, index) => (
                            <TableRow key={index}>
                                <TableCell>{user[1]}</TableCell>
                                <TableCell>{user[0]}</TableCell>
                                <TableCell>
                                    <Select value={user[2]} onValueChange={(value) => handleRoleChange(user[0], value)}>
                                    <SelectTrigger>{user[2]}</SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Admin">Admin</SelectItem>
                                        <SelectItem value="User">User</SelectItem>
                                    </SelectContent>
                                    </Select>
                                </TableCell>
                                <TableCell>
                                    <Select value={user[3]} onValueChange={(value) => handleSucursalChange(user[0], value)}>
                                    <SelectTrigger>{user[3]}</SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="AGUASCALIENTES">AGUASCALIENTES</SelectItem>
                                        <SelectItem value="TOLUCA">TOLUCA</SelectItem>
                                        <SelectItem value="CIUDAD DE MEXICO">CIUDAD DE MEXICO</SelectItem>
                                        <SelectItem value="GUADALAJARA">GUADALAJARA</SelectItem>
                                        <SelectItem value="Todas">Todas</SelectItem>
                                    </SelectContent>
                                    </Select>
                                </TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </div>
                <div className="flex justify-end mt-4">
                    <Button onClick={handleSaveChanges} disabled={!hasChanges}>
                    Save Changes
                    </Button>
                </div>
            </CardContent>
            </Card>
        </div>
      </main>
    </div>
  );
}
