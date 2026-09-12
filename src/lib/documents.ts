import api from './api';
import { Document, ReviewDecision, AIAnalysis, ComplianceFlag } from '@/types';

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

// Backend response types (snake_case)
interface BackendDocument {
  id: number;
  file_name: string;
  file_type: string;
  file_size: number | null;
  file_url: string | null;
  status: string;
  advisor_id: number;
  advisor_name: string;
  version: number;
  created_at: string | null;
  updated_at: string | null;
}

interface BackendFlag {
  id: string;
  severity: string;
  title: string;
  passage: string;
  matched_rule: string;
  explanation: string;
  page: number;
}

interface BackendAnalysis {
  summary: string;
  flags: BackendFlag[];
  generated_at: string;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function mapBackendDocument(doc: BackendDocument): Document {
  return {
    id: String(doc.id),
    name: doc.file_name,
    fileType: doc.file_type.toUpperCase() as Document['fileType'],
    fileSize: doc.file_size != null ? formatFileSize(doc.file_size) : 'Unknown',
    version: doc.version,
    submittedDate: doc.created_at || '',
    updatedDate: doc.updated_at || '',
    status: doc.status.toUpperCase() as Document['status'],
    advisorId: String(doc.advisor_id),
    advisorName: doc.advisor_name,
    fileUrl: doc.file_url || undefined,
    revisions: [],
    aiAnalysis: undefined,
  };
}

function mapBackendAnalysis(analysis: BackendAnalysis): AIAnalysis {
  return {
    summary: analysis.summary,
    generatedAt: analysis.generated_at,
    flags: analysis.flags.map((flag): ComplianceFlag => ({
      id: flag.id,
      severity: flag.severity.toUpperCase() as ComplianceFlag['severity'],
      title: flag.title,
      passage: flag.passage,
      matchedRule: flag.matched_rule,
      explanation: flag.explanation,
      page: flag.page,
    })),
  };
}

export const documentsApi = {
  getAll: async (filters?: DocumentFilters): Promise<DocumentsResponse> => {
    const response = await api.get<{ documents: BackendDocument[]; total: number; page: number; totalPages: number }>(
      '/documents',
      filters as Record<string, string>
    );
    return {
      ...response,
      documents: response.documents.map(mapBackendDocument),
    };
  },

  getById: async (id: string): Promise<Document> => {
    const doc = await api.get<BackendDocument>(`/documents/${id}`);
    return mapBackendDocument(doc);
  },

  upload: async (file: File, advisorId: string, signal?: AbortSignal): Promise<Document> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('advisorId', advisorId);
    return api.upload<Document>('/documents', formData, signal);
  },

  getAnalysis: async (id: string): Promise<AIAnalysis> => {
    const analysis = await api.get<BackendAnalysis>(`/documents/${id}/analysis`);
    return mapBackendAnalysis(analysis);
  },

  triggerAnalysis: async (id: string): Promise<AIAnalysis> => {
    const analysis = await api.post<BackendAnalysis>(`/documents/${id}/analyze`);
    return mapBackendAnalysis(analysis);
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
