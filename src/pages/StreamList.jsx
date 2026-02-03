import { useEffect, useRef, useState } from "react";
import Ticket from "../icons/ticket.svg";

const RECENT_KEY = "streamlist_recent_inputs_v1";
const MAX_RECENT = 8;

export default function StreamList() {
  // Load recent once (lazy initializer) to remove a separate "load" effect
  const [recent, setRecent] = useState(() => {
    try {
      const raw = localStorage.getItem(RECENT_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const [title, setTitle] = useState("");
  const [openMenu, setOpenMenu] = useState(false);

  const menuRef = useRef(null);
  const toggleRef = useRef(null);

  // Persist recent to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(RECENT_KEY, JSON.stringify(recent));
    } catch {
      /* noop */
    }
  }, [recent]);

  // Close dropdown on outside click or Escape (active only while open)
  useEffect(() => {
    if (!openMenu) return;

    const onDocClick = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        toggleRef.current &&
        !toggleRef.current.contains(e.target)
      ) {
        setOpenMenu(false);
      }
    };

    const onEsc = (e) => {
      if (e.key === "Escape") setOpenMenu(false);
    };

    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [openMenu]);

  const handleAdd = (e) => {
    e.preventDefault();

    const trimmed = title.trim();
    if (!trimmed) {
      console.warn("[StreamList] empty input; ignoring submit");
      return;
    }

    const ts = new Date().toISOString();

    // Required demo logs (human + structured)
    console.log(`[StreamList] submit @ ${ts} → "${trimmed}"`);
    console.log({
      component: "StreamList",
      event: "submit",
      title: trimmed,
      timestamp: ts,
    });

    // Update recent (dedupe, most-recent-first, capped)
    setRecent((prev) => {
      const withoutDup = prev.filter(
        (r) => r.text.toLowerCase() !== trimmed.toLowerCase()
      );
      return [{ text: trimmed, tsISO: ts }, ...withoutDup].slice(0, MAX_RECENT);
    });

    setTitle(""); // Clear input after submit (unchanged)
  };

  // GOLD TICKET: confirm input selection + log it
  const selectRecent = (text) => {
    const ts = new Date().toISOString();

    setTitle(text);
    setOpenMenu(false);

    // Explicit logging so your demo can state the gold ticket confirms input
    console.log(`[StreamList] Recent picked @ ${ts} → "${text}"`);
    console.log({
      component: "StreamList",
      event: "recent_pick",
      title: text,
      timestamp: ts,
    });
  };

  const clearRecent = () => {
    setRecent([]);
    try {
      localStorage.removeItem(RECENT_KEY);
    } catch {
      /* noop */
    }
  };

  return (
    <section className="page">
      <h1>
        <span className="material-icons" aria-hidden="true"></span>
        Your Stream List
      </h1>

      <form className="input-row" onSubmit={handleAdd}>
        <label htmlFor="add-title" className="visually-hidden">
          Add a movie or show
        </label>

        {/* Input + Recent (gold ticket; dropdown is absolutely positioned) */}
        <div className={`input-with-recent ${openMenu ? "is-open" : ""}`}>
          <input
            id="add-title"
            type="text"
            placeholder="Add a movie or show..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            aria-label="Add a movie or show"
          />

          {recent.length > 0 && (
            <button
              type="button"
              ref={toggleRef}
              className="recent-toggle icon-only"
              aria-haspopup="listbox"
              aria-expanded={openMenu}
              onClick={() => setOpenMenu((v) => !v)}
              title="Show recent entries"
              aria-label="Show recent entries"
            >
              <img
                src={Ticket}
                alt=""
                className="recent-ticket-icon"
                aria-hidden="true"
                draggable="false"
              />
            </button>
          )}

          {openMenu && recent.length > 0 && (
            <div className="recent-menu inside" ref={menuRef}>
              <ul role="listbox" aria-label="Recent inputs">
                {recent.map((r) => (
                  <li key={r.text + r.tsISO}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={false}
                      className="recent-item"
                      onClick={() => selectRecent(r.text)}
                    >
                      <span className="recent-text">{r.text}</span>
                      <time className="recent-time" dateTime={r.tsISO}>
                        {new Date(r.tsISO).toLocaleString()}
                      </time>
                    </button>
                  </li>
                ))}
              </ul>
              <div className="recent-actions">
                <button type="button" className="recent-clear" onClick={clearRecent}>
                  Clear recent
                </button>
              </div>
            </div>
          )}
        </div>

        {/* CTA: red ticket icon + text (no big red rectangle) */}
        <button
          type="submit"
          className="btn ticket-icon-cta"
          aria-label="Get your ticket"
          title="Get your ticket"
        >
          <img
            src={Ticket}
            alt=""
            className="ticket-icon-red"
            aria-hidden="true"
            draggable="false"
          />
          <span className="ticket-label">Get Your Ticket</span>
        </button>
      </form>

      <p className="empty-hint">🎬 Start your watchlist — add a title above.</p>

      {/* Prototype watermark (kept) */}
      <div className="prototype-watermark" aria-hidden="true">
        StreamList Prototype
      </div>
    </section>
  );
}
