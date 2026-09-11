const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://compliance-document-review-app-production.up.railway.app';
const API_VERSION = '/api/v1';

export class ApiError extends Error {
  constructor(public status: number, message: string, public rawResponse?: string) {
    super(message);
    this.name = 'ApiError';
  }
}

interface RequestConfig extends Omit<RequestInit, 'signal'> {
  params?: Record<string, string>;
  signal?: AbortSignal;
}

async function apiFetch<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
  const { params, signal, body, ...requestConfig } = config;
  
  let url = `${API_URL}${API_VERSION}${endpoint}`;
  if (params) {
    const searchParams = new URLSearchParams(params);
    url += `?${searchParams.toString()}`;
  }

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const headers: HeadersInit = {
    ...(token && { Authorization: `Bearer ${token}` }),
    ...config.headers,
  };

  // Only set Content-Type for non-FormData bodies.
  // When sending FormData, the browser must set Content-Type with the multipart boundary.
  if (!(body instanceof FormData)) {
    (headers as Record<string, string>)['Content-Type'] = 'application/json';
  }

  try {
    const response = await fetch(url, {
      ...requestConfig,
      headers,
      signal,
    });

    if (!response.ok) {
      const rawText = await response.text().catch(() => '');
      let errorData = null;
      try {
        errorData = JSON.parse(rawText);
      } catch {
        // Response was not JSON
      }
      const errorMessage = errorData?.message || errorData?.error || errorData?.detail || rawText || `Request failed with status ${response.status}`;
      throw new ApiError(response.status, errorMessage, rawText);
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
  
  upload: <T>(endpoint: string, formData: FormData, signal?: AbortSignal) =>
    apiFetch<T>(endpoint, { 
      method: 'POST', 
      body: formData,
      headers: {}, // Let browser set Content-Type for multipart
      signal,
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
