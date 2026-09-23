import { useEffect, useState } from 'react';

export default function CountUp({ end, suffix = '', duration = 2000 }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const target = parseInt(end, 10);
    if (isNaN(target)) return;

    const startTime = performance.now();

    const updateCounter = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo function for smooth slowing down at end
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.floor(easeProgress * target);
      setCount(current);

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        setCount(target);
      }
    };

    requestAnimationFrame(updateCounter);
  }, [end, duration]);

  const paddedStr = count < 10 && targetStrHasLeadingZero(end) ? `0${count}` : `${count}`;

  return (
    <span>
      {paddedStr}
      {suffix}
    </span>
  );
}

function targetStrHasLeadingZero(val) {
  const str = String(val).trim();
  return str.startsWith('0') && str.length > 1;
}
