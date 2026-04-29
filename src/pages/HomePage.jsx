import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import ProjectModal from '../components/ProjectModal.jsx';

export default function HomePage() {
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  const heroRef = useRef(null);
  const heroPhotoRef = useRef(null);
  const heroImgRef = useRef(null);

  useEffect(() => {
    const hero = heroRef.current;
    const heroPhoto = heroPhotoRef.current;
    const heroImg = heroImgRef.current;
    if (!hero || !heroPhoto || !heroImg) return;

    const onMouseMove = (e) => {
      const rect = hero.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
      const y = (e.clientY - rect.top - rect.height / 2) / rect.height;

      heroPhoto.style.transform = `translate3d(${x * 15}px, ${y * 15}px, 0)`;
      heroImg.style.transform = `translate3d(${x * 25}px, ${y * 25}px, 0) rotate(${
        x * 2
      }deg)`;
    };

    const onMouseLeave = () => {
      heroPhoto.style.transform = 'translate3d(0, 0, 0)';
      heroImg.style.transform = 'translate3d(0, 0, 0) rotate(3deg)';
    };

    hero.addEventListener('mousemove', onMouseMove);
    hero.addEventListener('mouseleave', onMouseLeave);

    return () => {
      hero.removeEventListener('mousemove', onMouseMove);
      hero.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  const projects = useMemo(
    () => ({
      ASL: {
        title: 'ASL Logistics Identity',
        img: '/Assets/ASL.jpg',
        desc: 'A comprehensive branding project for ASL Logistics. The goal was to create a visual identity that communicates speed, reliability, and global reach. I utilized negative space and bold typography to create a logo that stands out on fleet vehicles and digital platforms.',
        tags: ['Branding', 'Identity', 'Illustrator'],
      },
      Lumisnap: {
        title: 'Lumisnap Interface Design',
        img: '/Assets/Lumisnap.jpg',
        desc: 'UI/UX design for a modern photography portfolio platform. The focus was on a dark-mode first approach to let the photography stand out. Key features include a drag-and-drop gallery manager and seamless client proofing tools.',
        tags: ['UI/UX', 'Figma', 'App Design'],
      },
      LaptopOffers: {
        title: 'Laptop Offers E-commerce',
        img: '/Assets/2ndoffers.jpg',
        desc: 'A high-conversion landing page and e-commerce platform for refurbished electronics. I handled both the UI design and the Front-end development, ensuring the site was responsive and accessible. Sales increased by 40% post-launch.',
        tags: ['Web Dev', 'HTML/CSS', 'Conversion'],
      },
    }),
    [],
  );

  const selectedProject = selectedProjectId ? projects[selectedProjectId] : null;

  const faviconFallback =
    'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 fill=%22%23222%22 rx=%2220%22/><text y=%22.9em%22 font-size=%2270%22 x=%2250%%22 text-anchor=%22middle%22 dominant-baseline=%22central%22>W</text></svg>';

  return (
    <>
      <section id="profile" ref={heroRef}>
        <div className="section__text">
          <div className="hero-eyebrow">
            <span className="status-dot"></span> Available for work
          </div>
          <h1 className="title">
            Designing
            <br />
            <span className="text-gradient">Scalable</span>
            <br />
            Systems.
          </h1>
          <p className="section__text__p2">
            I&apos;m Braxton. I bridge the gap between{' '}
            <span className="highlight">product design</span> and{' '}
            <span className="highlight">engineering</span> to build resilient
            digital experiences.
          </p>

          <div className="hero-ctas">
            <a className="btn-pill primary" href="#projects">
              View Selected Work
            </a>
            <a className="btn-pill secondary" href="mailto:braxtonmandara254@gmail.com">
              Email Me
            </a>
          </div>

          <div className="hero-metrics">
            <div className="metric-item">
              <span className="metric-number">03+</span>
              <span className="metric-label">Years Exp</span>
            </div>
            <div className="metric-item">
              <span className="metric-number">15+</span>
              <span className="metric-label">Projects Shipped</span>
            </div>
            <div className="metric-item">
              <span className="metric-number">100%</span>
              <span className="metric-label">Client Satisfaction</span>
            </div>
          </div>
        </div>

        <div className="hero-photo-container" ref={heroPhotoRef}>
          <div className="hero-glow"></div>
          <img
            ref={heroImgRef}
            src="/Assets/Braxton.jpg"
            alt="Braxton Mandara"
            className="hero-img"
          />
        </div>
      </section>

      <section id="about">
        <div className="section-header">
          <p className="section-subtitle">01. THE CONTEXT</p>
          <h2 className="section-title">About Me</h2>
        </div>

        <div className="bento-grid">
          <div className="bento-card timeline-card hidden delay-200">
            <h3 className="card-title">Work Experience</h3>
            <div className="timeline">
              <div className="timeline-item">
                <div className="year">2025 - Present</div>
                <div className="role">Principal Partner · Avalanche Revamp</div>
                <div className="role">Web Developer · DSAIL</div>
              </div>
              <div className="timeline-item">
                <div className="year">Sep. - Dec. 2024</div>
                <div className="role">Attachee · DSAIL</div>
              </div>
              <div className="timeline-item">
                <div className="year">2022 - Present</div>
                <div className="role">Freelance Designer</div>
                <div className="role">Photographer &amp; Videographer</div>
              </div>
            </div>

            <div className="shipped-links">
              <p className="shipped-links-title">Shipped websites</p>
              <div className="shipped-links-list">
                {[
                  {
                    href: 'https://dekut-dsail.github.io',
                    label: 'DSAIL Website',
                    src: 'https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://dekut-dsail.github.io&size=32',
                  },
                  {
                    href: 'https://dsail-health.vercel.app',
                    label: 'DSAIL Health Data Collection App',
                    src: 'https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://dsail-health.vercel.app&size=32',
                  },
                  {
                    href: 'https://fscratchlabs.com',
                    label: 'FScratch',
                    src: 'https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://fscratchlabs.com&size=32',
                  },
                  {
                    href: 'https://cor.co.ke',
                    label: 'COR Website',
                    src: 'https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://cor.co.ke&size=32',
                  },
                  {
                    href: 'https://webp-magic-flax.vercel.app/',
                    label: 'Webp Magic',
                    src: 'https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://webp-magic-flax.vercel.app/&size=32',
                  },
                ].map((p) => (
                  <a
                    key={p.href}
                    className="shipped-link"
                    href={p.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      className="shipped-link__favicon"
                      src={p.src}
                      alt=""
                      aria-hidden="true"
                      onError={(e) => {
                        e.currentTarget.src = faviconFallback;
                      }}
                    />
                    <span>{p.label}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="bento-card bio-card hidden delay-300">
            <h3 className="card-title">Bio</h3>
            <p>
              I&apos;m a graduate from <b>Dedan Kimathi University of Technology</b> and a Principal
              Partner at Avalanche Revamp. I don&apos;t just design screens; I build systems. My
              background in Computer Science allows me to speak the language of developers,
              ensuring that my designs are not just beautiful, but feasible and scalable.
            </p>
          </div>

          <div className="bento-card edu-card hidden delay-400">
            <div className="card-icon">🎓</div>
            <div>
              <h3 className="card-title">Education</h3>
              <p className="card-desc">
                B.Sc. Computer Science
                <br />
                Dedan Kimathi University of Technology, 2025
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="skills">
        <div className="section-header">
          <p className="section-subtitle">02. THE TOOLKIT</p>
          <h2 className="section-title">Tech Stack</h2>
        </div>

        <div className="skills-grid hidden delay-200">
          <div className="skill-category">
            <h3>Design</h3>
            <div className="tag-container">
              <span className="tech-tag">Figma</span>
              <span className="tech-tag">Adobe Ae</span>
              <span className="tech-tag">Photoshop</span>
              <span className="tech-tag">Illustrator</span>
              <span className="tech-tag">Blender</span>
              <span className="tech-tag">Prototyping</span>
            </div>
          </div>

          <div className="skill-category">
            <h3>Development</h3>
            <div className="tag-container">
              <span className="tech-tag">HTML/CSS</span>
              <span className="tech-tag">JavaScript</span>
              <span className="tech-tag">React</span>
              <span className="tech-tag">Tailwind</span>
              <span className="tech-tag">Git</span>
              <span className="tech-tag">VS Code</span>
            </div>
          </div>
        </div>
      </section>

      <section id="projects">
        <div className="section-header">
          <p className="section-subtitle">03. SELECTED WORK</p>
          <h2 className="section-title">Projects</h2>
        </div>

        <div className="work-grid">
          <div
            className="work-card hidden delay-200"
            onClick={() => setSelectedProjectId('ASL')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') setSelectedProjectId('ASL');
            }}
          >
            <div className="work-img-wrapper">
              <img src="/Assets/ASL.jpg" alt="ASL logo" loading="lazy" />
            </div>
            <div className="work-content">
              <div className="work-tags">
                <span>Branding</span>
                <span>Identity</span>
              </div>
              <h3>ASL Logistics Identity</h3>
            </div>
          </div>

          <div
            className="work-card hidden delay-300"
            onClick={() => setSelectedProjectId('Lumisnap')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') setSelectedProjectId('Lumisnap');
            }}
          >
            <div className="work-img-wrapper">
              <img src="/Assets/Lumisnap.jpg" alt="Lumisnap" loading="lazy" />
            </div>
            <div className="work-content">
              <div className="work-tags">
                <span>UI/UX</span>
                <span>App Design</span>
              </div>
              <h3>Lumisnap Interface</h3>
            </div>
          </div>

          <div
            className="work-card hidden delay-400"
            onClick={() => setSelectedProjectId('LaptopOffers')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') setSelectedProjectId('LaptopOffers');
            }}
          >
            <div className="work-img-wrapper">
              <img src="/Assets/2ndoffers.jpg" alt="Laptop offers" loading="lazy" />
            </div>
            <div className="work-content">
              <div className="work-tags">
                <span>Web Dev</span>
                <span>E-commerce</span>
              </div>
              <h3>Laptop Offers Platform</h3>
            </div>
          </div>
        </div>

        <div className="center-btn">
          <Link to="/projects" className="btn-pill secondary">
            View Archive
          </Link>
        </div>
      </section>

      <section id="contact">
        <p className="section-subtitle">04. WHAT&apos;S NEXT?</p>
        <h1 className="title contact-title">Let&apos;s work together.</h1>
        <p className="contact-desc">
          Currently open for new opportunities in Product Design &amp; Front-end Dev.
        </p>

        <a href="mailto:braxtonmandara254@gmail.com" className="btn-pill primary big-btn">
          Say Hello
        </a>

        <footer>
          <div className="footer-links">
            <a href="https://instagram.com/brax.media" target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
            <a href="https://github.com/call493" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          </div>
          <p className="copyright">© 2026 Braxton Mandara</p>
        </footer>
      </section>

      <ProjectModal project={selectedProject} onClose={() => setSelectedProjectId(null)} />
    </>
  );
}

