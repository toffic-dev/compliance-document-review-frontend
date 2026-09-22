'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User } from '@/types';
import { authApi } from './auth';
import {
  clearSession,
  endSession,
  onSessionExpired,
  readSession,
} from './session';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  signup: (full_name: string, email: string, password: string, role: 'ADVISOR' | 'COMPLIANCE_OFFICER') => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const session = readSession();

    if (session.status === 'expired') {
      // The stored token is past its `exp` — typically a tab reopened later, or
      // a refresh on a protected page. Ending the session here means the visitor
      // is sent to sign-in with an explanation rather than left staring at a
      // dashboard whose requests will all fail.
      endSession();
    } else if (session.status === 'missing') {
      // No token but a cached user left over from a previous session: clear it so
      // the page guards treat this visit as signed out.
      clearSession();
    }

    setUser(session.user);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // Any 401 ends the session in the API layer; mirror it here so no page keeps
    // rendering a user the backend no longer recognises.
    return onSessionExpired(() => setUser(null));
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<User> => {
    const response = await authApi.login({ email, password });
    setUser(response.user);
    return response.user;
  }, []);

  const signup = useCallback(async (full_name: string, email: string, password: string, role: 'ADVISOR' | 'COMPLIANCE_OFFICER') => {
    const response = await authApi.signup({ full_name, email, password, role });
    setUser(response.user);
  }, []);

  const logout = useCallback(() => {
    authApi.logout();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
