const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:7239';

/**
 * Resolve image URL — prepend backend origin when path is relative.
 * Falls back to placeholder when url is empty/null.
 */
export const getImageUrl = (url) => {
  if (!url) return '/placeholder-coffee.jpg';
  if (url.startsWith('http')) return url;
  return `${BACKEND_URL}${url}`;
};
