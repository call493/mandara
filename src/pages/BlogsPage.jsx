import { Link } from 'react-router-dom';
import { blogs } from '../data/blogs';

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
          display: grid;
          grid-template-columns: 240px 1fr;
          gap: 32px;
          padding: 40px 0;
          border-bottom: 1px solid var(--card-border);
          transition: 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
          position: relative;
        }

        .article-link:hover {
          border-bottom-color: var(--accent);
        }

        .article-link:hover .article-image-wrapper img {
          transform: scale(1.05);
        }

        .article-image-wrapper {
          width: 100%;
          aspect-ratio: 4/3;
          border-radius: var(--radius-sm);
          overflow: hidden;
          border: 1px solid var(--card-border);
          background: var(--card-bg);
        }

        .article-image-wrapper img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
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
          color: var(--accent);
          font-weight: 600;
        }

        .article-title {
          font-family: var(--font-heading);
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--text-main);
          margin-bottom: 12px;
          transition: color 0.2s;
          letter-spacing: -0.02em;
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
          top: 44px;
          font-size: 1.5rem;
          opacity: 0.3;
          transform: rotate(-45deg);
          transition: 0.3s ease;
        }

        @media (max-width: 768px) {
          .article-link {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          .article-image-wrapper {
            aspect-ratio: 16/9;
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
          {blogs.map((blog, index) => (
            <Link 
              key={blog.slug}
              to={`/blogs/${blog.slug}`} 
              className={`article-link hidden show delay-${(index + 1) * 100}`}
            >
              <div className="article-image-wrapper">
                <img src={blog.image} alt="" loading="lazy" />
              </div>
              <div className="article-content">
                <div className="article-header">
                  <div className="article-meta">
                    <span className="category-tag">{blog.category}</span>
                    <span>{blog.date}</span>
                    <span>{blog.readTime}</span>
                  </div>
                  <div className="arrow-icon">→</div>
                </div>
                <h3 className="article-title">{blog.title}</h3>
                <p className="article-excerpt">{blog.excerpt}</p>
              </div>
            </Link>
          ))}
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

