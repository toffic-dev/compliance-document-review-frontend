import api, { ApiError } from './api';
import { User, UserRole } from '@/types';

interface LoginRequest {
  email: string;
  password: string;
}

interface SignupRequest {
  full_name: string;
  email: string;
  password: string;
  role: 'ADVISOR' | 'OFFICER';
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
    role: backendUser.role as UserRole,
    avatar: backendUser.avatar,
  };
}

export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<{ user: { id: string; full_name: string; email: string; role: string; avatar?: string }; token: string }>('/auth/login', data);
    const user = mapBackendUser(response.user);
    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(user));
    }
    return { user, token: response.token };
  },

  signup: async (data: SignupRequest): Promise<AuthResponse> => {
    const response = await api.post<{ user: { id: string; full_name: string; email: string; role: string; avatar?: string }; token: string }>('/auth/signup', data);
    const user = mapBackendUser(response.user);
    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(user));
    }
    return { user, token: response.token };
  },

  logout: (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: (): User | null => {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  getToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  },

  isAuthenticated: (): boolean => {
    return !!authApi.getToken();
  },
};

export { ApiError };
