// src/pages/StreamList.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Ticket from "../icons/ticket.svg";

// Keys for localStorage
const RECENT_KEY = "streamlist_recent_inputs_v1";
const MAX_RECENT = 8;

export default function StreamList() {
  const navigate = useNavigate(); // used for handoff to /movies

  // --- Recent (gold ticket menu data) ---
  const [recent, setRecent] = useState(() => {
    try {
      const raw = localStorage.getItem(RECENT_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      const list = Array.isArray(parsed) ? parsed : [];
      // Backfill completed flag (default false)
      return list.map((r) => ({ ...r, completed: !!r.completed }));
    } catch {
      return [];
    }
  });

  // Input + dropdown state
  const [title, setTitle] = useState("");
  const [openMenu, setOpenMenu] = useState(false);

  // Selection / edit state inside the menu
  const [selectedKey, setSelectedKey] = useState(null); // r.tsISO
  const [editingKey, setEditingKey] = useState(null);  // r.tsISO
  const [draft, setDraft] = useState("");

  // Refs: menuRef points to the menu box itself; toggleRef to the gold ticket button
  const menuRef = useRef(null);
  const toggleRef = useRef(null);
  const inputRef = useRef(null);

  // Persist recent whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(RECENT_KEY, JSON.stringify(recent));
    } catch {}
  }, [recent]);

  const closeMenu = () => {
    setOpenMenu(false);
    setSelectedKey(null);
    setEditingKey(null);
    setDraft("");
  };

  // Close dropdown on outside click or Escape (active only while open)
  useEffect(() => {
    if (!openMenu) return;
    const onDocMouseDown = (e) => {
      const inMenu = menuRef.current?.contains(e.target);
      const onToggle = toggleRef.current?.contains(e.target);
      if (!inMenu && !onToggle) closeMenu();
    };
    const onEsc = (e) => {
      if (e.key === "Escape") closeMenu();
    };
    document.addEventListener("mousedown", onDocMouseDown);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocMouseDown);
      document.removeEventListener("keydown", onEsc);
    };
  }, [openMenu]);

  // Focus input when coming from a CTA (#new link in your header)
  useEffect(() => {
    if (window.location.hash === "#new") {
      inputRef.current?.focus();
      window.history.replaceState(null, "", " ");
    }
  }, []);

  // --- Handlers ---
  const handleAdd = (e) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) {
      console.warn("[StreamList] empty input; ignoring submit");
      return;
    }
    const ts = new Date().toISOString();

    // Demo logs
    console.log(`[StreamList] submit @ ${ts} → "${trimmed}"`);
    console.log({
      component: "StreamList",
      event: "submit",
      title: trimmed,
      timestamp: ts,
    });

    // Update recent (dedupe case-insensitive, most-recent-first, capped)
    setRecent((prev) => {
      const withoutDup = prev.filter(
        (r) => r.text.toLowerCase() !== trimmed.toLowerCase()
      );
      return [
        { text: trimmed, tsISO: ts, completed: false },
        ...withoutDup,
      ].slice(0, MAX_RECENT);
    });

    setTitle("");         // clear input
    setOpenMenu(false);   // keep menu closed after submit
    inputRef.current?.focus();

    // NOTE: We are NOT auto-navigating here to avoid changing your submit behavior.
    // The handoff happens via the Play action in the Recents list (see onPlay below).
  };

  // Menu behaviors
  const toggleMenu = () => setOpenMenu((v) => !v);

  const clearRecent = () => {
    setRecent([]);
    try {
      localStorage.removeItem(RECENT_KEY);
    } catch {}
  };

  // Row selection (click a title -> show action icons)
  const onSelectRecent = (key) => {
    const selectingSame = selectedKey === key;
    if (selectingSame) {
      // if already selected, collapse the actions
      setSelectedKey(null);
      setEditingKey(null);
      setDraft("");
    } else {
      setSelectedKey(key);
      setEditingKey(null);
      setDraft("");
    }
  };

  // Actions within a selected row
  const onPlay = (r) => {
    console.log("[Recent] play", { title: r.text, tsISO: r.tsISO });
    // ✅ Navigate to Movies and pass the title as a query parameter
    const params = new URLSearchParams({ q: r.text });
    navigate(`/movies?${params.toString()}`);
  };

  const onDelete = (key) => {
    console.log("[Recent] delete", { tsISO: key });
    setRecent((prev) => prev.filter((r) => r.tsISO !== key));
    setSelectedKey(null);
    setEditingKey(null);
  };

  const onToggleComplete = (key) => {
    console.log("[Recent] complete toggle", { tsISO: key });
    setRecent((prev) =>
      prev.map((r) =>
        r.tsISO === key ? { ...r, completed: !r.completed } : r
      )
    );
  };

  const startEdit = (r) => {
    console.log("[Recent] edit start", { tsISO: r.tsISO, text: r.text });
    setEditingKey(r.tsISO);
    setDraft(r.text);
  };

  const cancelEdit = () => {
    console.log("[Recent] edit cancel", { tsISO: editingKey });
    setEditingKey(null);
    setDraft("");
  };

  const saveEdit = (key) => {
    const t = (draft || "").trim();
    console.log("[Recent] edit save", { tsISO: key, to: t });
    if (!t) {
      cancelEdit();
      return;
    }
    setRecent((prev) =>
      prev.map((r) => (r.tsISO === key ? { ...r, text: t } : r))
    );
    setEditingKey(null);
    setDraft("");
  };

  const recentList = useMemo(() => recent, [recent]);

  return (
    <section className="page">
      <h1>Your Stream List</h1>

      {/* ==== Input + Recent (gold ticket) ==== */}
      <form className="input-row" onSubmit={handleAdd}>
        <label htmlFor="add-title" className="visually-hidden">
          Add a movie or show
        </label>
        <div className={`input-with-recent ${openMenu ? "is-open" : ""}`}>
          <input
            id="add-title"
            type="text"
            placeholder="Add a movie or show..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            aria-label="Add a movie or show"
            ref={inputRef}
            // Keep menu open if focus moves into the menu or the toggle
            onBlur={(e) => {
              const next = e.relatedTarget;
              const inMenu = next && menuRef.current?.contains(next);
              const onToggle = next && toggleRef.current?.contains(next);
              if (!inMenu && !onToggle) closeMenu();
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown" && openMenu) {
                const firstBtn =
                  menuRef.current?.querySelector(".recent-item");
                if (firstBtn) {
                  e.preventDefault();
                  firstBtn.focus();
                }
              }
            }}
          />

          {recent.length > 0 && (
            <button
              type="button"
              ref={toggleRef}
              className="recent-toggle icon-only"
              aria-haspopup="listbox"
              aria-expanded={openMenu}
              aria-controls="recent-menu"
              onClick={toggleMenu}
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
            <div
              id="recent-menu"
              className="recent-menu inside"
              ref={menuRef}
              role="region"
              aria-label="Recent entries"
            >
              <div className="recent-menu-header" aria-hidden="true">
                Recents
              </div>

              <ul role="listbox" aria-label="Recent inputs">
                {recentList.map((r) => {
                  const key = r.tsISO;
                  const selected = selectedKey === key;
                  const editing = editingKey === key;

                  return (
                    <li key={key}>
                      {!editing ? (
                        <div
                          className={`recent-row ${
                            selected ? "is-selected" : ""
                          } ${r.completed ? "is-completed" : ""}`}
                        >
                          <button
                            type="button"
                            role="option"
                            aria-selected={selected}
                            className="recent-item"
                            onClick={() => onSelectRecent(key)}
                          >
                            <span className="recent-text">{r.text}</span>
                            <time
                              className="recent-time"
                              dateTime={r.tsISO}
                            >
                              {new Date(r.tsISO).toLocaleString()}
                            </time>
                          </button>

                          {selected && (
                            <div className="recent-actions-inline">
                              {/* Play (emerald) */}
                              <button
                                type="button"
                                className="icon-btn icon-play"
                                aria-label="Play"
                                title="Play"
                                onClick={() => onPlay(r)}
                              >
                                <span className="material-icons">
                                  play_arrow
                                </span>
                              </button>

                              {/* Edit (yellow) */}
                              <button
                                type="button"
                                className="icon-btn icon-edit"
                                aria-label="Edit"
                                title="Edit"
                                onClick={() => startEdit(r)}
                              >
                                <span className="material-icons">edit</span>
                              </button>

                              {/* Complete (electric cyan) */}
                              <button
                                type="button"
                                className="icon-btn icon-complete"
                                aria-label={
                                  r.completed ? "Mark as active" : "Complete"
                                }
                                title={
                                  r.completed ? "Mark as active" : "Complete"
                                }
                                onClick={() => onToggleComplete(key)}
                              >
                                <span className="material-icons">
                                  check_circle
                                </span>
                              </button>

                              {/* Delete (coral red) */}
                              <button
                                type="button"
                                className="icon-btn icon-delete"
                                aria-label="Delete"
                                title="Delete"
                                onClick={() => onDelete(key)}
                              >
                                <span className="material-icons">delete</span>
                              </button>

                              {/* Cancel (azure) */}
                              <button
                                type="button"
                                className="icon-btn icon-cancel"
                                aria-label="Cancel"
                                title="Cancel"
                                onClick={() => setSelectedKey(null)}
                              >
                                <span className="material-icons">close</span>
                              </button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="recent-edit">
                          <input
                            value={draft}
                            onChange={(e) => setDraft(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") saveEdit(key);
                              if (e.key === "Escape") cancelEdit();
                            }}
                            aria-label="Edit recent title"
                            autoFocus
                          />
                          <button
                            type="button"
                            className="icon-btn icon-save"
                            aria-label="Save"
                            title="Save"
                            onClick={() => saveEdit(key)}
                            disabled={(draft || "").trim().length === 0}
                          >
                            <span className="material-icons">save</span>
                          </button>
                          <button
                            type="button"
                            className="icon-btn icon-cancel"
                            aria-label="Cancel edit"
                            title="Cancel"
                            onClick={cancelEdit}
                          >
                            <span className="material-icons">close</span>
                          </button>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>

              <div className="recent-actions">
                <button
                  type="button"
                  className="recent-clear"
                  onClick={clearRecent}
                >
                  Clear recent
                </button>
              </div>
            </div>
          )}
        </div>

        {/* CTA: red ticket icon + text (kept) */}
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

      {/* Page hint (since actions are now in the Recents menu) */}
      <p className="empty-hint">
        🎬 Start your watchlist — add a title above.
      </p>

      {/* Prototype watermark (kept) */}
      <div className="prototype-watermark" aria-hidden="true">
        StreamList Prototype
      </div>
    </section>
  );
}
