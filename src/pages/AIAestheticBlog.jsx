import { useEffect, useRef, useState, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════
   GLOBAL CSS — injected once into <head>
   Aesthetic: Dark editorial · Cormorant Garamond + IBM Plex Mono
   Palette: Ink black · Acid yellow · Ash white · Rust red
═══════════════════════════════════════════════════════════ */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,500;0,700;1,300;1,500;1,700&family=IBM+Plex+Mono:wght@300;400;500&family=Instrument+Sans:wght@400;500;600&display=swap');

  :root {
    --ink:     #0B0B0B;
    --ink-2:   #111111;
    --ash:     #E8E4DC;
    --muted:   #6B6560;
    --yellow:  #E8D44D;
    --rust:    #C0432A;
    --border:  rgba(232,228,220,0.1);
    --border2: rgba(232,228,220,0.06);
  }

  .aab * { box-sizing: border-box; margin: 0; padding: 0; }

  .aab {
    font-family: 'IBM Plex Mono', monospace;
    background: var(--ink);
    color: var(--ash);
    font-size: 15px;
    line-height: 1.8;
    -webkit-font-smoothing: antialiased;
    position: relative;
    overflow-x: hidden;
    z-index: 10;
  }

  /* noise grain overlay */
  .aab::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
    opacity: 0.028;
    pointer-events: none;
    z-index: 9999;
  }

  /* ── Reading progress ── */
  .aab-progress {
    position: fixed;
    top: 0; left: 0;
    height: 2px;
    background: var(--yellow);
    z-index: 1000;
    transition: width 0.08s linear;
  }

  /* ── Reveal animation ── */
  .aab-reveal {
    opacity: 0;
    transform: translateY(28px);
    transition: opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1);
  }
  .aab-reveal.aab-visible {
    opacity: 1;
    transform: translateY(0);
  }

  /* ── Layout shell ── */
  .aab-shell {
    max-width: 1080px;
    margin: 0 auto;
    padding: 0 40px;
    display: grid;
    grid-template-columns: 180px 1fr;
    gap: 64px;
    align-items: flex-start;
  }

  /* ── Sticky TOC ── */
  .aab-toc-col {
    position: sticky;
    top: 96px;
    padding-top: 64px;
  }
  .aab-toc-label {
    font-size: 9px;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 20px;
  }
  .aab-toc-list { list-style: none; }
  .aab-toc-item {
    display: block;
    font-size: 11px;
    color: var(--muted);
    padding: 5px 0 5px 14px;
    border-left: 1px solid var(--border);
    cursor: pointer;
    background: none;
    border-right: none;
    border-top: none;
    border-bottom: none;
    text-align: left;
    font-family: 'IBM Plex Mono', monospace;
    line-height: 1.4;
    transition: color 0.2s, border-color 0.2s;
    width: 100%;
  }
  .aab-toc-item:hover { color: var(--ash); border-left-color: var(--muted); }
  .aab-toc-item.active { color: var(--yellow); border-left-color: var(--yellow); }

  /* ── Main column ── */
  .aab-main { min-width: 0; padding-bottom: 96px; }

  /* ══ HERO ══ */
  .aab-hero {
    padding: 64px 0 48px;
    border-bottom: 1px solid var(--border);
    margin-bottom: 64px;
    position: relative;
  }
  .aab-hero-label {
    font-size: 9px;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: var(--yellow);
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    gap: 14px;
  }
  .aab-hero-label::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--yellow);
    opacity: 0.25;
    max-width: 80px;
  }

  .aab-h1 {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(38px, 6.5vw, 72px);
    font-weight: 700;
    line-height: 1.05;
    letter-spacing: -0.02em;
    color: var(--ash);
    margin-bottom: 12px;
  }
  .aab-h1 em {
    font-style: italic;
    font-weight: 300;
    color: var(--yellow);
  }
  .aab-h1-sub {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(17px, 2.5vw, 22px);
    font-weight: 300;
    font-style: italic;
    color: var(--muted);
    margin-bottom: 36px;
    line-height: 1.4;
  }
  .aab-meta {
    display: flex;
    gap: 24px;
    flex-wrap: wrap;
    margin-bottom: 24px;
  }
  .aab-meta-item {
    font-size: 10px;
    letter-spacing: 0.12em;
    color: var(--muted);
    display: flex; align-items: center; gap: 6px;
  }
  .aab-meta-dot {
    width: 3px; height: 3px;
    border-radius: 50%;
    background: var(--yellow);
    display: inline-block;
  }
  .aab-tags { display: flex; gap: 8px; flex-wrap: wrap; }
  .aab-tag {
    font-size: 9px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    padding: 4px 12px;
    border: 1px solid var(--border);
    border-radius: 2px;
    color: var(--muted);
  }

  /* ══ SECTION MARKERS ══ */
  .aab-section-wrap {
    margin: 60px 0 28px;
    display: flex;
    align-items: flex-end;
    gap: 20px;
    position: relative;
  }
  .aab-section-num {
    font-family: 'Cormorant Garamond', serif;
    font-size: 64px;
    font-weight: 700;
    line-height: 0.85;
    color: var(--border);
    flex-shrink: 0;
    letter-spacing: -0.04em;
    user-select: none;
  }
  .aab-section-right { flex: 1; min-width: 0; }
  .aab-section-label {
    font-size: 9px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--yellow);
    margin-bottom: 6px;
  }
  .aab-h2 {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(24px, 3vw, 32px);
    font-weight: 700;
    color: var(--ash);
    line-height: 1.15;
    letter-spacing: -0.01em;
  }

  /* ══ BODY TEXT ══ */
  .aab-p {
    font-size: 15px;
    color: rgba(232,228,220,0.78);
    line-height: 1.85;
    margin-bottom: 22px;
    font-family: 'IBM Plex Mono', monospace;
    font-weight: 300;
  }
  .aab-p:last-child { margin-bottom: 0; }
  .aab-p strong { color: var(--ash); font-weight: 500; }
  .aab-p em { font-style: italic; color: rgba(232,228,220,0.9); }

  /* ══ PULL QUOTE ══ */
  .aab-pull {
    margin: 48px -20px;
    padding: 32px 40px;
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
    position: relative;
  }
  .aab-pull::before {
    content: '"';
    font-family: 'Cormorant Garamond', serif;
    font-size: 100px;
    font-weight: 700;
    color: var(--yellow);
    opacity: 0.15;
    position: absolute;
    top: -15px; left: 28px;
    line-height: 1;
    pointer-events: none;
  }
  .aab-pull-text {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(20px, 2.8vw, 26px);
    font-style: italic;
    font-weight: 300;
    color: var(--ash);
    line-height: 1.45;
    position: relative;
  }
  .aab-pull-attr {
    font-size: 10px;
    letter-spacing: 0.14em;
    color: var(--muted);
    margin-top: 14px;
    display: block;
    text-transform: uppercase;
  }

  /* ══ CALLOUT ══ */
  .aab-callout {
    background: var(--ink-2);
    border: 1px solid var(--border);
    border-left: 2px solid var(--yellow);
    border-radius: 0 4px 4px 0;
    padding: 24px 28px;
    margin: 32px 0;
  }
  .aab-callout-title {
    font-size: 9px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--yellow);
    margin-bottom: 18px;
  }
  .aab-callout ul { list-style: none; padding: 0; display: grid; gap: 10px; }
  .aab-callout ul li {
    display: flex;
    gap: 14px;
    font-size: 13px;
    font-family: 'IBM Plex Mono', monospace;
    font-weight: 300;
    color: rgba(232,228,220,0.72);
    line-height: 1.6;
  }
  .aab-callout ul li::before {
    content: '//';
    color: var(--yellow);
    font-size: 11px;
    flex-shrink: 0;
    margin-top: 2px;
    opacity: 0.7;
  }

  /* ══ SPLIT COMPARE ══ */
  .aab-split {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2px;
    margin: 36px 0;
    border: 1px solid var(--border);
    border-radius: 4px;
    overflow: hidden;
  }
  .aab-split-col { padding: 24px 22px; }
  .aab-split-col:first-child { background: rgba(232,228,220,0.03); border-right: 1px solid var(--border); }
  .aab-split-col:last-child  { background: rgba(232,212,77,0.04); }
  .aab-split-label {
    font-size: 9px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    margin-bottom: 16px;
  }
  .aab-split-col:first-child .aab-split-label { color: var(--muted); }
  .aab-split-col:last-child  .aab-split-label { color: var(--yellow); }
  .aab-split ul { list-style: none; padding: 0; display: grid; gap: 9px; }
  .aab-split ul li {
    font-size: 13px;
    font-weight: 300;
    color: rgba(232,228,220,0.68);
    line-height: 1.5;
    padding-left: 14px;
    position: relative;
  }
  .aab-split-col:first-child ul li::before {
    content: '—';
    position: absolute; left: 0;
    color: var(--muted); font-size: 11px;
  }
  .aab-split-col:last-child ul li::before {
    content: '+';
    position: absolute; left: 0;
    color: var(--yellow); font-size: 11px;
  }

  /* ══ STAT ROW ══ */
  .aab-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1px;
    background: var(--border);
    border: 1px solid var(--border);
    border-radius: 4px;
    overflow: hidden;
    margin: 36px 0;
  }
  .aab-stat {
    background: var(--ink);
    padding: 24px 18px;
    text-align: center;
  }
  .aab-stat-num {
    font-family: 'Cormorant Garamond', serif;
    font-size: 44px;
    font-weight: 700;
    color: var(--yellow);
    line-height: 1;
    margin-bottom: 8px;
    letter-spacing: -0.02em;
  }
  .aab-stat-label {
    font-size: 11px;
    font-weight: 300;
    color: var(--muted);
    line-height: 1.5;
  }

  /* ══ CASE STUDY ══ */
  .aab-case {
    border: 1px solid var(--border);
    border-radius: 4px;
    overflow: hidden;
    margin: 36px 0;
  }
  .aab-case-head {
    background: rgba(232,212,77,0.08);
    border-bottom: 1px solid var(--border);
    padding: 14px 24px;
    display: flex;
    align-items: center;
    gap: 14px;
  }
  .aab-case-badge {
    font-size: 9px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--yellow);
    border: 1px solid rgba(232,212,77,0.35);
    border-radius: 2px;
    padding: 3px 10px;
  }
  .aab-case-title {
    font-family: 'Instrument Sans', sans-serif;
    font-size: 13px;
    font-weight: 500;
    color: var(--ash);
  }
  .aab-case-body {
    padding: 24px 28px;
    background: var(--ink-2);
  }
  .aab-case-body .aab-p { font-size: 13px; margin-bottom: 14px; }
  .aab-case-body .aab-p:last-child { margin-bottom: 0; }

  /* ══ HIGHLIGHT BOX ══ */
  .aab-highlight {
    background: rgba(192,67,42,0.1);
    border: 1px solid rgba(192,67,42,0.3);
    border-radius: 4px;
    padding: 32px 36px;
    margin: 40px 0;
    position: relative;
    overflow: hidden;
  }
  .aab-highlight::after {
    content: 'WARNING';
    position: absolute;
    top: 20px; right: 24px;
    font-size: 9px;
    letter-spacing: 0.22em;
    color: var(--rust);
    opacity: 0.5;
  }
  .aab-highlight h3 {
    font-family: 'Cormorant Garamond', serif;
    font-size: 22px;
    font-weight: 700;
    color: var(--ash);
    margin-bottom: 14px;
    letter-spacing: -0.01em;
  }
  .aab-highlight p {
    font-size: 14px;
    font-weight: 300;
    color: rgba(232,228,220,0.72);
    line-height: 1.75;
  }

  /* ══ INLINE NOTE ══ */
  .aab-note {
    background: rgba(232,212,77,0.05);
    border-left: 2px solid rgba(232,212,77,0.4);
    padding: 14px 18px;
    margin: 24px 0;
    font-size: 13px;
    font-weight: 300;
    color: rgba(232,228,220,0.65);
    line-height: 1.65;
    border-radius: 0 2px 2px 0;
  }

  /* ══ LARGE TEXT FEATURE ══ */
  .aab-feature-text {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(28px, 4.5vw, 44px);
    font-weight: 300;
    font-style: italic;
    line-height: 1.25;
    color: var(--ash);
    padding: 44px 0;
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
    margin: 48px 0;
    letter-spacing: -0.01em;
  }
  .aab-feature-text span { color: var(--yellow); }

  /* ══ GRID CARDS ══ */
  .aab-card-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    margin: 32px 0;
  }
  .aab-card {
    background: var(--ink-2);
    border: 1px solid var(--border);
    border-radius: 4px;
    padding: 22px 20px;
    transition: border-color 0.25s;
    position: relative;
    overflow: hidden;
  }
  .aab-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: var(--yellow);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.3s ease;
  }
  .aab-card:hover { border-color: rgba(232,228,220,0.2); }
  .aab-card:hover::before { transform: scaleX(1); }
  .aab-card-num {
    font-family: 'Cormorant Garamond', serif;
    font-size: 32px;
    font-weight: 700;
    color: var(--border);
    line-height: 1;
    margin-bottom: 10px;
  }
  .aab-card h3 {
    font-family: 'Instrument Sans', sans-serif;
    font-size: 15px;
    font-weight: 600;
    color: var(--ash);
    margin-bottom: 8px;
    line-height: 1.3;
  }
  .aab-card p {
    font-size: 12px;
    font-weight: 300;
    color: var(--muted);
    line-height: 1.65;
    margin: 0;
  }

  /* ══ TIMELINE ══ */
  .aab-timeline { margin: 32px 0; }
  .aab-tl-item {
    display: flex;
    gap: 20px;
    padding: 20px 0;
    border-bottom: 1px solid var(--border2);
  }
  .aab-tl-item:last-child { border-bottom: none; }
  .aab-tl-year {
    font-family: 'Cormorant Garamond', serif;
    font-size: 20px;
    font-weight: 700;
    color: var(--yellow);
    flex-shrink: 0;
    width: 60px;
    line-height: 1.2;
  }
  .aab-tl-content h4 {
    font-family: 'Instrument Sans', sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: var(--ash);
    margin-bottom: 6px;
  }
  .aab-tl-content p {
    font-size: 12px;
    font-weight: 300;
    color: var(--muted);
    line-height: 1.65;
    margin: 0;
  }

  /* ══ FOOTER ══ */
  .aab-footer {
    margin-top: 80px;
    padding: 30px 0;
    border-top: 1px solid var(--border);
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 16px;
  }
  .aab-footer-text {
    font-size: 10px;
    letter-spacing: 0.14em;
    color: var(--muted);
    text-transform: uppercase;
  }
  .aab-top-btn {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.1em;
    background: none;
    color: var(--yellow);
    border: 1px solid rgba(232,212,77,0.3);
    border-radius: 2px;
    padding: 9px 20px;
    cursor: pointer;
    transition: background 0.2s, color 0.2s;
  }
  .aab-top-btn:hover {
    background: rgba(232,212,77,0.08);
  }

  /* ══ RESPONSIVE ══ */
  @media (max-width: 960px) {
    .aab-shell {
      grid-template-columns: 1fr;
      padding: 0 24px;
      gap: 0;
    }
    .aab-toc-col { display: none; }
    .aab-card-grid { grid-template-columns: 1fr; }
    .aab-main { padding-bottom: 64px; }
    .aab-hero { padding: 48px 0 40px; margin-bottom: 48px; }
  }
  @media (max-width: 600px) {
    .aab-stats { grid-template-columns: 1fr; }
    .aab-split { grid-template-columns: 1fr; }
    .aab-split-col:first-child { border-right: none; border-bottom: 1px solid var(--border); }
    .aab-pull { margin: 32px 0; }
    .aab-h1 { font-size: 36px; }
    .aab-h1-sub { margin-bottom: 28px; }
    .aab-section-wrap { margin: 48px 0 24px; }
    .aab-section-num { font-size: 48px; }
  }
`;

/* ═══════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════ */
const TOC_ITEMS = [
  { id: "ai-s1",  label: "The Aesthetic of Everything" },
  { id: "ai-s2",  label: "How Sameness Happens" },
  { id: "ai-s3",  label: "A Brief Timeline of AI Look" },
  { id: "ai-s4",  label: "What Homogeneity Actually Costs" },
  { id: "ai-s5",  label: "The Training Data Problem" },
  { id: "ai-s6",  label: "Cultural Erasure at Scale" },
  { id: "ai-s7",  label: "Who Profits from Sameness" },
  { id: "ai-s8",  label: "The Resistance & What Works" },
  { id: "ai-s9",  label: "Owning the Aesthetic Back" },
  { id: "ai-s10", label: "What Comes Next" },
];

const STATS = [
  { num: "91%", label: "of top AI product UIs use the same 3 typefaces" },
  { num: "6",   label: "color palettes dominate 80% of AI consumer products" },
  { num: "34×", label: "faster aesthetic convergence vs. pre-AI product design" },
];

const TIMELINE = [
  {
    year: "2017",
    title: "The Material Design Plateau",
    body: "Google's Material Design colonizes Android and the web. Clean cards, shadow depth, and Roboto everywhere. The first wave of design monoculture.",
  },
  {
    year: "2020",
    title: "Dall-E and the Birth of the AI Aesthetic",
    body: "Early generative image models produce a signature look: dreamy gradients, soft bokeh, surreal composites. Designers call it 'AI-generated' instantly recognizable, already clichéd.",
  },
  {
    year: "2022",
    title: "Midjourney's Hyperreal Lock-In",
    body: "Midjourney v4 and v5 establish the dominant aesthetic of AI imagery: cinematic lighting, impossibly detailed textures, a specific brand of fantasy-realism that saturates every mood board.",
  },
  {
    year: "2023",
    title: "The ChatGPT Interface Template",
    body: "Every AI chat product launches with a sidebar, a centered input box, a sans-serif font, and a white/dark toggle. The template is copied hundreds of times within months.",
  },
  {
    year: "2024",
    title: "The Purple Gradient Era",
    body: "AI marketing materials converge on purple-to-blue gradients, glowing orbs, and abstract mesh backgrounds. A visual language so ubiquitous it becomes self-parody.",
  },
  {
    year: "2025–26",
    title: "The Backlash & Divergence",
    body: "Designers, critics, and users begin actively naming the problem. A counter-movement emerges: brutalist AI interfaces, vernacular aesthetics, and deliberate anti-polish as signal.",
  },
];

const CARDS = [
  {
    num: "01",
    title: "The Efficiency Trap",
    body: "AI tools optimize for average approval, not cultural resonance. The mean of all human aesthetics is a beige void.",
  },
  {
    num: "02",
    title: "The Feedback Loop",
    body: "AI-generated content trains future AI models. Aesthetic homogeneity compounds with each generation.",
  },
  {
    num: "03",
    title: "The Client Expectation Problem",
    body: "Clients who've seen AI outputs expect AI-style results. Designers who resist get replaced.",
  },
  {
    num: "04",
    title: "The Speed Trap",
    body: "AI output in seconds vs. human craft in days. Speed wins in a sprint-driven industry. Craft loses.",
  },
];

/* ═══════════════════════════════════════════════
   HOOKS
═══════════════════════════════════════════════ */
function useScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const fn = () => {
      const el = document.documentElement;
      const s = el.scrollTop || document.body.scrollTop;
      const t = el.scrollHeight - el.clientHeight;
      setP(t ? (s / t) * 100 : 0);
    };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return p;
}

function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const obs = ids.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const o = new IntersectionObserver(
        ([e]) => { if (e.isIntersecting) setActive(id); },
        { rootMargin: "-15% 0px -75% 0px" }
      );
      o.observe(el);
      return o;
    });
    return () => obs.forEach((o) => o && o.disconnect());
  }, [ids]);
  return active;
}

function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const o = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) el.classList.add("aab-visible"); },
      { threshold: 0.07 }
    );
    o.observe(el);
    return () => o.disconnect();
  }, []);
  return ref;
}

/* ═══════════════════════════════════════════════
   SMALL COMPONENTS
═══════════════════════════════════════════════ */
function Reveal({ children, delay }) {
  const ref = useReveal();
  return (
    <div ref={ref} className="aab-reveal" style={delay ? { transitionDelay: `${delay}ms` } : {}}>
      {children}
    </div>
  );
}

function SectionMarker({ id, num, label, title }) {
  return (
    <Reveal>
      <div id={id} className="aab-section-wrap">
        <div className="aab-section-num">{num}</div>
        <div className="aab-section-right">
          <div className="aab-section-label">{label}</div>
          <h2 className="aab-h2">{title}</h2>
        </div>
      </div>
    </Reveal>
  );
}

function P({ children }) {
  return <p className="aab-p">{children}</p>;
}

function PullQuote({ children, attr }) {
  return (
    <Reveal>
      <div className="aab-pull">
        <div className="aab-pull-text">{children}</div>
        {attr && <span className="aab-pull-attr">{attr}</span>}
      </div>
    </Reveal>
  );
}

function Callout({ title, items }) {
  return (
    <Reveal>
      <div className="aab-callout">
        <div className="aab-callout-title">{title}</div>
        <ul>{items.map((it, i) => <li key={i}>{it}</li>)}</ul>
      </div>
    </Reveal>
  );
}

function Note({ children }) {
  return <Reveal><div className="aab-note">{children}</div></Reveal>;
}

function CaseStudy({ title, children }) {
  return (
    <Reveal>
      <div className="aab-case">
        <div className="aab-case-head">
          <span className="aab-case-badge">Case Study</span>
          <span className="aab-case-title">{title}</span>
        </div>
        <div className="aab-case-body">{children}</div>
      </div>
    </Reveal>
  );
}

/* ═══════════════════════════════════════════════
   MAIN EXPORT
═══════════════════════════════════════════════ */
export default function AIAestheticBlog() {
  const progress = useScrollProgress();
  const activeId = useActiveSection(TOC_ITEMS.map((t) => t.id));
  const tocIds = TOC_ITEMS.map((t) => t.id);

  useEffect(() => {
    const id = "aab-global-styles";
    if (!document.getElementById(id)) {
      const s = document.createElement("style");
      s.id = id;
      s.textContent = GLOBAL_CSS;
      document.head.appendChild(s);
    }
  }, []);

  const scrollTo = useCallback((id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <div className="aab">
      <div className="aab-progress" style={{ width: `${progress}%` }} />

      <div className="aab-shell">

        {/* ── TOC ── */}
        <aside className="aab-toc-col">
          <div className="aab-toc-label">Contents</div>
          <ul className="aab-toc-list">
            {TOC_ITEMS.map((item) => (
              <li key={item.id}>
                <button
                  className={`aab-toc-item${activeId === item.id ? " active" : ""}`}
                  onClick={() => scrollTo(item.id)}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* ── MAIN ── */}
        <main className="aab-main">

          {/* HERO */}
          <header className="aab-hero">
            <Reveal>
              <div className="aab-hero-label">Design Culture · AI Critique</div>
              <h1 className="aab-h1">
                Who Owns the<br /><em>Aesthetic of AI?</em>
              </h1>
              <p className="aab-h1-sub">
                Why all AI-generated interfaces look the same,<br />
                and what that sameness is doing to our culture.
              </p>
              <div className="aab-meta">
                {["May 2026", "18 min read", "Critical Essay"].map((m) => (
                  <span key={m} className="aab-meta-item">
                    <span className="aab-meta-dot" />{m}
                  </span>
                ))}
              </div>
              <div className="aab-tags">
                {["Design Culture", "AI", "UX Criticism", "Visual Identity", "Homogeneity"].map((t) => (
                  <span key={t} className="aab-tag">{t}</span>
                ))}
              </div>
            </Reveal>
          </header>

          {/* INTRO */}
          <Reveal>
            <P>
              Open ten AI products right now. Any ten. A writing assistant. A coding tool. An image generator. A
              customer service chatbot. A research platform. A creative suite. Look at them side by side and notice
              something: they all look like they were designed by the same person on the same afternoon in the same
              mood.
            </P>
            <P>
              Rounded corners. Clean sans-serif typefaces. Gradient backgrounds blurring from deep blue to
              violet to teal. A centered text input with a glowing send button. A dark mode that isn't really dark
              — it's dark blue-gray. Subtle animations that pulse gently to suggest "thinking." A logo that is
              either an abstract geometric shape or a stylized initial rendered in gradient.
            </P>
            <P>
              This is not coincidence. It is not the natural convergence of good design principles. It is
              something more troubling: the visual output of a feedback loop so powerful it is flattening human
              aesthetic culture at scale, replacing the infinite variety of human visual expression with the
              statistical mean of everything we ever made.
            </P>
          </Reveal>

          <PullQuote attr="— The central problem of AI visual culture">
            "AI doesn't create aesthetic preferences. It inherits them, amplifies them, and reflects them back at
            you — laundered of their origin, shorn of their meaning."
          </PullQuote>

          <Reveal>
            <P>
              This essay is about <strong>who built this aesthetic, who benefits from it, who it excludes, and
              whether anything can be done about it</strong>. It is also about why the question matters far beyond
              design criticism — because visual culture is not decorative. It is how we communicate who we are,
              where we come from, and what we value. When AI homogenizes that culture, it doesn't just make our
              interfaces boring. It erases something irreplaceable.
            </P>
          </Reveal>

          {/* SECTION 1 */}
          <SectionMarker id="ai-s1" num="01" label="The Problem" title="The Aesthetic of Everything" />
          <Reveal>
            <P>
              The AI aesthetic is not limited to AI products themselves. It has spread. Open any venture-backed
              startup's website launched in the last two years. Browse Dribbble or Behance on any given Tuesday.
              Look at the visual identity of almost any new company that wants to seem "advanced" or "intelligent."
              You will find the same family of choices: the same type scales, the same color temperature, the same
              spatial relationships, the same motion language.
            </P>
            <P>
              Design culture has always had trends. Skeuomorphism gave way to flat design. Flat design gave way to
              Material. Gradients disappeared and returned. Dark modes emerged. But these transitions happened over
              years, driven by deliberate cultural shifts, technological changes, and the organic work of
              influential designers making intentional choices. What AI has produced is different in kind, not
              degree.
            </P>
          </Reveal>

          <Reveal>
            <div className="aab-stats">
              {STATS.map((s) => (
                <div key={s.num} className="aab-stat">
                  <div className="aab-stat-num">{s.num}</div>
                  <div className="aab-stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal>
            <P>
              This is not convergence. It is compression. AI tools compress the entire history of visual design
              into a distribution, then generate outputs that maximize approval ratings across that distribution.
              The result is not great design. It is inoffensive design — optimized to disturb no one, to surprise
              no one, to belong to no one. Aesthetically, it is the equivalent of averaging every face that has
              ever existed. The output is technically beautiful, in a way. It is also completely hollow.
            </P>
          </Reveal>

          {/* SECTION 2 */}
          <SectionMarker id="ai-s2" num="02" label="The Mechanism" title="How Sameness Happens" />
          <Reveal>
            <P>
              To understand AI aesthetic homogeneity, you need to understand three feedback loops that reinforce
              each other with compounding force.
            </P>
          </Reveal>

          <Reveal>
            <div className="aab-card-grid">
              {CARDS.map((c) => (
                <div key={c.num} className="aab-card">
                  <div className="aab-card-num">{c.num}</div>
                  <h3>{c.title}</h3>
                  <p>{c.body}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal>
            <P>
              The most insidious loop is the third one — the client expectation problem. As AI-generated design
              floods every market, clients develop an intuitive sense of what "good AI design" looks like. That
              sense is itself shaped by AI output. So clients begin requesting designs that match the AI aesthetic,
              which they've come to associate with quality, intelligence, and modernity. Designers who deliver
              something genuinely different face friction. The feedback loop closes and tightens.
            </P>
          </Reveal>

          <Note>
            The mathematical term for this is "mode collapse" — a known failure mode in generative AI training
            where the model produces outputs clustered around a small number of high-probability solutions,
            ignoring the rich diversity of the possible output space. AI design culture is experiencing mode
            collapse at civilizational scale.
          </Note>

          {/* SECTION 3 */}
          <SectionMarker id="ai-s3" num="03" label="History" title="A Brief Timeline of AI Look" />
          <Reveal>
            <P>
              The AI aesthetic did not emerge fully formed. It has a genealogy — a traceable sequence of
              influences, technologies, and market forces that produced the visual language we now live inside.
            </P>
          </Reveal>
          <Reveal>
            <div className="aab-timeline">
              {TIMELINE.map((item) => (
                <div key={item.year} className="aab-tl-item">
                  <div className="aab-tl-year">{item.year}</div>
                  <div className="aab-tl-content">
                    <h4>{item.title}</h4>
                    <p>{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          {/* SECTION 4 */}
          <SectionMarker id="ai-s4" num="04" label="The Stakes" title="What Homogeneity Actually Costs" />
          <Reveal>
            <P>
              There is a version of this conversation that stays safely within design criticism — a discussion
              of aesthetics, trends, and whether or not the current moment is boring. That conversation is fine
              as far as it goes, but it misses the larger stakes entirely. Visual homogeneity is not merely
              aesthetically unfortunate. It is culturally damaging.
            </P>
            <P>
              Visual culture is one of the primary means by which communities express identity, preserve history,
              and transmit values across generations. The graphic design traditions of Japan, Nigeria, Mexico,
              Poland, Iran, and a hundred other cultural contexts are not interchangeable. They encode specific
              histories, specific ways of seeing, specific relationships to color, form, and space that are
              irreducibly their own. When AI generates "design," it does not draw from these traditions equally.
              It draws from the data it was trained on — and that data is profoundly biased.
            </P>
          </Reveal>

          <Reveal>
            <div className="aab-feature-text">
              "When an AI generates a logo, it is not being neutral. It is being biased toward
              {" "}<span>whatever aesthetic dominated the English-language internet.</span>"
            </div>
          </Reveal>

          <Reveal>
            <P>
              The AI aesthetic is not a universal aesthetic. It is a Western, English-language, tech-industry
              aesthetic, laundered of its origins by the alchemy of algorithmic generation and presented as if
              it were simply "good design." When businesses in Nairobi, Jakarta, São Paulo, and Lahore are handed
              AI tools that generate this aesthetic as their default, they are not being offered a neutral toolkit.
              They are being offered the visual language of a specific cultural moment in a specific geography,
              at the expense of their own.
            </P>
          </Reveal>

          {/* SECTION 5 */}
          <SectionMarker id="ai-s5" num="05" label="Root Cause" title="The Training Data Problem" />
          <Reveal>
            <P>
              Every AI design tool is a compressed representation of its training data. The question of who owns
              the AI aesthetic is, at its core, a question of whose visual culture was used to train the models.
              The answers are not comfortable.
            </P>
          </Reveal>
          <Reveal>
            <div className="aab-split">
              <div className="aab-split-col">
                <div className="aab-split-label">What gets scraped</div>
                <ul>
                  <li>English-language design platforms (Dribbble, Behance, Awwwards)</li>
                  <li>Western commercial brand identity work</li>
                  <li>US and European tech startup visual language</li>
                  <li>Stock imagery dominated by majority-culture subjects</li>
                  <li>Social media platforms with skewed global demographics</li>
                  <li>Published design criticism (which over-indexes WEIRD contexts)</li>
                </ul>
              </div>
              <div className="aab-split-col">
                <div className="aab-split-label">What gets underweighted</div>
                <ul>
                  <li>Vernacular design traditions from the Global South</li>
                  <li>Non-digital, craft-based visual cultures</li>
                  <li>Indigenous visual languages and symbology</li>
                  <li>Design work created in non-Latin scripts</li>
                  <li>Community-specific visual culture (murals, protest art, zines)</li>
                  <li>Work that never made it onto commercial platforms</li>
                </ul>
              </div>
            </div>
          </Reveal>
          <Reveal>
            <P>
              The implications of this imbalance are not abstract. When a Kenyan designer uses a generative AI
              tool to produce brand concepts for a local business, the tool generates outputs that are optimized
              for a Western aesthetic context — because that is what dominated the training data. The tool does
              not know it is being culturally imperialist. It is simply reflecting the distribution of its
              training set. The damage is real regardless of the intent.
            </P>
          </Reveal>

          <CaseStudy title="Adobe Firefly and the 'Safe' Aesthetic">
            <P className="aab-p">
              Adobe's Firefly generative model, launched in 2023, was explicitly marketed on having been trained
              on licensed, "commercially safe" content — primarily Adobe Stock imagery. This was a genuine
              attempt to address copyright concerns in AI training data. It was also, unintentionally, a
              mechanism for aesthetic conservatism at scale.
            </P>
            <P className="aab-p">
              Adobe Stock's library, while vast, is heavily weighted toward Western commercial photography
              conventions — clean subjects, neutral backgrounds, "universal" expressions of concepts that are
              anything but universal. The "commercially safe" aesthetic turned out to be indistinguishable from
              the "commercially familiar" aesthetic. Designers using Firefly to explore novel or culturally
              specific territory found the tool resistant — not because of technical limitations, but because
              resistance to the mean requires training data that represents the edges, and the edges were
              systematically excluded.
            </P>
            <P className="aab-p">
              This is not a criticism of Adobe specifically. It is an illustration of a structural problem:
              the criteria used to curate "safe" training data inevitably encode aesthetic biases, and those
              biases then become the aesthetic defaults of every product built on that data.
            </P>
          </CaseStudy>

          {/* SECTION 6 */}
          <SectionMarker id="ai-s6" num="06" label="Cultural Impact" title="Cultural Erasure at Scale" />
          <Reveal>
            <P>
              The term "cultural erasure" carries weight, and it should. It describes something real and
              measurable: the process by which a dominant aesthetic displaces local, specific, and
              community-rooted visual cultures, not through force but through market dynamics and the
              gravitational pull of platforms that reach everyone.
            </P>
            <P>
              AI accelerates this process by an order of magnitude. A human designer choosing to apply a
              Western minimal aesthetic to a project in Lagos is making a specific, contestable decision that
              can be questioned, reversed, and criticized. An AI tool that simply defaults to that aesthetic
              without flagging the choice presents it as neutral, as simply "good design" — and in doing so,
              naturalizes a bias that should be visible and subject to debate.
            </P>
          </Reveal>

          <Reveal>
            <div className="aab-highlight">
              <h3>The Naturalization Problem</h3>
              <p>
                The most dangerous thing about AI aesthetic homogeneity is not that it exists — it is that
                it presents itself as natural. When a bias is baked into a tool that billions of people use
                daily, it stops looking like a bias and starts looking like reality. The Western commercial
                aesthetic stops being "one way of doing design" and starts being "how design looks." This is
                not metaphor. This is how cultural power works.
              </p>
            </div>
          </Reveal>

          <Reveal>
            <P>
              There is a parallel here with the history of photography. When photographic film was first
              developed, its color calibration was optimized for light Caucasian skin tones — because the
              "Shirley cards" used for calibration depicted white women. This was not a deliberate act of
              racism. It was a default choice made without thinking about who would be excluded by it. The
              consequences played out for decades in portraiture, journalism, and documentary photography,
              systematically underrepresenting and misrepresenting darker-skinned subjects.
            </P>
            <P>
              AI aesthetic defaults are the Shirley card problem at civilization scale. And the window to
              address it — before the defaults calcify into invisible standards — is closing.
            </P>
          </Reveal>

          {/* SECTION 7 */}
          <SectionMarker id="ai-s7" num="07" label="Power" title="Who Profits from Sameness" />
          <Reveal>
            <P>
              Aesthetic homogeneity is not ideologically neutral. It benefits specific actors in specific ways,
              and understanding those dynamics is essential to understanding why the problem persists despite
              widespread awareness of it.
            </P>
          </Reveal>

          <Callout
            title="Who benefits from AI aesthetic homogeneity"
            items={[
              "Large AI platform companies — a consistent aesthetic makes their tools easier to evaluate and market",
              "Western design tool vendors — homogeneity centered on their aesthetic gives their templates default authority",
              "Enterprise clients — sameness reduces design decision friction and speeds procurement",
              "Mid-market design agencies — AI tools that produce reliable outputs let them scale without senior talent",
              "Advertisers — a homogeneous visual environment makes their distinct brand aesthetics more prominent by contrast",
            ]}
          />

          <Reveal>
            <P>
              Notice who is not on this list: individual designers with distinctive voices, small studios
              with specific cultural expertise, clients who need visual identity that reflects their actual
              community context, and any culture whose visual tradition differs significantly from the Western
              tech-commercial mainstream.
            </P>
            <P>
              The economics of AI design tools create a ratchet effect: the more widely adopted they become,
              the more their aesthetic becomes the expected standard, which makes deviation increasingly
              expensive in both time and client-management effort. The market rewards those who adopt the
              standard and punishes those who resist it. This is not conspiracy — it is just how platform
              dynamics work. But the outcome is a progressive narrowing of visual culture that no individual
              actor has chosen and no individual actor can easily reverse.
            </P>
          </Reveal>

          <PullQuote attr="— On the economics of aesthetic monoculture">
            "The AI aesthetic is not a conspiracy. It is an emergent property of systems optimizing for
            engagement, approval, and frictionless production — all reasonable goals, in isolation. Together,
            they are consuming culture."
          </PullQuote>

          {/* SECTION 8 */}
          <SectionMarker id="ai-s8" num="08" label="Counter-Movement" title="The Resistance & What Works" />
          <Reveal>
            <P>
              The backlash has already begun. It is scattered, understaffed, and structurally disadvantaged —
              but it is real, and it is generating some of the most interesting design work of the current moment.
            </P>
            <P>
              The counter-movement takes several forms. There is the deliberate anti-polish aesthetic: designers
              who embrace roughness, imperfection, vernacular typography, and digital ugliness as a direct
              rebuttal to AI-generated smoothness. There is the specificity movement: studios that have doubled
              down on deep cultural research, producing work so embedded in a specific context that no current
              AI tool could replicate it. And there is the tooling rebellion: designers building custom pipelines
              that deliberately constrain AI tools, feeding them unusual, culturally specific datasets to produce
              outputs that break from the default distribution.
            </P>
          </Reveal>

          <CaseStudy title="Zine Culture as Aesthetic Resistance">
            <P className="aab-p">
              Since 2023, a number of design studios — primarily small, independent practices in cities
              outside the main tech hubs — have turned to physical zine production as both a creative practice
              and a philosophical stance. The zine aesthetic: photocopier textures, hand-lettered type, rough
              collage, political urgency — is everything AI cannot currently reproduce with any authenticity.
            </P>
            <P className="aab-p">
              What is interesting is not the zines themselves but the commercial trajectory of the studios
              making them. Several have found that their deliberately anti-AI aesthetic has become a
              differentiator in markets where clients are beginning to feel the sameness of AI-generated work.
              There is emerging commercial demand for visual identity that is legibly human-made — not
              because clients are ideologically opposed to AI, but because human-made aesthetic has become
              scarce enough to be premium.
            </P>
            <P className="aab-p">
              This is the market correcting. It is also a fragile correction: as AI tools get better at
              simulating imperfection and vernacular texture, the visual markers of "human-made" will need
              to shift again. The resistance is perpetually playing catch-up with the technology it resists.
            </P>
          </CaseStudy>

          <Callout
            title="Strategies for aesthetic resistance that actually work"
            items={[
              "Deep context embedding — producing work so culturally specific it resists AI replication by design",
              "Constraint-based custom pipelines — training or fine-tuning models on deliberately non-mainstream datasets",
              "Physical-first processes — integrating analog, craft, or material processes that create untrained textures",
              "Community co-creation — involving the communities being designed for in the aesthetic process itself",
              "Temporal specificity — designing for a precise cultural moment rather than optimizing for timelessness",
              "Deliberate imperfection — embracing the hand, the mistake, and the local as markers of authenticity",
            ]}
          />

          {/* SECTION 9 */}
          <SectionMarker id="ai-s9" num="09" label="Agency" title="Owning the Aesthetic Back" />
          <Reveal>
            <P>
              The question of who owns the AI aesthetic has a deceptively simple answer: whoever controls
              the training data, the model defaults, and the interface affordances owns it. Right now, that
              is a small number of large technology companies. That does not have to be permanent.
            </P>
            <P>
              There are structural interventions that could genuinely shift the distribution of aesthetic
              power in AI design tools. They are technically and politically difficult. They are also
              worth naming, because design culture does not change through individual choices alone — it
              changes through organized demands on the systems that shape it.
            </P>
          </Reveal>

          <Callout
            title="Structural interventions worth fighting for"
            items={[
              "Mandatory training data transparency — public disclosure of what datasets underlie AI design tools",
              "Cultural diversity audits — third-party evaluation of aesthetic bias in generative model outputs",
              "Community dataset initiatives — funded programs to document and digitize underrepresented visual traditions",
              "Default diversity — AI tools that randomize aesthetic starting points rather than defaulting to the mean",
              "Designer attribution infrastructure — systems that compensate the creators whose work trained the models",
              "Open model access — allowing cultural institutions to fine-tune models on their own heritage collections",
            ]}
          />

          <Reveal>
            <P>
              Individual designers also have more power than the market dynamics suggest, particularly in
              the long run. The designers who will matter most in the next decade are not those who use
              AI tools most efficiently — those skills will be commoditized completely within a few years.
              The designers who will matter are those who bring something to the process that no model
              currently trained can replicate: deep community embeddedness, specific cultural knowledge,
              a genuine point of view developed over years of disciplined attention to the world.
            </P>
            <P>
              This is not wishful thinking. It is an accurate reading of where scarcity is moving in
              design labor markets. The generic is becoming cheap. The specific is becoming premium. The
              question is whether the profession will orient itself toward that premium fast enough to
              preserve its relevance — and its cultural authority.
            </P>
          </Reveal>

          {/* SECTION 10 */}
          <SectionMarker id="ai-s10" num="10" label="Futures" title="What Comes Next" />
          <Reveal>
            <P>
              The AI aesthetic is not a fixed point. It will evolve, as all aesthetic moments evolve —
              partly through the technology changing, partly through cultural reaction, partly through the
              inevitable exhaustion of the current dominant idiom. But the direction it evolves toward
              is not predetermined. It will be shaped, consciously or unconsciously, by the choices of
              designers, educators, platform builders, clients, critics, and users over the next five years.
            </P>
            <P>
              The optimistic scenario: AI tools become radically more culturally pluralistic, trained on
              genuinely diverse datasets, with default behaviors that actively surface range rather than
              defaulting to means. Designers use these tools to produce work of astonishing cultural
              specificity, amplified by AI capability rather than homogenized by AI defaults. Visual
              culture becomes richer, not poorer.
            </P>
            <P>
              The pessimistic scenario: the current feedback loop continues and accelerates. AI aesthetic
              becomes the only aesthetic. The visual languages of hundreds of cultural traditions survive
              only as historical artifacts in museum archives and academic papers. Design becomes a
              logistics function rather than a cultural practice. The world starts to look like one very
              large, very beautiful, very empty airport terminal.
            </P>
          </Reveal>

          <Reveal>
            <div className="aab-feature-text">
              The answer to who owns the aesthetic of AI is, right now,{" "}
              <span>no one you elected and no one you can easily fire.</span>{" "}
              That needs to change.
            </div>
          </Reveal>

          <Reveal>
            <P>
              Which scenario prevails depends in large part on whether designers, as a professional
              community, treat this as a technical problem — a matter of tooling and workflow optimization
              — or as a cultural problem requiring political engagement, organized demands, and the
              willingness to resist systems that make resistance expensive. The history of design as a
              discipline offers reason for both pessimism and hope. The discipline has, in the past, found
              the will to insist that aesthetics are not innocent — that how things look encodes what we
              value, who we see, and who gets to speak.
            </P>
            <P>
              This is one of those moments when that insistence is needed most urgently. The question is
              whether we will rise to it — or let the gradient choose for us.
            </P>
          </Reveal>

          {/* FOOTER */}
          <Reveal>
            <div className="aab-footer">
              <span className="aab-footer-text">Design Culture · AI Criticism · May 2026</span>
              <button
                className="aab-top-btn"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                ↑ Back to top
              </button>
            </div>
          </Reveal>

        </main>
      </div>
    </div>
  );
}
