import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

export default function NavBar({ activeSectionId }) {
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
                    className={activeSectionId === l.id ? 'active' : ''}
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
            BM
          </Link>
        </div>

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

          <div
            className={`menu-links ${menuOpen ? 'open' : ''}`}
          >
            <li>
              <Link
                to="/#about"
                className={activeSectionId === 'about' ? 'active' : ''}
                onClick={handleLinkClick}
              >
                // about
              </Link>
            </li>
            <li>
              <Link
                to="/#projects"
                className={activeSectionId === 'projects' ? 'active' : ''}
                onClick={handleLinkClick}
              >
                // work
              </Link>
            </li>
            <li>
              <Link
                to="/#contact"
                className={activeSectionId === 'contact' ? 'active' : ''}
                onClick={handleLinkClick}
              >
                Let's Chat
              </Link>
            </li>
          </div>
        </div>
      </nav>
    </>
  );
}

