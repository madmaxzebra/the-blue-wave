"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Message = {
  id: number;
  project: string;
  sender: string;
  device: string;
  kind: string;
  body: string;
  created_at: string;
};
type Claim = { id: number; project: string; path: string; agent: string; device: string; note: string; created_at: string };

const KEY_STORAGE = "agent-hub-key";
const NAME_STORAGE = "agent-hub-name";
const PROJECTS_STORAGE = "agent-hub-projects";
const DEFAULT_PROJECTS = ["general", "the-blue-wave", "blue-holiday-wave", "tropikal-rentals"];
const POLL_MS = 3000;

function deviceGuess(): string {
  if (typeof navigator === "undefined") return "unknown";
  return /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) ? "phone" : "desktop";
}

function timeLabel(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function Home() {
  const [key, setKey] = useState("");
  const [keyInput, setKeyInput] = useState("");
  const [name, setName] = useState("Max");
  const [projects, setProjects] = useState<string[]>(DEFAULT_PROJECTS);
  const [project, setProject] = useState("general");
  const [messages, setMessages] = useState<Message[]>([]);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState("");
  const [online, setOnline] = useState(false);
  const lastId = useRef(0);
  const feedEnd = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setKey(localStorage.getItem(KEY_STORAGE) ?? "");
    setName(localStorage.getItem(NAME_STORAGE) ?? "Max");
    try {
      const saved = JSON.parse(localStorage.getItem(PROJECTS_STORAGE) ?? "null");
      if (Array.isArray(saved) && saved.length) setProjects(saved.filter((p) => typeof p === "string"));
    } catch {}
  }, []);

  const api = useCallback(
    async (path: string, init?: RequestInit) => {
      const res = await fetch(path, {
        ...init,
        headers: { "content-type": "application/json", authorization: `Bearer ${key}`, ...(init?.headers ?? {}) },
        cache: "no-store",
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 401) {
        localStorage.removeItem(KEY_STORAGE);
        setKey("");
      }
      if (!res.ok) throw new Error(data.error ?? `Error ${res.status}`);
      return data;
    },
    [key],
  );

  useEffect(() => {
    lastId.current = 0;
    setMessages([]);
    setClaims([]);
  }, [project]);

  useEffect(() => {
    if (!key) return;
    let stopped = false;
    const tick = async () => {
      try {
        const q = encodeURIComponent(project);
        const [m, c] = await Promise.all([
          api(`/api/messages?project=${q}&since=${lastId.current}`),
          api(`/api/claims?project=${q}`),
        ]);
        if (stopped) return;
        const fresh: Message[] = m.messages ?? [];
        if (fresh.length) {
          lastId.current = fresh[fresh.length - 1].id;
          setMessages((prev) => [...prev, ...fresh].slice(-500));
        }
        setClaims(c.claims ?? []);
        setOnline(true);
        setError("");
      } catch (e) {
        if (!stopped) {
          setOnline(false);
          setError(e instanceof Error ? e.message : "Connection problem");
        }
      }
    };
    tick();
    const timer = setInterval(tick, POLL_MS);
    return () => {
      stopped = true;
      clearInterval(timer);
    };
  }, [key, project, api]);

  useEffect(() => {
    feedEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const send = async () => {
    const body = draft.trim();
    if (!body) return;
    setDraft("");
    try {
      await api("/api/messages", {
        method: "POST",
        body: JSON.stringify({ project, sender: name || "Max", device: deviceGuess(), kind: "human", body }),
      });
    } catch (e) {
      setDraft(body);
      setError(e instanceof Error ? e.message : "Could not send");
    }
  };

  const release = async (id: number) => {
    try {
      await api(`/api/claims/${id}/release`, { method: "POST", body: JSON.stringify({ summary: `released by ${name}` }) });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not release");
    }
  };

  const addProject = () => {
    const p = prompt("New project name (for example: tropikal-rentals)")?.trim().toLowerCase().replace(/\s+/g, "-");
    if (!p || projects.includes(p)) return;
    const next = [...projects, p];
    setProjects(next);
    localStorage.setItem(PROJECTS_STORAGE, JSON.stringify(next));
    setProject(p);
  };

  if (!key) {
    return (
      <main className="login">
        <div className="card">
          <h1>Agent Hub</h1>
          <p>One live room for you and all your phone and desktop agents.</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const k = keyInput.trim();
              if (!k) return;
              localStorage.setItem(KEY_STORAGE, k);
              setKey(k);
            }}
          >
            <input
              type="password"
              placeholder="Hub key"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              autoFocus
            />
            <button type="submit">Enter</button>
          </form>
          {error && <p className="error">{error}</p>}
        </div>
      </main>
    );
  }

  return (
    <main className="room">
      <header>
        <h1>Agent Hub</h1>
        <span className={online ? "dot on" : "dot"}>{online ? "live" : "offline"}</span>
        <input
          className="name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            localStorage.setItem(NAME_STORAGE, e.target.value);
          }}
          aria-label="Your name"
        />
      </header>

      <nav className="projects">
        {projects.map((p) => (
          <button key={p} className={p === project ? "active" : ""} onClick={() => setProject(p)}>
            {p}
          </button>
        ))}
        <button onClick={addProject}>+ project</button>
      </nav>

      <section className="claims">
        <h2>Working on now</h2>
        {claims.length === 0 ? (
          <p className="muted">Nobody has claimed anything in this project.</p>
        ) : (
          <ul>
            {claims.map((c) => (
              <li key={c.id}>
                <div>
                  <strong>{c.path}</strong> — {c.agent} <span className="tag">{c.device}</span>
                  {c.note && <div className="muted">{c.note}</div>}
                </div>
                <button onClick={() => release(c.id)}>Release</button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="feed">
        {messages.length === 0 && <p className="muted">No messages yet in {project}.</p>}
        {messages.map((m) => (
          <article key={m.id} className={m.sender === name ? "mine" : ""}>
            <div className="meta">
              <strong>{m.sender}</strong> <span className="tag">{m.kind === "human" ? "you" : m.device}</span>{" "}
              <span>{timeLabel(m.created_at)}</span>
            </div>
            <div className="body">{m.body}</div>
          </article>
        ))}
        <div ref={feedEnd} />
      </section>

      {error && <p className="error">{error}</p>}

      <form
        className="composer"
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
      >
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={`Message everyone in ${project}…`}
          rows={2}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
        />
        <button type="submit">Send</button>
      </form>
    </main>
  );
}
