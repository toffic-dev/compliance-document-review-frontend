const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://compliance-document-review-app-production.up.railway.app';
const API_VERSION = '/api/v1';

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

interface RequestConfig extends RequestInit {
  params?: Record<string, string>;
}

async function apiFetch<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
  const { params, ...requestConfig } = config;
  
  let url = `${API_URL}${API_VERSION}${endpoint}`;
  if (params) {
    const searchParams = new URLSearchParams(params);
    url += `?${searchParams.toString()}`;
  }

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...config.headers,
  };

  try {
    const response = await fetch(url, {
      ...requestConfig,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'An error occurred' }));
      throw new ApiError(response.status, error.message || 'Request failed');
    }

    return response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    // Network error or backend unreachable
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new ApiError(0, 'Unable to connect to the server. Please check your internet connection or try again later.');
    }
    throw new ApiError(0, 'An unexpected error occurred. Please try again.');
  }
}

export const api = {
  get: <T>(endpoint: string, params?: Record<string, string>) =>
    apiFetch<T>(endpoint, { method: 'GET', params }),
  
  post: <T>(endpoint: string, data?: unknown) =>
    apiFetch<T>(endpoint, { method: 'POST', body: JSON.stringify(data) }),
  
  put: <T>(endpoint: string, data?: unknown) =>
    apiFetch<T>(endpoint, { method: 'PUT', body: JSON.stringify(data) }),
  
  patch: <T>(endpoint: string, data?: unknown) =>
    apiFetch<T>(endpoint, { method: 'PATCH', body: JSON.stringify(data) }),
  
  delete: <T>(endpoint: string) =>
    apiFetch<T>(endpoint, { method: 'DELETE' }),
  
  upload: <T>(endpoint: string, formData: FormData) =>
    apiFetch<T>(endpoint, { 
      method: 'POST', 
      body: formData,
      headers: {}, // Let browser set Content-Type for multipart
    }),

  // Health check to verify backend is reachable
  healthCheck: async (): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}${API_VERSION}/health`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      return response.ok;
    } catch {
      return false;
    }
  },
};

export default api;
