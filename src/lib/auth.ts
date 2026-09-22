import api, { ApiError } from './api';
import { User, UserRole } from '@/types';
import { normalizeRole } from './utils';
import {
  clearSession,
  getStoredUser,
  getToken as readToken,
  hasValidSession,
  saveSession,
} from './session';

interface LoginRequest {
  email: string;
  password: string;
}

interface SignupRequest {
  full_name: string;
  email: string;
  password: string;
  role: 'ADVISOR' | 'COMPLIANCE_OFFICER';
}

interface AuthResponse {
  user: User;
  token: string;
}

// Helper to map backend user format to frontend User type
function mapBackendUser(backendUser: { id: string; full_name: string; email: string; role: string; avatar?: string }): User {
  return {
    id: backendUser.id,
    name: backendUser.full_name,
    email: backendUser.email,
    role: normalizeRole(backendUser.role) as UserRole,
    avatar: backendUser.avatar,
  };
}

export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<{ user: { id: string; full_name: string; email: string; role: string; avatar?: string }; token: string }>('/auth/login', data);
    const user = mapBackendUser(response.user);
    if (response.token) {
      saveSession(response.token, user);
    }
    return { user, token: response.token };
  },

  signup: async (data: SignupRequest): Promise<AuthResponse> => {
    const response = await api.post<{ user: { id: string; full_name: string; email: string; role: string; avatar?: string }; token: string }>('/auth/signup', data);
    const user = mapBackendUser(response.user);
    if (response.token) {
      saveSession(response.token, user);
    }
    return { user, token: response.token };
  },

  logout: (): void => {
    clearSession();
  },

  getCurrentUser: (): User | null => {
    return getStoredUser();
  },

  getToken: (): string | null => {
    return readToken();
  },

  /**
   * True only while the stored token is present and not past its `exp`. A token
   * that has expired counts as signed out, which is what lets the app leave a
   * protected page instead of rendering it half-alive.
   */
  isAuthenticated: (): boolean => {
    return hasValidSession();
  },
};

export { ApiError };
