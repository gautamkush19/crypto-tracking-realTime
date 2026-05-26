export function sanitizeCoinId(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 80);
}

export function sanitizeSearchTerm(value: string) {
  return value.replace(/[^\w\s.-]/g, '').trim().slice(0, 80);
}

export function stripHtml(value: string | undefined) {
  if (!value) return '';

  return value
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

export function safeExternalUrl(url: string | undefined) {
  if (!url) return null;

  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' ? parsed.toString() : null;
  } catch {
    return null;
  }
}
