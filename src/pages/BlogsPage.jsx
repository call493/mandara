import { Link } from 'react-router-dom';
import { blogs } from '../data/blogs';

export default function BlogsPage() {
  return (
    <>
      <style>{`
        main {
          max-width: 1000px;
          margin: 0 auto;
          padding: 120px 24px 96px;
          min-height: 80vh;
        }

        .blog-header {
          margin-bottom: 80px;
          border-bottom: 1px solid var(--card-border);
          padding-bottom: 48px;
        }

        .blog-eyebrow {
          font-family: var(--font-mono);
          color: var(--accent);
          font-size: 0.85rem;
          margin-bottom: 16px;
          display: inline-block;
          letter-spacing: 0.1em;
        }

        .blog-title {
          font-size: clamp(3rem, 5vw, 4.5rem);
          margin-bottom: 24px;
          letter-spacing: -0.04em;
          line-height: 1;
        }

        .blog-desc {
          font-size: 1.2rem;
          color: var(--text-muted);
          max-width: 600px;
          line-height: 1.6;
        }

        /* Featured Article Styles */
        .featured-article {
          margin-bottom: 100px;
        }

        .featured-link {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 48px;
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          border-radius: var(--radius-md);
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
          text-decoration: none;
        }

        .featured-link:hover {
          transform: translateY(-8px);
          border-color: var(--accent);
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.3);
        }

        .featured-image {
          position: relative;
          height: 100%;
          min-height: 400px;
          overflow: hidden;
        }

        .featured-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.8s cubic-bezier(0.25, 1, 0.5, 1);
        }

        .featured-link:hover .featured-image img {
          transform: scale(1.05);
        }

        .featured-badge {
          position: absolute;
          top: 32px;
          left: 32px;
          background: var(--accent);
          color: #000;
          padding: 8px 16px;
          font-family: var(--font-mono);
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          border-radius: 4px;
          z-index: 2;
        }

        .featured-content {
          padding: 64px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .featured-title {
          font-size: clamp(2rem, 3.5vw, 3rem);
          margin: 24px 0;
          line-height: 1.1;
          letter-spacing: -0.03em;
          color: var(--text-main);
          font-weight: 800;
        }

        .featured-excerpt {
          font-size: 1.15rem;
          color: var(--text-muted);
          line-height: 1.6;
          margin-bottom: 40px;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .read-more-btn {
          font-family: var(--font-mono);
          color: var(--accent);
          font-weight: 600;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: gap 0.3s ease;
        }

        .featured-link:hover .read-more-btn {
          gap: 16px;
        }

        /* List Styles */
        .blog-list {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0;
        }

        .article-link {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 48px;
          padding: 56px 0;
          border-bottom: 1px solid var(--card-border);
          transition: 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
          text-decoration: none;
          position: relative;
        }

        .article-link:hover {
          border-bottom-color: var(--accent);
        }

        .article-image-wrapper {
          width: 100%;
          aspect-ratio: 16/10;
          border-radius: var(--radius-sm);
          overflow: hidden;
          border: 1px solid var(--card-border);
          background: var(--card-bg);
        }

        .article-image-wrapper img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s ease;
        }

        .article-link:hover .article-image-wrapper img {
          transform: scale(1.05);
        }

        .article-meta {
          font-family: var(--font-mono);
          font-size: 0.8rem;
          color: var(--text-muted);
          display: flex;
          gap: 16px;
          align-items: center;
        }

        .category-tag {
          color: var(--accent);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .article-title {
          font-family: var(--font-heading);
          font-size: 2rem;
          font-weight: 700;
          color: var(--text-main);
          margin: 16px 0;
          transition: color 0.3s;
          letter-spacing: -0.02em;
          line-height: 1.2;
        }

        .article-link:hover .article-title {
          color: var(--accent);
        }

        .article-excerpt {
          color: var(--text-muted);
          font-size: 1.05rem;
          max-width: 90%;
          line-height: 1.6;
        }

        .arrow-icon {
          position: absolute;
          right: 0;
          top: 64px;
          font-size: 1.5rem;
          opacity: 0.2;
          transform: rotate(-45deg);
          transition: all 0.3s ease;
        }

        .article-link:hover .arrow-icon {
          opacity: 1;
          color: var(--accent);
          transform: translate(5px, -5px) rotate(-45deg);
        }

        @media (max-width: 900px) {
          .featured-link {
            grid-template-columns: 1fr;
          }
          .featured-image {
            min-height: 300px;
          }
          .featured-content {
            padding: 40px;
          }
        }

        @media (max-width: 768px) {
          .article-link {
            grid-template-columns: 1fr;
            gap: 24px;
            padding: 40px 0;
          }
          .article-image-wrapper {
            aspect-ratio: 16/9;
          }
          .arrow-icon {
            display: none;
          }
          .article-title {
            font-size: 1.5rem;
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

        {blogs.length > 0 && (
          <section className="featured-article">
            <Link to={`/blogs/${blogs[0].slug}`} className="featured-link hidden show">
              <div className="featured-image">
                <img src={blogs[0].image} alt="" />
                <div className="featured-badge">LATEST</div>
              </div>
              <div className="featured-content">
                <div className="article-meta">
                  <span className="category-tag">{blogs[0].category}</span>
                  <span>{blogs[0].date}</span>
                  <span>{blogs[0].readTime}</span>
                </div>
                <h2 className="featured-title">{blogs[0].title}</h2>
                <p className="featured-excerpt">{blogs[0].excerpt}</p>
                <div className="read-more-btn">
                  Read Full Note <span>→</span>
                </div>
              </div>
            </Link>
          </section>
        )}

        <div className="blog-list">
          {blogs.slice(1).map((blog, index) => (
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
            padding: '60px 40px',
            color: 'var(--text-muted)',
            borderTop: '1px solid var(--card-border)',
            maxWidth: 1000,
            margin: '0 auto',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.8rem',
            letterSpacing: '0.05em'
          }}
        >
          © 2026 Braxton Mandara
        </div>
      </footer>
    </>
  );
}
