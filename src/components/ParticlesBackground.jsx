import { useEffect, useRef } from 'react';

export default function ParticlesBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const particleConfig = {
      count: 80,
      maxVelocity: 0.5,
      linkDistance: 150,
      mouseRadius: 180,
    };

    let particles = [];
    const mousePos = { x: null, y: null };

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      // Reset transform each resize to avoid compounding scale.
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const initParticles = () => {
      particles = Array.from({ length: particleConfig.count }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * particleConfig.maxVelocity,
        vy: (Math.random() - 0.5) * particleConfig.maxVelocity,
      }));
    };

    let rafId = 0;

    const drawParticles = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        // Bounce
        if (p.x < 0 || p.x > window.innerWidth) p.vx *= -1;
        if (p.y < 0 || p.y > window.innerHeight) p.vy *= -1;

        // Mouse Interact
        if (mousePos.x !== null) {
          const dx = p.x - mousePos.x;
          const dy = p.y - mousePos.y;
          const dist = Math.hypot(dx, dy);
          if (dist < particleConfig.mouseRadius && dist > 0) {
            const force =
              ((particleConfig.mouseRadius - dist) / particleConfig.mouseRadius) * 0.03;
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
          }
        }

        // Draw Dot
        ctx.fillStyle = 'rgba(157, 78, 221, 0.4)';
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw Lines
      for (let i = 0; i < particles.length; i += 1) {
        for (let j = i + 1; j < particles.length; j += 1) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.hypot(dx, dy);
          if (dist < particleConfig.linkDistance) {
            const alpha = 1 - dist / particleConfig.linkDistance;
            ctx.strokeStyle = `rgba(157, 78, 221, ${alpha * 0.15})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      rafId = requestAnimationFrame(drawParticles);
    };

    resizeCanvas();
    initParticles();
    rafId = requestAnimationFrame(drawParticles);

    const onResize = () => {
      resizeCanvas();
      initParticles();
    };

    const onMouseMove = (e) => {
      mousePos.x = e.clientX;
      mousePos.y = e.clientY;
    };

    const onMouseLeave = () => {
      mousePos.x = null;
      mousePos.y = null;
    };

    window.addEventListener('resize', onResize);
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseleave', onMouseLeave);

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return <canvas id="bg-canvas" ref={canvasRef} aria-hidden="true" />;
}

