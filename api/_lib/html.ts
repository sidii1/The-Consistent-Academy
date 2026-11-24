/** Escape user-supplied text before interpolating it into an HTML email body. */
export const escapeHtml = (s: string): string =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));

/** Safe for any value (undefined/null/number): stringify then escape. */
export const esc = (v: unknown): string => escapeHtml(String(v ?? ""));
