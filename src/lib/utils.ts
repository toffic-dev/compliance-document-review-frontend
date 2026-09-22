import { type ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return inputs.filter(Boolean).join(" ");
}

/** Placeholder for a value the backend did not provide. */
export const EMPTY_VALUE = "—";

/**
 * Formats an ISO timestamp for display.
 *
 * Returns a dash rather than the literal "Invalid Date" for missing or
 * unparseable values (a document without an `updatedAt`, for instance), so a
 * gap in the data never leaks a JavaScript artefact into the UI.
 */
export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return EMPTY_VALUE;

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return EMPTY_VALUE;

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Normalize a role string for case-insensitive comparison.
 * Trims whitespace and converts to uppercase.
 * Handles null/undefined safely.
 */
export function normalizeRole(role: string | null | undefined): string {
  return (role ?? "").trim().toUpperCase();
}
