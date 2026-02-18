// src/api/tmdb.js
const TMDB_BASE = 'https://api.themoviedb.org/3';
const API_KEY = process.env.REACT_APP_TMDB_API_KEY;

/**
 * Search movies by query text.
 * Uses TMDB v3 /search/movie and an API key in the query string.
 * Docs: https://developer.themoviedb.org/docs/search-and-query-for-details
 * Auth (v3 key or v4 bearer): https://documenter.getpostman.com/view/28279354/2s9YsNeWJj
 */
export async function searchMovies(query, page = 1) {
  if (!API_KEY) {
    throw new Error('Missing REACT_APP_TMDB_API_KEY. Add it to your .env file in the project root.');
  }
  const url = new URL(`${TMDB_BASE}/search/movie`);
  url.searchParams.set('api_key', API_KEY); // v3 key in query param
  url.searchParams.set('query', query);
  url.searchParams.set('page', String(page));
  url.searchParams.set('include_adult', 'false');

  const res = await fetch(url.toString(), { headers: { accept: 'application/json' } });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`TMDB ${res.status}: ${text}`);
  }
  return res.json();
}

/** Build a full image URL for TMDB posters. */
export function getPosterUrl(path, size = 'w342') {
  if (!path) return '';
  return `https://image.tmdb.org/t/p/${size}${path}`;
}