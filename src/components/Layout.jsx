import { Outlet, useLocation } from 'react-router-dom';
import { useEffect, useMemo, useRef, useState } from 'react';
import ParticlesBackground from './ParticlesBackground.jsx';
import NavBar from './NavBar.jsx';
import useRevealAnimations from '../hooks/useRevealAnimations.js';

export default function Layout() {
  const location = useLocation();
  const locationKey = useMemo(
    () => `${location.pathname}:${location.search}:${location.hash}`,
    [location.pathname, location.search, location.hash],
  );

  const [activeSectionId, setActiveSectionId] = useState('profile');
  const activeSectionRef = useRef('profile');

  useRevealAnimations(locationKey);

  useEffect(() => {
    // Smooth scroll to a hash target when navigating (SPA routing).
    if (!location.hash) return;
    const id = location.hash.replace('#', '');
    const el = document.querySelector(`#root #${id}`);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [locationKey]);

  useEffect(() => {
    // Because the legacy static HTML still exists (but is hidden), we must scope
    // all DOM queries to inside React's `#root` to avoid duplicate-ID issues.
    const progressBar = document.querySelector('#root #progress-bar');
    const scrollBtn = document.querySelector('#root #scrollToTopBtn');
    if (!progressBar && !scrollBtn) return;

    const handleScroll = () => {
      const doc = document.documentElement;
      const scrollTop = doc.scrollTop || window.scrollY;
      const docHeight = doc.scrollHeight - doc.clientHeight;

      if (progressBar) {
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        progressBar.style.width = `${progress}%`;
      }

      if (scrollBtn) {
        if (window.scrollY > 500) scrollBtn.classList.add('visible');
        else scrollBtn.classList.remove('visible');
      }

      // Nav active state: mimic original index.html script.js logic.
      const sections = Array.from(document.querySelectorAll('#root section[id]'));
      if (sections.length === 0) return;

      const triggerLine = window.innerHeight * 0.35;
      let currentSection = 'profile';

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= triggerLine && rect.bottom >= triggerLine) {
          currentSection = section.id;
        }
      });

      if (currentSection !== activeSectionRef.current) {
        activeSectionRef.current = currentSection;
        setActiveSectionId(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // init

    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  return (
    <>
      <ParticlesBackground />
      <div id="progress-bar" />
      <NavBar activeSectionId={activeSectionId} />

      <div>
        <Outlet />
      </div>

      <button
        id="scrollToTopBtn"
        className="scroll-top-btn"
        aria-label="Scroll to top"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="12" y1="19" x2="12" y2="5"></line>
          <polyline points="5 12 12 5 19 12"></polyline>
        </svg>
      </button>
    </>
  );
}

