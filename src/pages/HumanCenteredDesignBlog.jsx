import { useEffect, useRef, useState } from "react";

/* ─────────────────────────────────────────────
   GLOBAL STYLES — inject once into <head>
   (uses a <style> tag via useEffect)
───────────────────────────────────────────── */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,400&family=DM+Mono:wght@400&display=swap');

  :root {
    --cream:   #F9F6F0;
    --ink:     #1A1714;
    --rust:    #C4501A;
    --slate:   #3D4A5C;
    --gold:    #D4A853;
    --muted:   #7A7268;
    --surface: #FFFFFF;
    --border:  rgba(26,23,20,0.12);
  }

  .hcd-blog * { box-sizing: border-box; margin: 0; padding: 0; }

  .hcd-blog {
    font-family: 'DM Sans', sans-serif;
    background: var(--cream);
    color: var(--ink);
    font-size: 17px;
    line-height: 1.75;
    -webkit-font-smoothing: antialiased;
    position: relative;
    z-index: 10;
  }

  .hcd-blog a { color: var(--rust); text-decoration: none; }
  .hcd-blog a:hover { text-decoration: underline; }

  /* ── Reveal animation ── */
  .hcd-reveal {
    opacity: 0;
    transform: translateY(22px);
    transition: opacity 0.6s ease, transform 0.6s ease;
  }
  .hcd-reveal.hcd-visible {
    opacity: 1;
    transform: translateY(0);
  }

  /* ── Reading progress bar ── */
  .hcd-progress {
    position: fixed;
    top: 0; left: 0;
    height: 3px;
    background: var(--rust);
    z-index: 1000;
    transition: width 0.1s linear;
  }

  /* ── Sticky TOC ── */
  .hcd-toc-wrap {
    position: sticky;
    top: 120px;
    width: 220px;
    flex-shrink: 0;
    align-self: flex-start;
  }
  .hcd-toc {
    border-left: 2px solid var(--border);
    padding-left: 20px;
  }
  .hcd-toc-title {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 14px;
  }
  .hcd-toc-item {
    font-size: 12px;
    color: var(--muted);
    cursor: pointer;
    padding: 4px 0;
    transition: color 0.2s;
    line-height: 1.4;
    display: block;
    background: none;
    border: none;
    text-align: left;
    font-family: 'DM Sans', sans-serif;
  }
  .hcd-toc-item:hover { color: var(--ink); }
  .hcd-toc-item.active { color: var(--rust); font-weight: 500; }

  /* ── Layout ── */
  .hcd-outer {
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 32px;
    display: flex;
    gap: 60px;
    align-items: flex-start;
  }
  .hcd-main { flex: 1; min-width: 0; padding-bottom: 100px; }

  /* ── HERO ── */
  .hcd-hero {
    padding: 72px 0 52px;
    border-bottom: 1px solid var(--border);
    margin-bottom: 60px;
  }
  .hcd-eyebrow {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--rust);
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .hcd-eyebrow::after {
    content: '';
    width: 60px; height: 1px;
    background: var(--rust);
    opacity: 0.3;
  }
  .hcd-h1 {
    font-family: 'Playfair Display', serif;
    font-size: clamp(38px, 5vw, 62px);
    font-weight: 700;
    line-height: 1.1;
    letter-spacing: -0.02em;
    color: var(--ink);
    margin-bottom: 28px;
  }
  .hcd-h1 em { font-style: italic; color: var(--rust); }
  .hcd-hero-sub {
    font-size: 19px;
    color: var(--muted);
    font-weight: 300;
    max-width: 600px;
    line-height: 1.65;
    margin-bottom: 36px;
  }
  .hcd-meta-row {
    display: flex;
    align-items: center;
    gap: 20px;
    flex-wrap: wrap;
    margin-bottom: 20px;
  }
  .hcd-meta-pill {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.08em;
    color: var(--muted);
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .hcd-dot {
    width: 4px; height: 4px;
    background: var(--gold);
    border-radius: 50%;
    display: inline-block;
  }
  .hcd-tags { display: flex; gap: 8px; flex-wrap: wrap; }
  .hcd-tag {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    padding: 4px 12px;
    border: 1px solid var(--border);
    border-radius: 100px;
    color: var(--muted);
  }

  /* ── Section marker ── */
  .hcd-section-marker {
    display: flex;
    align-items: center;
    gap: 16px;
    margin: 60px 0 32px;
  }
  .hcd-section-marker .num {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    color: var(--rust);
    letter-spacing: 0.1em;
    flex-shrink: 0;
  }
  .hcd-section-marker .line {
    flex: 1; height: 1px;
    background: var(--border);
  }
  .hcd-h2 {
    font-family: 'Playfair Display', serif;
    font-size: 30px;
    font-weight: 700;
    color: var(--ink);
    letter-spacing: -0.01em;
  }

  /* ── Body text ── */
  .hcd-p { margin-bottom: 22px; }
  .hcd-p:last-child { margin-bottom: 0; }

  /* ── Pull quote ── */
  .hcd-pull {
    border-left: 3px solid var(--rust);
    padding: 20px 28px;
    margin: 44px 0;
    background: var(--surface);
    border-radius: 0 8px 8px 0;
  }
  .hcd-pull p {
    font-family: 'Playfair Display', serif;
    font-size: 21px;
    font-style: italic;
    line-height: 1.5;
    color: var(--slate);
    margin: 0;
  }
  .hcd-pull .attr {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    color: var(--muted);
    letter-spacing: 0.08em;
    margin-top: 12px;
    display: block;
  }

  /* ── Callout ── */
  .hcd-callout {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 28px 32px;
    margin: 36px 0;
  }
  .hcd-callout-title {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--rust);
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .hcd-callout-title::before {
    content: '';
    width: 20px; height: 1px;
    background: var(--rust);
  }
  .hcd-callout ul { list-style: none; padding: 0; display: grid; gap: 10px; }
  .hcd-callout ul li {
    display: flex;
    gap: 12px;
    font-size: 15px;
    color: var(--slate);
    line-height: 1.55;
  }
  .hcd-callout ul li::before {
    content: '→';
    color: var(--rust);
    font-family: 'DM Mono', monospace;
    font-size: 12px;
    margin-top: 2px;
    flex-shrink: 0;
  }

  /* ── Principle cards ── */
  .hcd-principle-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
    margin: 36px 0;
  }
  .hcd-principle-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 24px 20px;
    transition: border-color 0.2s, transform 0.2s;
  }
  .hcd-principle-card:hover {
    border-color: rgba(196,80,26,0.45);
    transform: translateY(-2px);
  }
  .hcd-p-num {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    color: var(--rust);
    letter-spacing: 0.1em;
    margin-bottom: 12px;
  }
  .hcd-principle-card h3 {
    font-family: 'Playfair Display', serif;
    font-size: 17px;
    font-weight: 700;
    color: var(--ink);
    margin-bottom: 8px;
    line-height: 1.3;
  }
  .hcd-principle-card p {
    font-size: 13px;
    color: var(--muted);
    line-height: 1.6;
    margin: 0;
  }

  /* ── Stat cards ── */
  .hcd-stat-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin: 36px 0;
  }
  .hcd-stat-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 24px 20px;
    text-align: center;
  }
  .hcd-stat-num {
    font-family: 'Playfair Display', serif;
    font-size: 40px;
    font-weight: 700;
    color: var(--rust);
    line-height: 1;
    margin-bottom: 10px;
  }
  .hcd-stat-label {
    font-size: 12px;
    color: var(--muted);
    line-height: 1.5;
  }

  /* ── Compare table ── */
  .hcd-table-wrap {
    overflow-x: auto;
    margin: 32px 0;
    border-radius: 12px;
    border: 1px solid var(--border);
  }
  .hcd-table {
    width: 100%;
    border-collapse: collapse;
    background: var(--surface);
    font-size: 14px;
    min-width: 540px;
  }
  .hcd-table thead tr { background: var(--ink); }
  .hcd-table thead th {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    padding: 14px 20px;
    text-align: left;
    font-weight: 400;
    color: #fff;
  }
  .hcd-table tbody tr { border-bottom: 1px solid var(--border); }
  .hcd-table tbody tr:last-child { border-bottom: none; }
  .hcd-table tbody tr:nth-child(even) { background: rgba(249,246,240,0.5); }
  .hcd-table td {
    padding: 13px 20px;
    vertical-align: top;
    color: var(--slate);
  }
  .hcd-table td:first-child { font-weight: 500; color: var(--ink); font-size: 13px; }

  /* ── Step list ── */
  .hcd-steps { list-style: none; padding: 0; margin: 32px 0; }
  .hcd-step {
    display: flex;
    gap: 24px;
    padding: 24px 0;
    border-bottom: 1px solid var(--border);
  }
  .hcd-step:last-child { border-bottom: none; }
  .hcd-step-left {
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .hcd-step-circle {
    width: 36px; height: 36px;
    border-radius: 50%;
    background: var(--rust);
    color: #fff;
    font-family: 'DM Mono', monospace;
    font-size: 13px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .hcd-step-line {
    width: 1px;
    flex: 1;
    background: var(--border);
    margin-top: 8px;
  }
  .hcd-step-body h3 {
    font-family: 'Playfair Display', serif;
    font-size: 19px;
    font-weight: 700;
    color: var(--ink);
    margin-bottom: 8px;
    margin-top: 5px;
    line-height: 1.3;
  }
  .hcd-step-body p {
    font-size: 15px;
    color: var(--muted);
    line-height: 1.7;
    margin: 0;
  }

  /* ── Highlight box ── */
  .hcd-highlight {
    background: var(--ink);
    color: #fff;
    border-radius: 14px;
    padding: 40px 44px;
    margin: 48px 0;
    position: relative;
    overflow: hidden;
  }
  .hcd-highlight::before {
    content: '';
    position: absolute;
    top: -40px; right: -40px;
    width: 180px; height: 180px;
    border-radius: 50%;
    background: rgba(196,80,26,0.15);
  }
  .hcd-highlight h3 {
    font-family: 'Playfair Display', serif;
    font-size: 24px;
    font-weight: 700;
    color: #fff;
    margin-bottom: 16px;
    position: relative;
  }
  .hcd-highlight p {
    font-size: 16px;
    color: rgba(255,255,255,0.72);
    line-height: 1.7;
    margin: 0;
    position: relative;
  }

  /* ── Case study ── */
  .hcd-case {
    border: 1px solid var(--border);
    border-radius: 12px;
    overflow: hidden;
    margin: 36px 0;
  }
  .hcd-case-header {
    background: var(--slate);
    padding: 16px 24px;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .hcd-case-badge {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--gold);
    border: 1px solid var(--gold);
    border-radius: 100px;
    padding: 3px 10px;
  }
  .hcd-case-title-text { font-size: 14px; font-weight: 500; color: #fff; }
  .hcd-case-body { padding: 24px 28px; background: var(--surface); }
  .hcd-case-body p { font-size: 15px; color: var(--muted); margin-bottom: 14px; line-height: 1.65; }
  .hcd-case-body p:last-child { margin-bottom: 0; }

  /* ── Inline note ── */
  .hcd-note {
    display: flex;
    gap: 12px;
    align-items: flex-start;
    background: rgba(212,168,83,0.08);
    border-left: 3px solid var(--gold);
    border-radius: 0 8px 8px 0;
    padding: 16px 20px;
    margin: 28px 0;
    font-size: 14px;
    color: var(--slate);
    line-height: 1.6;
  }

  /* ── Visual banner ── */
  .hcd-banner {
    background: linear-gradient(135deg, var(--slate) 0%, #1A1714 100%);
    border-radius: 14px;
    padding: 44px 40px;
    margin: 48px 0;
  }
  .hcd-banner-title {
    font-family: 'Playfair Display', serif;
    font-size: 22px;
    color: #fff;
    font-weight: 700;
    margin-bottom: 24px;
  }
  .hcd-banner-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }
  .hcd-banner-item {
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 10px;
    padding: 20px;
  }
  .hcd-banner-num {
    font-family: 'Playfair Display', serif;
    font-size: 22px;
    font-weight: 700;
    color: var(--gold);
    margin-bottom: 8px;
  }
  .hcd-banner-label { font-size: 12px; color: rgba(255,255,255,0.55); line-height: 1.5; }

  /* ── Footer ── */
  .hcd-footer {
    margin-top: 80px;
    padding-top: 32px;
    border-top: 1px solid var(--border);
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 16px;
  }
  .hcd-footer-text {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    color: var(--muted);
    letter-spacing: 0.08em;
  }
  .hcd-back-btn {
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 500;
    background: var(--rust);
    color: #fff;
    border: none;
    border-radius: 8px;
    padding: 10px 22px;
    cursor: pointer;
    transition: opacity 0.2s;
  }
  .hcd-back-btn:hover { opacity: 0.85; }

  /* ── Responsive ── */
  @media (max-width: 900px) {
    .hcd-toc-wrap { display: none; }
    .hcd-outer { padding: 0 20px; }
  }
  @media (max-width: 560px) {
    .hcd-stat-row { grid-template-columns: 1fr; }
    .hcd-banner-grid { grid-template-columns: 1fr; }
    .hcd-principle-grid { grid-template-columns: 1fr; }
    .hcd-highlight { padding: 28px 24px; }
    .hcd-h1 { font-size: 34px; }
  }
`;

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const TOC = [
  { id: "s1",  label: "What HCD Actually Means" },
  { id: "s2",  label: "The Seismic Shift in UI/UX" },
  { id: "s3",  label: "Six Principles for AI-Era HCD" },
  { id: "s4",  label: "Designing for Trust" },
  { id: "s5",  label: "The New UX Research Imperative" },
  { id: "s6",  label: "Conversational UI" },
  { id: "s7",  label: "Ethics as Design Practice" },
  { id: "s8",  label: "The Paradox of Personalization" },
  { id: "s9",  label: "Accessibility in AI" },
  { id: "s10", label: "The Future of the Designer's Role" },
  { id: "s11", label: "Where Do We Go From Here?" },
];

const PRINCIPLES = [
  {
    num: "01", title: "Radical Transparency",
    desc: "Users must always know when they are interacting with AI, what data informs it, and how certain it is in its outputs.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="#C4501A" strokeWidth="1.5"/>
        <path d="M12 8v4l3 3" stroke="#C4501A" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    num: "02", title: "Graceful Uncertainty",
    desc: "Design for when the AI doesn't know. Confidence levels, hedging language, and fallback paths are first-class design elements.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 3l9 4.5v9L12 21l-9-4.5v-9L12 3z" stroke="#C4501A" strokeWidth="1.5"/>
        <path d="M12 12L3 7.5M12 12v9M12 12l9-4.5" stroke="#C4501A" strokeWidth="1.5"/>
      </svg>
    ),
  },
  {
    num: "03", title: "Human Override",
    desc: "No AI decision should be final. Every consequential action must have a clear, accessible path for human review and reversal.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M20 7H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z" stroke="#C4501A" strokeWidth="1.5"/>
        <path d="M12 11v2M8 11v2M16 11v2" stroke="#C4501A" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    num: "04", title: "Inclusive by Default",
    desc: "AI systems trained on biased data produce biased outputs. HCD demands active auditing, diverse testing, and equity-first evaluation.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="9" cy="9" r="4" stroke="#C4501A" strokeWidth="1.5"/>
        <circle cx="15" cy="15" r="4" stroke="#C4501A" strokeWidth="1.5"/>
      </svg>
    ),
  },
  {
    num: "05", title: "Consent Architecture",
    desc: "Personalization requires data. Design consent flows that are honest, reversible, and never obscured by dark patterns.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#C4501A" strokeWidth="1.5"/>
      </svg>
    ),
  },
  {
    num: "06", title: "Contextual Empathy",
    desc: "AI adapts to context, but empathy must be deliberately designed — not assumed. Interfaces must respond to emotional cues, not just input data.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="#C4501A" strokeWidth="1.5"/>
      </svg>
    ),
  },
];

const STATS = [
  { num: "73%", label: "of users report confusion when AI behaves unexpectedly in interfaces" },
  { num: "4×",  label: "more likely to abandon a product after an inexplicable AI failure" },
  { num: "89%", label: "want to understand why AI made a decision that affected them" },
];

const TABLE_ROWS = [
  ["Outputs",              "Fixed, deterministic",           "Probabilistic, generative"],
  ["Error states",         "Predictable and enumerable",     "Emergent, often surprising"],
  ["User mental model",    "Stable, learnable",              "Shifting, requires recalibration"],
  ["Trust mechanism",      "Consistency and clarity",        "Transparency and explainability"],
  ["Designer's control",   "High — every state designed",   "Partial — outputs are emergent"],
  ["Personalization",      "Rule-based segments",            "Continuous, individual adaptation"],
  ["Testing approach",     "Finite test cases",              "Adversarial + probabilistic testing"],
];

const STEPS = [
  {
    title: "Mental Model Elicitation",
    body: "Before users interact with an AI feature, interview them about what they believe the AI can and cannot do. After interaction, revisit those beliefs. Gaps between expectation and reality are your most important design signals — they reveal where the interface fails to communicate the system's actual capabilities or limitations.",
  },
  {
    title: "Longitudinal Trust Studies",
    body: "Observe users over weeks or months, not just single sessions. Trust in AI systems evolves dramatically over time — initial enthusiasm gives way to frustration, then calibrated use, then habitual over- or under-reliance. Design interventions must account for this arc, not just the first-time experience.",
  },
  {
    title: "Adversarial User Testing",
    body: "Intentionally expose the AI to edge cases, contradictory inputs, and hostile queries in user sessions. Study how users react when the system fails, hallucinates, or contradicts itself. The quality of failure-mode UX is arguably more important than the quality of success-mode UX, because failures are unpredictable and their consequences are disproportionate.",
  },
  {
    title: "Bias Auditing with Diverse Panels",
    body: "Convene research panels that deliberately include users from marginalized, underrepresented, or non-Western contexts. AI systems trained on majority-culture data fail these users in ways that standard user testing panels — themselves often skewed toward tech-literate, educated, English-speaking participants — will never surface.",
  },
  {
    title: "Emotional Response Mapping",
    body: "Use qualitative methods — diary studies, emotion cards, contextual interviews — to map how users feel when AI systems make decisions that affect them. Surprise, unease, relief, distrust: these emotional responses are primary design data. An AI that produces technically correct outputs but generates persistent unease has a serious UX problem that analytics alone will never reveal.",
  },
];

/* ─────────────────────────────────────────────
   HOOKS
───────────────────────────────────────────── */
function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const scrolled = el.scrollTop || document.body.scrollTop;
      const total = el.scrollHeight - el.clientHeight;
      setProgress(total ? (scrolled / total) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return progress;
}

function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const observers = ids.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id); },
        { rootMargin: "-20% 0px -70% 0px" }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((o) => o && o.disconnect());
  }, [ids]);
  return active;
}

function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) el.classList.add("hcd-visible"); },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

/* ─────────────────────────────────────────────
   SMALL COMPONENTS
───────────────────────────────────────────── */
function Reveal({ children, style }) {
  const ref = useReveal();
  return <div ref={ref} className="hcd-reveal" style={style}>{children}</div>;
}

function SectionMarker({ num, title, id }) {
  return (
    <Reveal>
      <div id={id} className="hcd-section-marker">
        <span className="num">{num}</span>
        <div className="line" />
        <h2 className="hcd-h2">{title}</h2>
      </div>
    </Reveal>
  );
}

function PullQuote({ children, attr }) {
  return (
    <Reveal>
      <div className="hcd-pull">
        <p>{children}</p>
        {attr && <span className="attr">{attr}</span>}
      </div>
    </Reveal>
  );
}

function Callout({ title, items }) {
  return (
    <Reveal>
      <div className="hcd-callout">
        <div className="hcd-callout-title">{title}</div>
        <ul>{items.map((item, i) => <li key={i}>{item}</li>)}</ul>
      </div>
    </Reveal>
  );
}

function InlineNote({ children }) {
  return (
    <Reveal>
      <div className="hcd-note">{children}</div>
    </Reveal>
  );
}

function CaseStudy({ badge, title, children }) {
  return (
    <Reveal>
      <div className="hcd-case">
        <div className="hcd-case-header">
          <span className="hcd-case-badge">{badge}</span>
          <span className="hcd-case-title-text">{title}</span>
        </div>
        <div className="hcd-case-body">{children}</div>
      </div>
    </Reveal>
  );
}

function P({ children }) {
  return <p className="hcd-p">{children}</p>;
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
export default function HumanCenteredDesignBlog() {
  const progress = useScrollProgress();
  const activeSection = useActiveSection(TOC.map((t) => t.id));

  // Inject global CSS once
  useEffect(() => {
    const id = "hcd-global-styles";
    if (!document.getElementById(id)) {
      const style = document.createElement("style");
      style.id = id;
      style.textContent = GLOBAL_CSS;
      document.head.appendChild(style);
    }
    return () => {
      // optionally clean up: document.getElementById(id)?.remove();
    };
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="hcd-blog">
      {/* Reading progress */}
      <div className="hcd-progress" style={{ width: `${progress}%` }} />

      <div className="hcd-outer">
        {/* ── Sticky TOC ── */}
        <aside className="hcd-toc-wrap">
          <nav className="hcd-toc">
            <div className="hcd-toc-title">Contents</div>
            {TOC.map((item) => (
              <button
                key={item.id}
                className={`hcd-toc-item${activeSection === item.id ? " active" : ""}`}
                onClick={() => scrollTo(item.id)}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* ── Main content ── */}
        <main className="hcd-main">

          {/* HERO */}
          <header className="hcd-hero">
            <div className="hcd-eyebrow">UX &amp; Design Thinking · AI Era</div>
            <h1 className="hcd-h1">
              Human-Centered Design<br />in the <em>Age of AI</em>
            </h1>
            <p className="hcd-hero-sub">
              As artificial intelligence reshapes every pixel of our digital interfaces, one discipline has never
              mattered more — designing for real people, with genuine empathy, in a world now co-authored by machines.
            </p>
            <div className="hcd-meta-row">
              {["May 2026", "22 min read", "Deep Dive"].map((m) => (
                <span key={m} className="hcd-meta-pill">
                  <span className="hcd-dot" /> {m}
                </span>
              ))}
            </div>
            <div className="hcd-tags">
              {["UI/UX", "AI Design", "HCD", "Product Thinking", "Ethics"].map((t) => (
                <span key={t} className="hcd-tag">{t}</span>
              ))}
            </div>
          </header>

          {/* INTRO */}
          <Reveal>
            <P>
              We are living through one of the most consequential transitions in the history of product design.
              Every assumption we held about how users interact with software — clicking buttons, following flows,
              reading menus — is being rapidly dismantled by artificial intelligence. Natural language is the new
              interface. Prediction is the new navigation. And yet, amid this technological revolution, the most
              dangerous mistake a designer can make is to let the machine lead.
            </P>
            <P>
              <strong>Human-Centered Design (HCD)</strong> was never just a methodology. It was a declaration:
              that the needs, emotions, limitations, and aspirations of real human beings must sit at the center
              of every design decision. In the AI era, that declaration has become more radical, more necessary,
              and more complex than ever before.
            </P>
          </Reveal>

          <PullQuote attr="— Core tenet of Human-Centered Design, 2026">
            "Technology should serve humanity, not the other way around. AI makes this principle more urgent, not less."
          </PullQuote>

          <Reveal>
            <P>
              This is not a post about AI tools for designers. This is an exploration of how the discipline of HCD
              must evolve, stretch, and sometimes resist the tide of automation to keep interfaces genuinely human
              — even when they are built by and for machines.
            </P>
          </Reveal>

          {/* ── SECTION 1 ── */}
          <SectionMarker id="s1" num="01" title="What HCD Actually Means" />
          <Reveal>
            <P>
              Human-Centered Design is a philosophy and a process. Coined and popularized by IDEO and the Stanford
              d.school, it begins with a deceptively simple commitment: <strong>understand people deeply before
              solving for them</strong>. Not users. People. The difference is significant. A "user" is an abstraction
              — an avatar clicking through your funnel. A person has fears, distractions, bad days, and brilliant
              workarounds your analytics will never show you.
            </P>
            <P>
              The original HCD framework rested on three pillars: desirability (what do people want?), feasibility
              (what is technically possible?), and viability (what works as a business?). In the AI era, a fourth
              pillar has emerged — <strong>accountability</strong>: what happens when the system gets it wrong, and
              who bears responsibility?
            </P>
          </Reveal>
          <Callout
            title="The four pillars of modern HCD"
            items={[
              "Desirability — Does this genuinely serve human needs, goals, and emotions?",
              "Feasibility — Can it be built reliably and maintained over time?",
              "Viability — Does it sustain the organization that makes it?",
              "Accountability — When AI fails or harms, who answers for it?",
            ]}
          />
          <Reveal>
            <P>
              HCD is not a process you apply once. It is an ongoing orientation — a recurring question asked at
              every stage of product development: <em>have we actually talked to the people who will use this?</em>{" "}
              In the AI era, that question is asked in an entirely new context, where the product itself may change
              its behavior based on what it learns, often in ways designers never directly programmed.
            </P>
          </Reveal>

          {/* ── SECTION 2 ── */}
          <SectionMarker id="s2" num="02" title="The Seismic Shift in UI/UX" />
          <Reveal>
            <P>
              Let's be precise about what has changed. Traditional UI/UX design operated on a deterministic model:
              a user clicks button A, action B occurs. Designers could exhaustively map every state, every edge case,
              every transition. The interface was, at its core, a finite state machine.
            </P>
            <P>
              AI-powered interfaces break this model entirely. A conversational AI assistant does not have a fixed
              set of responses. A recommendation engine does not have a predetermined list of results. A generative
              UI that adapts itself based on usage patterns does not have a single layout.{" "}
              <strong>The interface is now probabilistic.</strong> It can produce infinite outputs from any given input.
            </P>
          </Reveal>

          <Reveal>
            <div className="hcd-stat-row">
              {STATS.map((s) => (
                <div key={s.num} className="hcd-stat-card">
                  <div className="hcd-stat-num">{s.num}</div>
                  <div className="hcd-stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal>
            <P>
              This creates profound new challenges for UX. How do you design for a system that can say anything?
              How do you write error states for an AI that may fail in ways you have never anticipated? How do you
              set user expectations for a product that learns and changes over time? These questions have no clean
              answers — they require a new vocabulary of design.
            </P>
          </Reveal>

          <Reveal>
            <div className="hcd-table-wrap">
              <table className="hcd-table">
                <thead>
                  <tr>
                    <th>Dimension</th>
                    <th>Traditional UI/UX</th>
                    <th>AI-Native UI/UX</th>
                  </tr>
                </thead>
                <tbody>
                  {TABLE_ROWS.map(([dim, trad, ai]) => (
                    <tr key={dim}>
                      <td>{dim}</td>
                      <td>{trad}</td>
                      <td>{ai}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>

          {/* ── SECTION 3 ── */}
          <SectionMarker id="s3" num="03" title="Six Principles for AI-Era HCD" />
          <Reveal>
            <P>
              What follows is not a framework to be applied mechanically, but a set of design principles that emerge
              from deep user research, ethical reflection, and the hard-won lessons of building AI products at scale.
            </P>
          </Reveal>
          <Reveal>
            <div className="hcd-principle-grid">
              {PRINCIPLES.map((p) => (
                <div key={p.num} className="hcd-principle-card">
                  <div className="hcd-p-num">{p.num}</div>
                  <div style={{ marginBottom: 10 }}>{p.icon}</div>
                  <h3>{p.title}</h3>
                  <p>{p.desc}</p>
                </div>
              ))}
            </div>
          </Reveal>

          {/* ── SECTION 4 ── */}
          <SectionMarker id="s4" num="04" title="Designing for Trust in AI Interfaces" />
          <Reveal>
            <P>
              Trust is the primary UX challenge of the AI era. It is also the most fragile. Users who trust an AI
              system too much become dangerously dependent on it. Users who trust it too little won't engage
              meaningfully. The designer's job is to calibrate trust — to help users form accurate mental models
              of what the system can and cannot do.
            </P>
            <P>
              This is an entirely new interaction design problem. In traditional interfaces, trust came from
              consistency. A button that always does the same thing earns trust through repetition. In AI interfaces,
              consistency is not guaranteed. Trust must therefore come from transparency and from the quality of
              uncertainty communication.
            </P>
          </Reveal>

          <PullQuote>
            "The interface is the trust layer between the algorithm and the human. If designers abdicate this
            responsibility, no one else will take it."
          </PullQuote>

          <Reveal>
            <P>
              <strong>Calibrated confidence displays</strong> are one of the most underused tools in AI UX design.
              When an AI system generates a recommendation, diagnosis, or prediction, how certain is it? Most
              interfaces communicate AI outputs as if they were ground truth. A well-designed HCD-aligned interface
              displays confidence levels, cites the basis of a recommendation, and makes clear what information was
              and was not considered.
            </P>
          </Reveal>

          <Callout
            title="Trust-building UI patterns for AI products"
            items={[
              "Source attribution — show where the AI got its information",
              "Confidence indicators — visual cues that distinguish certain from uncertain outputs",
              "Explanation affordances — 'Why did AI recommend this?' accessible at all times",
              "Error acknowledgment — design honest failure states, not generic 'something went wrong'",
              "Audit trails — let users see a history of AI decisions that affected them",
              "Correction flows — simple, low-friction ways to tell the AI it was wrong",
            ]}
          />

          <Reveal>
            <P>
              The irony of AI UX is that the most powerful systems require the most humble interfaces. The more
              capable the AI, the more important it is to design affordances that help users understand its limits.
              Overconfident interfaces breed catastrophic errors — medical misdiagnoses accepted without question,
              financial advice followed blindly, legal arguments trusted without verification.
            </P>
          </Reveal>

          <CaseStudy badge="Case Study" title="Healthcare AI: Diagnostic Assistance Tools">
            <P>
              When major hospital systems began deploying AI diagnostic assistants in 2023–2025, early interfaces
              presented AI findings with the same visual weight as physician notes. Clinicians reported over-reliance
              on AI outputs, reduced independent evaluation, and difficulty questioning recommendations that felt
              "official."
            </P>
            <P>
              Redesigned interfaces introduced explicit uncertainty ranges, color-coded confidence levels, and
              mandatory "physician review required" friction steps before AI recommendations could be acted upon.
              Crucially, they surfaced the differential diagnosis list the AI considered and rejected, making its
              reasoning visible rather than opaque.
            </P>
            <P>
              The result: physician overrides increased 34%, catching AI errors earlier. Paradoxically, this
              increased long-term trust in the system, because clinicians felt like genuine collaborators rather
              than rubber-stampers.
            </P>
          </CaseStudy>

          {/* ── SECTION 5 ── */}
          <SectionMarker id="s5" num="05" title="The New UX Research Imperative" />
          <Reveal>
            <P>
              HCD has always been grounded in research — in observing, listening to, and learning from actual people.
              In the AI era, this research mandate has expanded dramatically. Designers must now study not just how
              users interact with interfaces, but how they form beliefs about AI systems, how those beliefs change
              over time, and how errors in AI outputs propagate into user behavior.
            </P>
            <P>
              Traditional usability testing — watch someone complete a task, observe where they struggle — remains
              essential but insufficient. AI interfaces require new research methodologies:
            </P>
          </Reveal>

          <Reveal>
            <ul className="hcd-steps">
              {STEPS.map((s, i) => (
                <li key={i} className="hcd-step">
                  <div className="hcd-step-left">
                    <div className="hcd-step-circle">{i + 1}</div>
                    {i < STEPS.length - 1 && <div className="hcd-step-line" />}
                  </div>
                  <div className="hcd-step-body">
                    <h3>{s.title}</h3>
                    <p>{s.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>

          {/* ── SECTION 6 ── */}
          <SectionMarker id="s6" num="06" title="Conversational UI: The New Frontier" />
          <Reveal>
            <P>
              The rise of large language models has made conversational interfaces — chatbots, AI assistants, voice
              interfaces — the dominant new interaction paradigm. And conversational UI is, in many ways, the most
              complex UX challenge the field has ever faced. Language is infinitely rich, deeply ambiguous,
              emotionally loaded, and culturally situated. Designing a good conversational experience means designing
              for all of that.
            </P>
            <P>
              The first generation of chatbot design was largely reactive: build the bot, watch it fail, patch the
              failures. The HCD approach is fundamentally different. It begins with understanding the conversations
              users are actually trying to have — not just the tasks they want to complete, but the context they
              are in when they try to complete them, the emotional state they are in, and the social context of the
              conversation itself.
            </P>
          </Reveal>

          <InlineNote>
            A person asking a healthcare chatbot about medication dosage at 2am is in a radically different context
            than someone doing so during a routine check-up. The interface must be designed for both — not just the
            happy path.
          </InlineNote>

          <Reveal>
            <P>
              Conversational UX demands what linguists call <strong>pragmatic competence</strong> — an understanding
              of implication, context, and social convention that goes far beyond the literal content of words. When
              a user says "I'm not sure this is right," they may be asking the AI to double-check a fact, expressing
              general unease, or signaling that they want the conversation to end. The interface must handle all of
              these possibilities gracefully.
            </P>
          </Reveal>

          <Reveal>
            <div className="hcd-highlight">
              <h3>The Conversational Design Triad</h3>
              <p>
                Every conversational AI interface must balance three competing forces:{" "}
                <strong style={{ color: "#fff" }}>efficiency</strong> (getting to the answer fast),{" "}
                <strong style={{ color: "#fff" }}>comprehensiveness</strong> (covering all relevant nuance and context),
                and <strong style={{ color: "#fff" }}>emotional safety</strong> (never making the user feel judged,
                stupid, or trapped). These forces are often in direct tension, and navigating that tension is the core
                creative challenge of conversational UI design.
              </p>
            </div>
          </Reveal>

          <Reveal>
            <P>
              Key conversational UX principles include: designing graceful recovery from misunderstanding (a
              conversational dead end is far more frustrating than a 404 page); building clear escalation paths to
              human agents; ensuring the AI never implies it is infallible; and writing system prompts and default
              behaviors that reflect genuine care for user wellbeing, not just task completion.
            </P>
          </Reveal>

          {/* ── SECTION 7 ── */}
          <SectionMarker id="s7" num="07" title="Ethics as Design Practice" />
          <Reveal>
            <P>
              HCD has always had an ethical dimension — designing for marginalized users, avoiding manipulative dark
              patterns, ensuring accessibility. In the AI era, these ethical questions have become central and
              structural, not peripheral add-ons. An AI system that perpetuates racial bias, enables surveillance, or
              nudges users toward harmful behaviors is not a neutral tool with a few rough edges. It is an active harm
              at scale.
            </P>
            <P>
              For UI/UX designers, this is both a professional responsibility and a strategic opportunity. Design is
              the primary site where ethical choices about AI systems become visible — or are hidden — from users.
              Every interface element is an ethical decision: what information to surface, what to obscure, what
              affordances to provide for user control, how to communicate risk.
            </P>
          </Reveal>

          <Callout
            title="Ethical design checklist for AI features"
            items={[
              "Have we disclosed that this feature uses AI to users, clearly and upfront?",
              "Can users opt out of AI personalization without losing access to core functionality?",
              "Have we tested this feature with users across different demographics, languages, and ability levels?",
              "Does the interface make it easy to understand and contest AI decisions?",
              "Are we using dark patterns to hide data collection or make consent difficult?",
              "Have we modeled the worst-case misuse of this interface and designed mitigations?",
              "Is there a human review process for high-stakes AI outputs?",
            ]}
          />

          <Reveal>
            <P>
              One of the most important — and most neglected — ethical design problems is{" "}
              <strong>automation bias</strong>: the well-documented human tendency to over-trust automated systems,
              particularly when presented with confidence. Interfaces that present AI outputs without friction,
              without uncertainty communication, and without obvious correction paths actively induce automation bias.
              This is a design failure, not a user failure.
            </P>
          </Reveal>

          <CaseStudy badge="Case Study" title="Hiring AI: When Algorithms Screen People">
            <P>
              AI-powered resume screening tools were widely adopted between 2019 and 2024, often with minimal UX
              consideration for either candidates or hiring managers. Candidates had no insight into why they were
              rejected. Hiring managers received ranked lists with confidence scores but no explanation of the
              underlying criteria.
            </P>
            <P>
              HCD-led redesigns at several major platforms introduced candidate-facing feedback interfaces — not just
              "you were not selected" but "here are the three criteria our system weighted most heavily and how your
              application compared." For hiring managers, redesigned dashboards surfaced demographic distribution of
              screened candidates and flagged potential bias patterns.
            </P>
            <P>
              These changes did not make the AI more accurate. But they made the consequences of its decisions legible
              and contestable — which is the minimum viable ethical standard for AI systems that make life-affecting
              decisions about people.
            </P>
          </CaseStudy>

          {/* ── SECTION 8 ── */}
          <SectionMarker id="s8" num="08" title="The Paradox of Personalization" />
          <Reveal>
            <P>
              Personalization is AI's most seductive promise to UX designers: a perfect interface, optimized for each
              individual user, adapting in real time to their preferences, context, and needs. It is also, from an HCD
              perspective, one of the most complex and risky capabilities we have ever deployed at scale.
            </P>
            <P>
              The problem is not personalization itself — it is unconstrained, invisible personalization. When users
              do not know their interface is being personalized, they cannot interrogate the assumptions embedded in
              it. They cannot notice when their information environment is being narrowed. They cannot identify when
              preferences inferred from past behavior are actively shaping — and potentially limiting — their present
              choices.
            </P>
          </Reveal>

          <Reveal>
            <div className="hcd-banner">
              <div className="hcd-banner-title">The Personalization Spectrum</div>
              <div className="hcd-banner-grid">
                {[
                  {
                    label: "Explicit",
                    desc: "User actively sets preferences. Full transparency and control. Highest trust, lowest serendipity.",
                  },
                  {
                    label: "Collaborative",
                    desc: "AI suggests, user confirms. Shared agency. The HCD sweet spot for most contexts.",
                  },
                  {
                    label: "Implicit",
                    desc: "AI infers and applies without disclosure. Efficient, but ethically fraught without robust oversight.",
                  },
                ].map((item) => (
                  <div key={item.label} className="hcd-banner-item">
                    <div className="hcd-banner-num">{item.label}</div>
                    <div className="hcd-banner-label">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal>
            <P>
              HCD-aligned personalization design operates at the collaborative end of this spectrum. Users are shown
              what the system has inferred about them. They can correct those inferences. They can see how their
              recommendations would differ under different preference settings. They have genuine agency over the
              personalization engine, not just a binary on/off switch buried in settings.
            </P>
            <P>
              This is technically harder to build. It requires design investment in preference visualization,
              inference transparency, and correction flows that most product teams deprioritize. But it is the only
              form of personalization that genuinely respects user autonomy — which is, ultimately, the heart of HCD.
            </P>
          </Reveal>

          {/* ── SECTION 9 ── */}
          <SectionMarker id="s9" num="09" title="Accessibility in the AI Interface" />
          <Reveal>
            <P>
              Accessibility is not an add-on feature. It is the purest expression of human-centered thinking —
              designing for the full range of human bodies, minds, and circumstances, not just the idealized,
              able-bodied, neurotypical, high-bandwidth user that technology products have historically assumed. In
              the AI era, accessibility has both gained new possibilities and introduced new risks.
            </P>
            <P>
              On the possibility side: AI-powered interfaces offer genuinely transformative accessibility features.
              Real-time speech-to-text enables text input for users who cannot type. AI image description makes
              visual interfaces navigable for blind users in ways that manual alt-text never could at scale. Adaptive
              interfaces that learn individual users' interaction patterns can reduce the cognitive load of complex
              software for users with ADHD or processing differences.
            </P>
          </Reveal>

          <Callout
            title="AI accessibility opportunities & risks"
            items={[
              "Real-time captioning and transcription for deaf and hard-of-hearing users — transformative at scale",
              "AI-generated image descriptions that exceed manual alt-text coverage significantly",
              "Adaptive reading level adjustment for users with cognitive differences",
              "Risk: AI trained without disability community input will replicate ableist assumptions at scale",
              "Risk: Conversational UI that assumes vocal interaction excludes non-speaking users",
              "Risk: Personalization that 'learns' around a disability may entrench rather than support",
            ]}
          />

          <Reveal>
            <P>
              On the risk side: if AI systems are trained without diverse, disability-inclusive datasets, they will
              encode existing accessibility failures at unprecedented scale. A voice recognition system that struggles
              with non-standard speech patterns — including those of many disabled users — is not a neutral limitation.
              It is a design failure that compounds existing disadvantage. HCD demands that accessibility be built into
              AI training and evaluation, not retrofitted as a UI feature.
            </P>
          </Reveal>

          {/* ── SECTION 10 ── */}
          <SectionMarker id="s10" num="10" title="The Future of the Designer's Role" />
          <Reveal>
            <P>
              There is a persistent anxiety in the design community about AI's role in the design process itself.
              Generative AI can now produce UI mockups, write microcopy, conduct automated usability analyses, and
              suggest color palettes. If machines can do these things, what is the designer for?
            </P>
            <P>
              The answer, from an HCD perspective, is clarifying: the designer's irreducible role is{" "}
              <strong>judgment</strong> — the ability to ask whether a design serves human values, not just business
              metrics or aesthetic conventions. AI can generate a thousand interface variants. Only a human designer
              — embedded in culture, attuned to emotion, accountable to real users — can determine which of those
              variants is genuinely right.
            </P>
            <P>
              In practice, the designer's role is evolving in three directions simultaneously:{" "}
              <strong>upward</strong> into strategy and ethics, becoming the person who asks "should we build this?"
              before "how do we build this?"; <strong>outward</strong> into community, becoming the bridge between
              technical teams and the diverse populations they serve; and <strong>deeper</strong> into craft,
              developing new skills in AI behavior design, uncertainty communication, and the design of systems that
              can fail gracefully.
            </P>
          </Reveal>

          <PullQuote>
            "The designer of the AI era is not an artisan of pixels. They are a steward of human dignity in the machine age."
          </PullQuote>

          <Reveal>
            <P>
              This is, genuinely, a harder job than it was a decade ago. The stakes are higher, the systems are more
              complex, the ethical terrain is more contested. But it is also a more important job than it has ever
              been. When billions of people interact with AI systems daily, the quality of those interfaces is not
              just a UX metric — it is a civilization-scale question about what relationship between humans and
              machines we collectively choose to build.
            </P>
          </Reveal>

          {/* ── CLOSING ── */}
          <SectionMarker id="s11" num="↓" title="Where Do We Go From Here?" />
          <Reveal>
            <P>
              Human-Centered Design in the AI era is not about resisting technology. It is about insisting that
              technology, no matter how powerful, remains a tool in service of human flourishing. It is about asking,
              at every stage, with every feature, for every user:{" "}
              <em>does this actually serve people?</em>
            </P>
            <P>
              The path forward requires designers who are technically literate enough to understand what AI systems
              are actually doing — not just their surface outputs but their underlying mechanisms, their training data,
              their failure modes. It requires research practices sophisticated enough to surface what quantitative
              data cannot show. And it requires an ethical seriousness that matches the genuine stakes of designing
              systems that will shape how billions of people understand the world, make decisions, and relate to one
              another.
            </P>
            <P>
              The AI era will produce interfaces of astonishing capability. The question HCD poses — the only
              question that ultimately matters — is whether they will be interfaces of genuine human benefit. That
              answer is not written in the algorithm. It is written in the design.
            </P>
          </Reveal>

          {/* FOOTER */}
          <Reveal>
            <div className="hcd-footer">
              <span className="hcd-footer-text">Design &amp; AI · May 2026</span>
              <button className="hcd-back-btn" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                Back to top ↑
              </button>
            </div>
          </Reveal>

        </main>
      </div>
    </div>
  );
}
