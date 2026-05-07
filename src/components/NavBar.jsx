import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function NavBar({ activeSectionId }) {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return;

    const onDocumentClick = (event) => {
      const container = containerRef.current;
      if (!container) return;
      if (!container.contains(event.target)) setMenuOpen(false);
    };

    document.addEventListener('click', onDocumentClick);
    return () => document.removeEventListener('click', onDocumentClick);
  }, [menuOpen]);

  const links = [
    { id: 'about', label: '// about', to: '/#about' },
    { id: 'projects', label: '// work', to: '/#projects' },
    { id: 'blogs', label: '// blogs', to: '/blogs' },
    { id: 'contact', label: "Let's Chat", to: '/#contact', isCta: true },
  ];

  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  return (
    <>
      <nav id="desktop-nav">
        <div className="logo">
          <Link to="/#profile" aria-label="Go to top">
            Braxton<span className="accent">.</span>dev
          </Link>
        </div>
        <div className="nav-actions">
          <ul className="nav-links">
            {links.map((l) =>
              l.isCta ? (
                <li key={l.id}>
                  <Link
                    to={l.to}
                    className={`btn-nav ${activeSectionId === l.id ? 'active' : ''}`}
                    onClick={handleLinkClick}
                  >
                    {l.label}
                  </Link>
                </li>
              ) : (
                <li key={l.id}>
                  <Link
                    to={l.to}
                    className={
                      (l.id === 'blogs' && location.pathname === '/blogs') ||
                      activeSectionId === l.id
                        ? 'active'
                        : ''
                    }
                    onClick={handleLinkClick}
                  >
                    {l.label}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </div>
      </nav>

      <nav id="hamburger-nav">
        <div className="logo">
          <Link to="/#profile" aria-label="Go to top">
            BM<span className="accent">.</span>
          </Link>
        </div>

        <div className={`menu-overlay ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(false)}></div>

        <div className="hamburger-menu" ref={containerRef}>
          <div
            className={`hamburger-icon ${menuOpen ? 'open' : ''}`}
            role="button"
            tabIndex={0}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') setMenuOpen((v) => !v);
            }}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>

          <div className={`menu-links ${menuOpen ? 'open' : ''}`}>
            <div className="menu-header">
              <span className="menu-label">Navigation</span>
            </div>
            <ul className="menu-list">
              {links.map((l) => (
                <li key={l.id}>
                  <Link
                    to={l.to}
                    className={`${l.isCta ? 'menu-cta' : ''} ${
                      (l.id === 'blogs' && location.pathname === '/blogs') ||
                      activeSectionId === l.id
                        ? 'active'
                        : ''
                    }`}
                    onClick={handleLinkClick}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="menu-footer">
              <p>© 2026 Braxton Mandara</p>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

