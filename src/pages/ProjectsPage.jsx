import { Link } from 'react-router-dom';
import { projects } from '../data/projects';
import { contact } from '../data/contact';

export default function ProjectsPage() {
  return (
    <>
      <section id="all-projects">
        <p className="section__text">All Of My</p>
        <h1 className="title">Work</h1>
        <div className="work-list">
          {projects.map((p) => (
            <a
              key={p.id}
              href={`${import.meta.env.BASE_URL}${p.img}`}
              target="_blank"
              rel="noreferrer"
            >
              <div className="work">
                <img src={`${import.meta.env.BASE_URL}${p.img}`} alt={p.title} />
                <div className="layer">
                  <h3>{p.title}</h3>
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
            <a href={`mailto:${contact.email}`}>
              <img
                src={`${import.meta.env.BASE_URL}Assets/email.png`}
                alt="Email icon"
                className="icon contact-icon"
              />
              <p>{contact.email}</p>
            </a>
          </div>

          <div className="contact-info-container">
            <a href={contact.linkedin} target="_blank" rel="noreferrer">
              <img
                src={`${import.meta.env.BASE_URL}Assets/linkedin.png`}
                alt="LinkedIn"
                className="icon contact-icon"
              />
              <p>Connect with me on LinkedIn</p>
            </a>
          </div>

          <div className="contact-info-container">
            <a href={contact.instagram} target="_blank" rel="noreferrer">
              <img
                src={`${import.meta.env.BASE_URL}Assets/insta.png`}
                alt="My Instagram Handle"
                className="icon contact-icon"
              />
              <p>DM me on Instagram</p>
            </a>
          </div>
        </div>

        <div className="logo">
          <img
            src={`${import.meta.env.BASE_URL}Assets/Braxlogo.png`}
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
        <p>Copyright &#169; {new Date().getFullYear()} Braxton Mandara. All Rights Reserved.</p>
      </footer>
    </>
  );
}

