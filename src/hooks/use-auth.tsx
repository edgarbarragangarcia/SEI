"use client";
import { useContext } from 'react';
import { AuthContext, type AuthContextType } from '@/components/auth-provider';
import type { User } from 'firebase/auth';

const useFirebaseAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const useMockAuth = (): AuthContextType => {
  const mockUser: User = {
    uid: 'mock-user-id',
    email: 'test@example.com',
    displayName: 'Test User',
    photoURL: 'https://picsum.photos/seed/1/200/200',
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
  };

  return {
    user: mockUser,
    loading: false,
  };
}

export const useAuth = process.env.NODE_ENV === 'production' ? useFirebaseAuth : useMockAuth;