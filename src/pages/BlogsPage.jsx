export default function BlogsPage() {
  return (
    <>
      <style>{`
        main {
          max-width: 800px;
          margin: 0 auto;
          padding: 120px 24px 96px;
          min-height: 80vh;
        }

        .blog-header {
          margin-bottom: 64px;
          border-bottom: 1px solid var(--card-border);
          padding-bottom: 40px;
        }

        .blog-eyebrow {
          font-family: var(--font-mono);
          color: var(--accent);
          font-size: 0.85rem;
          margin-bottom: 16px;
          display: inline-block;
        }

        .blog-title {
          font-size: clamp(3rem, 5vw, 4.5rem);
          margin-bottom: 16px;
          letter-spacing: -0.03em;
        }

        .blog-desc {
          font-size: 1.1rem;
          color: var(--text-muted);
          max-width: 500px;
        }

        .blog-list {
          display: flex;
          flex-direction: column;
        }

        .article-link {
          display: block;
          padding: 32px 0;
          border-bottom: 1px solid var(--card-border);
          transition: 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
          position: relative;
        }

        .article-link:hover {
          padding-left: 12px;
          border-bottom-color: var(--accent);
        }

        .article-link:hover .article-title {
          color: var(--accent);
        }

        .article-link:hover .arrow-icon {
          transform: translateX(5px) rotate(-45deg);
          opacity: 1;
          color: var(--accent);
        }

        .article-header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 12px;
        }

        .article-meta {
          font-family: var(--font-mono);
          font-size: 0.8rem;
          color: var(--text-muted);
          display: flex;
          gap: 12px;
        }

        .category-tag {
          color: var(--text-main);
          background: rgba(255,255,255,0.05);
          padding: 2px 8px;
          border-radius: 4px;
        }

        .article-title {
          font-family: var(--font-heading);
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--text-main);
          margin-bottom: 8px;
          transition: color 0.2s;
        }

        .article-excerpt {
          color: var(--text-muted);
          font-size: 1rem;
          max-width: 90%;
          line-height: 1.6;
        }

        .arrow-icon {
          position: absolute;
          right: 0;
          top: 36px;
          font-size: 1.5rem;
          opacity: 0.3;
          transform: rotate(-45deg);
          transition: 0.3s ease;
        }

        @media (max-width: 600px) {
          .article-header {
            flex-direction: column;
            gap: 8px;
          }
          .arrow-icon {
            display: none;
          }
        }
      `}</style>

      <main>
        <header className="blog-header">
          <span className="blog-eyebrow">THE ARCHIVE</span>
          <h1 className="title blog-title">
            Notes on <span className="text-gradient">Craft</span>.
          </h1>
          <p className="blog-desc">
            Thoughts on product design, engineering systems, and the process of shipping
            high-quality software.
          </p>
        </header>

        <div className="blog-list">
          <a href="#" className="article-link hidden delay-100">
            <div className="article-header">
              <div className="article-meta">
                <span className="category-tag">Product</span>
                <span>JAN 2025</span>
                <span>5 MIN READ</span>
              </div>
              <div className="arrow-icon">→</div>
            </div>
            <h3 className="article-title">Designing trustworthy payment flows</h3>
            <p className="article-excerpt">
              How we shaped low-friction, high-trust experiences for millions of shoppers at
              Amazon Pay by focusing on micro-copy and timing.
            </p>
          </a>

          <a href="#" className="article-link hidden delay-200">
            <div className="article-header">
              <div className="article-meta">
                <span className="category-tag">Process</span>
                <span>DEC 2024</span>
                <span>4 MIN READ</span>
              </div>
              <div className="arrow-icon">→</div>
            </div>
            <h3 className="article-title">From brief to launch in 10 days</h3>
            <p className="article-excerpt">
              A fast-track case study on aligning stakeholders, prototyping in code, and
              shipping with confidence under tight deadlines.
            </p>
          </a>

          <a href="#" className="article-link hidden delay-300">
            <div className="article-header">
              <div className="article-meta">
                <span className="category-tag">Engineering</span>
                <span>NOV 2024</span>
                <span>3 MIN READ</span>
              </div>
              <div className="arrow-icon">→</div>
            </div>
            <h3 className="article-title">Microinteractions that earn trust</h3>
            <p className="article-excerpt">
              Small motions that guide users and reduce anxiety in checkout, identity
              verification, and confirmation screens.
            </p>
          </a>

          <a href="#" className="article-link hidden delay-400">
            <div className="article-header">
              <div className="article-meta">
                <span className="category-tag">Career</span>
                <span>OCT 2024</span>
                <span>6 MIN READ</span>
              </div>
              <div className="arrow-icon">→</div>
            </div>
            <h3 className="article-title">The designer who codes</h3>
            <p className="article-excerpt">
              Why learning React changed my design career and how it bridges the gap between
              Figma files and production environments.
            </p>
          </a>
        </div>
      </main>

      <footer>
        <div
          style={{
            textAlign: 'center',
            padding: '40px',
            color: 'var(--text-muted)',
            borderTop: '1px solid var(--card-border)',
            maxWidth: 800,
            margin: '0 auto',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.8rem',
          }}
        >
          © 2025 Braxton Mandara
        </div>
      </footer>
    </>
  );
}

