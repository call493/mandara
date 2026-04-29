import { Link } from 'react-router-dom';

const projectImages = [
  { src: '/Assets/ASL.jpg', alt: 'ASL', label: 'ASL logo' },
  { src: '/Assets/Lumisnap.jpg', alt: 'Lumisnap', label: 'Lumisnap' },
  { src: '/Assets/2ndoffers.jpg', alt: 'Laptop offers', label: 'Laptop offers' },
  { src: '/Assets/ASL Services1.jpg', alt: 'ASL services', label: 'ASL Services' },
  {
    src: '/Assets/ASL company profile1.jpg',
    alt: 'ASL company profile',
    label: 'ASL Company Profile',
  },
  { src: '/Assets/Limited1.png', alt: 'Limited1', label: 'Limited' },
  { src: '/Assets/design.png', alt: 'design', label: 'DESIGN' },
  { src: '/Assets/DSAIL-Research Day.jpg', alt: 'DSAIL', label: 'DSAIL Research Day' },
  { src: '/Assets/Media-training.jpg', alt: 'Media', label: 'Media Training Poster' },
];

export default function ProjectsPage() {
  return (
    <>
      <section id="all-projects">
        <p className="section__text">All Of My</p>
        <h1 className="title">Work</h1>
        <div className="work-list">
          {projectImages.map((p) => (
            <a key={p.src} href={p.src} target="_blank" rel="noreferrer">
              <div className="work">
                <img src={p.src} alt={p.alt} />
                <div className="layer">
                  <h3>{p.label}</h3>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section id="contact">
        <p className="section__text" style={{ paddingBottom: '0.3rem' }}>
          Get In Touch
        </p>
        <h1 className="title" style={{ fontWeight: 600 }}>
          Contact Me
        </h1>

        <div className="contact-info-upper-container">
          <div className="contact-info-container">
            <a href="mailto:23110059@iitgn.ac.in">
              <img src="/Assets/email.png" alt="Email icon" className="icon contact-icon" />
              <p>braxtonmandara254@gmail.com</p>
            </a>
          </div>

          <div className="contact-info-container">
            <a href="https://www.linkedin.com/in/braxton-m" target="_blank" rel="noreferrer">
              <img src="/Assets/linkedin.png" alt="LinkedIn" className="icon contact-icon" />
              <p>Connect with me on LinkedIn</p>
            </a>
          </div>

          <div className="contact-info-container">
            <a href="https://www.instagram.com/brax.media/" target="_blank" rel="noreferrer">
              <img src="/Assets/insta.png" alt="My Instagram Handle" className="icon contact-icon" />
              <p>DM me on Instagram</p>
            </a>
          </div>
        </div>

        <div className="logo">
          <img
            src="/Assets/Braxlogo.png"
            alt="Braxton logo"
            onClick={() => {
              // Scroll back to the top route and then hash section.
              window.location.href = '/#profile';
            }}
            role="button"
            tabIndex={0}
          />
        </div>
      </section>

      <footer>
        <nav>
          <div className="nav-links-container">
            <ul className="nav-links">
              <li>
                <Link to="/#about">About</Link>
              </li>
              <li>
                <Link to="/#skills">Skills</Link>
              </li>
              <li>
                <Link to="/#projects">Projects</Link>
              </li>
            </ul>
          </div>
        </nav>
        <br />
        <p>Copyright &#169; 2025 Braxton Mandara. All Rights Resereved.</p>
      </footer>
    </>
  );
}

