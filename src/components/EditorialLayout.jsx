import { useEffect, useRef, useState, useCallback, useMemo } from 'react';

/* ── Common Reveal Hook ── */
export function useReveal(threshold = 0.07, visibleClass = 'visible') {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const o = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) el.classList.add(visibleClass);
      },
      { threshold },
    );
    o.observe(el);
    return () => o.disconnect();
  }, [threshold, visibleClass]);
  return ref;
}

/* ── Common Scroll Progress Hook ── */
export function useScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const fn = () => {
      const el = document.documentElement;
      const s = el.scrollTop || document.body.scrollTop;
      const t = el.scrollHeight - el.clientHeight;
      setP(t ? (s / t) * 100 : 0);
    };
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);
  return p;
}

/* ── Common Active Section Hook ── */
export function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0]);

  useEffect(() => {
    if (!ids || ids.length === 0) return;

    // Use a single observer for all elements if possible,
    // or at least avoid re-creating on every render.
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { rootMargin: '-15% 0px -75% 0px' }
    );

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [ids]);

  return active;
}

/* ── Shared UI Components ── */
function ReadingProgress({ color }) {
  const progress = useScrollProgress();
  return (
    <div
      className="editorial-progress"
      style={{ width: `${progress}%`, background: color }}
    />
  );
}

export function Reveal({ children, delay, threshold, visibleClass, className, style }) {
  const ref = useReveal(threshold, visibleClass);
  return (
    <div
      ref={ref}
      className={className}
      style={{ ...style, transitionDelay: delay ? `${delay}ms` : undefined }}
    >
      {children}
    </div>
  );
}

export default function EditorialLayout({
  children,
  toc = [],
  className = '',
  progressColor = 'var(--accent)',
  heroData = {},
}) {
  const tocIds = useMemo(() => toc.map((t) => t.id), [toc]);
  const activeId = useActiveSection(tocIds);

  const scrollTo = useCallback((id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  return (
    <div className={`editorial-root ${className}`}>
      {/* Reading Progress */}
      <ReadingProgress color={progressColor} />

      <div className="editorial-shell">
        {/* Table of Contents */}
        {toc.length > 0 && (
          <aside className="editorial-toc-col">
            <div className="editorial-toc-label">Contents</div>
            <ul className="editorial-toc-list">
              {toc.map((item) => (
                <li key={item.id}>
                  <button
                    className={`editorial-toc-item ${activeId === item.id ? 'active' : ''}`}
                    onClick={() => scrollTo(item.id)}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </aside>
        )}

        {/* Main Content */}
        <main className="editorial-main">
          {heroData.title && (
            <header className="editorial-hero">
              <Reveal className="editorial-reveal">
                {heroData.eyebrow && (
                  <div className="editorial-hero-eyebrow">{heroData.eyebrow}</div>
                )}
                <h1 className="editorial-h1" dangerouslySetInnerHTML={{ __html: heroData.title }} />
                {heroData.subtitle && <p className="editorial-hero-sub">{heroData.subtitle}</p>}
                <div className="editorial-meta">
                  {heroData.meta?.map((m, i) => (
                    <span key={i} className="editorial-meta-item">
                      <span className="editorial-meta-dot" />
                      {m}
                    </span>
                  ))}
                </div>
                {heroData.tags && (
                  <div className="editorial-tags">
                    {heroData.tags.map((t) => (
                      <span key={t} className="editorial-tag">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </Reveal>
            </header>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
