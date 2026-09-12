import api, { API_URL } from './api';
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
  total_pages?: number;
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

function detectFileType(fileName: string, fileType: string): Document['fileType'] {
  // Try to detect from file extension first
  const ext = fileName.split('.').pop()?.toLowerCase();
  if (ext === 'pdf') return 'PDF';
  if (ext === 'docx') return 'DOCX';
  if (ext === 'xlsx') return 'XLSX';
  // Fall back to parsing file_type field
  const upper = fileType.toUpperCase();
  if (upper.includes('PDF')) return 'PDF';
  if (upper.includes('WORD') || upper.includes('DOCX')) return 'DOCX';
  if (upper.includes('SHEET') || upper.includes('XLSX')) return 'XLSX';
  return 'PDF'; // default fallback
}

function mapBackendStatus(status: string): Document['status'] {
  const upper = status.toUpperCase().replace(/-/g, '_');
  if (upper.includes('APPROVE')) return 'APPROVED';
  if (upper.includes('REJECT')) return 'REJECTED';
  if (upper.includes('REVISION')) return 'NEEDS_REVISION';
  return 'PENDING_REVIEW'; // default fallback
}

function mapBackendDocument(doc: BackendDocument): Document {
  return {
    id: String(doc.id),
    name: doc.file_name,
    fileType: detectFileType(doc.file_name, doc.file_type),
    fileSize: doc.file_size != null ? formatFileSize(doc.file_size) : 'Unknown',
    version: doc.version ?? 1,
    submittedDate: doc.created_at || '',
    updatedDate: doc.updated_at || '',
    status: mapBackendStatus(doc.status),
    advisorId: String(doc.advisor_id),
    advisorName: doc.advisor_name,
    fileUrl: doc.file_url || undefined,
    totalPages: doc.total_pages ?? 1,
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
    try {
      const response = await api.get<unknown>(
        '/documents',
        filters as Record<string, string>
      );

      // Handle different possible response formats
      let backendDocs: BackendDocument[] = [];
      let total = 0;
      let page = 1;
      let totalPages = 1;

      if (Array.isArray(response)) {
        // Response is a plain array
        backendDocs = response as BackendDocument[];
        total = backendDocs.length;
      } else if (response && typeof response === 'object') {
        const obj = response as Record<string, unknown>;
        // Try common property names for documents array
        const docs = (obj.documents ?? obj.data ?? obj.items ?? obj.results ?? []) as BackendDocument[];
        backendDocs = Array.isArray(docs) ? docs : [];
        total = (obj.total as number) ?? backendDocs.length;
        page = (obj.page as number) ?? 1;
        totalPages = (obj.totalPages as number) ?? 1;
      }

      return {
        documents: backendDocs.map(mapBackendDocument),
        total,
        page,
        totalPages,
      };
    } catch (err) {
      console.error('Failed to fetch documents:', err);
      throw err;
    }
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
      `${API_URL}/api/v1/documents/${id}/file`,
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
