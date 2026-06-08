import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import useTheme from '../hooks/useTheme.js';

function SunIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="sun-icon"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="moon-icon"
    >
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  );
}

export default function NavBar({ activeSectionId }) {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const containerRef = useRef(null);
  const { theme, toggleTheme } = useTheme();

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
            <li>
              <button
                className="theme-toggle-btn"
                onClick={toggleTheme}
                aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
              </button>
            </li>
          </ul>
        </div>
      </nav>

      <nav id="hamburger-nav">
        <div className="logo">
          <Link to="/#profile" aria-label="Go to top">
            BM<span className="accent">.</span>
          </Link>
        </div>

        <div className="nav-actions-mobile">
          <button
            className="theme-toggle-btn"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>

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
                <p>© {new Date().getFullYear()} Braxton Mandara</p>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

