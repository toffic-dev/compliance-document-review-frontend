import api from './api';
import { Document, ReviewDecision, AIAnalysis } from '@/types';

interface DocumentsResponse {
  documents: Document[];
  total: number;
  page: number;
  totalPages: number;
}

interface DocumentFilters {
  status?: string;
  advisorId?: string;
  page?: string;
  limit?: string;
  search?: string;
}

export const documentsApi = {
  getAll: async (filters?: DocumentFilters): Promise<DocumentsResponse> => {
    return api.get<DocumentsResponse>('/documents', filters as Record<string, string>);
  },

  getById: async (id: string): Promise<Document> => {
    return api.get<Document>(`/documents/${id}`);
  },

  upload: async (file: File, advisorId: string): Promise<Document> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('advisorId', advisorId);
    return api.upload<Document>('/documents', formData);
  },

  getAnalysis: async (id: string): Promise<AIAnalysis> => {
    return api.get<AIAnalysis>(`/documents/${id}/analysis`);
  },

  triggerAnalysis: async (id: string): Promise<AIAnalysis> => {
    return api.post<AIAnalysis>(`/documents/${id}/analyze`);
  },

  download: async (id: string): Promise<Blob> => {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/documents/${id}/download`,
      {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
        },
      }
    );
    if (!response.ok) {
      throw new Error('Download failed');
    }
    return response.blob();
  },
};

export const reviewsApi = {
  submit: async (data: Omit<ReviewDecision, 'timestamp'>): Promise<{ success: boolean; document: Document }> => {
    return api.post('/reviews', data);
  },

  getHistory: async (documentId: string): Promise<ReviewDecision[]> => {
    return api.get<ReviewDecision[]>(`/reviews/${documentId}`);
  },
};
