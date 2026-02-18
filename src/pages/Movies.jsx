// src/pages/Movies.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { useLocalStorage } from '../cart/useLocalStorage';
import { searchMovies, getPosterUrl } from '../api/tmdb';
import { useSearchParams, useNavigate } from 'react-router-dom';

/** Must match StreamList storage shape & key */
const RECENT_KEY = 'streamlist_recent_inputs_v1';
const MAX_RECENT = 8;

export default function Movies() {
  const [query, setQuery] = useLocalStorage('tmdb:lastQuery', '');
  const [results, setResults] = useLocalStorage('tmdb:lastResults', []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const headerLabel = useMemo(() => {
    if (query && results?.length) return `Results for “${query}”`;
    if (query && !results?.length) return `No results for “${query}”`;
    return 'Search Movies';
  }, [query, results]);

  async function runSearch(term) {
    const trimmed = String(term || '').trim();
    if (!trimmed) {
      setResults([]);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data = await searchMovies(trimmed, 1);
      const next = Array.isArray(data?.results) ? data.results : [];
      setQuery(trimmed);
      setResults(next);

      const params = new URLSearchParams({ q: trimmed });
      navigate(`/movies?${params.toString()}`, { replace: true });
    } catch (err) {
      setError(err.message || 'Search failed.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleSearch(e) {
    e.preventDefault();
    await runSearch(query);
  }

  function addToStreamList(title) {
    const trimmed = String(title || '').trim();
    if (!trimmed) return;
    try {
      const raw = localStorage.getItem(RECENT_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      const list = Array.isArray(parsed) ? parsed : [];

      const ts = new Date().toISOString();
      const withoutDup = list.filter(
        (r) => (r?.text || '').toLowerCase() !== trimmed.toLowerCase()
      );
      const next = [{ text: trimmed, tsISO: ts, completed: false }, ...withoutDup].slice(0, MAX_RECENT);
      localStorage.setItem(RECENT_KEY, JSON.stringify(next));
    } catch {
      // ignore quota errors for demo
    }
  }

  function handlePlay(title) {
    // Later: navigate(`/watch?title=${encodeURIComponent(title)}`)
    navigate('/#new');
  }

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) runSearch(q);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="movies-page" style={{ padding: 16 }}>
      <h1 style={{ marginBottom: 12 }}>{headerLabel}</h1>

      <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input
          type="text"
          value={query}
          placeholder="Search for a movie (e.g., Batman)"
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Movie search"
          style={{
            flex: 1,
            padding: '10px 12px',
            borderRadius: 8,
            border: '1px solid rgba(255,255,255,0.15)',
            background: '#0f1f3f',
            color: '#e8ecff',
          }}
        />

        {/* Dark search button + teal outlined icon */}
        <button
          className="navlike-btn"
          type="submit"
          disabled={loading}
          style={{
            background: '#0f1f3f',
            border: '1px solid rgba(255,255,255,0.15)',
            color: '#e8ecff',
          }}
        >
          <span
            className="material-icons-outlined"
            aria-hidden="true"
            style={{ color: '#4DEEEA', marginRight: 6, fontSize: '22px', verticalAlign: 'middle' }}
          >
            search
          </span>
          {loading ? 'Searching…' : 'Search'}
        </button>
      </form>

      {error && (
        <div className="cart-warning" role="alert" aria-live="polite" style={{ marginBottom: 12 }}>
          <span className="material-icons" aria-hidden="true">warning</span>
          <span style={{ marginLeft: 8 }}>{error}</span>
        </div>
      )}

      <MoviesGrid
        items={results}
        onPlay={(title) => handlePlay(title)}
        onAdd={(title) => addToStreamList(title)}
      />
    </section>
  );
}

function MoviesGrid({ items, onPlay, onAdd }) {
  if (!items?.length) {
    return <p style={{ color: '#a7b3d0' }}>Try a search to see results from TMDB.</p>;
  }

  return (
    <div
      className="movies-grid"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
        gap: 12,
      }}
    >
      {items.map((m) => {
        const title = m.title || m.original_title || '';
        return (
          <article
            key={m.id}
            className="movie-card"
            style={{
              background: 'var(--surface-2, #182045)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 10,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              minHeight: 0,
            }}
          >
            <div style={{ aspectRatio: '2 / 3', background: '#111a3a' }}>
              {m.poster_path ? (
                <img
                  src={getPosterUrl(m.poster_path, 'w342')}
                  alt={title || 'Movie poster'}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  loading="lazy"
                />
              ) : (
                <div
                  style={{
                    width: '100%', height: '100%', display: 'grid',
                    placeItems: 'center', color: '#a7b3d0', fontSize: 14
                  }}
                >
                  No poster
                </div>
              )}
            </div>

            <div style={{ padding: 10 }}>
              <div style={{ fontWeight: 800 }}>{title}</div>
              <div style={{ color: '#a7b3d0', fontSize: 13, marginTop: 2 }}>
                {(m.release_date || '').slice(0, 4) || '—'} · ⭐ {m.vote_average?.toFixed?.(1) ?? '—'}
              </div>
            </div>

            <div style={{ flex: 1 }} />

            {/* Bottom-pinned actions */}
            <div
              style={{
                display: 'flex',
                gap: 8,
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '8px 10px 12px 10px',
                borderTop: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              {/* Play (green arrow) */}
              <button
                type="button"
                onClick={() => onPlay(title)}
                title="Play Movie"
                aria-label="Play Movie"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 10px',
                  borderRadius: 8,
                  border: '1px solid rgba(255,255,255,0.12)',
                  background: 'transparent',
                  color: '#00e676',
                  cursor: 'pointer',
                }}
              >
                <span className="material-icons" aria-hidden="true">play_arrow</span>
                <span style={{ fontWeight: 700 }}>Play</span>
              </button>

              {/* Add to StreamList — BRIGHT GOLD TICKET (masked, not dark) */}
              <button
                type="button"
                onClick={() => onAdd(title)}
                title="Add to StreamList"
                aria-label="Add to StreamList"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '6px 10px',
                  borderRadius: 8,
                  border: '1px solid rgba(255,255,255,0.12)',
                  background: 'transparent',
                  color: '#ffd166', /* label color */
                  cursor: 'pointer',
                }}
              >
                {/* Masked bright ticket */}
                <span className="ticket-gold" aria-hidden="true" />
                <span style={{ fontWeight: 800 }}>Add</span>
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}