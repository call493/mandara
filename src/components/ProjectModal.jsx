import { useEffect } from 'react';

export default function ProjectModal({ project, onClose }) {
  useEffect(() => {
    if (!project) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div
      className="modal open"
      style={{ display: 'flex' }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-content">
        <button
          type="button"
          className="close-modal"
          aria-label="Close project modal"
          onClick={onClose}
        >
          ×
        </button>

        <div className="modal-body">
          <div className="modal-img-container">
            <img id="modal-img" src={project.img} alt={project.title} />
          </div>
          <div className="modal-text">
            <h2 id="modal-title">{project.title}</h2>

            <div className="modal-tags-container">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    color: 'var(--accent)',
                    border: '1px solid var(--accent)',
                    padding: '4px 12px',
                    borderRadius: '50px',
                    display: 'inline-block',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            <p id="modal-desc">{project.desc}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

