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
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/users')
        .then(res => res.json())
        .then((data) => {
          // The API returns an array of rows on success, or an object with an error on failure.
          if (Array.isArray(data)) {
            // Filter out duplicate users based on email (index 0)
            const uniqueUsers = Array.from(new Map(data.map((user: any) => [user[0], user])).values());
            setUsers(uniqueUsers);
            setInitialUsers(JSON.parse(JSON.stringify(uniqueUsers)));
          } else if (data && typeof data === 'object' && Object.keys(data).length === 0) {
            // Empty object returned: treat as no users (avoid noisy console.error in dev)
            console.warn('Empty /api/users response received; no users to display.');
            setUsers([]);
            setInitialUsers([]);
          } else if (data && (data.error || data.message)) {
            // Backend returned an error object with details
            console.warn('Error from /api/users:', data);
            toast?.({ title: 'Error', description: data.error || data.message || 'Failed to load users.', variant: 'destructive' });
          } else {
            // Unexpected shape
            console.warn('Unexpected /api/users response:', data);
            // Show a toast to the user if fetching failed
            toast?.({ title: 'Error', description: 'Failed to load users. Check server logs.', variant: 'destructive' });
          }
        })
        .catch((err) => {
          console.error('Error fetching /api/users:', err);
          toast?.({ title: 'Error', description: 'Failed to load users. Check server logs.', variant: 'destructive' });
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
    setIsSaving(true);
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(users),
      });

      const body = await res.json().catch(() => ({}));

      if (!res.ok) {
        // The API provides structured error details now
        const message = body?.error || body?.message || 'Failed to update users';
        const details = body?.details ? `: ${body.details}` : '';
        toast({ title: 'Error', description: `${message}${details}`, variant: 'destructive' });
        setIsSaving(false);
        return;
      }

      // Successful update
      toast({ title: 'Success', description: body?.message || 'User data updated successfully.' });
      setInitialUsers(JSON.parse(JSON.stringify(users)));
    } catch (error) {
      console.error('Error saving users from AdminPage:', error);
      toast({ title: 'Error', description: 'Failed to update user data. Revisa la consola del servidor.', variant: 'destructive' });
    } finally {
      setIsSaving(false);
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
                    <Button onClick={handleSaveChanges} disabled={!hasChanges || isSaving}>
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </CardContent>
            </Card>
        </div>
      </main>
    </div>
  );
}
