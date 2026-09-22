/**
 * Stage model behind the review / analysis progress indicator.
 *
 * The backend performs extraction and analysis as a single server-side operation
 * and reports no intermediate progress, so these stages do not claim to mirror
 * the server. They describe what the *client* knows and is waiting on:
 *
 *   - a stage is only ever `complete` when something we actually received proves
 *     it ran (a successful response — the returned findings quote the document's
 *     own text, which is evidence the file was read);
 *   - the stage being awaited is `active`;
 *   - anything we cannot observe stays `pending`, even while a later stage runs.
 *
 * Kept free of React so the mapping can be reasoned about and tested on its own,
 * alongside `validation.ts` and `documentPreview.ts`.
 */

export type ReviewStepStatus = "pending" | "active" | "complete" | "failed";

/** How the in-flight request ended, as far as the client can tell. */
export type ReviewPhase = "running" | "complete" | "failed";

/** `idle` = nothing has been started from this screen in this visit. */
export type ReviewProgressState = "idle" | ReviewPhase;

export interface ReviewStage {
  /** Short label, e.g. "Extracting document text". */
  label: string;
  /** One-line explanation of what the stage means. */
  hint: string;
}

/** Submit → Extract → Analyze → Review, in the order the workflow runs. */
export const REVIEW_STAGES: ReviewStage[] = [
  {
    label: "Uploading document",
    hint: "The submission is stored and registered for review.",
  },
  {
    label: "Extracting document text",
    hint: "Text and structure are read from the file.",
  },
  {
    label: "Analyzing document",
    hint: "The content is checked against compliance rules.",
  },
  {
    label: "Review complete",
    hint: "Findings are ready for the compliance officer.",
  },
];

/**
 * Stages for analysing a submission that is already in the queue.
 *
 * `Uploading` is complete from the start because the submission exists — the
 * officer only reached this screen by loading it. Driving the request is the
 * analysis itself, so `Analyzing` is the stage being awaited; extraction cannot
 * be observed separately and is only confirmed once findings come back quoting
 * the document. A failure therefore never claims extraction happened.
 */
export function analyzeStatuses(phase: ReviewPhase): ReviewStepStatus[] {
  if (phase === "complete") {
    return ["complete", "complete", "complete", "complete"];
  }

  if (phase === "failed") {
    return ["complete", "pending", "failed", "pending"];
  }

  return ["complete", "pending", "active", "pending"];
}

/**
 * Stages for submitting a document (the advisor's "Submit Document for Review").
 *
 * Only the upload is observable from here: extraction and analysis continue on
 * the server after the response, so they stay pending rather than being ticked
 * off optimistically.
 */
export function submissionStatuses(phase: ReviewPhase): ReviewStepStatus[] {
  if (phase === "complete") {
    return ["complete", "pending", "pending", "pending"];
  }

  if (phase === "failed") {
    return ["failed", "pending", "pending", "pending"];
  }

  return ["active", "pending", "pending", "pending"];
}

/** Number of stages the client can vouch for as finished. */
export function completedCount(statuses: ReviewStepStatus[]): number {
  return statuses.filter((status) => status === "complete").length;
}

/** Index of the stage in flight, or -1 when nothing is running. */
export function activeIndex(statuses: ReviewStepStatus[]): number {
  return statuses.findIndex(
    (status) => status === "active" || status === "failed"
  );
}

/** The stage the process is at: running, or the one it stopped on. */
export function isCurrentStep(status: ReviewStepStatus): boolean {
  return status === "active" || status === "failed";
}