export type DocumentStatus =
  | "PENDING_REVIEW"
  | "APPROVED"
  | "REJECTED"
  | "NEEDS_REVISION";

export type UserRole = "ADVISOR" | "OFFICER";

export type Severity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

export type FileType = "PDF" | "DOCX" | "XLSX";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Revision {
  id: string;
  version: number;
  date: string;
  status: DocumentStatus;
  comment?: string;
  isCurrent: boolean;
}

export interface ComplianceFlag {
  id: string;
  severity: Severity;
  title: string;
  passage: string;
  matchedRule: string;
  explanation: string;
  page: number;
}

export interface AIAnalysis {
  summary: string;
  flags: ComplianceFlag[];
  generatedAt: string;
}

export interface Document {
  id: string;
  name: string;
  fileType: FileType;
  fileSize: string;
  version: number;
  submittedDate: string;
  updatedDate: string;
  status: DocumentStatus;
  advisorId: string;
  advisorName: string;
  fileUrl?: string;
  totalPages?: number;
  aiAnalysis?: AIAnalysis;
  revisions: Revision[];
  revisionComment?: string;
  officerComment?: string;
}

export interface ReviewDecision {
  documentId: string;
  decision: "APPROVE" | "REJECT" | "REQUEST_REVISION";
  comment: string;
  officerId: string;
  timestamp: string;
}

export interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}
