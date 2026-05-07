import { useEffect, useRef, useState, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════════
   GLOBAL CSS
   Aesthetic: Warm literary editorial · paper texture · typewriter soul
   Fonts: Libre Baskerville (display) + Fira Code (body/mono)
   Palette: Parchment · Forest green · Terracotta · Charcoal ink
═══════════════════════════════════════════════════════════════ */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Fira+Code:wght@300;400;500&family=Lato:wght@300;400;700&display=swap');

  :root {
    --parchment:  #F5F0E8;
    --parchment2: #EDE7D9;
    --ink:        #1C1C1A;
    --ink-soft:   #3A3A36;
    --forest:     #2D5016;
    --forest-lt:  #3D6B1F;
    --terra:      #B84A2E;
    --gold:       #C8963C;
    --muted:      #8A8578;
    --border:     rgba(28,28,26,0.12);
    --border2:    rgba(28,28,26,0.07);
    --surface:    #FDFAF4;
  }

  .pai * { box-sizing: border-box; margin: 0; padding: 0; }

  .pai {
    font-family: 'Fira Code', monospace;
    background: var(--parchment);
    color: var(--ink);
    font-size: 15px;
    line-height: 1.85;
    -webkit-font-smoothing: antialiased;
    position: relative;
  }

  /* paper texture */
  .pai::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image:
      repeating-linear-gradient(
        0deg,
        transparent,
        transparent 27px,
        rgba(28,28,26,0.025) 27px,
        rgba(28,28,26,0.025) 28px
      );
    pointer-events: none;
    z-index: 0;
  }

  /* ── Progress bar ── */
  .pai-progress {
    position: fixed;
    top: 0; left: 0;
    height: 3px;
    background: var(--forest);
    z-index: 1000;
    transition: width 0.08s linear;
    border-radius: 0 2px 2px 0;
  }

  /* ── Reveal ── */
  .pai-reveal {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.65s cubic-bezier(0.22,1,0.36,1),
                transform 0.65s cubic-bezier(0.22,1,0.36,1);
    position: relative;
    z-index: 1;
  }
  .pai-reveal.pai-visible { opacity: 1; transform: translateY(0); }

  /* ── Shell ── */
  .pai-shell {
    max-width: 1080px;
    margin: 0 auto;
    padding: 0 40px;
    display: grid;
    grid-template-columns: 180px 1fr;
    gap: 64px;
  }

  /* ── TOC ── */
  .pai-toc-col {
    position: sticky;
    top: 64px;
    padding-top: 64px;
    align-self: flex-start;
  }
  .pai-toc-eyebrow {
    font-size: 9px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 16px;
    font-family: 'Fira Code', monospace;
  }
  .pai-toc-list { list-style: none; border-left: 2px solid var(--border); padding-left: 16px; }
  .pai-toc-btn {
    display: block;
    width: 100%;
    text-align: left;
    background: none;
    border: none;
    font-family: 'Fira Code', monospace;
    font-size: 11px;
    font-weight: 300;
    color: var(--muted);
    padding: 5px 0;
    cursor: pointer;
    line-height: 1.4;
    transition: color 0.2s;
  }
  .pai-toc-btn:hover { color: var(--ink-soft); }
  .pai-toc-btn.active { color: var(--forest); font-weight: 500; }

  /* ── Main ── */
  .pai-main { min-width: 0; padding-bottom: 96px; position: relative; z-index: 1; }

  /* ══ HERO ══ */
  .pai-hero {
    padding: 64px 0 48px;
    border-bottom: 2px solid var(--border);
    margin-bottom: 64px;
  }
  .pai-eyebrow {
    font-family: 'Fira Code', monospace;
    font-size: 10px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--forest);
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .pai-eyebrow::before {
    content: '§';
    font-size: 16px;
    opacity: 0.5;
  }
  .pai-h1 {
    font-family: 'Libre Baskerville', serif;
    font-size: clamp(36px, 5.5vw, 64px);
    font-weight: 700;
    line-height: 1.1;
    letter-spacing: -0.025em;
    color: var(--ink);
    margin-bottom: 12px;
  }
  .pai-h1 em {
    font-style: italic;
    font-weight: 400;
    color: var(--forest);
  }
  .pai-subtitle {
    font-family: 'Libre Baskerville', serif;
    font-size: clamp(16px, 2vw, 20px);
    font-weight: 400;
    font-style: italic;
    color: var(--muted);
    line-height: 1.5;
    margin-bottom: 36px;
    max-width: 560px;
  }
  .pai-meta {
    display: flex; gap: 24px; flex-wrap: wrap; margin-bottom: 24px;
  }
  .pai-meta-item {
    font-size: 10px;
    letter-spacing: 0.1em;
    color: var(--muted);
    display: flex; align-items: center; gap: 7px;
  }
  .pai-meta-pip {
    width: 4px; height: 4px;
    border-radius: 50%;
    background: var(--terra);
    display: inline-block;
  }
  .pai-tags { display: flex; gap: 8px; flex-wrap: wrap; }
  .pai-tag {
    font-size: 9px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    padding: 4px 11px;
    border: 1px solid var(--border);
    border-radius: 2px;
    color: var(--muted);
    font-family: 'Fira Code', monospace;
  }

  /* ══ SECTION MARKER ══ */
  .pai-sec-wrap {
    display: flex;
    align-items: center;
    gap: 18px;
    margin: 60px 0 28px;
  }
  .pai-sec-num {
    font-family: 'Libre Baskerville', serif;
    font-size: 11px;
    font-style: italic;
    color: var(--terra);
    letter-spacing: 0.05em;
    flex-shrink: 0;
    white-space: nowrap;
  }
  .pai-sec-rule { flex: 1; height: 1px; background: var(--border); }
  .pai-h2 {
    font-family: 'Libre Baskerville', serif;
    font-size: clamp(22px, 2.8vw, 32px);
    font-weight: 700;
    color: var(--ink);
    letter-spacing: -0.02em;
    line-height: 1.25;
  }
  .pai-sec-label {
    font-family: 'Fira Code', monospace;
    font-size: 9px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--forest);
    margin-bottom: 8px;
  }

  /* ══ BODY TEXT ══ */
  .pai-p {
    font-family: 'Fira Code', monospace;
    font-size: 14.5px;
    font-weight: 300;
    color: var(--ink-soft);
    line-height: 1.9;
    margin-bottom: 22px;
  }
  .pai-p:last-child { margin-bottom: 0; }
  .pai-p strong { font-weight: 500; color: var(--ink); }
  .pai-p em { font-style: italic; color: var(--ink); }
  .pai-p code {
    font-family: 'Fira Code', monospace;
    font-size: 13px;
    background: rgba(45,80,22,0.08);
    color: var(--forest);
    padding: 2px 7px;
    border-radius: 3px;
    border: 1px solid rgba(45,80,22,0.15);
  }

  /* ══ PULL QUOTE ══ */
  .pai-pull {
    margin: 48px 0;
    padding: 0 0 0 28px;
    border-left: 3px solid var(--forest);
    position: relative;
  }
  .pai-pull-text {
    font-family: 'Libre Baskerville', serif;
    font-size: clamp(18px, 2.4vw, 24px);
    font-style: italic;
    font-weight: 400;
    color: var(--ink);
    line-height: 1.45;
  }
  .pai-pull-attr {
    display: block;
    font-family: 'Fira Code', monospace;
    font-size: 10px;
    letter-spacing: 0.12em;
    color: var(--muted);
    margin-top: 14px;
    text-transform: uppercase;
  }

  /* ══ TYPEWRITER CODE BLOCK ══ */
  .pai-code-block {
    background: var(--ink);
    border-radius: 6px;
    overflow: hidden;
    margin: 32px 0;
    box-shadow: 0 4px 24px rgba(28,28,26,0.12);
  }
  .pai-code-header {
    background: rgba(255,255,255,0.06);
    padding: 10px 18px;
    display: flex;
    align-items: center;
    gap: 10px;
    border-bottom: 1px solid rgba(255,255,255,0.07);
  }
  .pai-code-dot {
    width: 10px; height: 10px;
    border-radius: 50%;
  }
  .pai-code-label {
    font-family: 'Fira Code', monospace;
    font-size: 10px;
    letter-spacing: 0.1em;
    color: rgba(255,255,255,0.35);
    margin-left: 6px;
  }
  .pai-code-body {
    padding: 20px 24px;
    font-family: 'Fira Code', monospace;
    font-size: 13px;
    font-weight: 300;
    line-height: 1.7;
    color: rgba(245,240,232,0.85);
    white-space: pre-wrap;
    word-break: break-word;
  }
  .pai-code-body .c-label { color: #88B04B; font-weight: 500; }
  .pai-code-body .c-key   { color: #E8D44D; }
  .pai-code-body .c-val   { color: #F08080; }
  .pai-code-body .c-com   { color: rgba(245,240,232,0.35); font-style: italic; }
  .pai-code-body .c-good  { color: #88B04B; }
  .pai-code-body .c-bad   { color: #E07070; }

  /* ══ CALLOUT ══ */
  .pai-callout {
    background: var(--surface);
    border: 1px solid var(--border);
    border-left: 3px solid var(--forest);
    border-radius: 0 5px 5px 0;
    padding: 24px 28px;
    margin: 32px 0;
  }
  .pai-callout-title {
    font-family: 'Fira Code', monospace;
    font-size: 9px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--forest);
    margin-bottom: 16px;
    display: flex; align-items: center; gap: 8px;
  }
  .pai-callout-title::before { content: '//'; opacity: 0.6; }
  .pai-callout ul { list-style: none; padding: 0; display: grid; gap: 10px; }
  .pai-callout ul li {
    display: flex; gap: 13px;
    font-family: 'Fira Code', monospace;
    font-size: 13px; font-weight: 300;
    color: var(--ink-soft); line-height: 1.65;
  }
  .pai-callout ul li::before {
    content: '→';
    color: var(--forest); font-size: 12px;
    flex-shrink: 0; margin-top: 2px;
  }

  /* ══ STAT GRID ══ */
  .pai-stats {
    display: grid;
    grid-template-columns: repeat(3,1fr);
    gap: 16px; margin: 32px 0;
  }
  .pai-stat {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 5px;
    padding: 22px 18px;
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  .pai-stat::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 3px;
    background: var(--forest);
    opacity: 0.15;
  }
  .pai-stat-num {
    font-family: 'Libre Baskerville', serif;
    font-size: 40px;
    font-weight: 700;
    color: var(--forest);
    line-height: 1;
    margin-bottom: 8px;
    letter-spacing: -0.02em;
  }
  .pai-stat-label {
    font-family: 'Fira Code', monospace;
    font-size: 11px; font-weight: 300;
    color: var(--muted); line-height: 1.5;
  }

  /* ══ PRINCIPLE CARDS ══ */
  .pai-principles {
    display: grid;
    grid-template-columns: repeat(2,1fr);
    gap: 14px; margin: 32px 0;
  }
  .pai-principle {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 5px;
    padding: 22px 20px;
    transition: border-color 0.25s, transform 0.2s;
  }
  .pai-principle:hover {
    border-color: rgba(45,80,22,0.35);
    transform: translateY(-2px);
  }
  .pai-pr-num {
    font-family: 'Libre Baskerville', serif;
    font-size: 28px; font-weight: 700;
    color: rgba(45,80,22,0.15);
    line-height: 1; margin-bottom: 10px;
  }
  .pai-principle h3 {
    font-family: 'Libre Baskerville', serif;
    font-size: 16px; font-weight: 700;
    color: var(--ink); margin-bottom: 8px; line-height: 1.3;
  }
  .pai-principle p {
    font-family: 'Fira Code', monospace;
    font-size: 12px; font-weight: 300;
    color: var(--muted); line-height: 1.65; margin: 0;
  }

  /* ══ COMPARISON TABLE ══ */
  .pai-table-scroll { overflow-x: auto; margin: 32px 0; }
  .pai-table {
    width: 100%; border-collapse: collapse;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 5px;
    overflow: hidden;
    font-size: 13px;
    min-width: 520px;
  }
  .pai-table thead tr { background: var(--forest); }
  .pai-table thead th {
    font-family: 'Fira Code', monospace;
    font-size: 9px; letter-spacing: 0.18em;
    text-transform: uppercase;
    padding: 13px 18px;
    text-align: left; font-weight: 400; color: rgba(245,240,232,0.85);
  }
  .pai-table tbody tr { border-bottom: 1px solid var(--border2); }
  .pai-table tbody tr:last-child { border-bottom: none; }
  .pai-table tbody tr:nth-child(even) { background: rgba(45,80,22,0.025); }
  .pai-table td {
    padding: 13px 18px; vertical-align: top;
    font-family: 'Fira Code', monospace;
    font-weight: 300; color: var(--ink-soft);
  }
  .pai-table td:first-child { font-weight: 500; color: var(--ink); }
  .pai-table .good { color: var(--forest); }
  .pai-table .bad  { color: var(--terra); }

  /* ══ CASE STUDY ══ */
  .pai-case {
    border: 1px solid var(--border);
    border-radius: 5px; overflow: hidden; margin: 36px 0;
  }
  .pai-case-head {
    background: var(--ink);
    padding: 14px 22px;
    display: flex; align-items: center; gap: 13px;
  }
  .pai-case-badge {
    font-family: 'Fira Code', monospace;
    font-size: 9px; letter-spacing: 0.16em; text-transform: uppercase;
    color: var(--gold);
    border: 1px solid rgba(200,150,60,0.4);
    border-radius: 2px; padding: 3px 10px;
  }
  .pai-case-title {
    font-family: 'Lato', sans-serif;
    font-size: 13px; font-weight: 700; color: rgba(245,240,232,0.9);
  }
  .pai-case-body {
    padding: 24px 28px; background: var(--surface);
  }
  .pai-case-body .pai-p { font-size: 13px; margin-bottom: 13px; }
  .pai-case-body .pai-p:last-child { margin-bottom: 0; }

  /* ══ BEFORE / AFTER BLOCK ══ */
  .pai-ba {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 2px; background: var(--border);
    border-radius: 5px; overflow: hidden; margin: 32px 0;
    border: 1px solid var(--border);
  }
  .pai-ba-col { padding: 22px 20px; }
  .pai-ba-col.before { background: rgba(184,74,46,0.05); }
  .pai-ba-col.after  { background: rgba(45,80,22,0.06); }
  .pai-ba-label {
    font-family: 'Fira Code', monospace;
    font-size: 9px; letter-spacing: 0.18em; text-transform: uppercase;
    margin-bottom: 14px;
  }
  .pai-ba-col.before .pai-ba-label { color: var(--terra); }
  .pai-ba-col.after  .pai-ba-label { color: var(--forest); }
  .pai-ba-text {
    font-family: 'Fira Code', monospace;
    font-size: 13px; font-weight: 300; line-height: 1.7;
    color: var(--ink-soft);
    border-left: 2px solid;
    padding-left: 12px;
    font-style: italic;
  }
  .pai-ba-col.before .pai-ba-text { border-color: var(--terra); }
  .pai-ba-col.after  .pai-ba-text { border-color: var(--forest); }

  /* ══ HIGHLIGHT BOX ══ */
  .pai-highlight {
    background: var(--forest);
    border-radius: 5px;
    padding: 32px 36px; margin: 40px 0;
    position: relative; overflow: hidden;
  }
  .pai-highlight::before {
    content: '';
    position: absolute; top: -30px; right: -30px;
    width: 140px; height: 140px; border-radius: 50%;
    background: rgba(255,255,255,0.05);
  }
  .pai-highlight h3 {
    font-family: 'Libre Baskerville', serif;
    font-size: 20px; font-weight: 700;
    color: rgba(245,240,232,0.95);
    margin-bottom: 14px; position: relative; line-height: 1.3;
  }
  .pai-highlight p {
    font-family: 'Fira Code', monospace;
    font-size: 13.5px; font-weight: 300;
    color: rgba(245,240,232,0.75);
    line-height: 1.75; position: relative;
  }

  /* ══ INLINE NOTE ══ */
  .pai-note {
    background: rgba(200,150,60,0.07);
    border-left: 2px solid var(--gold);
    padding: 14px 18px; margin: 24px 0;
    font-family: 'Fira Code', monospace;
    font-size: 12.5px; font-weight: 300;
    color: var(--ink-soft); line-height: 1.65;
    border-radius: 0 3px 3px 0;
  }

  /* ══ STEP LIST ══ */
  .pai-steps { list-style: none; padding: 0; margin: 32px 0; }
  .pai-step {
    display: flex; gap: 20px;
    padding: 20px 0; border-bottom: 1px solid var(--border2);
  }
  .pai-step:last-child { border-bottom: none; }
  .pai-step-left { flex-shrink: 0; display: flex; flex-direction: column; align-items: center; }
  .pai-step-circle {
    width: 32px; height: 32px; border-radius: 50%;
    background: var(--forest); color: rgba(245,240,232,0.9);
    font-family: 'Libre Baskerville', serif;
    font-size: 14px; font-weight: 700;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .pai-step-line {
    width: 1px; flex: 1; background: var(--border); margin-top: 8px;
  }
  .pai-step-body h3 {
    font-family: 'Libre Baskerville', serif;
    font-size: 17px; font-weight: 700; color: var(--ink);
    margin-bottom: 7px; margin-top: 4px; line-height: 1.3;
  }
  .pai-step-body p {
    font-family: 'Fira Code', monospace;
    font-size: 13px; font-weight: 300;
    color: var(--muted); line-height: 1.75; margin: 0;
  }

  /* ══ LARGE QUOTE ══ */
  .pai-large-quote {
    font-family: 'Libre Baskerville', serif;
    font-size: clamp(24px, 3.5vw, 36px);
    font-style: italic; font-weight: 400;
    line-height: 1.25; color: var(--ink);
    padding: 40px 0;
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
    margin: 48px 0;
    letter-spacing: -0.01em;
  }
  .pai-large-quote span { color: var(--forest); }

  /* ══ FOOTER ══ */
  .pai-footer {
    margin-top: 80px; padding-top: 30px;
    border-top: 2px solid var(--border);
    display: flex; justify-content: space-between;
    align-items: center; flex-wrap: wrap; gap: 16px;
  }
  .pai-footer-text {
    font-family: 'Fira Code', monospace;
    font-size: 10px; letter-spacing: 0.12em;
    color: var(--muted); text-transform: uppercase;
  }
  .pai-top-btn {
    font-family: 'Fira Code', monospace;
    font-size: 11px; letter-spacing: 0.1em;
    background: none; color: var(--forest);
    border: 1px solid rgba(45,80,22,0.35);
    border-radius: 3px; padding: 9px 20px; cursor: pointer;
    transition: background 0.2s;
  }
  .pai-top-btn:hover { background: rgba(45,80,22,0.07); }

  /* ══ RESPONSIVE ══ */
  @media (max-width: 900px) {
    .pai-shell { grid-template-columns: 1fr; padding: 0 24px; gap: 0; }
    .pai-toc-col { display: none; }
    .pai-main { padding-bottom: 64px; }
    .pai-hero { padding: 48px 0 40px; margin-bottom: 48px; }
  }
  @media (max-width: 580px) {
    .pai-stats { grid-template-columns: 1fr; }
    .pai-principles { grid-template-columns: 1fr; }
    .pai-ba { grid-template-columns: 1fr; }
    .pai-ba-col.before { border-bottom: 1px solid var(--border); }
    .pai-h1 { font-size: 32px; }
    .pai-highlight { padding: 24px 20px; }
    .pai-sec-wrap { margin: 48px 0 24px; }
    .pai-pull { margin: 32px 0; padding-left: 20px; }
  }
`;

/* ═══════════════════════════════════════════
   DATA
═══════════════════════════════════════════ */
const TOC = [
    { id: "pi-s1", label: "Writing Was Always Design" },
    { id: "pi-s2", label: "What a Prompt Actually Is" },
    { id: "pi-s3", label: "The Anatomy of a Good Prompt" },
    { id: "pi-s4", label: "Why Users Struggle" },
    { id: "pi-s5", label: "The UX of Prompting" },
    { id: "pi-s6", label: "Teaching Prompt Literacy" },
    { id: "pi-s7", label: "Prompt Patterns That Work" },
    { id: "pi-s8", label: "Writing as Systems Thinking" },
    { id: "pi-s9", label: "The Designer's New Deliverable" },
    { id: "pi-s10", label: "Where This Goes" },
];

const STATS = [
    { num: "83%", label: "of AI users never revise their first prompt — they accept the first output" },
    { num: "7×", label: "better outputs when users specify format, context, and audience explicitly" },
    { num: "12", label: "seconds: avg time a user spends writing their first AI prompt" },
];

const PRINCIPLES = [
    { num: "01", title: "Context Before Task", body: "Always establish who, where, and why before asking what. Context is load-bearing structure, not decoration." },
    { num: "02", title: "Specificity Over Length", body: "A 15-word precise prompt outperforms a 150-word vague one. Precision is a discipline, not a volume game." },
    { num: "03", title: "Format as Signal", body: "Telling the AI how to respond — bullet list, paragraph, code, table — is as important as telling it what to respond." },
    { num: "04", title: "Persona & Audience", body: "The best prompts name an audience. 'Explain this to a first-year medical student' and 'explain this to a cardiologist' are different instructions to the same question." },
    { num: "05", title: "Constraints Liberate", body: "Adding constraints — word limits, excluded topics, required elements — actually improves output quality by narrowing the generative search space." },
    { num: "06", title: "Iteration is the Method", body: "The first prompt is a hypothesis. The second is a revision. The third is usually good. Treating prompting as single-shot is the most common mistake." },
];

const TABLE_ROWS = [
    ["Visual design", "Color, typography, layout", "Tone, format, context, constraints"],
    ["Primary tool", "Figma, Sketch, CSS", "Natural language"],
    ["Test method", "Usability sessions, A/B test", "Prompt iteration, output evaluation"],
    ["Failure mode", "Confusing layout, bad hierarchy", "Vague prompts, wrong assumptions"],
    ["Expertise signal", "Craft, taste, system thinking", "Precision, vocabulary, context-setting"],
    ["Deliverable", "Wireframe, component, spec", "Prompt library, interaction script, template"],
    ["Learning curve", "Years to master tools", "Days to learn patterns; years to master nuance"],
];

const STEPS = [
    {
        title: "Teach the Mental Model First",
        body: "Before users write a single prompt, they need an accurate mental model of what the AI is doing. Not technically — conceptually. It is completing text based on patterns, not thinking. It has no memory between sessions. It takes instructions very literally. These three facts change how users prompt dramatically.",
    },
    {
        title: "Show Failure Before Success",
        body: "The most effective onboarding sequence demonstrates a vague prompt and its mediocre output first, then shows the same request rewritten with context, format, and constraints — and the dramatically better result. Contrast is the fastest teacher. Users who see the gap between a bad and a good prompt retain the lesson.",
    },
    {
        title: "Provide Scaffolded Templates",
        body: "Beginners need training wheels: fill-in-the-blank prompt templates that teach structure without requiring users to invent it. 'I am [role], working on [project], for [audience]. I need [output type] that [constraints]. Please [format instruction].' Templates are not crutches — they are pattern libraries that users internalize over time.",
    },
    {
        title: "Build Inline Prompt Guidance",
        body: "The best prompt literacy training happens inside the product, not in a help article. Inline suggestions, character-count nudges, format selectors, and contextual tips placed at the moment of prompting are more effective than any onboarding flow. Design the interface to teach as it is used.",
    },
    {
        title: "Create a Feedback Loop",
        body: "Users learn to prompt better when they can see why an output succeeded or failed. Interfaces that surface what the AI interpreted from a prompt — even approximately — close the feedback loop and dramatically accelerate learning. 'The AI understood your request as X' is more valuable than any tutorial.",
    },
];

/* ═══════════════════════════════════════════
   HOOKS
═══════════════════════════════════════════ */
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
            ([e]) => { if (e.isIntersecting) el.classList.add("pai-visible"); },
            { threshold: 0.06 }
        );
        o.observe(el);
        return () => o.disconnect();
    }, []);
    return ref;
}

/* ═══════════════════════════════════════════
   COMPONENTS
═══════════════════════════════════════════ */
function Reveal({ children, delay }) {
    const ref = useReveal();
    return (
        <div ref={ref} className="pai-reveal" style={delay ? { transitionDelay: `${delay}ms` } : {}}>
            {children}
        </div>
    );
}

function SecMarker({ id, num, label, title }) {
    return (
        <Reveal>
            <div id={id} style={{ paddingTop: 8 }}>
                <div className="pai-sec-label">{label}</div>
                <div className="pai-sec-wrap">
                    <span className="pai-sec-num">{num}</span>
                    <div className="pai-sec-rule" />
                    <h2 className="pai-h2">{title}</h2>
                </div>
            </div>
        </Reveal>
    );
}

function P({ children }) { return <p className="pai-p">{children}</p>; }

function PullQuote({ children, attr }) {
    return (
        <Reveal>
            <div className="pai-pull">
                <div className="pai-pull-text">{children}</div>
                {attr && <span className="pai-pull-attr">{attr}</span>}
            </div>
        </Reveal>
    );
}

function Callout({ title, items }) {
    return (
        <Reveal>
            <div className="pai-callout">
                <div className="pai-callout-title">{title}</div>
                <ul>{items.map((it, i) => <li key={i}>{it}</li>)}</ul>
            </div>
        </Reveal>
    );
}

function Note({ children }) {
    return <Reveal><div className="pai-note">{children}</div></Reveal>;
}

function CaseStudy({ title, children }) {
    return (
        <Reveal>
            <div className="pai-case">
                <div className="pai-case-head">
                    <span className="pai-case-badge">Case Study</span>
                    <span className="pai-case-title">{title}</span>
                </div>
                <div className="pai-case-body">{children}</div>
            </div>
        </Reveal>
    );
}

function CodeBlock({ label, children }) {
    return (
        <Reveal>
            <div className="pai-code-block">
                <div className="pai-code-header">
                    <div className="pai-code-dot" style={{ background: "#FF6058" }} />
                    <div className="pai-code-dot" style={{ background: "#FFBE2E" }} />
                    <div className="pai-code-dot" style={{ background: "#2ACA44" }} />
                    <span className="pai-code-label">{label}</span>
                </div>
                <div className="pai-code-body" dangerouslySetInnerHTML={{ __html: children }} />
            </div>
        </Reveal>
    );
}

function BeforeAfter({ before, after }) {
    return (
        <Reveal>
            <div className="pai-ba">
                <div className="pai-ba-col before">
                    <div className="pai-ba-label">❌ Without prompt craft</div>
                    <div className="pai-ba-text">{before}</div>
                </div>
                <div className="pai-ba-col after">
                    <div className="pai-ba-label">✓ With prompt craft</div>
                    <div className="pai-ba-text">{after}</div>
                </div>
            </div>
        </Reveal>
    );
}

/* ═══════════════════════════════════════════
   MAIN EXPORT
═══════════════════════════════════════════ */
export default function PromptAsInterface() {
    const progress = useScrollProgress();
    const activeId = useActiveSection(TOC.map((t) => t.id));

    useEffect(() => {
        const id = "pai-global-styles";
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
        <div className="pai">
            <div className="pai-progress" style={{ width: `${progress}%` }} />

            <div className="pai-shell">

                {/* ── TOC ── */}
                <aside className="pai-toc-col">
                    <div className="pai-toc-eyebrow">Contents</div>
                    <ul className="pai-toc-list">
                        {TOC.map((t) => (
                            <li key={t.id}>
                                <button
                                    className={`pai-toc-btn${activeId === t.id ? " active" : ""}`}
                                    onClick={() => scrollTo(t.id)}
                                >
                                    {t.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                </aside>

                {/* ── MAIN ── */}
                <main className="pai-main">

                    {/* HERO */}
                    <header className="pai-hero">
                        <Reveal>
                            <div className="pai-eyebrow">Writing · AI Interfaces · Design Skill</div>
                            <h1 className="pai-h1">Prompt as<br /><em>Interface</em></h1>
                            <p className="pai-subtitle">
                                Why writing is now a design skill — and how to teach users
                                to communicate with AI.
                            </p>
                            <div className="pai-meta">
                                {["May 2026", "20 min read", "Practitioner Essay"].map((m) => (
                                    <span key={m} className="pai-meta-item">
                                        <span className="pai-meta-pip" />{m}
                                    </span>
                                ))}
                            </div>
                            <div className="pai-tags">
                                {["Prompt Design", "UX Writing", "AI Interfaces", "Literacy", "Onboarding"].map((t) => (
                                    <span key={t} className="pai-tag">{t}</span>
                                ))}
                            </div>
                        </Reveal>
                    </header>

                    {/* INTRO */}
                    <Reveal>
                        <P>
                            For most of computing history, the interface was a thing you could see. A button. A menu. A form.
                            A layout. Designers made interfaces visible — legible, learnable, predictable. The medium was
                            space: pixels arranged on a plane, affordances communicated through color and shape and position.
                        </P>
                        <P>
                            Then language models arrived, and the interface became invisible. The primary mechanism for
                            controlling a vast, probabilistic, generative system is now a text box — blank, patient, offering
                            no affordances whatsoever. The entire interaction is mediated through words. And suddenly,
                            writing is a design skill.
                        </P>
                        <P>
                            Not writing in the traditional UX sense — not microcopy, not error messages, not onboarding
                            text. Writing as the literal interface: the act of constructing a string of words that reliably
                            produces the output you want from an AI system. This skill is now called{" "}
                            <strong>prompt engineering</strong> by practitioners. It should be called something more honest:
                            <strong> conversational interface design.</strong>
                        </P>
                    </Reveal>

                    <PullQuote attr="— The core thesis">
                        "The prompt is not a search query. It is not a command. It is a design artifact — and like all
                        design artifacts, its quality determines the quality of what it produces."
                    </PullQuote>

                    <Reveal>
                        <P>
                            This essay is about three things: what it means to treat prompting as a design discipline,
                            why most users are failing at it and why that is a design problem not a user problem, and
                            what it looks like to actually teach prompt literacy at the product level — not in a help
                            center, not in a workshop, but built into the interaction itself.
                        </P>
                    </Reveal>

                    {/* ── S1 ── */}
                    <SecMarker id="pi-s1" num="§ 01" label="Historical Context" title="Writing Was Always Design" />
                    <Reveal>
                        <P>
                            The premise that writing is a design skill is not actually new. Every UX writer knows that
                            words are interface elements — that the label on a button, the text in an error message, the
                            copy in an onboarding flow are as much design decisions as the choice of typeface or the width
                            of a sidebar. Words communicate affordances, set expectations, and guide behavior. They have
                            always been design.
                        </P>
                        <P>
                            What is new is that words are now <em>the entire interface</em> — not just the labels on the
                            controls, but the controls themselves. In a conversational AI interface, there is no button to
                            click, no menu to navigate, no form to fill. There is only the prompt. The quality of the
                            experience is entirely determined by the quality of the writing.
                        </P>
                        <P>
                            This is a radical inversion of the traditional UI paradigm. In conventional interfaces, designers
                            carefully constrain and guide user input — radio buttons instead of free text, dropdowns instead
                            of manual entry, confirmation dialogs instead of irreversible actions. The design absorbs
                            complexity and offloads it from users. In prompt-driven interfaces, complexity is transferred
                            back to the user. The blank text box says: <em>figure it out.</em>
                        </P>
                    </Reveal>

                    <Reveal>
                        <div className="pai-large-quote">
                            In every prior interface paradigm, design reduced what users needed to know.{" "}
                            <span>In AI interfaces, design has accidentally increased it.</span>
                        </div>
                    </Reveal>

                    <Reveal>
                        <P>
                            This is not an indictment of AI product teams. It reflects the genuine difficulty of designing
                            for open-ended generative systems — systems where the range of possible inputs and outputs is,
                            for practical purposes, infinite. But it is a problem that design must own. If users cannot
                            write prompts that produce useful outputs, they will not use the product. The failure is silent
                            — not an error state, just a blank box and a sense of inadequacy — and it belongs to design.
                        </P>
                    </Reveal>

                    {/* ── S2 ── */}
                    <SecMarker id="pi-s2" num="§ 02" label="Foundations" title="What a Prompt Actually Is" />
                    <Reveal>
                        <P>
                            Before designing for prompt literacy, it helps to be precise about what a prompt is and what
                            it does. A prompt is not a command in the traditional computing sense — it is not a precise
                            instruction with defined syntax that triggers a defined response. It is more like a context
                            envelope: a packet of information that shapes the probability distribution over all possible
                            AI responses.
                        </P>
                        <P>
                            This probabilistic framing has important implications for how we think about prompt quality.
                            A good prompt does not guarantee a good output — it shifts the probability distribution
                            toward good outputs and away from bad ones. A bad prompt does not guarantee a bad output —
                            it leaves the distribution wide, which means the output is unpredictable, likely generic,
                            and often not what the user wanted.
                        </P>
                    </Reveal>

                    <Reveal>
                        <div className="pai-stats">
                            {STATS.map((s) => (
                                <div key={s.num} className="pai-stat">
                                    <div className="pai-stat-num">{s.num}</div>
                                    <div className="pai-stat-label">{s.label}</div>
                                </div>
                            ))}
                        </div>
                    </Reveal>

                    <Reveal>
                        <P>
                            Every prompt contains, explicitly or implicitly, several components. Understanding these
                            components is the foundation of prompt literacy — the difference between a user who says
                            "help me write an email" and one who says "help me write a 3-paragraph professional email
                            to a client explaining a project delay, in a tone that is apologetic but confident, ending
                            with a clear next step."
                        </P>
                    </Reveal>

                    <CodeBlock label="prompt-anatomy.txt">
                        {`<span class="c-com">// The hidden structure inside every prompt</span>

<span class="c-label">CONTEXT</span>       <span class="c-com">// Who are you? What situation are you in?</span>
<span class="c-val">"I'm a product manager at a B2B SaaS company..."</span>

<span class="c-label">TASK</span>          <span class="c-com">// What do you want the AI to do?</span>
<span class="c-val">"...write an executive summary of our Q3 roadmap..."</span>

<span class="c-label">AUDIENCE</span>      <span class="c-com">// Who will read / use the output?</span>
<span class="c-val">"...for a board of investors unfamiliar with our product..."</span>

<span class="c-label">FORMAT</span>        <span class="c-com">// How should the output be structured?</span>
<span class="c-val">"...as 3 bullet points under each of 4 theme headers..."</span>

<span class="c-label">CONSTRAINTS</span>   <span class="c-com">// What should be included / excluded?</span>
<span class="c-val">"...no technical jargon, under 300 words, confident tone..."</span>

<span class="c-label">EXAMPLES</span>      <span class="c-com">// Optional: show what good looks like</span>
<span class="c-val">"...here's a previous summary that hit the right tone: [...]"</span>`}
                    </CodeBlock>

                    <Reveal>
                        <P>
                            Most users supply only the task. They say what they want but not who they are, who they are
                            writing for, what format they need, or what constraints apply. The AI fills in those blanks
                            with its best statistical guess — which is to say, with the most common answer, not the most
                            appropriate one. The result is generic. The user is disappointed. They blame the AI. The
                            actual problem is a missing design pattern.
                        </P>
                    </Reveal>

                    {/* ── S3 ── */}
                    <SecMarker id="pi-s3" num="§ 03" label="Craft" title="The Anatomy of a Good Prompt" />
                    <Reveal>
                        <P>
                            What separates a good prompt from a bad one? The answer is not length, not technical
                            vocabulary, not memorized tricks. It is the same thing that separates good writing from
                            bad writing in any context: <strong>precision, context, and clarity of purpose.</strong>
                        </P>
                    </Reveal>

                    <BeforeAfter
                        before={"Write me a cover letter."}
                        after={"Write a cover letter for a senior UX designer applying to a fintech startup (Series B, 40 people). The role is design systems lead. My background: 7 years in B2B SaaS, led 3 design systems from scratch. Tone: confident but not arrogant. Format: 3 short paragraphs, under 250 words. Avoid: buzzwords like 'passionate' or 'innovative'."}
                    />

                    <Reveal>
                        <P>
                            The difference between these two prompts is not effort — the longer one took about 90 seconds
                            to write. The difference is structural thinking: the second prompt has internalized the context
                            envelope. It provides the AI with everything it needs to narrow its probability distribution
                            toward a genuinely useful output.
                        </P>
                        <P>
                            Notice also that the second prompt does negative specification — "avoid buzzwords like
                            'passionate' or 'innovative.'" Constraints of exclusion are often more powerful than
                            constraints of inclusion. Telling the AI what not to do is frequently the fastest way to
                            get it to do what you actually want.
                        </P>
                    </Reveal>

                    <Note>
                        The single most impactful change most users can make to their prompting practice is adding
                        one sentence of audience specification. "Explain this for a 12-year-old" vs. "Explain this
                        for a practicing attorney" produces dramatically different outputs from the same underlying
                        question — and neither is better in the abstract. Only one is right for the context.
                    </Note>

                    {/* ── S4 ── */}
                    <SecMarker id="pi-s4" num="§ 04" label="The Problem" title="Why Users Struggle" />
                    <Reveal>
                        <P>
                            If good prompting is simply a matter of adding context, why do most users not do it? The
                            answer is not laziness or lack of intelligence. It is a combination of design failures,
                            cognitive habits, and the unique psychological dynamics of talking to a machine.
                        </P>
                    </Reveal>

                    <Callout
                        title="Root causes of poor user prompting"
                        items={[
                            "The blank box provides no affordance — nothing signals what good input looks like",
                            "Users import the search engine mental model — short, keyword-based queries",
                            "Cognitive load — constructing a context envelope requires working memory most users don't spare",
                            "The magic expectation — users believe AI should understand them without effort",
                            "No feedback on prompt quality — users don't know if their prompt was good or bad",
                            "Fear of being wrong — users self-censor specific requests, preferring vague safety",
                            "One-shot thinking — users treat the first output as final, not as a starting point",
                        ]}
                    />

                    <Reveal>
                        <P>
                            The cognitive load problem is particularly significant. Writing a good prompt is not just
                            writing — it is a form of structured thinking: identifying your audience, clarifying your
                            actual need, deciding on a format, and specifying constraints, all before you have even
                            received a first draft to react to. For many users, this is more structured thinking than
                            the task itself would require. The interface is asking them to do the hard work upfront,
                            invisibly, with no guidance.
                        </P>
                        <P>
                            The "magic expectation" problem is structural and not users' fault. AI marketing — from
                            every major company, without exception — has consistently sold the experience as effortless.
                            "Just ask." "Say what you need." "AI that understands you." These messages are not lies exactly,
                            but they are optimistic about the current state of the technology in a way that sets users
                            up for disappointment and self-blame when the blank box fails to produce magic.
                        </P>
                    </Reveal>

                    <PullQuote attr="— On the failure of AI onboarding">
                        "Every AI product tells users what the system can do. Almost none of them teach users
                        how to actually ask for it."
                    </PullQuote>

                    {/* ── S5 ── */}
                    <SecMarker id="pi-s5" num="§ 05" label="Interface Design" title="The UX of Prompting" />
                    <Reveal>
                        <P>
                            The blank text box is a design choice. It is not inevitable. The range of possible prompt
                            interfaces spans a vast spectrum, and the choice of where to sit on that spectrum has profound
                            implications for user capability, output quality, and product retention.
                        </P>
                    </Reveal>

                    <Reveal>
                        <div className="pai-table-scroll">
                            <table className="pai-table">
                                <thead>
                                    <tr>
                                        <th>Interface Pattern</th>
                                        <th>How It Works</th>
                                        <th>Trade-off</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        ["Pure blank box", "User types anything; no guidance", "Maximum flexibility, maximum failure rate"],
                                        ["Placeholder text", "Ghost text suggests structure or examples", "Low lift, modest improvement"],
                                        ["Contextual chips", "Clickable tags prepend context: 'Make it shorter', 'More formal'", "Guides revision; doesn't help first prompts"],
                                        ["Structured wizard", "Step-by-step form builds the prompt behind the scenes", "Better outputs; may feel rigid or slow"],
                                        ["Dynamic suggestions", "Inline suggestions appear as user types based on detected intent", "High impact when well-executed; complex to build"],
                                        ["Template library", "Pre-built prompts for common tasks, user fills blanks", "Fastest path to good output; reduces creativity"],
                                        ["Prompt interpreter", "After submission, shows what the AI understood from the prompt", "Closes feedback loop; teaches via transparency"],
                                    ].map(([a, b, c]) => (
                                        <tr key={a}>
                                            <td>{a}</td>
                                            <td>{b}</td>
                                            <td>{c}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Reveal>

                    <Reveal>
                        <P>
                            The most effective prompt interfaces are not those that make prompting easier by removing
                            its complexity — that approach produces good outputs for common tasks and poor outputs for
                            everything else. The most effective interfaces are those that teach prompting by doing:
                            they scaffold the process in ways that gradually transfer the skill to the user.
                        </P>
                        <P>
                            This is a familiar principle in learning design — scaffolding that fades. Early in the
                            user journey, the interface carries most of the cognitive load. Over time, as the user
                            develops mental models and intuitions about what works, the scaffolding recedes and the
                            user operates more autonomously. The goal is not permanent assistance — it is accelerated
                            skill development.
                        </P>
                    </Reveal>

                    <Reveal>
                        <div className="pai-highlight">
                            <h3>The Prompt Interpreter: A Design Pattern Worth Building</h3>
                            <p>
                                After a user submits a prompt, display a one-sentence interpretation: "I understood this
                                as: write a casual 200-word summary of X for a general audience." Users who see their
                                intent reflected back can immediately identify mismatches — and more importantly, they
                                learn what information the AI is looking for. Two weeks of this pattern produces
                                measurably better natural prompts than any onboarding flow.
                            </p>
                        </div>
                    </Reveal>

                    {/* ── S6 ── */}
                    <SecMarker id="pi-s6" num="§ 06" label="Pedagogy" title="Teaching Prompt Literacy" />
                    <Reveal>
                        <P>
                            Prompt literacy can be taught. The evidence for this is overwhelming — every organization
                            that has run structured prompt training programs reports meaningful improvements in output
                            quality and user confidence within days, not months. The bottleneck is not human capability.
                            It is the absence of deliberate teaching.
                        </P>
                        <P>
                            Teaching prompt literacy effectively means understanding how skills are actually acquired:
                            through contrast (seeing good and bad examples side by side), through practice (low-stakes
                            iteration with immediate feedback), and through conceptual models (understanding why something
                            works, not just that it works). Most AI onboarding fails on all three counts.
                        </P>
                    </Reveal>

                    <ul className="pai-steps">
                        {STEPS.map((s, i) => (
                            <Reveal key={i} delay={i * 60}>
                                <li className="pai-step">
                                    <div className="pai-step-left">
                                        <div className="pai-step-circle">{i + 1}</div>
                                        {i < STEPS.length - 1 && <div className="pai-step-line" />}
                                    </div>
                                    <div className="pai-step-body">
                                        <h3>{s.title}</h3>
                                        <p>{s.body}</p>
                                    </div>
                                </li>
                            </Reveal>
                        ))}
                    </ul>

                    {/* ── S7 ── */}
                    <SecMarker id="pi-s7" num="§ 07" label="Pattern Library" title="Prompt Patterns That Work" />
                    <Reveal>
                        <P>
                            Design systems have component libraries. Prompt practice has pattern libraries — reusable
                            structural approaches that reliably improve output quality across a wide range of tasks.
                            These are not tricks or hacks. They are applications of the underlying logic of how context
                            envelopes work.
                        </P>
                    </Reveal>

                    <CodeBlock label="prompt-patterns.txt">
                        {`<span class="c-label">PATTERN 1 · The Expert Persona</span>
<span class="c-com">// Assign the AI a role to shape its knowledge emphasis</span>
<span class="c-good">"You are a senior copy editor at a medical journal. Review this abstract
for clarity, precision, and appropriate hedge language."</span>

<span class="c-label">PATTERN 2 · The Constraint Stack</span>
<span class="c-com">// Layer constraints to narrow the output space</span>
<span class="c-good">"Write in active voice. Maximum 3 sentences per paragraph. No statistics
without a source. No use of the word 'leverage'."</span>

<span class="c-label">PATTERN 3 · The Chain of Thought Trigger</span>
<span class="c-com">// Ask the AI to reason before concluding</span>
<span class="c-good">"Before giving me a recommendation, list the tradeoffs you see between
Option A and Option B, then make a recommendation and explain why."</span>

<span class="c-label">PATTERN 4 · The Negative Example</span>
<span class="c-com">// Show what you don't want</span>
<span class="c-good">"Here is a version of this email I don't like: [example]. The problem
is it sounds defensive. Rewrite it without that quality."</span>

<span class="c-label">PATTERN 5 · The Format Mirror</span>
<span class="c-com">// Give the AI a template to fill</span>
<span class="c-good">"Use this structure exactly:
PROBLEM: [one sentence]
CAUSE: [one sentence]
SOLUTION: [two to three sentences]
NEXT STEP: [one sentence action item]"</span>

<span class="c-label">PATTERN 6 · The Iterative Refinement</span>
<span class="c-com">// Build on the first output rather than starting over</span>
<span class="c-good">"This is good but too formal for our audience. Keep the structure,
reduce the reading level to Grade 8, and make the opening line
a question instead of a statement."</span>`}
                    </CodeBlock>

                    <Reveal>
                        <P>
                            These patterns are not exhaustive — they are starting points for a living pattern library
                            that every AI product team should be building and sharing with users. The best AI products
                            of the next five years will not just expose AI capability — they will systematically transfer
                            prompting skill to users through embedded, contextual, progressive pattern instruction.
                        </P>
                    </Reveal>

                    {/* ── S8 ── */}
                    <SecMarker id="pi-s8" num="§ 08" label="Systems Thinking" title="Writing as Systems Thinking" />
                    <Reveal>
                        <P>
                            There is a deeper dimension to prompt literacy that goes beyond individual prompt quality.
                            Good prompting is not just a writing skill — it is a systems thinking skill. It requires
                            understanding the AI as a system: what inputs it responds to, what outputs it produces,
                            where its boundaries are, and how to use iteration to approach an optimal output rather
                            than expecting to hit it on the first try.
                        </P>
                        <P>
                            This reframes prompt literacy as something much larger than a UX concern. It is a form
                            of technological fluency — the equivalent, in the AI era, of knowing how to construct a
                            search query, how to read a spreadsheet formula, or how to structure a database query.
                            These skills were once rare, then became ubiquitous, then became invisible. Prompt literacy
                            is on the same trajectory.
                        </P>
                    </Reveal>

                    <Reveal>
                        <div className="pai-principles">
                            {PRINCIPLES.map((p) => (
                                <div key={p.num} className="pai-principle">
                                    <div className="pai-pr-num">{p.num}</div>
                                    <h3>{p.title}</h3>
                                    <p>{p.body}</p>
                                </div>
                            ))}
                        </div>
                    </Reveal>

                    <CaseStudy title="Notion AI: Scaffolded Prompting Done Well">
                        <P>
                            When Notion integrated AI into its product in 2023, it faced a classic prompt literacy
                            challenge: its users ranged from casual personal note-takers to professional project
                            managers, with wildly different mental models of what AI could do and how to ask for it.
                        </P>
                        <P>
                            Rather than defaulting to a blank text box, Notion's AI interface offered a selection of
                            task templates — "Improve writing," "Summarize," "Make shorter," "Continue writing" — that
                            served two purposes. Immediately, they gave users an obvious starting point. Over time, they
                            taught users the vocabulary of AI interaction: that the AI responds to task framing, that
                            "make shorter" is a legitimate instruction, that summarization is distinct from rewriting.
                        </P>
                        <P>
                            The templates also had a secondary design function: they demonstrated the range of what
                            was possible. Users who discovered "Explain this as a table" by clicking it once then started
                            asking for tables spontaneously in the blank prompt box. The templates were not a replacement
                            for prompt skill — they were a curriculum for developing it.
                        </P>
                    </CaseStudy>

                    {/* ── S9 ── */}
                    <SecMarker id="pi-s9" num="§ 09" label="Role Evolution" title="The Designer's New Deliverable" />
                    <Reveal>
                        <P>
                            If prompting is a design skill, then the designer's deliverable set needs to expand. The
                            traditional outputs of a UX designer — wireframes, prototypes, component specs, interaction
                            flows — remain necessary. But they are no longer sufficient for AI-powered products.
                        </P>
                    </Reveal>

                    <Reveal>
                        <div className="pai-table-scroll">
                            <table className="pai-table">
                                <thead>
                                    <tr>
                                        <th>Dimension</th>
                                        <th>Traditional UX Design</th>
                                        <th>AI Interface Design</th>
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

                    <Reveal>
                        <P>
                            The prompt library is the new component library. A well-designed prompt library documents
                            the canonical ways of asking an AI for common product tasks — not as end-user instructions,
                            but as design specifications: what the prompt should contain, what output it should produce,
                            and what variations are valid. It is a living artifact that bridges the design team, the
                            engineering team, and eventually the user-facing pattern guidance that teaches prompt literacy
                            in context.
                        </P>
                        <P>
                            The interaction script is the new user flow. Where a traditional user flow documents the
                            sequence of screens a user traverses to complete a task, an interaction script documents
                            the conversation a user needs to have with an AI to complete a task — including the likely
                            misunderstandings, the recommended recovery prompts, and the signals that indicate the user
                            has reached their goal.
                        </P>
                    </Reveal>

                    <Note>
                        Designers who are building AI features without writing, testing, and maintaining prompt
                        libraries are building on unstable ground. The AI behavior is part of the product behavior.
                        It needs to be specified, versioned, and evaluated like any other product component.
                    </Note>

                    {/* ── S10 ── */}
                    <SecMarker id="pi-s10" num="§ 10" label="Looking Forward" title="Where This Goes" />
                    <Reveal>
                        <P>
                            Prompt literacy is a transitional skill. The interfaces of 2026 require it because the
                            technology requires explicit instruction. The interfaces of 2030 will likely require less
                            of it — as AI systems become better at inferring context, asking clarifying questions, and
                            working with ambiguous input. The blank box will not be blank forever.
                        </P>
                        <P>
                            But "eventually this won't be a problem" is not a design strategy for the present. Right
                            now, millions of users are opening AI products every day, staring at blank text boxes, typing
                            vague questions, receiving generic outputs, and quietly concluding that AI is not for them.
                            This is a UX crisis masquerading as a technology limitation.
                        </P>
                        <P>
                            The solution is not to wait for better AI. It is to design better onboarding, better
                            scaffolding, better feedback loops, and better prompt literacy programs — to treat the
                            gap between what users can ask and what AI can deliver as a design problem, not a user
                            problem. The discipline that taught users how to use touchscreens, how to navigate apps,
                            and how to understand notifications can teach them how to talk to AI.
                        </P>
                    </Reveal>

                    <PullQuote attr="— The core design opportunity">
                        "Every user who gives up on AI because the blank box intimidated them is a design failure.
                        Every user who learns to prompt well is a design success. The difference between those outcomes
                        is not the technology. It is the interface."
                    </PullQuote>

                    <Reveal>
                        <P>
                            Writing is now a design skill. That means designers need to become better writers, yes —
                            but more fundamentally, it means they need to become teachers of writing. The most impactful
                            thing a UX team can do for an AI product in 2026 is not design a more beautiful empty state
                            or a more elegant response card. It is to design the experience that turns a hesitant
                            first-time user into a confident prompt author — someone who knows how to shape the
                            probability distribution of a generative system toward what they actually need.
                        </P>
                        <P>
                            That is a new kind of design skill. It is also, clearly, the most important one.
                        </P>
                    </Reveal>

                    {/* FOOTER */}
                    <Reveal>
                        <div className="pai-footer">
                            <span className="pai-footer-text">Prompt Design · UX Writing · May 2026</span>
                            <button
                                className="pai-top-btn"
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