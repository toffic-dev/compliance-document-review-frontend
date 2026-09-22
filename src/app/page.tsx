import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  CheckCircle,
  ChevronDown,
  ClipboardCheck,
  Clock,
  FileText,
  FileUp,
  ScanText,
  Shield,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";

/** Submit → Extract → Analyze → Review: what happens after a document is sent in. */
const workflow = [
  {
    step: "01",
    title: "Submit",
    icon: FileUp,
    body: "Select a PDF, DOCX, or XLSX document and submit it for review. The submission enters Pending Review straight away.",
  },
  {
    step: "02",
    title: "Extract",
    icon: ScanText,
    body: "Text and structure are pulled out of the document so every section, clause, and table can be assessed.",
  },
  {
    step: "03",
    title: "Analyze",
    icon: Sparkles,
    body: "AI-assisted analysis highlights potential compliance issues and ranks them by severity with rule references.",
  },
  {
    step: "04",
    title: "Review",
    icon: ClipboardCheck,
    body: "A compliance officer works through the findings and approves, rejects, or requests a revision.",
  },
];

/** AI-assisted analysis, human accountability, and the record behind both. */
const pillars = [
  {
    icon: Sparkles,
    title: "AI-assisted analysis",
    body: "Every submission gets a first pass that surfaces potential issues, so a reviewer starts from evidence rather than a blank page.",
    chips: ["Critical", "High", "Medium"],
  },
  {
    icon: ShieldCheck,
    title: "Human decision",
    body: "Findings are advisory. A qualified compliance officer makes the final call on every document that enters review.",
    chips: ["Approved", "Needs revision", "Rejected"],
  },
  {
    icon: Clock,
    title: "Auditable by default",
    body: "Status changes, officer comments, and revisions are recorded against the document, giving each review a complete trail.",
    chips: ["Submitted", "Pending Review", "Decision"],
  },
];

/** The platform surface behind the workflow. */
const capabilities = [
  {
    icon: FileText,
    title: "Document submission",
    body: "Drag and drop a PDF, DOCX, or XLSX file; format and size are validated before it enters review.",
  },
  {
    icon: Sparkles,
    title: "AI-assisted review",
    body: "Each submission is read for potential compliance issues and summarised for the officer reviewing it.",
  },
  {
    icon: AlertTriangle,
    title: "Issue detection",
    body: "Flags are ranked from critical to low, each pointing at the rule or section that triggered it.",
  },
  {
    icon: Users,
    title: "Compliance officer review",
    body: "A queue of pending submissions gives officers the document, the findings, and one place to decide.",
  },
  {
    icon: Clock,
    title: "Revision tracking",
    body: "Versions, review states, and resubmissions stay on a single timeline from first submission to approval.",
  },
  {
    icon: CheckCircle,
    title: "Transparent decisions",
    body: "Every decision carries the officer's comment, so an outcome can still be explained months later.",
  },
];

const trustPoints = [
  { icon: FileText, label: "PDF, DOCX and XLSX up to 10 MB" },
  { icon: Activity, label: "AI flags ranked by severity" },
  { icon: ShieldCheck, label: "Officer decision on every submission" },
];

/**
 * Platform facts behind the workflow. Each value comes from the platform's own
 * rules — accepted formats and limits in FileUploader, the severity and status
 * enums in `types` — so nothing here is a marketing figure.
 */
const stats = [
  {
    value: "3",
    label: "Document formats",
    detail: "PDF, DOCX and XLSX accepted",
  },
  {
    value: "10 MB",
    label: "Maximum per submission",
    detail: "Validated before it enters review",
  },
  {
    value: "4",
    label: "Severity levels flagged",
    detail: "Critical, high, medium and low",
  },
  {
    value: "3",
    label: "Decisions an officer records",
    detail: "Approve, reject or request revision",
  },
];

/** Sample findings shown in the hero's product preview. */
const aiPreview = [
  {
    label: "Missing regulatory impact assessment",
    severity: "Critical",
    tone: "border-red-200 bg-red-50 text-red-700",
  },
  {
    label: "Outdated reference: 2019 retention policy",
    severity: "High",
    tone: "border-orange-200 bg-orange-50 text-orange-700",
  },
  {
    label: "Training completion metrics not attached",
    severity: "Medium",
    tone: "border-yellow-200 bg-yellow-50 text-yellow-700",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-slate-900" />
              <span className="font-semibold text-slate-900">
                Compliance Review
              </span>
            </Link>
            <nav className="hidden items-center gap-8 md:flex">
              <a
                href="#how-it-works"
                className="landing-nav-link text-sm text-slate-600 transition-colors hover:text-slate-900"
              >
                How it works
              </a>
              <a
                href="#capabilities"
                className="landing-nav-link text-sm text-slate-600 transition-colors hover:text-slate-900"
              >
                Capabilities
              </a>
              <a
                href="#features"
                className="landing-nav-link text-sm text-slate-600 transition-colors hover:text-slate-900"
              >
                Features
              </a>
              <Link
                href="/login"
                className="landing-nav-link text-sm text-slate-600 transition-colors hover:text-slate-900"
              >
                Sign in
              </Link>
            </nav>
            <div className="flex items-center gap-1.5">
              {/* The desktop nav above already carries "Sign in"; this keeps
                  the action reachable when the nav collapses. */}
              <Link
                href="/login"
                className="inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition duration-200 hover:bg-slate-100 hover:text-slate-900 md:hidden"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-slate-900 rounded-lg transition duration-200 hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-md active:translate-y-0"
              >
                Get started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="hero-shell relative pb-20 pt-14 sm:pt-20 lg:pb-28 lg:pt-24">
        <div className="hero-grid-lines" aria-hidden="true" />
        <div
          className="hero-orb animate-drift -left-24 -top-24 h-80 w-80 bg-brand/25"
          aria-hidden="true"
        />
        <div
          className="hero-orb animate-drift right-[-4rem] top-10 h-72 w-72 bg-slate-900/10 [animation-delay:7s]"
          aria-hidden="true"
        />
        <div
          className="hero-orb animate-drift bottom-[-3rem] left-1/3 h-64 w-64 bg-indigo-300/25 [animation-delay:13s]"
          aria-hidden="true"
        />

        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,440px)] lg:items-center lg:gap-16">
            {/* Copy */}
            <div className="text-center lg:text-left">
              <span className="animate-rise rise-1 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs font-medium text-slate-600 shadow-sm backdrop-blur">
                <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-brand text-brand" />
                AI-assisted compliance review
              </span>

              <h1 className="animate-rise rise-2 mt-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                Smarter compliance{" "}
                <span className="text-gradient-brand">document review</span>
              </h1>

              <p className="animate-rise rise-3 mx-auto mt-6 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg lg:mx-0">
                Submit a document for compliance review and let AI do the first
                pass — extracting the content, flagging issues by severity, and
                handing a clear summary to a compliance officer for the final
                decision.
              </p>

              <div className="animate-rise rise-4 mt-9 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center lg:justify-start">
                <Link
                  href="/signup"
                  className="group inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-6 py-3 text-base font-medium text-white shadow-lg shadow-slate-900/10 transition duration-200 hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-xl active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
                >
                  Submit Document for Review
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-6 py-3 text-base font-medium text-slate-700 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-slate-400 hover:bg-slate-50 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
                >
                  Sign in
                </Link>
              </div>

              <ul className="animate-rise rise-5 mt-10 flex flex-col items-center gap-3 text-sm text-slate-500 sm:flex-row sm:flex-wrap sm:justify-center lg:justify-start">
                {trustPoints.map((point) => (
                  <li
                    key={point.label}
                    className="inline-flex items-center gap-2"
                  >
                    <point.icon className="h-4 w-4 text-brand" />
                    {point.label}
                  </li>
                ))}
              </ul>

              <a
                href="#how-it-works"
                className="animate-fade-in rise-7 mt-10 hidden items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-slate-400 transition-colors hover:text-slate-600 lg:inline-flex"
              >
                See the workflow
                <ChevronDown className="h-4 w-4" />
              </a>
            </div>

            {/* Product preview */}
            <div
              className="animate-rise rise-6 relative mx-auto w-full max-w-md"
              aria-hidden="true"
            >
              <div className="glass-panel relative overflow-hidden rounded-2xl p-5">
                <div className="mock-scan" />

                <div className="relative">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-2.5">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
                        <FileText className="h-4 w-4" />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-slate-900">
                          Annual_Compliance_Review.pdf
                        </p>
                        <p className="text-xs text-slate-500">
                          Submitted 2 minutes ago
                        </p>
                      </div>
                    </div>
                    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
                      <Clock className="h-3.5 w-3.5" />
                      Pending Review
                    </span>
                  </div>

                  <div className="mt-5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="inline-flex items-center gap-1.5 font-medium text-slate-600">
                        <ScanText className="h-3.5 w-3.5 text-brand" />
                        Extracting document text
                      </span>
                      <span className="text-slate-500">Complete</span>
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200">
                      <div className="mock-progress h-full w-full rounded-full bg-brand" />
                    </div>
                  </div>

                  <div className="mt-5 space-y-2.5 rounded-xl border border-slate-200/80 bg-white/70 p-4">
                    <div className="mock-skeleton h-2.5 w-11/12" />
                    <div className="mock-skeleton h-2.5 w-full" />
                    <div className="mock-skeleton h-2.5 w-9/12" />
                    <div className="mock-skeleton h-2.5 w-10/12" />
                    <div className="mock-skeleton h-2.5 w-7/12" />
                  </div>

                  <div className="mt-5 rounded-xl border border-slate-200/80 bg-white/70 p-4">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700">
                        <Sparkles className="h-3.5 w-3.5 text-brand" />
                        AI-assisted analysis
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-xs text-brand">
                        <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-brand text-brand" />
                        Scanning
                      </span>
                    </div>
                    <ul className="mt-3 space-y-2">
                      {aiPreview.map((finding, index) => (
                        <li
                          key={finding.label}
                          className="animate-fade-in flex items-center justify-between gap-3 rounded-lg border border-slate-200/70 bg-white px-3 py-2"
                          style={{ animationDelay: `${900 + index * 200}ms` }}
                        >
                          <span className="truncate text-xs text-slate-700">
                            {finding.label}
                          </span>
                          <span
                            className={`shrink-0 rounded border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${finding.tone}`}
                          >
                            {finding.severity}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-5 flex items-center gap-2 rounded-lg bg-slate-900/5 px-3 py-2 text-xs text-slate-600">
                    <ShieldCheck className="h-4 w-4 text-slate-700" />
                    Queued for compliance officer review
                  </div>
                </div>
              </div>

              <div className="animate-float-slow absolute -left-6 top-1/3 hidden sm:block">
                <div className="glass-panel rounded-xl px-3 py-2 text-xs font-medium text-slate-700">
                  Severity-ranked flags
                </div>
              </div>
              <div className="animate-float-slow absolute -right-6 bottom-12 hidden sm:block [animation-delay:3.5s]">
                <div className="glass-panel rounded-xl px-3 py-2 text-xs font-medium text-slate-700">
                  Human decision
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* At a glance — revealed as the row scrolls into view */}
      <section className="bg-white pb-16 sm:pb-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <Reveal key={stat.label} delay={index * 90} className="h-full">
                <div className="stat-tile h-full rounded-xl border border-slate-200 bg-white px-5 py-6">
                  <p className="stat-value text-gradient-brand text-3xl font-bold">
                    {stat.value}
                  </p>
                  <p className="mt-3 text-sm font-semibold text-slate-900">
                    {stat.label}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-500">
                    {stat.detail}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow: submit, extract, analyze, review */}
      <section
        id="how-it-works"
        className="border-y border-slate-200 bg-slate-50 py-20 lg:py-28"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
              The review workflow
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Submit &rarr; Extract &rarr; Analyze &rarr; Review
            </h2>
            <p className="mt-4 text-base text-slate-600 sm:text-lg">
              One path from a selected document to a recorded decision, with
              AI-assisted analysis in the middle.
            </p>
          </Reveal>

          <div className="relative mt-14">
            {/* Connector between the four steps on wide screens */}
            <div
              className="workflow-track pointer-events-none absolute left-[12.5%] right-[12.5%] top-[52px] hidden h-px lg:block"
              aria-hidden="true"
            />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {workflow.map((stage, index) => (
                <Reveal key={stage.title} delay={index * 110} className="h-full">
                  <div className="landing-card h-full rounded-xl border border-slate-200 bg-white p-6">
                    <div className="flex items-center justify-between">
                      <span className="landing-icon flex h-14 w-14 items-center justify-center rounded-2xl bg-brand/10 text-brand">
                        <stage.icon className="h-6 w-6" />
                      </span>
                      <span className="text-xs font-semibold tracking-[0.2em] text-slate-300">
                        {stage.step}
                      </span>
                    </div>
                    <h3 className="mt-5 text-base font-semibold text-slate-900">
                      {stage.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">
                      {stage.body}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities: AI assistance, human accountability, the record */}
      <section id="capabilities" className="py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
              Built for AI-powered review
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              AI does the first pass. People make the call.
            </h2>
            <p className="mt-4 text-base text-slate-600 sm:text-lg">
              Analysis exists to make review faster and more consistent — never
              to replace the compliance officer who signs off.
            </p>
          </Reveal>

          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {pillars.map((pillar, index) => (
              <Reveal key={pillar.title} delay={index * 120} className="h-full">
                <div className="landing-card h-full rounded-xl border border-slate-200 bg-white p-7">
                  <span className="landing-icon flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10 text-brand">
                    <pillar.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold text-slate-900">
                    {pillar.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {pillar.body}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {pillar.chips.map((chip) => (
                      <span
                        key={chip}
                        className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600"
                      >
                        {chip}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="border-y border-slate-200 bg-slate-50 py-20 lg:py-28"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
              Platform capabilities
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Everything a compliance review needs
            </h2>
            <p className="mt-4 text-base text-slate-600 sm:text-lg">
              From submission to decision, every document, finding, and comment
              stays in one place.
            </p>
          </Reveal>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {capabilities.map((feature, index) => (
              <Reveal key={feature.title} delay={index * 90} className="h-full">
                <div className="landing-card h-full rounded-xl border border-slate-200 bg-white p-6">
                  <div className="flex items-center gap-3">
                    <span className="landing-icon flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
                      <feature.icon className="h-5 w-5" />
                    </span>
                    <h3 className="text-base font-semibold text-slate-900">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    {feature.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Closing call to action */}
      <section className="cta-shell">
        <div className="relative mx-auto max-w-6xl px-4 py-20 text-center sm:px-6 lg:px-8 lg:py-24">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white/80">
              <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-white text-white" />
              Pending Review starts here
            </span>
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to submit a document for review?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-white/70 sm:text-lg">
              Create an account to submit documents, follow their review status,
              and read the AI-assisted findings alongside the officer&apos;s
              decision.
            </p>
            <div className="mt-9 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
              <Link
                href="/signup"
                className="group inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 text-base font-medium text-slate-900 shadow-lg shadow-slate-950/25 transition duration-200 hover:-translate-y-0.5 hover:bg-slate-100 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-900"
              >
                Submit Document for Review
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/25 px-6 py-3 text-base font-medium text-white transition duration-200 hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/10 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-white/60 focus:ring-offset-2 focus:ring-offset-slate-900"
              >
                Sign in
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-slate-900" />
                <span className="font-semibold text-slate-900">
                  Compliance Review
                </span>
              </div>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-500">
                A document submission and compliance review platform:
                AI-assisted analysis, officer decisions, and a complete record
                of both.
              </p>
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                Workflow
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm">
                <li>
                  <a
                    href="#how-it-works"
                    className="text-slate-600 transition-colors hover:text-slate-900"
                  >
                    How it works
                  </a>
                </li>
                <li>
                  <a
                    href="#capabilities"
                    className="text-slate-600 transition-colors hover:text-slate-900"
                  >
                    Capabilities
                  </a>
                </li>
                <li>
                  <a
                    href="#features"
                    className="text-slate-600 transition-colors hover:text-slate-900"
                  >
                    Features
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                Account
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm">
                <li>
                  <Link
                    href="/signup"
                    className="text-slate-600 transition-colors hover:text-slate-900"
                  >
                    Submit a document
                  </Link>
                </li>
                <li>
                  <Link
                    href="/login"
                    className="text-slate-600 transition-colors hover:text-slate-900"
                  >
                    Sign in
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-slate-200 pt-6 sm:flex-row">
            <p className="text-sm text-slate-500">
              &copy; 2026 Compliance Review. All rights reserved.
            </p>
            <p className="text-xs text-slate-400">
              Submitted documents stay in Pending Review until an officer
              decides.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

