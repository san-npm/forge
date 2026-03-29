/**
 * Safely serialize data for embedding in a <script type="application/ld+json"> tag.
 * Escapes </script> sequences to prevent XSS via tag breakout.
 */
export function safeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/<\/script>/gi, '<\\/script>')
}
