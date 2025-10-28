"use client";
import { useContext } from 'react';
import { AuthContext, type AuthContextType, type User } from '@/components/auth-provider';

const useFirebaseAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const useMockAuth = (): AuthContextType => {
  const mockUser: User = {
    uid: 'mock-user-id-2',
    email: 'carlos.martinez@example.com',
    displayName: 'Carlos Martinez',
    photoURL: 'https://i.pravatar.cc/150?u=user-2',
    emailVerified: true,
    isAnonymous: false,
    metadata: {},
    providerData: [],
    providerId: 'password',
    tenantId: null,
    delete: async () => {},
    getIdToken: async () => 'mock-token',
    getIdTokenResult: async () => ({
      token: 'mock-token',
      expirationTime: '',
      authTime: '',
      issuedAtTime: '',
      signInProvider: null,
      signInSecondFactor: null,
      claims: {},
    }),
    reload: async () => {},
    toJSON: () => ({}),
    // New fields for role and branch
    role: 'User',
    sucursal: 'TOLUCA',
  };

  return {
    user: mockUser,
    loading: false,
  };
}

export const useAuth = process.env.NODE_ENV === 'production' ? useFirebaseAuth : useMockAuth;
