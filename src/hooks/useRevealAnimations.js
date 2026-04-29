import { useEffect } from 'react';

function animateCount(el) {
  // Extract number from text (e.g. "03+" -> 3)
  const originalText = el.innerText;
  const target = parseInt(originalText.replace(/\D/g, ''), 10);
  const suffix = originalText.replace(/[0-9]/g, '');

  if (!target) return;

  const duration = 1500;
  const start = performance.now();

  const step = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    // Easing function for smooth stop
    const easeOut = 1 - Math.pow(1 - progress, 3);
    const value = Math.floor(easeOut * target);

    // Pad with 0 if original was "03"
    const displayValue =
      target < 10 && value < 10 && originalText.startsWith('0') ? `0${value}` : value;

    el.textContent = `${displayValue}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      el.dataset.done = 'true';
      el.textContent = originalText; // Ensure exact final match
    }
  };

  requestAnimationFrame(step);
}

export default function useRevealAnimations(locationKey) {
  useEffect(() => {
    // Scope to React's mount node to avoid picking up the hidden legacy HTML.
    const hiddenElements = document.querySelectorAll('#root .hidden, #root .metric-item');
    if (!hiddenElements || hiddenElements.length === 0) return;

    const revealObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add('show');

          // Handle Number Count Up
          if (
            entry.target.classList.contains('metric-number') ||
            entry.target.querySelector?.('.metric-number')
          ) {
            const numEl = entry.target.classList.contains('metric-number')
              ? entry.target
              : entry.target.querySelector('.metric-number');

            if (numEl && !numEl.dataset.done) animateCount(numEl);
          }

          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.15 },
    );

    hiddenElements.forEach((el) => revealObserver.observe(el));

    return () => {
      revealObserver.disconnect();
    };
  }, [locationKey]);
}

