"use client";

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { sucursales } from '@/lib/mock-data';

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [initialUsers, setInitialUsers] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (status === 'authenticated') {
      setIsLoading(true);
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
        })
        .finally(() => setIsLoading(false));
    }
  }, [status]);

  // Ensure body scroll is restored when leaving the page
  useEffect(() => {
    return () => {
      try { document.body.style.overflow = ''; } catch (e) { /* ignore */ }
    };
  }, []);

  // Global loading handled by Providers -> GlobalLoading. Do not early-return here.

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
        <CardTitle>Gestión de Usuarios</CardTitle>
        <CardDescription>
        Edita roles y sucursales de los usuarios. Los cambios se guardan en la hoja de Google.
        </CardDescription>
      </CardHeader>
            <CardContent className="h-[70vh] flex flex-col">
                <div className="relative w-full flex-1 overflow-auto rounded-md border">
                  {isLoading ? (
                    <div className="flex items-center justify-center min-h-[300px]" aria-busy="true">
                      <div role="status" aria-live="polite" className="flex flex-col items-center gap-3">
                        <svg className="animate-spin h-16 w-16 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                        </svg>
                        <span className="sr-only">Cargando usuarios...</span>
                      </div>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nombre</TableHead>
                          <TableHead>Correo</TableHead>
                          <TableHead>Rol</TableHead>
                          <TableHead>Sucursales</TableHead>
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
                            <TableCell className="align-top">
                              {/* Compact branch selector: chips in the summary and modal dialog for selection */}
                              <div className="min-w-[220px] max-w-[460px]">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button variant="outline" className="w-full justify-start h-auto py-2">
                                      {(() => {
                                        const current = (user[3] || '').toString().split(',').map((s: string) => s.trim()).filter(Boolean);
                                        if (current.length === 0) return <span className="text-sm text-muted-foreground">Seleccionar sucursales...</span>;
                                        const shown = current.slice(0, 3);
                                        return (
                                          <div className="flex items-center gap-2 overflow-hidden">
                                            {shown.map((b: string) => (
                                              <span key={b} className="inline-flex items-center bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full text-xs whitespace-nowrap">{b}</span>
                                            ))}
                                            {current.length > 3 && (
                                              <span className="inline-flex items-center bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs">+{current.length - 3}</span>
                                            )}
                                          </div>
                                        );
                                      })()}
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="sm:max-w-[600px]">
                                    <DialogHeader>
                                      <DialogTitle>Seleccionar Sucursales</DialogTitle>
                                    </DialogHeader>
                                    <div className="grid grid-cols-3 gap-3 p-4">
                                      {[...sucursales, 'Todas'].map((branch) => {
                                        const current = (user[3] || '').toString().split(',').map((s: string) => s.trim()).filter(Boolean);
                                        const checked = current.includes(branch);
                                        return (
                                          <label key={branch}
                                            className={`flex items-center justify-center gap-2 p-3 rounded-lg border cursor-pointer transition-all
                                              ${checked ? 'bg-blue-50 border-blue-200 text-blue-700 ring-2 ring-blue-200' : 'hover:bg-gray-50 hover:border-gray-300'}`}>
                                            <input
                                              type="checkbox"
                                              className="hidden"
                                              checked={checked}
                                              onChange={() => {
                                                const next = checked ? current.filter((c: string) => c !== branch) : [...current, branch];
                                                handleSucursalChange(user[0], next.join(', '));
                                              }}
                                            />
                                            <span className="text-sm font-medium">{branch}</span>
                                          </label>
                                        );
                                      })}
                                    </div>
                                  </DialogContent>
                                </Dialog>
                                <div className="text-xs text-muted-foreground mt-1 truncate">{(user[3] || '') && (user[3] || '')}</div>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </div>
                <div className="flex justify-end mt-2 sticky bottom-0 bg-white py-2">
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
