/**
 * Decides how (or whether) a submitted document can be previewed in the browser.
 *
 * Kept out of the viewer component so the rules can be reasoned about and tested
 * on their own: browsers render PDFs, images and plain text inline, while Word
 * and Excel files have no native viewer and must be offered as a download.
 */

export type PreviewKind = "pdf" | "image" | "text" | "unsupported";

const IMAGE_EXTENSIONS = ["png", "jpg", "jpeg", "gif", "webp", "bmp", "svg"];

export function previewKindFor(
  fileName: string,
  blobType?: string | null
): PreviewKind {
  const type = (blobType ?? "").toLowerCase();
  const ext = fileName.split(".").pop()?.toLowerCase() ?? "";

  if (type.startsWith("application/pdf") || ext === "pdf") return "pdf";
  if (type.startsWith("image/") || IMAGE_EXTENSIONS.includes(ext)) {
    return "image";
  }
  if (type.startsWith("text/") || ext === "txt") return "text";
  return "unsupported";
}

/**
 * Blobs streamed as `application/octet-stream` (or with no type at all) are
 * downloaded by the browser rather than rendered inside the `<iframe>`.
 * Re-wrap them with a MIME type the browser can display inline, taking the type
 * from the preview kind and the file extension.
 */
export function withRenderableType(
  blob: Blob,
  kind: PreviewKind,
  fileName: string
): Blob {
  const type = (blob.type || "").toLowerCase();
  if (type && !type.startsWith("application/octet-stream")) {
    return blob;
  }

  const ext = fileName.split(".").pop()?.toLowerCase();
  const inferred =
    kind === "pdf"
      ? "application/pdf"
      : kind === "text"
        ? "text/plain"
        : ext === "png"
          ? "image/png"
          : ext === "jpg" || ext === "jpeg"
            ? "image/jpeg"
            : ext === "gif"
              ? "image/gif"
              : ext === "webp"
                ? "image/webp"
                : undefined;

  return inferred ? new Blob([blob], { type: inferred }) : blob;
}