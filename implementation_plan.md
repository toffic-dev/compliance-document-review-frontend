# Implementation Plan

## Overview
Fix errors and feature issues in the compliance document review frontend. This plan addresses unused code, broken UI features, browser compatibility issues, and URL handling inconsistencies across the document viewer and API layer.

---

## Types

No new type definitions needed. Existing types in `src/types/index.ts` are sufficient.

---

## Files

### `src/components/review/DocumentViewer.tsx`
- Remove unused `cn` import (line 4)
- Remove unused `isFullscreen` state variable (line 31)
- Replace unreliable `handleSearch` with a no-op or tooltip telling users to use Ctrl+F
- Fix `handleNextPage` to accept a `totalPages` parameter and enforce an upper bound
- Reset `currentPage` to 1 when `fileUrl` changes (useEffect)
- Remove non-standard `zoom` parameter from `iframeSrc` URL fragment

### `src/lib/documents.ts`
- Update `download()` function to use the `API_URL` constant from `api.ts` instead of `process.env.NEXT_PUBLIC_API_URL`

### `src/lib/api.ts`
- No changes needed

---

## Functions

### `src/components/review/DocumentViewer.tsx`

**Modified: `handleSearch`**
- Current: Dispatches synthetic KeyboardEvent for Ctrl+F (unreliable across browsers)
- New: Show a tooltip/alert telling users to use Ctrl+F/Cmd+F, or remove the button entirely

**Modified: `handleNextPage`**
- Current: `setCurrentPage(currentPage + 1)` with no upper bound
- New: Accept `totalPages` prop and clamp: `if (currentPage < totalPages) setCurrentPage(currentPage + 1)`

**New: `useEffect` to reset page**
- Watch `fileUrl` prop and reset `currentPage` to 1 when it changes

**Modified: `iframeSrc` computation**
- Current: `${fileUrl}#page=${currentPage}&zoom=${zoom}`
- New: `${fileUrl}#page=${currentPage}` (remove non-standard zoom parameter)

### `src/lib/documents.ts`

**Modified: `download` function**
- Current: Uses `process.env.NEXT_PUBLIC_API_URL` directly
- New: Import `API_URL` from `./api` and use it for consistency

---

## Classes

No class modifications needed.

---

## Dependencies

No new dependencies needed.

---

## Testing

- Manual testing in Chrome, Firefox, and Safari to verify:
  - Document viewer iframe loads PDFs correctly
  - Page navigation works (Chrome `#page=N` fragment)
  - Download button triggers file download
  - Search button shows helpful message
  - Fullscreen toggles correctly
  - Page resets when switching documents

---

## Implementation Order

1. Fix `DocumentViewer.tsx` - remove unused imports/state
2. Fix `DocumentViewer.tsx` - add `totalPages` prop and fix page navigation bounds
3. Fix `DocumentViewer.tsx` - add `useEffect` to reset page on `fileUrl` change
4. Fix `DocumentViewer.tsx` - replace `handleSearch` with reliable alternative
5. Fix `DocumentViewer.tsx` - remove `zoom` from iframe URL fragment
6. Fix `documents.ts` - use `API_URL` constant in `download()` function
