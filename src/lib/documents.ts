import api, { API_URL, ApiError } from './api';
import { endSession, getToken, SESSION_EXPIRED_MESSAGE } from './session';
import { Document, ReviewDecision, AIAnalysis, ComplianceFlag, Revision } from '@/types';

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

// Backend response types. The API serialises the documented camelCase names
// (`submittedDate`, `fileType`, `advisorId`, …) and also echoes a few raw
// snake_case columns (`created_at`, `file_size`, `content_type`), so every
// field below is optional and the mapper reads whichever one is present.
interface BackendDocument {
  id: number;
  // camelCase (documented response)
  name?: string | null;
  filename?: string | null;
  fileType?: string | null;
  fileSize?: number | null;
  submittedDate?: string | null;
  updatedDate?: string | null;
  advisorId?: number | null;
  advisorName?: string | null;
  revisions?: BackendRevision[] | null;
  aiAnalysis?: BackendAnalysis | null;
  // snake_case columns the API also sends
  file_name?: string | null;
  file_type?: string | null;
  file_size?: number | null;
  file_url?: string | null;
  content_type?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  status: string;
  version?: number | null;
  total_pages?: number;
}

interface BackendRevision {
  id: number;
  documentId?: number;
  version: number;
  status: string;
  comment?: string | null;
  createdAt?: string | null;
}

interface BackendFlag {
  // The API does not give flags an id, so one is derived when mapping.
  id?: string;
  severity: string;
  title: string;
  passage: string;
  matchedRule?: string | null;
  matched_rule?: string | null;
  explanation: string;
  page?: number | null;
}

interface BackendAnalysis {
  summary?: string;
  flags?: BackendFlag[];
  generatedAt?: string | null;
  generated_at?: string | null;
}

/** A decision as recorded by `POST /reviews`. */
interface BackendReview {
  id: number;
  documentId: number;
  officerId: number;
  officer?: { id: number; full_name: string; email: string; role: string } | null;
  decision: string;
  comment: string;
  timestamp?: string | null;
}

function mapBackendReview(review: BackendReview): ReviewDecision {
  return {
    documentId: String(review.documentId),
    decision: (review.decision ?? '').toUpperCase() as ReviewDecision['decision'],
    comment: review.comment ?? '',
    officerId: String(review.officerId),
    officerName: review.officer?.full_name,
    timestamp: review.timestamp ?? '',
  };
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function detectFileType(fileName: string | null | undefined, ...hints: (string | null | undefined)[]): Document['fileType'] {
  // The extension is the most reliable signal, then the declared MIME type.
  const combined = [fileName, ...hints].filter(Boolean).join(' ').toUpperCase();

  if (combined.includes('PDF')) return 'PDF';
  if (combined.includes('WORD') || combined.includes('DOCX') || combined.includes('DOCUMENT')) return 'DOCX';
  if (combined.includes('SHEET') || combined.includes('XLSX') || combined.includes('EXCEL')) return 'XLSX';

  // Fall back on a file extension the MIME sniffing missed.
  const ext = fileName?.split('.').pop()?.toLowerCase();
  if (ext === 'docx') return 'DOCX';
  if (ext === 'xlsx') return 'XLSX';
  return 'PDF';
}

function mapBackendStatus(status: string): Document['status'] {
  const upper = (status ?? '').toUpperCase().replace(/-/g, '_');
  if (upper.includes('APPROVE')) return 'APPROVED';
  if (upper.includes('REJECT')) return 'REJECTED';
  if (upper.includes('REVISION')) return 'NEEDS_REVISION';
  return 'PENDING_REVIEW'; // default fallback
}

function mapBackendRevision(revision: BackendRevision, isCurrent: boolean): Revision {
  return {
    id: String(revision.id),
    version: revision.version ?? 1,
    date: revision.createdAt ?? '',
    status: mapBackendStatus(revision.status),
    comment: revision.comment ?? undefined,
    isCurrent,
  };
}

function mapBackendDocument(doc: BackendDocument): Document {
  // The API sends `name` (display name) and `filename` (stored file); older
  // payloads only had `file_name`, so accept all three.
  const fileName = doc.name ?? doc.filename ?? doc.file_name ?? 'Unknown';
  const declaredType = doc.fileType ?? doc.file_type ?? doc.content_type ?? '';

  const revisions = (doc.revisions ?? [])
    .map((revision) => revision)
    .filter((revision): revision is BackendRevision => revision != null);
  // The API does not flag which revision is current: the highest version is.
  const currentVersion = revisions.reduce(
    (highest, revision) => Math.max(highest, revision.version ?? 0),
    0
  );
  const latestRevision = revisions.find(
    (revision) => (revision.version ?? 0) === currentVersion
  );

  return {
    id: String(doc.id),
    name: fileName,
    fileType: detectFileType(fileName, declaredType),
    fileSize:
      doc.fileSize != null
        ? formatFileSize(doc.fileSize)
        : doc.file_size != null
          ? formatFileSize(doc.file_size)
          : 'Unknown',
    version: doc.version ?? 1,
    submittedDate: doc.submittedDate ?? doc.created_at ?? '',
    updatedDate: doc.updatedDate ?? doc.updated_at ?? '',
    status: mapBackendStatus(doc.status),
    advisorId: doc.advisorId != null ? String(doc.advisorId) : '',
    advisorName: doc.advisorName ?? (doc as BackendDocument & { advisor_name?: string }).advisor_name ?? 'Unknown',
    fileUrl: doc.file_url || undefined,
    totalPages: doc.total_pages ?? 1,
    revisions: revisions.map((revision) =>
      mapBackendRevision(revision, (revision.version ?? 0) === currentVersion)
    ),
    aiAnalysis: doc.aiAnalysis ? mapBackendAnalysis(doc.aiAnalysis) : undefined,
    // The officer's reply lives on the revision record — it is the comment they
    // attached when asking for a revision — so surface the newest one.
    revisionComment: latestRevision?.comment ?? undefined,
  };
}

function mapBackendAnalysis(analysis: BackendAnalysis): AIAnalysis {
  return {
    summary: analysis.summary ?? '',
    generatedAt: analysis.generatedAt ?? analysis.generated_at ?? '',
    // Flags carry no id of their own; a stable one per position keeps React keys
    // and the per-flag selection working (otherwise every flag shares `undefined`
    // and selecting one would select them all).
    flags: (analysis.flags ?? []).map((flag, index): ComplianceFlag => ({
      id: flag.id ?? `flag-${index}`,
      severity: (flag.severity ?? 'LOW').toUpperCase() as ComplianceFlag['severity'],
      title: flag.title ?? 'Untitled finding',
      passage: flag.passage ?? '',
      matchedRule: flag.matchedRule ?? flag.matched_rule ?? 'Not specified',
      explanation: flag.explanation ?? '',
      page: flag.page ?? 0,
    })),
  };
}

// The `/download` endpoint is expected to stream the raw file bytes, but if it
// ever answers 200 with a JSON body instead, that body is an envelope (a URL or
// metadata) -- never the file itself. These are the keys we know how to unwrap.
const FILE_URL_KEYS = [
  'download_url', 'downloadUrl',
  'file_url', 'fileUrl',
  'signed_url', 'signedUrl',
  'presigned_url', 'presignedUrl',
  'url',
];

function extractFileUrl(payload: unknown): string | null {
  if (typeof payload === 'string') {
    return /^https?:\/\//i.test(payload) ? payload : null;
  }
  if (!payload || typeof payload !== 'object') return null;
  const record = payload as Record<string, unknown>;
  for (const key of FILE_URL_KEYS) {
    const value = record[key];
    if (typeof value === 'string' && value.length > 0) return value;
  }
  for (const key of ['file', 'document', 'data']) {
    const nested = extractFileUrl(record[key]);
    if (nested) return nested;
  }
  return null;
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

      // Map backend documents with error handling for individual items
      const documents: Document[] = [];
      for (const backendDoc of backendDocs) {
        try {
          documents.push(mapBackendDocument(backendDoc));
        } catch (mapErr) {
          console.error('Failed to map document:', backendDoc, mapErr);
          // Log the raw document shape for debugging backend contract issues
          console.error('Raw document keys:', Object.keys(backendDoc));
        }
      }

      return {
        documents,
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
    // The advisor is taken from the bearer token; the field is kept because the
    // documented multipart body lists only `file` and older builds expected it.
    formData.append('advisorId', advisorId);
    const created = await api.upload<BackendDocument>('/documents', formData, signal);
    return mapBackendDocument(created);
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
    const token = getToken();
    // Use the user-facing download endpoint (HTTPBearer = the logged-in user's
    // JWT). The `/documents/{id}/file` route is the *internal* endpoint used by
    // the AI service: it requires an internal service token and always responds
    // 401 {"detail":"Invalid internal service token"} to user sessions.
    const response = await fetch(
      `${API_URL}/api/v1/documents/${id}/download`,
      {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      }
    );
    if (!response.ok) {
      const rawText = await response.text().catch(() => '');
      let detail: unknown = rawText;
      try {
        const parsed = JSON.parse(rawText);
        detail = parsed?.detail ?? parsed?.message ?? parsed?.error ?? rawText;
      } catch {
        // Response body was not JSON; fall back to the raw text
      }

      // This request bypasses the shared client (it reads a file body, not
      // JSON), so it repeats the client's 401 handling: an expired or revoked
      // token ends the session everywhere rather than surfacing a download error.
      if (response.status === 401) {
        endSession();
        throw new ApiError(401, SESSION_EXPIRED_MESSAGE, rawText);
      }

      const detailText = typeof detail === 'string' ? detail : JSON.stringify(detail);
      const message = `Download failed (HTTP ${response.status})${detailText ? `: ${detailText}` : ''}`;
      console.error('[documentsApi.download]', message, {
        documentId: id,
        status: response.status,
        statusText: response.statusText,
        contentType: response.headers.get('content-type'),
        hasToken: !!token,
      });
      throw new ApiError(response.status, message, rawText);
    }

    const contentType = (response.headers.get('content-type') || '').toLowerCase();
    console.info('[documentsApi.download] HTTP', response.status, {
      documentId: id,
      contentType,
      contentDisposition: response.headers.get('content-disposition'),
      contentLength: response.headers.get('content-length'),
    });

    // Verify we actually received file bytes. A JSON body here means the backend
    // sent an envelope rather than the file, so unwrap it instead of treating the
    // JSON itself as the document (that renders as raw JSON in the preview).
    if (contentType.includes('json')) {
      const rawText = await response.text();
      let payload: unknown = null;
      try {
        payload = JSON.parse(rawText);
      } catch {
        // Claimed to be JSON but was not parseable; reported by the error below
      }
      const fileUrl = extractFileUrl(payload);
      if (!fileUrl) {
        throw new ApiError(
          response.status,
          `Download endpoint returned JSON instead of a file. Body: ${rawText.slice(0, 300)}`,
          rawText
        );
      }
      // Send the bearer token only when the URL points at our own backend;
      // signed/external URLs must be fetched without extra headers.
      const fileResponse = await fetch(
        fileUrl,
        fileUrl.startsWith(API_URL) && token
          ? { headers: { Authorization: `Bearer ${token}` } }
          : undefined
      );
      if (!fileResponse.ok) {
        throw new ApiError(
          fileResponse.status,
          `Backend returned a file URL but fetching it failed (HTTP ${fileResponse.status})`,
          await fileResponse.text().catch(() => '')
        );
      }
      return fileResponse.blob();
    }

    return response.blob();
  },
};

export const reviewsApi = {
  submit: async (data: Omit<ReviewDecision, 'timestamp'>): Promise<{ success: boolean; document: Document }> => {
    // The API documents `documentId` as an integer while the UI carries ids as
    // strings, so coerce it (leaving non-numeric ids untouched).
    const documentId = Number(data.documentId);
    const payload = Number.isFinite(documentId) ? { ...data, documentId } : data;
    return api.post('/reviews', payload);
  },

  getHistory: async (documentId: string): Promise<ReviewDecision[]> => {
    const history = await api.get<BackendReview[] | undefined>(`/reviews/${documentId}`);
    // A submission with no decision yet answers 200 with an empty body.
    return Array.isArray(history) ? history.map(mapBackendReview) : [];
  },
};
