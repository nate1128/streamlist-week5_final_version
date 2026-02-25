// src/pages/Movies.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { useLocalStorage } from '../cart/useLocalStorage';
import { searchMovies, getPosterUrl } from '../api/tmdb';
import { useSearchParams, useNavigate } from 'react-router-dom';

// Transparent PNG/SVG frame with a clear inner window
import marqueeFrame from '../assets/marquee.png';

/** Must match StreamList storage shape & key */
const RECENT_KEY = 'streamlist_recent_inputs_v1';
const MAX_RECENT = 8;

/* =========================================================
   SIZING / LAYOUT KNOBS
   ========================================================= */

/** Narrower card width (panel is narrower). */
const CARD_WIDTH_PX = 240; // ← adjust (e.g., 210, 200, 240)

/** Keep marquee slot height as-is (so poster/marquee visuals stay the same). */
const SLOT_ASPECT = '2 / 2.70';

/** Keep frame/poster visuals as-is. */
const FRAME_SCALE = 1.18;
const WINDOW_INSETS = { top: '12%', right: '6%', bottom: '24%', left: '6%' };
const POSTER_MARGIN_PCT = '2%';
const POSTER_SCALE = 1.2;
const POSTER_BORDER_RADIUS = 10;

/** Make the title/year/rating panel taller without changing fonts too much. */
const META_MIN_HEIGHT_PX = 64;    // ← panel vertical height target
const META_PADDING = 10;          // a bit more breathing room
const TITLE_FONT_SIZE = 14;       // unchanged font, taller comes from min-height
const SUB_FONT_SIZE = 12;
const META_LINE_HEIGHT = 1.35;    // taller line spacing

/** Make the actions panel taller (without huge buttons). */
const ACTIONS_MIN_HEIGHT_PX = 60;     // ← panel vertical height target
const ACTIONS_PAD = '8px 10px';       // compact but gives height with min-height below
const BTN_PAD = '5px 10px';           // slight bump
const BTN_GAP = 6;
const BTN_ICON_SIZE = 20;             // keep icon size consistent

/* Poster + marquee overlay:
   - Slot fills the space above the meta/actions.
   - Frame overlays the slot.
   - Poster is inside the window with object-fit: contain (keeps aspect),
     centered, and scaled to 120% (unchanged). */
function PosterWithMarquee({ posterPath, title }) {
  const hasPoster = !!posterPath;

  return (
    <div
      className="marquee-slot"
      style={{
        position: 'relative',
        width: `${CARD_WIDTH_PX}px`, // ← fixed to the card width (narrower card)
        aspectRatio: SLOT_ASPECT,
        background: '#0b1734',
        overflow: 'hidden',
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        margin: '0 auto',
      }}
    >
      {/* Inner window bounds */}
      <div
        className="marquee-window"
        style={{
          position: 'absolute',
          top: WINDOW_INSETS.top,
          right: WINDOW_INSETS.right,
          bottom: WINDOW_INSETS.bottom,
          left: WINDOW_INSETS.left,
          borderRadius: POSTER_BORDER_RADIUS,
          overflow: 'hidden', // ensures scaled poster stays within the window
          display: 'grid',
          placeItems: 'center',
          background: '#0f1f3f',
        }}
      >
        {hasPoster ? (
          <img
            src={getPosterUrl(posterPath, 'w780')}
            srcSet={[
              `${getPosterUrl(posterPath, 'w342')} 342w`,
              `${getPosterUrl(posterPath, 'w500')} 500w`,
              `${getPosterUrl(posterPath, 'w780')} 780w`,
            ].join(', ')}
            sizes="(min-width: 1400px) 280px, (min-width: 1000px) 240px, 200px"
            alt={title || 'Movie poster'}
            loading="lazy"
            style={{
              // Fit a 2:3 poster box in the window, then scale uniformly from the center
              width: `calc(100% - ${POSTER_MARGIN_PCT} - ${POSTER_MARGIN_PCT})`,
              height: `calc(100% - ${POSTER_MARGIN_PCT} - ${POSTER_MARGIN_PCT})`,
              objectFit: 'contain',  // preserves poster aspect; no cropping
              display: 'block',
              borderRadius: POSTER_BORDER_RADIUS,

              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: `translate(-50%, -50%) scale(${POSTER_SCALE})`,
              transformOrigin: 'center center',
            }}
          />
        ) : (
          <div
            style={{
              width: `calc(100% - ${POSTER_MARGIN_PCT} - ${POSTER_MARGIN_PCT})`,
              height: `calc(100% - ${POSTER_MARGIN_PCT} - ${POSTER_MARGIN_PCT})`,
              display: 'grid',
              placeItems: 'center',
              color: '#a7b3d0',
              fontSize: 14,
              background: 'linear-gradient(180deg, #0f1f3f, #0a1430)',
              borderRadius: POSTER_BORDER_RADIUS,
            }}
          >
            No poster
          </div>
        )}
      </div>

      {/* Decorative frame covering the slot */}
      <img
        src={marqueeFrame}
        alt=""
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          transform: `scale(${FRAME_SCALE})`,
          transformOrigin: 'center center',
          pointerEvents: 'none',
          display: 'block',
        }}
      />
    </div>
  );
}

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
        // Build columns exactly at the fixed card width (narrower panel)
        gridTemplateColumns: `repeat(auto-fill, minmax(${CARD_WIDTH_PX}px, ${CARD_WIDTH_PX}px))`,
        gap: 14,
        justifyContent: 'center',
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
              borderRadius: 12,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              minHeight: 0,

              // Narrower card width; marquee matches via PosterWithMarquee width
              width: `${CARD_WIDTH_PX}px`,
              maxWidth: `${CARD_WIDTH_PX}px`,
              margin: '0 auto',
            }}
          >
            {/* Marquee fills all space above the (taller) metadata */}
            <PosterWithMarquee posterPath={m.poster_path} title={title} />

            {/* TALLER metadata panel */}
            <div
              style={{
                padding: META_PADDING,
                minHeight: META_MIN_HEIGHT_PX,   // ← taller panel
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                lineHeight: META_LINE_HEIGHT,
              }}
            >
              <div style={{ fontWeight: 800, fontSize: TITLE_FONT_SIZE }}>{title}</div>
              <div style={{ color: '#a7b3d0', fontSize: SUB_FONT_SIZE, marginTop: 2 }}>
                {(m.release_date || '').slice(0, 4) || '—'} · ⭐ {m.vote_average?.toFixed?.(1) ?? '—'}
              </div>
            </div>

            <div style={{ flex: 1 }} />

            {/* TALLER actions panel */}
            <div
              style={{
                display: 'flex',
                gap: BTN_GAP,
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: ACTIONS_PAD,
                borderTop: '1px solid rgba(255,255,255,0.06)',
                minHeight: ACTIONS_MIN_HEIGHT_PX, // ← taller panel
              }}
            >
              <button
                type="button"
                onClick={() => onPlay(title)}
                title="Play Movie"
                aria-label="Play Movie"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: BTN_GAP,
                  padding: BTN_PAD,
                  borderRadius: 8,
                  border: '1px solid rgba(255,255,255,0.12)',
                  background: 'transparent',
                  color: '#00e676',
                  cursor: 'pointer',
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                <span className="material-icons" aria-hidden="true" style={{ fontSize: BTN_ICON_SIZE }}>
                  play_arrow
                </span>
                <span>Play</span>
              </button>

              <button
                type="button"
                onClick={() => onAdd(title)}
                title="Add to StreamList"
                aria-label="Add to StreamList"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: BTN_GAP,
                  padding: BTN_PAD,
                  borderRadius: 8,
                  border: '1px solid rgba(255,255,255,0.12)',
                  background: 'transparent',
                  color: '#ffd166',
                  cursor: 'pointer',
                  fontSize: 13,
                  fontWeight: 800,
                }}
              >
                <span className="ticket-gold" aria-hidden="true" />
                <span>Add</span>
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}