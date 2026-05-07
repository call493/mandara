import { useEffect, useRef, useState, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════════════
   GLOBAL CSS
   Aesthetic: Midnight recording studio · deep navy · electric cyan · amber
   Fonts: DM Serif Display (headings) + Space Mono (body)
═══════════════════════════════════════════════════════════════════ */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Instrument+Sans:wght@400;500;600&display=swap');

  :root {
    --navy:      #080C14;
    --navy2:     #0D1220;
    --navy3:     #111827;
    --cyan:      #00D4FF;
    --cyan-dim:  rgba(0,212,255,0.12);
    --amber:     #F59E0B;
    --amber-dim: rgba(245,158,11,0.1);
    --ash:       #E2E8F0;
    --ash2:      #94A3B8;
    --muted:     #4A5568;
    --border:    rgba(226,232,240,0.08);
    --border2:   rgba(0,212,255,0.15);
    --red:       #F87171;
    --green:     #4ADE80;
  }

  .sux * { box-sizing: border-box; margin: 0; padding: 0; }

  .sux {
    font-family: 'Space Mono', monospace;
    background: var(--navy);
    color: var(--ash);
    font-size: 15px;
    line-height: 1.85;
    -webkit-font-smoothing: antialiased;
    position: relative;
    overflow-x: hidden;
  }

  /* subtle grid bg */
  .sux::before {
    content: '';
    position: fixed; inset: 0;
    background-image:
      linear-gradient(rgba(0,212,255,0.02) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,212,255,0.02) 1px, transparent 1px);
    background-size: 40px 40px;
    pointer-events: none; z-index: 0;
  }

  /* ── Reveal ── */
  .sux-reveal {
    opacity: 0; transform: translateY(24px);
    transition: opacity 0.7s cubic-bezier(0.16,1,0.3,1),
                transform 0.7s cubic-bezier(0.16,1,0.3,1);
    position: relative; z-index: 1;
  }
  .sux-reveal.sux-visible { opacity: 1; transform: translateY(0); }

  /* ── Shell ── */
  .sux-shell {
    max-width: 1140px; margin: 0 auto;
    padding: 0 40px;
    display: grid;
    grid-template-columns: 200px 1fr;
    gap: 72px; align-items: flex-start;
  }

  /* ── TOC ── */
  .sux-toc-col {
    position: sticky; top: 64px;
    padding-top: 72px; align-self: flex-start;
  }
  .sux-toc-label {
    font-size: 9px; letter-spacing: 0.24em;
    text-transform: uppercase; color: var(--muted);
    margin-bottom: 16px;
  }
  .sux-toc-list { list-style: none; }
  .sux-toc-btn {
    display: block; width: 100%; text-align: left;
    background: none; border: none;
    font-family: 'Space Mono', monospace;
    font-size: 10px; font-weight: 400;
    color: var(--muted); padding: 5px 0 5px 14px;
    border-left: 1px solid var(--border);
    cursor: pointer; line-height: 1.4;
    transition: color 0.2s, border-color 0.2s;
  }
  .sux-toc-btn:hover { color: var(--ash2); border-left-color: var(--muted); }
  .sux-toc-btn.active { color: var(--cyan); border-left-color: var(--cyan); }

  /* ── Main ── */
  .sux-main { min-width: 0; padding-bottom: 120px; position: relative; z-index: 1; }

  /* ══ HERO ══ */
  .sux-hero {
    padding: 80px 0 60px;
    border-bottom: 1px solid var(--border);
    margin-bottom: 72px; position: relative;
  }
  .sux-hero-waves {
    position: absolute; bottom: 0; left: 0; right: 0;
    height: 3px; overflow: hidden;
  }
  .sux-eyebrow {
    font-size: 9px; letter-spacing: 0.28em;
    text-transform: uppercase; color: var(--cyan);
    margin-bottom: 28px;
    display: flex; align-items: center; gap: 12px;
  }
  .sux-eyebrow-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: var(--cyan);
    animation: sux-pulse 2s ease-in-out infinite;
  }
  @keyframes sux-pulse {
    0%,100% { opacity: 1; transform: scale(1); }
    50%      { opacity: 0.4; transform: scale(0.7); }
  }
  .sux-h1 {
    font-family: 'DM Serif Display', serif;
    font-size: clamp(44px, 6vw, 82px);
    font-weight: 400; line-height: 1.06;
    letter-spacing: -0.02em; color: var(--ash);
    margin-bottom: 10px;
  }
  .sux-h1 em { font-style: italic; color: var(--cyan); }
  .sux-subtitle {
    font-family: 'DM Serif Display', serif;
    font-size: clamp(16px, 2vw, 21px);
    font-style: italic; font-weight: 400;
    color: var(--ash2); line-height: 1.5;
    margin-bottom: 40px; max-width: 540px;
  }
  .sux-meta { display: flex; gap: 22px; flex-wrap: wrap; margin-bottom: 22px; }
  .sux-meta-item {
    font-size: 10px; letter-spacing: 0.1em;
    color: var(--muted);
    display: flex; align-items: center; gap: 7px;
  }
  .sux-meta-dot {
    width: 3px; height: 3px; border-radius: 50%;
    background: var(--amber);
  }
  .sux-tags { display: flex; gap: 8px; flex-wrap: wrap; }
  .sux-tag {
    font-size: 9px; letter-spacing: 0.14em;
    text-transform: uppercase; padding: 4px 11px;
    border: 1px solid var(--border); border-radius: 2px;
    color: var(--muted);
  }

  /* ══ SECTION MARKERS ══ */
  .sux-sec {
    display: flex; align-items: center; gap: 16px;
    margin: 68px 0 32px;
  }
  .sux-sec-num {
    font-size: 9px; letter-spacing: 0.22em;
    text-transform: uppercase; color: var(--cyan);
    flex-shrink: 0; font-family: 'Space Mono', monospace;
  }
  .sux-sec-line { flex: 1; height: 1px; background: var(--border); }
  .sux-h2 {
    font-family: 'DM Serif Display', serif;
    font-size: clamp(26px, 3vw, 38px); font-weight: 400;
    color: var(--ash); letter-spacing: -0.02em; line-height: 1.2;
  }
  .sux-sec-label {
    font-size: 9px; letter-spacing: 0.2em;
    text-transform: uppercase; color: var(--amber);
    margin-bottom: 8px; font-family: 'Space Mono', monospace;
  }

  /* ══ BODY TEXT ══ */
  .sux-p {
    font-size: 14.5px; font-weight: 400;
    color: var(--ash2); line-height: 1.9;
    margin-bottom: 22px;
  }
  .sux-p:last-child { margin-bottom: 0; }
  .sux-p strong { font-weight: 700; color: var(--ash); }
  .sux-p em { font-style: italic; color: var(--ash); }

  /* ══ PULL QUOTE ══ */
  .sux-pull {
    margin: 52px 0;
    padding: 32px 36px;
    background: var(--navy2);
    border: 1px solid var(--border2);
    border-radius: 6px;
    position: relative; overflow: hidden;
  }
  .sux-pull::before {
    content: '';
    position: absolute; top: 0; left: 0;
    width: 3px; height: 100%;
    background: linear-gradient(180deg, var(--cyan), var(--amber));
  }
  .sux-pull-text {
    font-family: 'DM Serif Display', serif;
    font-size: clamp(20px, 2.5vw, 27px);
    font-style: italic; color: var(--ash);
    line-height: 1.45;
  }
  .sux-pull-attr {
    display: block; font-size: 10px;
    letter-spacing: 0.12em; color: var(--muted);
    margin-top: 14px; text-transform: uppercase;
  }

  /* ══ CALLOUT ══ */
  .sux-callout {
    background: var(--navy2);
    border: 1px solid var(--border);
    border-left: 2px solid var(--amber);
    border-radius: 0 5px 5px 0;
    padding: 26px 30px; margin: 34px 0;
  }
  .sux-callout-title {
    font-size: 9px; letter-spacing: 0.22em;
    text-transform: uppercase; color: var(--amber);
    margin-bottom: 16px;
    display: flex; align-items: center; gap: 8px;
  }
  .sux-callout-title::before { content: '▶'; font-size: 8px; }
  .sux-callout ul { list-style: none; padding: 0; display: grid; gap: 10px; }
  .sux-callout li {
    display: flex; gap: 13px;
    font-size: 13px; color: var(--ash2); line-height: 1.65;
  }
  .sux-callout li::before {
    content: '—'; color: var(--cyan);
    font-size: 12px; flex-shrink: 0; margin-top: 2px;
  }

  /* ══ STAT ROW ══ */
  .sux-stats {
    display: grid; grid-template-columns: repeat(3,1fr);
    gap: 1px; background: var(--border);
    border: 1px solid var(--border);
    border-radius: 6px; overflow: hidden; margin: 36px 0;
  }
  .sux-stat {
    background: var(--navy2);
    padding: 28px 18px; text-align: center;
  }
  .sux-stat-num {
    font-family: 'DM Serif Display', serif;
    font-size: 50px; font-weight: 400;
    color: var(--cyan); line-height: 1;
    margin-bottom: 10px; letter-spacing: -0.02em;
  }
  .sux-stat-label {
    font-size: 11px; color: var(--muted); line-height: 1.5;
  }

  /* ══ CASE STUDY ══ */
  .sux-case {
    border: 1px solid var(--border);
    border-radius: 6px; overflow: hidden; margin: 44px 0;
  }
  .sux-case-head {
    background: var(--navy3);
    border-bottom: 1px solid var(--border);
    padding: 14px 22px;
    display: flex; align-items: center; justify-content: space-between;
    flex-wrap: wrap; gap: 10px;
  }
  .sux-case-left { display: flex; align-items: center; gap: 12px; }
  .sux-case-badge {
    font-size: 9px; letter-spacing: 0.16em; text-transform: uppercase;
    color: var(--amber); border: 1px solid rgba(245,158,11,0.4);
    border-radius: 2px; padding: 3px 10px;
  }
  .sux-case-title {
    font-family: 'Instrument Sans', sans-serif;
    font-size: 13px; font-weight: 600; color: var(--ash);
  }
  .sux-case-company {
    font-size: 10px; letter-spacing: 0.1em;
    color: var(--cyan); text-transform: uppercase;
  }
  .sux-case-body { padding: 28px; background: var(--navy2); }
  .sux-case-body .sux-p { font-size: 13.5px; margin-bottom: 14px; }
  .sux-case-body .sux-p:last-child { margin-bottom: 0; }

  /* ══ HIGHLIGHT BOX ══ */
  .sux-highlight {
    background: linear-gradient(135deg, rgba(0,212,255,0.07) 0%, rgba(245,158,11,0.05) 100%);
    border: 1px solid var(--border2);
    border-radius: 6px; padding: 36px 40px; margin: 48px 0;
    position: relative; overflow: hidden;
  }
  .sux-highlight h3 {
    font-family: 'DM Serif Display', serif;
    font-size: 22px; color: var(--ash);
    margin-bottom: 14px; line-height: 1.3;
  }
  .sux-highlight p {
    font-size: 13.5px; color: var(--ash2); line-height: 1.75;
  }

  /* ══ NOTE ══ */
  .sux-note {
    background: var(--amber-dim);
    border-left: 2px solid var(--amber);
    padding: 14px 18px; margin: 26px 0;
    font-size: 13px; color: var(--ash2); line-height: 1.65;
    border-radius: 0 3px 3px 0;
  }

  /* ══ LARGE QUOTE ══ */
  .sux-large-q {
    font-family: 'DM Serif Display', serif;
    font-size: clamp(28px, 3.8vw, 48px);
    font-style: italic; font-weight: 400;
    line-height: 1.2; color: var(--ash);
    padding: 52px 0;
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
    margin: 52px 0; letter-spacing: -0.01em;
  }
  .sux-large-q span { color: var(--cyan); }

  /* ══ COMPARISON TABLE ══ */
  .sux-table-wrap { overflow-x: auto; margin: 34px 0; border-radius: 6px; border: 1px solid var(--border); }
  .sux-table {
    width: 100%; border-collapse: collapse;
    background: var(--navy2); font-size: 13px; min-width: 500px;
  }
  .sux-table thead tr { background: var(--navy3); }
  .sux-table thead th {
    font-size: 9px; letter-spacing: 0.18em; text-transform: uppercase;
    padding: 13px 18px; text-align: left; font-weight: 400; color: var(--ash2);
    border-bottom: 1px solid var(--border);
  }
  .sux-table tbody tr { border-bottom: 1px solid rgba(226,232,240,0.04); }
  .sux-table tbody tr:last-child { border-bottom: none; }
  .sux-table td { padding: 13px 18px; color: var(--ash2); }
  .sux-table td:first-child { font-weight: 700; color: var(--ash); }

  /* ══ PRINCIPLE CARDS ══ */
  .sux-principles {
    display: grid; grid-template-columns: repeat(2,1fr);
    gap: 14px; margin: 36px 0;
  }
  .sux-pr-card {
    background: var(--navy2);
    border: 1px solid var(--border);
    border-radius: 6px; padding: 22px 20px;
    transition: border-color 0.25s, transform 0.2s;
  }
  .sux-pr-card:hover { border-color: var(--border2); transform: translateY(-2px); }
  .sux-pr-num {
    font-family: 'DM Serif Display', serif;
    font-size: 32px; color: var(--cyan-dim);
    line-height: 1; margin-bottom: 10px;
  }
  .sux-pr-card h3 {
    font-family: 'Instrument Sans', sans-serif;
    font-size: 15px; font-weight: 600; color: var(--ash);
    margin-bottom: 7px; line-height: 1.3;
  }
  .sux-pr-card p { font-size: 12px; color: var(--muted); line-height: 1.65; margin: 0; }

  /* ══ WAVEFORM ANIMATION ══ */
  @keyframes sux-wave {
    0%,100% { transform: scaleY(1); }
    50%      { transform: scaleY(0.15); }
  }
  .sux-wave-bars {
    display: flex; align-items: center; gap: 3px;
    height: 24px;
  }
  .sux-wave-bar {
    width: 3px; background: var(--cyan);
    border-radius: 2px; flex-shrink: 0;
    transform-origin: center;
  }
  .sux-wave-bar.playing {
    animation: sux-wave 0.6s ease-in-out infinite;
  }

  /* ══ SOUND PLAYER ══ */
  .sux-sound-section {
    background: var(--navy2);
    border: 1px solid var(--border2);
    border-radius: 10px; overflow: hidden; margin: 44px 0;
  }
  .sux-sound-header {
    background: var(--navy3);
    padding: 16px 24px;
    border-bottom: 1px solid var(--border);
    display: flex; align-items: center; gap: 12px;
  }
  .sux-sound-header-icon {
    font-size: 18px; line-height: 1;
  }
  .sux-sound-header-title {
    font-family: 'Instrument Sans', sans-serif;
    font-size: 14px; font-weight: 600; color: var(--ash);
  }
  .sux-sound-header-sub {
    font-size: 11px; color: var(--muted); margin-left: auto;
    letter-spacing: 0.06em;
  }
  .sux-sound-grid {
    display: grid; gap: 0;
  }
  .sux-sound-item {
    display: flex; align-items: center;
    padding: 18px 24px; gap: 18px;
    border-bottom: 1px solid rgba(226,232,240,0.04);
    transition: background 0.2s;
    cursor: pointer;
  }
  .sux-sound-item:last-child { border-bottom: none; }
  .sux-sound-item:hover { background: rgba(0,212,255,0.03); }
  .sux-play-btn {
    width: 40px; height: 40px;
    border-radius: 50%;
    background: var(--cyan-dim);
    border: 1px solid var(--border2);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; flex-shrink: 0;
    transition: background 0.2s, transform 0.15s;
    color: var(--cyan); font-size: 13px;
  }
  .sux-play-btn:hover { background: rgba(0,212,255,0.2); transform: scale(1.05); }
  .sux-play-btn.playing {
    background: var(--cyan);
    color: var(--navy);
  }
  .sux-sound-info { flex: 1; min-width: 0; }
  .sux-sound-name {
    font-family: 'Instrument Sans', sans-serif;
    font-size: 14px; font-weight: 600; color: var(--ash);
    margin-bottom: 3px;
  }
  .sux-sound-desc {
    font-size: 11px; color: var(--muted); line-height: 1.4;
  }
  .sux-sound-brand {
    font-size: 10px; letter-spacing: 0.1em;
    text-transform: uppercase; color: var(--cyan);
    flex-shrink: 0;
  }
  .sux-sound-viz {
    width: 80px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
  }

  /* ══ FOOTER ══ */
  .sux-footer {
    margin-top: 100px; padding-top: 30px;
    border-top: 1px solid var(--border);
    display: flex; justify-content: space-between;
    align-items: center; flex-wrap: wrap; gap: 16px;
  }
  .sux-footer-text {
    font-size: 10px; letter-spacing: 0.14em;
    color: var(--muted); text-transform: uppercase;
  }
  .sux-top-btn {
    font-family: 'Space Mono', monospace;
    font-size: 11px; letter-spacing: 0.1em;
    background: none; color: var(--cyan);
    border: 1px solid var(--border2);
    border-radius: 3px; padding: 9px 20px; cursor: pointer;
    transition: background 0.2s;
  }
  .sux-top-btn:hover { background: var(--cyan-dim); }

  /* ══ RESPONSIVE ══ */
  @media (max-width: 920px) {
    .sux-shell { grid-template-columns: 1fr; padding: 0 22px; gap: 0; }
    .sux-toc-col { display: none; }
    .sux-principles { grid-template-columns: 1fr; }
  }
  @media (max-width: 580px) {
    .sux-stats { grid-template-columns: 1fr; }
    .sux-h1 { font-size: 38px; }
    .sux-highlight { padding: 26px 22px; }
    .sux-sound-item { padding: 14px 16px; gap: 12px; }
  }
`;

/* ═══════════════════════════════════════
   WEB AUDIO ENGINE
   Synthesizes all sounds in-browser
   No audio files needed
═══════════════════════════════════════ */
function createAudioContext() {
    if (typeof window === "undefined") return null;
    return new (window.AudioContext || window.webkitAudioContext)();
}

function playTone(ctx, config) {
    if (!ctx) return;
    if (ctx.state === "suspended") ctx.resume();
    const { type = "sine", freq = 440, freq2, duration = 0.4,
        attack = 0.01, decay = 0.1, sustain = 0.3, release = 0.2,
        gain = 0.3, detune = 0, sweep = false } = config;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    if (detune) osc.detune.setValueAtTime(detune, now);
    if (sweep && freq2) osc.frequency.exponentialRampToValueAtTime(freq2, now + duration * 0.6);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(8000, now);
    filter.frequency.exponentialRampToValueAtTime(1200, now + duration);

    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(gain, now + attack);
    gainNode.gain.linearRampToValueAtTime(gain * sustain, now + attack + decay);
    gainNode.gain.setValueAtTime(gain * sustain, now + duration - release);
    gainNode.gain.linearRampToValueAtTime(0, now + duration);

    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + duration + 0.05);
    return duration * 1000;
}

function playChord(ctx, freqs, config = {}) {
    if (!ctx) return;
    const dur = config.duration || 0.6;
    freqs.forEach((f, i) => {
        setTimeout(() => playTone(ctx, { ...config, freq: f, duration: dur }), i * 30);
    });
    return dur * 1000 + freqs.length * 30;
}

function playSequence(ctx, notes, config = {}) {
    if (!ctx) return;
    let offset = 0;
    notes.forEach(({ freq, dur = 0.15, gap = 0 }) => {
        setTimeout(() => playTone(ctx, { ...config, freq, duration: dur }), offset);
        offset += (dur + gap) * 1000;
    });
    return offset;
}

/* sound presets */
const SOUND_PRESETS = {
    apple_success: (ctx) => {
        playTone(ctx, { type: "sine", freq: 523, duration: 0.18, gain: 0.25, attack: 0.005 });
        setTimeout(() => playTone(ctx, { type: "sine", freq: 659, duration: 0.22, gain: 0.22, attack: 0.005 }), 120);
        return 400;
    },
    apple_error: (ctx) => {
        playTone(ctx, { type: "sine", freq: 200, duration: 0.3, gain: 0.3, type: "sawtooth", attack: 0.01 });
        return 350;
    },
    slack_pop: (ctx) => {
        playTone(ctx, { type: "sine", freq: 880, duration: 0.08, gain: 0.28, attack: 0.002, decay: 0.02 });
        setTimeout(() => playTone(ctx, { type: "sine", freq: 1100, duration: 0.1, gain: 0.2, attack: 0.002 }), 60);
        return 300;
    },
    slack_sent: (ctx) => {
        playSequence(ctx,
            [{ freq: 784, dur: 0.08, gap: 0.02 }, { freq: 988, dur: 0.1, gap: 0 }],
            { type: "sine", gain: 0.22, attack: 0.003 }
        );
        return 400;
    },
    nintendo_1up: (ctx) => {
        playSequence(ctx,
            [
                { freq: 523, dur: 0.08, gap: 0.01 }, { freq: 659, dur: 0.08, gap: 0.01 },
                { freq: 784, dur: 0.08, gap: 0.01 }, { freq: 1047, dur: 0.15, gap: 0 },
            ],
            { type: "square", gain: 0.2, attack: 0.005 }
        );
        return 700;
    },
    zelda_secret: (ctx) => {
        playSequence(ctx,
            [
                { freq: 392, dur: 0.1, gap: 0.02 }, { freq: 523, dur: 0.1, gap: 0.02 },
                { freq: 659, dur: 0.1, gap: 0.02 }, { freq: 784, dur: 0.22, gap: 0 },
            ],
            { type: "triangle", gain: 0.22, attack: 0.01 }
        );
        return 900;
    },
    whatsapp_receive: (ctx) => {
        playTone(ctx, { type: "sine", freq: 440, duration: 0.06, gain: 0.3, attack: 0.002 });
        setTimeout(() => playTone(ctx, { type: "sine", freq: 880, duration: 0.09, gain: 0.25, attack: 0.002 }), 80);
        return 300;
    },
    discord_join: (ctx) => {
        playTone(ctx, { type: "sine", freq: 660, duration: 0.12, gain: 0.2, attack: 0.005, sweep: true, freq2: 880 });
        return 350;
    },
    mac_startup: (ctx) => {
        playChord(ctx, [261, 329, 392, 523], { type: "sine", duration: 1.8, gain: 0.18, attack: 0.04, release: 0.8 });
        return 2000;
    },
    coin: (ctx) => {
        playTone(ctx, { type: "square", freq: 987, duration: 0.04, gain: 0.25, attack: 0.001 });
        setTimeout(() => playTone(ctx, { type: "square", freq: 1319, duration: 0.15, gain: 0.22, attack: 0.001 }), 40);
        return 350;
    },
    soft_confirm: (ctx) => {
        playTone(ctx, { type: "sine", freq: 392, duration: 0.14, gain: 0.22, attack: 0.01 });
        setTimeout(() => playTone(ctx, { type: "sine", freq: 523, duration: 0.18, gain: 0.2, attack: 0.01 }), 100);
        return 400;
    },
    error_buzz: (ctx) => {
        playTone(ctx, { type: "sawtooth", freq: 150, duration: 0.22, gain: 0.28, attack: 0.005, release: 0.1 });
        return 350;
    },
};

/* ═══════════════════════════════════════
   DATA
═══════════════════════════════════════ */
const TOC = [
    { id: "sx-s1", label: "The Silent Crisis" },
    { id: "sx-s2", label: "Why Sound Works" },
    { id: "sx-s3", label: "Anatomy of a UX Sound" },
    { id: "sx-s4", label: "Case: Apple" },
    { id: "sx-s5", label: "Case: Nintendo" },
    { id: "sx-s6", label: "Case: Slack & Discord" },
    { id: "sx-s7", label: "The Wrong Way" },
    { id: "sx-s8", label: "Principles of Audio UX" },
    { id: "sx-s9", label: "The Future of Sound UX" },
];

const STATS = [
    { num: "82%", label: "of users say sound significantly affects their perception of product quality" },
    { num: "3×", label: "faster emotional response to audio feedback vs. visual feedback alone" },
    { num: "1%", label: "of product design budgets allocated to audio UX on average" },
];

const PRINCIPLES = [
    { num: "01", title: "Purposeful, Not Decorative", body: "Every sound must earn its place by carrying information. If removing it changes nothing for the user, remove it." },
    { num: "02", title: "Consistent Vocabulary", body: "Rising tones signal success; descending tones signal error. Establish a grammar and never break it without reason." },
    { num: "03", title: "Proportional to Importance", body: "Critical alerts are louder and more complex. Routine feedback is subtle. Hierarchy in audio mirrors hierarchy in visual design." },
    { num: "04", title: "Respectful of Context", body: "Design for silent mode. Every audio interaction must have a visual equivalent. Never assume the user can hear." },
    { num: "05", title: "Culturally Considered", body: "Sound carries cultural meaning. A tone that signals success in one context may signal alarm in another. Test across cultures." },
    { num: "06", title: "Off by Default or Opt-In", body: "For ambient or expressive sounds, give users control. Autonomy over audio is a basic UX courtesy." },
];

/* ═══════════════════════════════════════
   WAVEFORM COMPONENT
═══════════════════════════════════════ */
function WaveBars({ playing, count = 10, color }) {
    const heights = [40, 70, 55, 85, 45, 90, 60, 75, 50, 65,
        80, 40, 70, 55, 85].slice(0, count);
    return (
        <div className="sux-wave-bars">
            {heights.map((h, i) => (
                <div
                    key={i}
                    className={`sux-wave-bar${playing ? " playing" : ""}`}
                    style={{
                        height: `${h}%`,
                        animationDelay: playing ? `${i * 0.06}s` : "0s",
                        background: color || "var(--cyan)",
                    }}
                />
            ))}
        </div>
    );
}

/* ═══════════════════════════════════════
   SOUND PLAYER COMPONENT
═══════════════════════════════════════ */
function SoundPlayer({ title, subtitle, sounds }) {
    const [playing, setPlaying] = useState(null);
    const ctxRef = useRef(null);
    const timerRef = useRef(null);

    const getCtx = () => {
        if (!ctxRef.current) ctxRef.current = createAudioContext();
        return ctxRef.current;
    };

    const handlePlay = useCallback((id, preset) => {
        if (timerRef.current) clearTimeout(timerRef.current);
        const ctx = getCtx();
        const dur = SOUND_PRESETS[preset]?.(ctx) || 400;
        setPlaying(id);
        timerRef.current = setTimeout(() => setPlaying(null), dur + 100);
    }, []);

    useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

    return (
        <div className="sux-sound-section">
            <div className="sux-sound-header">
                <span className="sux-sound-header-icon">🎵</span>
                <span className="sux-sound-header-title">{title}</span>
                <span className="sux-sound-header-sub">{subtitle}</span>
            </div>
            <div className="sux-sound-grid">
                {sounds.map((s) => (
                    <div key={s.id} className="sux-sound-item" onClick={() => handlePlay(s.id, s.preset)}>
                        <button
                            className={`sux-play-btn${playing === s.id ? " playing" : ""}`}
                            aria-label={`Play ${s.name}`}
                        >
                            {playing === s.id ? "■" : "▶"}
                        </button>
                        <div className="sux-sound-info">
                            <div className="sux-sound-name">{s.name}</div>
                            <div className="sux-sound-desc">{s.desc}</div>
                        </div>
                        <div className="sux-sound-brand">{s.brand}</div>
                        <div className="sux-sound-viz">
                            <WaveBars playing={playing === s.id} count={12} color={s.color || "var(--cyan)"} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════
   HOOKS
═══════════════════════════════════════ */
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
            o.observe(el); return o;
        });
        return () => obs.forEach((o) => o && o.disconnect());
    }, [ids]);
    return active;
}

function useReveal() {
    const ref = useRef(null);
    useEffect(() => {
        const el = ref.current; if (!el) return;
        const o = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) el.classList.add("sux-visible"); },
            { threshold: 0.06 }
        );
        o.observe(el); return () => o.disconnect();
    }, []);
    return ref;
}

/* ═══════════════════════════════════════
   SMALL COMPONENTS
═══════════════════════════════════════ */
function Reveal({ children, delay }) {
    const ref = useReveal();
    return (
        <div ref={ref} className="sux-reveal" style={delay ? { transitionDelay: `${delay}ms` } : {}}>
            {children}
        </div>
    );
}

function SecMarker({ id, num, label, title }) {
    return (
        <Reveal>
            <div id={id} style={{ paddingTop: 8 }}>
                <div className="sux-sec-label">{label}</div>
                <div className="sux-sec">
                    <span className="sux-sec-num">{num}</span>
                    <div className="sux-sec-line" />
                    <h2 className="sux-h2">{title}</h2>
                </div>
            </div>
        </Reveal>
    );
}

function P({ children }) { return <p className="sux-p">{children}</p>; }
function PullQuote({ children, attr }) {
    return (
        <Reveal>
            <div className="sux-pull">
                <div className="sux-pull-text">{children}</div>
                {attr && <span className="sux-pull-attr">{attr}</span>}
            </div>
        </Reveal>
    );
}
function Callout({ title, items }) {
    return (
        <Reveal>
            <div className="sux-callout">
                <div className="sux-callout-title">{title}</div>
                <ul>{items.map((it, i) => <li key={i}>{it}</li>)}</ul>
            </div>
        </Reveal>
    );
}
function Note({ children }) {
    return <Reveal><div className="sux-note">{children}</div></Reveal>;
}
function CaseStudy({ company, title, children }) {
    return (
        <Reveal>
            <div className="sux-case">
                <div className="sux-case-head">
                    <div className="sux-case-left">
                        <span className="sux-case-badge">Case Study</span>
                        <span className="sux-case-title">{title}</span>
                    </div>
                    <span className="sux-case-company">{company}</span>
                </div>
                <div className="sux-case-body">{children}</div>
            </div>
        </Reveal>
    );
}

/* ═══════════════════════════════════════
   MAIN EXPORT
═══════════════════════════════════════ */
export default function SoundAsUX() {
    const progress = useScrollProgress();
    const activeId = useActiveSection(TOC.map((t) => t.id));

    useEffect(() => {
        const id = "sux-global-styles";
        if (!document.getElementById(id)) {
            const s = document.createElement("style");
            s.id = id; s.textContent = GLOBAL_CSS;
            document.head.appendChild(s);
        }
    }, []);

    const scrollTo = useCallback((id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, []);

    return (
        <div className="sux">
            <div className="sux-progress" style={{ width: `${progress}%` }} />

            <div className="sux-shell">

                {/* TOC */}
                <aside className="sux-toc-col">
                    <div className="sux-toc-label">Contents</div>
                    <ul className="sux-toc-list">
                        {TOC.map((t) => (
                            <li key={t.id}>
                                <button
                                    className={`sux-toc-btn${activeId === t.id ? " active" : ""}`}
                                    onClick={() => scrollTo(t.id)}
                                >{t.label}</button>
                            </li>
                        ))}
                    </ul>
                </aside>

                {/* MAIN */}
                <main className="sux-main">

                    {/* HERO */}
                    <header className="sux-hero">
                        <Reveal>
                            <div className="sux-eyebrow">
                                <span className="sux-eyebrow-dot" />
                                Audio Design · UX Craft · Product Experience
                            </div>
                            <h1 className="sux-h1">Sound as <em>UX</em></h1>
                            <p className="sux-subtitle">
                                The criminally underinvested discipline of audio design
                                in digital products — and the companies doing it right.
                            </p>
                            <div className="sux-meta">
                                {["May 2026", "8 min read", "Deep Dive + Interactive"].map((m) => (
                                    <span key={m} className="sux-meta-item">
                                        <span className="sux-meta-dot" />{m}
                                    </span>
                                ))}
                            </div>
                            <div className="sux-tags">
                                {["Audio UX", "Sound Design", "Product Design", "Case Studies", "Interactive"].map((t) => (
                                    <span key={t} className="sux-tag">{t}</span>
                                ))}
                            </div>
                        </Reveal>
                    </header>

                    {/* INTRO */}
                    <Reveal>
                        <P>
                            Close your eyes and open your banking app. Now your music player. Now your favourite game.
                            You don't need to see them — you already know what they sound like. Or rather, you know
                            what most of them <em>don't</em> sound like: nothing. A void. The same silence that greets
                            you whether you've successfully transferred money, accidentally deleted a file, or hit
                            the wrong button entirely.
                        </P>
                        <P>
                            Sound is the most emotionally direct channel available to a product designer. It bypasses
                            cognition, landing in the limbic system before the prefrontal cortex has had a chance to
                            process what happened. It communicates faster than text, more precisely than color, and
                            more memorably than either. And yet in the hierarchy of design investment — visual design,
                            interaction design, motion design, copywriting — audio sits dead last, an afterthought
                            usually delegated to a single engineer with a royalty-free sound library and no brief.
                        </P>
                        <P>
                            This is not a minor oversight. It is a <strong>multi-billion-dollar mistake</strong> that
                            the best companies in the world have quietly corrected, building sonic identities as
                            carefully considered as their visual ones — and reaping measurable returns in user
                            satisfaction, brand recognition, and emotional loyalty.
                        </P>
                    </Reveal>

                    <PullQuote attr="— The core argument for audio UX investment">
                        "Sound reaches the emotional brain 200 milliseconds faster than vision. Every silent
                        interface is a missed opportunity to communicate, reassure, and delight — at the speed
                        of feeling."
                    </PullQuote>

                    {/* ── S1 ── */}
                    <SecMarker id="sx-s1" num="01" label="The Problem" title="The Silent Crisis in Digital Design" />
                    <Reveal>
                        <P>
                            The numbers tell an uncomfortable story. Despite sound being one of the oldest and most
                            instinctive forms of human communication, digital product teams allocate less than 1% of
                            their design budget to audio. The average app has fewer than three distinct sounds, all
                            of them sourced from system defaults or stock libraries. Most enterprise software has none.
                        </P>
                    </Reveal>

                    <Reveal>
                        <div className="sux-stats">
                            {STATS.map((s) => (
                                <div key={s.num} className="sux-stat">
                                    <div className="sux-stat-num">{s.num}</div>
                                    <div className="sux-stat-label">{s.label}</div>
                                </div>
                            ))}
                        </div>
                    </Reveal>

                    <Reveal>
                        <P>
                            The reasons for this neglect are structural. Sound design requires a specialist skill set
                            that sits uncomfortably between music composition, acoustic psychology, and UX research —
                            a combination almost no design school teaches as a unified discipline. It is also
                            notoriously difficult to test: user research on audio UX requires controlled conditions
                            that standard usability labs are not set up for. And unlike visual design, bad audio is
                            often worse than no audio — a badly timed beep or an incongruent notification sound
                            creates more friction than silence would.
                        </P>
                        <P>
                            So teams default to silence. And in doing so, they surrender one of the most powerful
                            tools in the designer's kit — one that the best companies have quietly turned into a
                            competitive advantage.
                        </P>
                    </Reveal>

                    {/* ── S2 ── */}
                    <SecMarker id="sx-s2" num="02" label="The Science" title="Why Sound Works on Us" />
                    <Reveal>
                        <P>
                            To understand why audio UX matters so much, you need a brief tour of how the auditory
                            system actually works. Unlike visual processing, which involves a relatively long pathway
                            through the visual cortex before reaching areas associated with emotion and memory,
                            auditory signals travel a shorter route — directly engaging the amygdala, the brain's
                            primary emotional processing center.
                        </P>
                        <P>
                            This is not metaphor. It is neuroscience. Sound literally reaches the emotional brain
                            before it reaches the reasoning brain. This means that a well-designed notification sound
                            can communicate "success, you're safe, proceed" before the user has consciously read a
                            single word of interface copy. It also means a poorly designed one can trigger a subtle
                            anxiety response that the user will attribute to the product as a whole without being
                            able to explain why.
                        </P>
                    </Reveal>

                    <Reveal>
                        <div className="sux-highlight">
                            <h3>The Earcon Principle</h3>
                            <p>
                                Designers working in audio UX use the term <strong>earcon</strong> — the audio equivalent
                                of an icon. Just as an icon is a compressed visual symbol that carries meaning without
                                words, an earcon is a brief audio signal that communicates a specific state or action.
                                The best earcons are immediately recognizable, emotionally congruent with their meaning,
                                and distinct enough to be identified even in noisy environments. Designing a good earcon
                                requires the same systematic thinking as designing a good icon — and the same rigor in
                                testing whether it communicates what it's meant to communicate.
                            </p>
                        </div>
                    </Reveal>

                    <Reveal>
                        <P>
                            Sound also has a unique relationship with memory and brand identity. Research in audio
                            branding consistently shows that sonic logos — the Intel bong, the Netflix "ta-dum," the
                            McDonald's "ba da ba ba baa" — achieve brand recall rates 20–30% higher than visual logos
                            alone. Applied to product interfaces, this means that a distinctive, well-designed sound
                            vocabulary makes a product feel more coherent, more trustworthy, and more memorable than
                            its visually equivalent counterpart.
                        </P>
                    </Reveal>

                    {/* ── S3 ── */}
                    <SecMarker id="sx-s3" num="03" label="Craft" title="Anatomy of a UX Sound" />
                    <Reveal>
                        <P>
                            What makes a UX sound good? The answer is more precise than most designers expect.
                            Audio UX operates with a vocabulary of acoustic parameters — frequency, duration, timbre,
                            envelope, and harmonic content — each of which maps to specific psychological effects.
                            Understanding these mappings is the foundation of intentional sound design.
                        </P>
                    </Reveal>

                    <Reveal>
                        <div className="sux-table-wrap">
                            <table className="sux-table">
                                <thead>
                                    <tr>
                                        <th>Parameter</th>
                                        <th>Low / Short</th>
                                        <th>High / Long</th>
                                        <th>UX Application</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        ["Frequency (pitch)", "Authority, gravity, warning", "Delight, clarity, notification", "Errors: low. Success: mid-high"],
                                        ["Duration", "Quick feedback, low interruption", "Emphasis, ceremony, attention", "Routine: <150ms. Milestone: 500ms+"],
                                        ["Attack (onset)", "Urgent, sharp, alert", "Warm, gentle, ambient", "Alerts: fast attack. Ambience: slow"],
                                        ["Timbre", "Sine/triangle = soft, digital", "Sawtooth = edge, urgency", "Tone type sets emotional register"],
                                        ["Harmonic content", "Simple = clear, unambiguous", "Complex = rich, premium feel", "Clarity vs. brand expression"],
                                        ["Directionality", "Stereo spread = spatial, immersive", "Mono = neutral, functional", "Games vs. productivity tools"],
                                    ].map(([a, b, c, d]) => (
                                        <tr key={a}>
                                            <td>{a}</td>
                                            <td style={{ color: "var(--ash2)" }}>{b}</td>
                                            <td style={{ color: "var(--ash2)" }}>{c}</td>
                                            <td style={{ color: "var(--cyan)" }}>{d}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Reveal>

                    <Note>
                        The most common audio UX mistake is using a descending tone for a success state or an
                        ascending tone for an error. Pitch direction is one of the most deeply conditioned sonic
                        expectations in human psychology. Violating it creates unconscious dissonance that erodes
                        product trust without users being able to name the cause.
                    </Note>

                    {/* INTERACTIVE PLAYER 1 — Feedback Sounds */}
                    <Reveal>
                        <SoundPlayer
                            title="Feedback Sound Comparison"
                            subtitle="Click to hear — synthesized in your browser"
                            sounds={[
                                { id: "s1", name: "Success Tone", desc: "Ascending two-note — warm sine wave. Communicates 'done, proceed'.", brand: "Apple-style", preset: "apple_success", color: "#4ADE80" },
                                { id: "s2", name: "Error Tone", desc: "Low descending sawtooth — signals 'stop, something's wrong'.", brand: "System UI", preset: "apple_error", color: "#F87171" },
                                { id: "s3", name: "Soft Confirm", desc: "Gentle ascending chord — minimal, non-intrusive acknowledgment.", brand: "Ambient UI", preset: "soft_confirm", color: "#00D4FF" },
                                { id: "s4", name: "Error Buzz", desc: "Low-frequency buzz — visceral, impossible to miss or misread.", brand: "Alert System", preset: "error_buzz", color: "#F59E0B" },
                            ]}
                        />
                    </Reveal>

                    {/* ── S4 ── */}
                    <SecMarker id="sx-s4" num="04" label="Case Study" title="Apple: The Gold Standard" />
                    <CaseStudy company="Apple Inc." title="Building a Sonic Identity Across a Decade">
                        <P>
                            Apple's audio UX is the most studied and most imitated in the industry — for good reason.
                            Beginning with the original Macintosh startup chime in 1984, designed by Jim Reekes,
                            Apple has treated sound as a first-class design material, applying the same systematic
                            thinking to its audio vocabulary that it applies to its visual one.
                        </P>
                        <P>
                            The principles are consistent across thirty years of iteration: sounds are short (rarely
                            exceeding 500ms for UI feedback), harmonically simple (sine and triangle waves dominate,
                            avoiding the anxious quality of sawtooth or square), and carefully tuned to the frequency
                            range that sits comfortably above the noise floor of most environments — typically
                            between 800Hz and 1.2kHz for primary feedback tones.
                        </P>
                        <P>
                            What distinguishes Apple's approach is not just the quality of individual sounds but
                            the coherence of the system. Success states, error states, notifications, and transitions
                            share a recognizable tonal family — related by harmonic content and attack character
                            even when they differ in pitch and duration. The result is a sonic language that feels
                            unified even as it communicates a wide range of states.
                        </P>
                        <P>
                            Apple's investment in this discipline is substantial. The company employs dedicated
                            sound designers who work in close collaboration with hardware engineers (sound design
                            changes with hardware resonance characteristics), software interaction designers, and
                            accessibility teams. No sound ships without extensive testing across use environments,
                            hearing ability ranges, and cultural contexts.
                        </P>
                    </CaseStudy>

                    {/* INTERACTIVE PLAYER 2 — Apple-Style */}
                    <Reveal>
                        <SoundPlayer
                            title="Apple-Inspired Sound Palette"
                            subtitle="Synthesized approximations — click to experience"
                            sounds={[
                                { id: "a1", name: "Notification Chime", desc: "The two-note ascending pattern that signals an incoming message. Warm, clear, non-alarming.", brand: "iOS", preset: "apple_success", color: "#4ADE80" },
                                { id: "a2", name: "Mac Startup Chord", desc: "A major chord with slow attack and long sustain. Ceremonial, warm, familiar. One of the most recognized sounds in tech.", brand: "macOS", preset: "mac_startup", color: "#00D4FF" },
                                { id: "a3", name: "UI Error State", desc: "Short descending tone. Communicates 'invalid input' without alarm or shame.", brand: "iOS / macOS", preset: "apple_error", color: "#F87171" },
                            ]}
                        />
                    </Reveal>

                    {/* ── S5 ── */}
                    <SecMarker id="sx-s5" num="05" label="Case Study" title="Nintendo: Sound as World-Building" />
                    <CaseStudy company="Nintendo" title="When Audio UX Becomes Cultural Memory">
                        <P>
                            Nintendo's relationship with audio design is unique in the industry because it collapses
                            the boundary between UI sound and narrative sound. In most digital products, audio UX
                            is strictly functional — feedback, alerts, notifications. In Nintendo's products, the
                            sonic vocabulary of the interface becomes indistinguishable from the sonic vocabulary
                            of the experience itself. The coin collect sound in Mario is simultaneously a reward
                            signal, a score increment notification, and a piece of world-building.
                        </P>
                        <P>
                            This integration is not accidental. Nintendo's sound designers — including the legendary
                            Koji Kondo — have consistently treated audio as a narrative tool first and a feedback
                            mechanism second. The result is a set of interaction sounds so emotionally loaded that
                            they have entered cultural memory across generations. The 1-Up sound, the Zelda secret
                            discovery chime, the Pokémon level-up fanfare: these are not merely feedback tones.
                            They are emotionally conditioned reward signals that have been reinforced through hundreds
                            of hours of positive association.
                        </P>
                        <P>
                            The lesson for product designers is not "add 8-bit sounds to your app." It is: <strong>
                                sounds that carry narrative meaning become emotionally sticky in ways that purely
                                functional sounds do not.</strong> When a sound is associated with a moment of success,
                            discovery, or reward, it accumulates emotional charge with each repetition. That charge
                            becomes brand equity.
                        </P>
                    </CaseStudy>

                    {/* INTERACTIVE PLAYER 3 — Nintendo */}
                    <Reveal>
                        <SoundPlayer
                            title="Nintendo Iconic Earcons"
                            subtitle="Synthesized recreations — the sounds that built a culture"
                            sounds={[
                                { id: "n1", name: "1-Up Mushroom", desc: "Four ascending square-wave notes. One of the most universally recognized reward sounds ever designed.", brand: "Super Mario", preset: "nintendo_1up", color: "#4ADE80" },
                                { id: "n2", name: "Secret Discovery", desc: "The ascending four-note chime that signals 'you found something hidden.' Pure positive reinforcement.", brand: "Zelda Series", preset: "zelda_secret", color: "#F59E0B" },
                                { id: "n3", name: "Coin Collect", desc: "Short, bright, percussive. Hundreds of millions of people know exactly what this means.", brand: "Super Mario", preset: "coin", color: "#00D4FF" },
                            ]}
                        />
                    </Reveal>

                    {/* ── S6 ── */}
                    <SecMarker id="sx-s6" num="06" label="Case Study" title="Slack & Discord: The Social Soundscape" />
                    <CaseStudy company="Slack / Discord" title="Designing Sound for Ambient Awareness">
                        <P>
                            Communication platforms present a unique audio UX challenge: their sounds are heard
                            repeatedly throughout a workday, in diverse environments, by users with widely varying
                            sensitivity to auditory interruption. The margin for error is thin. A notification sound
                            that is even slightly grating will cause users to mute the app entirely — losing all
                            audio feedback permanently. A sound that is too quiet will be missed, causing users to
                            feel disconnected from their team.
                        </P>
                        <P>
                            Slack's audio identity, developed in collaboration with sound designer Jim Lavery, solved
                            this problem through what the team called "acoustic warmth" — a deliberate choice to use
                            harmonically rich but short sounds in a frequency range that feels organic rather than
                            electronic. The notification pop is brief (under 100ms), pitched in a mid-range that
                            cuts through ambient noise without dominating it, and shaped with a fast attack and
                            slow decay that gives it a percussive quality without harshness.
                        </P>
                        <P>
                            Discord took a different approach, targeting a younger, gaming-adjacent audience with
                            higher tolerance for expressive sound design. The join/leave sounds in voice channels —
                            a brief ascending or descending sweep — are distinctive enough to communicate state
                            changes unambiguously even in chaotic multi-tab browser environments. They have become
                            so associated with Discord's brand that they are instantly recognizable to hundreds of
                            millions of users.
                        </P>
                    </CaseStudy>

                    {/* INTERACTIVE PLAYER 4 — Messaging */}
                    <Reveal>
                        <SoundPlayer
                            title="Communication Platform Sounds"
                            subtitle="The sounds of digital social life"
                            sounds={[
                                { id: "m1", name: "Message Received", desc: "Slack's signature pop — brief, warm, organic. Designed to feel like a gentle tap on the shoulder, not an alarm.", brand: "Slack", preset: "slack_pop", color: "#4ADE80" },
                                { id: "m2", name: "Message Sent", desc: "Confirmation of send action — two ascending notes. 'Your message is on its way.'", brand: "Slack", preset: "slack_sent", color: "#00D4FF" },
                                { id: "m3", name: "User Joined Voice", desc: "Ascending sweep — 'someone arrived.' Discord's most recognized sound.", brand: "Discord", preset: "discord_join", color: "#7C3AED" },
                                { id: "m4", name: "WhatsApp Receive", desc: "The double-tone notification that signals a new message. Billions of daily exposures.", brand: "WhatsApp", preset: "whatsapp_receive", color: "#25D366" },
                            ]}
                        />
                    </Reveal>

                    {/* ── S7 ── */}
                    <SecMarker id="sx-s7" num="07" label="Anti-Patterns" title="The Wrong Way to Do Audio UX" />
                    <Reveal>
                        <P>
                            For every Apple and Nintendo, there are a hundred products that have gotten audio UX
                            badly wrong — and understanding these failures is as instructive as studying the successes.
                            The pathologies of bad audio UX are remarkably consistent.
                        </P>
                    </Reveal>

                    <Callout
                        title="The most common audio UX failures"
                        items={[
                            "Stock library sounds — using royalty-free audio that carries no brand identity and often conflicts with the product's visual register",
                            "Frequency mismatch — using high-frequency, sharp tones for routine feedback, creating unnecessary stress responses",
                            "Duration crime — sounds longer than 300ms for routine UI actions; users will disable audio entirely within days",
                            "The missing off switch — playing audio in contexts where users cannot control or mute it (especially in enterprise software)",
                            "Asymmetric volume — notification sounds significantly louder than ambient interaction sounds, creating startle responses",
                            "Semantic inconsistency — using similar tones for success and error states; users cannot build reliable mental models",
                            "Cultural tone-deafness — deploying Western-tuned notification sounds in markets where those frequencies carry different cultural meaning",
                        ]}
                    />

                    <Reveal>
                        <P>
                            The most damaging failure is also the most common: treating audio as a feature to be
                            added at the end of development rather than a design dimension to be considered from
                            the beginning. Sound that is retrofitted onto an already-completed interaction model
                            almost always feels incongruent — because it was not considered when the interaction's
                            timing, rhythm, and emotional arc were being designed. Good audio UX is co-designed
                            with the interaction, not applied to it afterward.
                        </P>
                    </Reveal>

                    <Reveal>
                        <div className="sux-large-q">
                            The question is never "should we add sound to this?"
                            The question is <span>"what is this moment already
                                communicating, and how does sound complete it?"</span>
                        </div>
                    </Reveal>

                    {/* ── S8 ── */}
                    <SecMarker id="sx-s8" num="08" label="Framework" title="Principles of Audio UX Design" />
                    <Reveal>
                        <P>
                            What emerges from studying the best and worst of audio UX is a set of principles robust
                            enough to guide practice across very different product contexts — from enterprise tools
                            to consumer games, from mobile apps to voice interfaces.
                        </P>
                    </Reveal>

                    <Reveal>
                        <div className="sux-principles">
                            {PRINCIPLES.map((p, i) => (
                                <div key={p.num} className="sux-pr-card">
                                    <div className="sux-pr-num">{p.num}</div>
                                    <h3>{p.title}</h3>
                                    <p>{p.body}</p>
                                </div>
                            ))}
                        </div>
                    </Reveal>

                    <Reveal>
                        <P>
                            Underlying all of these principles is a single truth: <strong>audio UX is not about
                                adding sounds to a product. It is about designing a complete sensory experience
                                where every channel — visual, haptic, and auditory — communicates coherently.</strong>{" "}
                            The absence of sound is itself a design decision. It should be made intentionally, not
                            by default.
                        </P>
                    </Reveal>

                    {/* ── S9 ── */}
                    <SecMarker id="sx-s9" num="09" label="Future" title="The Future of Sound UX" />
                    <Reveal>
                        <P>
                            Three forces are converging to push audio UX from a niche concern to a mainstream
                            design discipline. The first is the rise of voice-native and ambient interfaces —
                            smart speakers, earbuds, AR glasses — where sound is the primary output channel and
                            visual design is secondary or absent. Designers who have not developed audio UX
                            competencies will be unable to practice effectively in these environments.
                        </P>
                        <P>
                            The second is the maturation of generative audio AI. Systems like ElevenLabs, Suno,
                            and Adobe's audio tools are making high-quality sound design accessible without
                            requiring years of acoustic engineering expertise. This democratization will lower
                            the barrier to entry for audio UX — but it will also flood markets with mediocre,
                            generic sound design generated by teams who haven't developed the underlying principles.
                            As with visual AI tools, the advantage will go to designers who understand the craft
                            well enough to direct and evaluate AI output, not just generate it.
                        </P>
                        <P>
                            The third force is accessibility. As voice interfaces become primary for users with
                            visual impairments, and as haptic feedback reaches its physical limits on thin mobile
                            hardware, audio becomes the most important remaining channel for communicating product
                            state to the full range of users. The legal and ethical pressure to design accessible
                            audio experiences — not just accessible visual ones — is building steadily.
                        </P>
                    </Reveal>

                    <PullQuote attr="— On the near future of audio UX">
                        "Every interface will need a sound designer within a decade, for the same reason every
                        interface needs a visual designer today. The products that invest now will own the
                        emotional vocabulary of whatever comes next."
                    </PullQuote>

                    <Reveal>
                        <P>
                            The companies profiled in this piece — Apple, Nintendo, Slack, Discord — did not invest
                            in audio UX because they had spare budget. They invested because they understood that
                            every sensory channel is a relationship channel. Sound is how a product says <em>I see
                                you, I heard you, you're on the right track.</em> In a world of increasing digital
                            noise, the product that knows when to speak and what to say — and how to say it in
                            200 milliseconds — will be the one users come back to.
                        </P>
                        <P>
                            The discipline is not niche. It is not optional. It is simply, for most of the industry,
                            not yet begun.
                        </P>
                    </Reveal>

                    {/* FINAL INTERACTIVE PLAYER */}
                    <Reveal>
                        <SoundPlayer
                            title="Full Sound Vocabulary Demo"
                            subtitle="Hear the full emotional range of a well-designed audio system"
                            sounds={[
                                { id: "f1", name: "Task Complete", desc: "Mid-range ascending — 'you're done, move forward.'", brand: "Success", preset: "soft_confirm", color: "#4ADE80" },
                                { id: "f2", name: "Critical Error", desc: "Low-frequency alert — impossible to miss, communicates urgency without panic.", brand: "Error", preset: "error_buzz", color: "#F87171" },
                                { id: "f3", name: "Milestone Reward", desc: "Rising sequence — 'you achieved something meaningful.' Dopamine-triggering by design.", brand: "Achievement", preset: "nintendo_1up", color: "#F59E0B" },
                                { id: "f4", name: "New Message", desc: "Non-intrusive notification — 'something awaits when you're ready.'", brand: "Notify", preset: "slack_pop", color: "#00D4FF" },
                                { id: "f5", name: "Discovery Moment", desc: "Four-note ascending chime — 'you found something hidden.' Pure positive reinforcement.", brand: "Delight", preset: "zelda_secret", color: "#A78BFA" },
                            ]}
                        />
                    </Reveal>

                    {/* FOOTER */}
                    <Reveal>
                        <div className="sux-footer">
                            <span className="sux-footer-text">Sound Design · UX Craft · May 2026</span>
                            <button className="sux-top-btn" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                                ↑ Back to top
                            </button>
                        </div>
                    </Reveal>

                </main>
            </div>
        </div>
    );
}