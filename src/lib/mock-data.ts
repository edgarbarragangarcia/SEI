import type { User } from '@/components/auth-provider';

export const sucursales = [
  "AGUASCALIENTES",
  "HERMOSILLO",
  "MONTERREY",
  "TIJUANA"
] as const;

export const roles = ["Admin", "User"] as const;

export type Sucursal = typeof sucursales[number];
export type Role = typeof roles[number];

type MockUser = Omit<User, 'role' | 'sucursal' | 'providerId' | 'tenantId' | 'metadata' | 'providerData' | 'delete' | 'getIdToken' | 'getIdTokenResult' | 'reload' | 'toJSON'> & {
    role: Role;
    sucursal: Sucursal;
    providerId: string;
    tenantId: string | null;
    metadata: {};
    providerData: [];
    delete: () => Promise<void>;
    getIdToken: () => Promise<string>;
    getIdTokenResult: () => Promise<{token: string, expirationTime: string, authTime: string, issuedAtTime: string, signInProvider: null, signInSecondFactor: null, claims: {}}>;
    reload: () => Promise<void>;
    toJSON: () => object;
};

const createMockUser = (uid: string, displayName: string, email: string, role: Role, sucursal: Sucursal, photoURL: string): MockUser => ({
  uid,
  displayName,
  email,
  role,
  sucursal,
  photoURL,
  phoneNumber: null,
  refreshToken: '',
  emailVerified: true,
  isAnonymous: false,
  providerId: 'google.com',
  tenantId: null,
  metadata: {},
  providerData: [],
  delete: async () => {},
  getIdToken: async () => `${uid}-token`,
  getIdTokenResult: async () => ({ token: `${uid}-token`, expirationTime: '', authTime: '', issuedAtTime: '', signInProvider: null, signInSecondFactor: null, claims: {} }),
  reload: async () => {},
  toJSON: () => ({ uid, displayName, email }),
});

export const mockUsers: MockUser[] = [
    createMockUser('user-1', 'Ana García', 'ana.garcia@example.com', 'Admin', 'AGUASCALIENTES', 'https://i.pravatar.cc/150?u=user-1'),
    createMockUser('user-2', 'Carlos Martinez', 'carlos.martinez@example.com', 'User', 'HERMOSILLO', 'https://i.pravatar.cc/150?u=user-2'),
    createMockUser('user-3', 'Sofia Rodriguez', 'sofia.rodriguez@example.com', 'User', 'MONTERREY', 'https://i.pravatar.cc/150?u=user-3'),
    createMockUser('user-4', 'Javier Lopez', 'javier.lopez@example.com', 'User', 'TIJUANA', 'https://i.pravatar.cc/150?u=user-4'),
];
