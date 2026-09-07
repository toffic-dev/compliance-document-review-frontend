import { Document } from "@/types";

export const documents: Document[] = [
  {
    id: "doc-1",
    name: "Data Protection Policy.pdf",
    fileType: "PDF",
    fileSize: "2.4 MB",
    version: 3,
    submittedDate: "2026-09-07",
    updatedDate: "2026-09-07",
    status: "PENDING_REVIEW",
    advisorId: "user-1",
    advisorName: "Alex Johnson",
    aiAnalysis: {
      summary:
        "This document outlines the organization's data protection policies. The policy covers data collection, processing, storage, and deletion procedures. Several areas require attention regarding retention periods and consent mechanisms.",
      flags: [
        {
          id: "flag-1",
          severity: "HIGH",
          title: "Potential data retention issue",
          passage: "The organization may retain customer information indefinitely.",
          matchedRule: "Data Retention Policy",
          explanation:
            "The document does not specify a maximum retention period for customer data, which may violate data protection regulations.",
          page: 4,
        },
        {
          id: "flag-2",
          severity: "MEDIUM",
          title: "Vague consent language",
          passage:
            "Users implicitly agree to data collection by using our services.",
          matchedRule: "Explicit Consent Requirement",
          explanation:
            "Consent must be explicitly obtained rather than implied through service usage.",
          page: 2,
        },
        {
          id: "flag-3",
          severity: "LOW",
          title: "Missing data breach notification timeline",
          passage:
            "In the event of a data breach, affected parties will be notified.",
          matchedRule: "Breach Notification Timeline",
          explanation:
            "The document should specify a maximum timeframe for breach notifications (e.g., 72 hours).",
          page: 6,
        },
      ],
      generatedAt: "2026-09-07T10:30:00Z",
    },
    revisions: [
      {
        id: "rev-1-3",
        version: 3,
        date: "2026-09-07",
        status: "PENDING_REVIEW",
        isCurrent: true,
      },
      {
        id: "rev-1-2",
        version: 2,
        date: "2026-09-05",
        status: "NEEDS_REVISION",
        comment:
          "Please clarify the data retention period and add explicit consent mechanisms.",
        isCurrent: false,
      },
      {
        id: "rev-1-1",
        version: 1,
        date: "2026-09-02",
        status: "NEEDS_REVISION",
        comment: "Initial submission requires significant updates.",
        isCurrent: false,
      },
    ],
  },
  {
    id: "doc-2",
    name: "Client Compliance Report.pdf",
    fileType: "PDF",
    fileSize: "1.8 MB",
    version: 1,
    submittedDate: "2026-09-06",
    updatedDate: "2026-09-06",
    status: "APPROVED",
    advisorId: "user-1",
    advisorName: "Alex Johnson",
    aiAnalysis: {
      summary:
        "A comprehensive compliance report covering Q3 2026 client activities. The report demonstrates adequate adherence to regulatory requirements with minor observations noted.",
      flags: [
        {
          id: "flag-4",
          severity: "LOW",
          title: "Minor formatting inconsistency",
          passage: "Section 3.2 uses different date format than other sections.",
          matchedRule: "Document Consistency Standard",
          explanation:
            "All dates should follow the same format throughout the document.",
          page: 8,
        },
      ],
      generatedAt: "2026-09-06T14:15:00Z",
    },
    revisions: [
      {
        id: "rev-2-1",
        version: 1,
        date: "2026-09-06",
        status: "APPROVED",
        isCurrent: true,
      },
    ],
  },
  {
    id: "doc-3",
    name: "Risk Assessment.xlsx",
    fileType: "XLSX",
    fileSize: "3.2 MB",
    version: 2,
    submittedDate: "2026-09-05",
    updatedDate: "2026-09-07",
    status: "NEEDS_REVISION",
    advisorId: "user-1",
    advisorName: "Alex Johnson",
    revisionComment:
      "The document needs clarification regarding section 4.2 risk scoring methodology and additional mitigation strategies for high-risk items.",
    aiAnalysis: {
      summary:
        "Risk assessment covering operational, financial, and compliance risks. Several high-risk items lack adequate mitigation strategies, and the scoring methodology requires clarification.",
      flags: [
        {
          id: "flag-5",
          severity: "CRITICAL",
          title: "Missing mitigation strategy for critical risk",
          passage:
            "Risk ID-004: Data center outage probability rated as high with no documented mitigation.",
          matchedRule: "Risk Mitigation Requirement",
          explanation:
            "All critical and high risks must have documented mitigation strategies.",
          page: 12,
        },
        {
          id: "flag-6",
          severity: "HIGH",
          title: "Incomplete risk scoring methodology",
          passage:
            "Risk scores are calculated using a proprietary method not fully documented.",
          matchedRule: "Methodology Transparency",
          explanation:
            "The risk scoring methodology must be fully documented and reproducible.",
          page: 5,
        },
        {
          id: "flag-7",
          severity: "MEDIUM",
          title: "Outdated risk references",
          passage:
            "Reference to 2023 regulatory framework instead of current 2026 standards.",
          matchedRule: "Current Standards Compliance",
          explanation:
            "All regulatory references should reflect the most current standards.",
          page: 3,
        },
      ],
      generatedAt: "2026-09-05T09:00:00Z",
    },
    revisions: [
      {
        id: "rev-3-2",
        version: 2,
        date: "2026-09-07",
        status: "NEEDS_REVISION",
        isCurrent: true,
      },
      {
        id: "rev-3-1",
        version: 1,
        date: "2026-09-05",
        status: "NEEDS_REVISION",
        comment: "Initial submission requires additional detail.",
        isCurrent: false,
      },
    ],
  },
  {
    id: "doc-4",
    name: "Customer Due Diligence.docx",
    fileType: "DOCX",
    fileSize: "890 KB",
    version: 1,
    submittedDate: "2026-09-04",
    updatedDate: "2026-09-06",
    status: "APPROVED",
    advisorId: "user-2",
    advisorName: "Sarah Mitchell",
    aiAnalysis: {
      summary:
        "Customer due diligence procedures document outlining KYC processes, enhanced due diligence triggers, and ongoing monitoring requirements. The document is well-structured and comprehensive.",
      flags: [],
      generatedAt: "2026-09-04T11:45:00Z",
    },
    revisions: [
      {
        id: "rev-4-1",
        version: 1,
        date: "2026-09-04",
        status: "APPROVED",
        isCurrent: true,
      },
    ],
  },
  {
    id: "doc-5",
    name: "Annual Compliance Review.pdf",
    fileType: "PDF",
    fileSize: "4.1 MB",
    version: 1,
    submittedDate: "2026-09-03",
    updatedDate: "2026-09-05",
    status: "REJECTED",
    advisorId: "user-2",
    advisorName: "Sarah Mitchell",
    officerComment:
      "The annual compliance review is incomplete. Missing sections on regulatory change impact assessment, training completion metrics, and third-party vendor compliance status. Please resubmit with all required sections.",
    aiAnalysis: {
      summary:
        "Annual compliance review document. The document is missing several required sections and contains outdated regulatory references.",
      flags: [
        {
          id: "flag-8",
          severity: "CRITICAL",
          title: "Missing required section",
          passage: "Section 5: Regulatory Impact Assessment is not present.",
          matchedRule: "Complete Documentation Requirement",
          explanation:
            "Annual compliance reviews must include a regulatory impact assessment section.",
          page: 1,
        },
        {
          id: "flag-9",
          severity: "HIGH",
          title: "Missing training metrics",
          passage:
            "Employee training completion rates are referenced but not provided.",
          matchedRule: "Training Documentation Standard",
          explanation:
            "Training completion metrics must be included with supporting data.",
          page: 15,
        },
      ],
      generatedAt: "2026-09-03T16:20:00Z",
    },
    revisions: [
      {
        id: "rev-5-1",
        version: 1,
        date: "2026-09-03",
        status: "REJECTED",
        isCurrent: true,
      },
    ],
  },
  {
    id: "doc-6",
    name: "Anti-Money Laundering Policy.pdf",
    fileType: "PDF",
    fileSize: "1.5 MB",
    version: 2,
    submittedDate: "2026-09-02",
    updatedDate: "2026-09-04",
    status: "APPROVED",
    advisorId: "user-3",
    advisorName: "Michael Chen",
    aiAnalysis: {
      summary:
        "Comprehensive AML policy covering customer identification, suspicious activity reporting, and record keeping requirements. The policy aligns well with current regulatory expectations.",
      flags: [
        {
          id: "flag-10",
          severity: "LOW",
          title: "Minor typographical error",
          passage: "Section 2.1 contains a typo in 'suspicious'.",
          matchedRule: "Document Quality Standard",
          explanation: "Minor typographical errors should be corrected.",
          page: 3,
        },
      ],
      generatedAt: "2026-09-02T13:00:00Z",
    },
    revisions: [
      {
        id: "rev-6-2",
        version: 2,
        date: "2026-09-04",
        status: "APPROVED",
        isCurrent: true,
      },
      {
        id: "rev-6-1",
        version: 1,
        date: "2026-09-02",
        status: "NEEDS_REVISION",
        comment: "Please update the suspicious activity reporting thresholds.",
        isCurrent: false,
      },
    ],
  },
  {
    id: "doc-7",
    name: "Vendor Risk Management.docx",
    fileType: "DOCX",
    fileSize: "1.2 MB",
    version: 1,
    submittedDate: "2026-09-07",
    updatedDate: "2026-09-07",
    status: "PENDING_REVIEW",
    advisorId: "user-3",
    advisorName: "Michael Chen",
    aiAnalysis: {
      summary:
        "Vendor risk management framework outlining assessment criteria, monitoring procedures, and escalation protocols. The framework is generally sound but lacks specific risk thresholds.",
      flags: [
        {
          id: "flag-11",
          severity: "MEDIUM",
          title: "Undefined risk thresholds",
          passage:
            "Vendors are classified as high, medium, or low risk based on assessment.",
          matchedRule: "Risk Classification Criteria",
          explanation:
            "Specific quantitative thresholds for risk classification should be defined.",
          page: 7,
        },
        {
          id: "flag-12",
          severity: "MEDIUM",
          title: "Missing ongoing monitoring frequency",
          passage: "Vendors will be monitored on an ongoing basis.",
          matchedRule: "Monitoring Schedule Requirement",
          explanation:
            "The document should specify monitoring frequency based on risk level.",
          page: 9,
        },
      ],
      generatedAt: "2026-09-07T08:45:00Z",
    },
    revisions: [
      {
        id: "rev-7-1",
        version: 1,
        date: "2026-09-07",
        status: "PENDING_REVIEW",
        isCurrent: true,
      },
    ],
  },
  {
    id: "doc-8",
    name: "Information Security Policy.pdf",
    fileType: "PDF",
    fileSize: "2.8 MB",
    version: 1,
    submittedDate: "2026-09-01",
    updatedDate: "2026-09-03",
    status: "APPROVED",
    advisorId: "user-1",
    advisorName: "Alex Johnson",
    aiAnalysis: {
      summary:
        "Information security policy covering access controls, encryption standards, incident response, and business continuity. The policy is comprehensive and well-aligned with industry standards.",
      flags: [],
      generatedAt: "2026-09-01T10:00:00Z",
    },
    revisions: [
      {
        id: "rev-8-1",
        version: 1,
        date: "2026-09-01",
        status: "APPROVED",
        isCurrent: true,
      },
    ],
  },
  {
    id: "doc-9",
    name: "Business Continuity Plan.pdf",
    fileType: "PDF",
    fileSize: "3.5 MB",
    version: 2,
    submittedDate: "2026-08-30",
    updatedDate: "2026-09-02",
    status: "NEEDS_REVISION",
    advisorId: "user-2",
    advisorName: "Sarah Mitchell",
    revisionComment:
      "Please update the recovery time objectives for critical systems and add the alternate site contact information.",
    aiAnalysis: {
      summary:
        "Business continuity plan covering disaster recovery, communication protocols, and recovery procedures. Several key metrics require updating.",
      flags: [
        {
          id: "flag-13",
          severity: "HIGH",
          title: "Outdated recovery time objectives",
          passage:
            "Critical systems RTO: 48 hours (established 2024).",
          matchedRule: "Current RTO Standards",
          explanation:
            "Recovery time objectives should reflect current business requirements and be updated annually.",
          page: 10,
        },
        {
          id: "flag-14",
          severity: "MEDIUM",
          title: "Missing alternate site details",
          passage:
            "Alternate processing site will be activated during extended outages.",
          matchedRule: "Site Documentation Requirement",
          explanation:
            "Specific alternate site location and contact information must be documented.",
          page: 14,
        },
      ],
      generatedAt: "2026-08-30T15:30:00Z",
    },
    revisions: [
      {
        id: "rev-9-2",
        version: 2,
        date: "2026-09-02",
        status: "NEEDS_REVISION",
        isCurrent: true,
      },
      {
        id: "rev-9-1",
        version: 1,
        date: "2026-08-30",
        status: "NEEDS_REVISION",
        comment: "Initial submission requires updates to RTO values.",
        isCurrent: false,
      },
    ],
  },
  {
    id: "doc-10",
    name: "Privacy Impact Assessment.xlsx",
    fileType: "XLSX",
    fileSize: "1.9 MB",
    version: 1,
    submittedDate: "2026-09-06",
    updatedDate: "2026-09-06",
    status: "PENDING_REVIEW",
    advisorId: "user-3",
    advisorName: "Michael Chen",
    aiAnalysis: {
      summary:
        "Privacy impact assessment for the new customer portal project. The assessment identifies data flows and potential privacy risks with recommended mitigations.",
      flags: [
        {
          id: "flag-15",
          severity: "HIGH",
          title: "Incomplete data flow mapping",
          passage:
            "Customer data flows from portal to analytics platform.",
          matchedRule: "Complete Data Flow Documentation",
          explanation:
            "All data flows must be fully documented including third-party processors.",
          page: 4,
        },
      ],
      generatedAt: "2026-09-06T12:00:00Z",
    },
    revisions: [
      {
        id: "rev-10-1",
        version: 1,
        date: "2026-09-06",
        status: "PENDING_REVIEW",
        isCurrent: true,
      },
    ],
  },
  {
    id: "doc-11",
    name: "Employee Code of Conduct.pdf",
    fileType: "PDF",
    fileSize: "980 KB",
    version: 1,
    submittedDate: "2026-08-28",
    updatedDate: "2026-08-30",
    status: "APPROVED",
    advisorId: "user-1",
    advisorName: "Alex Johnson",
    aiAnalysis: {
      summary:
        "Employee code of conduct covering ethical standards, conflict of interest policies, and reporting procedures. The document is clear and comprehensive.",
      flags: [],
      generatedAt: "2026-08-28T09:15:00Z",
    },
    revisions: [
      {
        id: "rev-11-1",
        version: 1,
        date: "2026-08-28",
        status: "APPROVED",
        isCurrent: true,
      },
    ],
  },
  {
    id: "doc-12",
    name: "Third Party Due Diligence.docx",
    fileType: "DOCX",
    fileSize: "1.4 MB",
    version: 1,
    submittedDate: "2026-09-07",
    updatedDate: "2026-09-07",
    status: "PENDING_REVIEW",
    advisorId: "user-2",
    advisorName: "Sarah Mitchell",
    aiAnalysis: {
      summary:
        "Third party due diligence procedures for onboarding new vendors and partners. The procedures cover initial assessment, ongoing monitoring, and termination protocols.",
      flags: [
        {
          id: "flag-16",
          severity: "MEDIUM",
          title: "Missing escalation procedure",
          passage:
            "Non-compliant vendors will be subject to review.",
          matchedRule: "Escalation Protocol Requirement",
          explanation:
            "A clear escalation procedure with defined timelines should be documented.",
          page: 6,
        },
      ],
      generatedAt: "2026-09-07T11:20:00Z",
    },
    revisions: [
      {
        id: "rev-12-1",
        version: 1,
        date: "2026-09-07",
        status: "PENDING_REVIEW",
        isCurrent: true,
      },
    ],
  },
];
