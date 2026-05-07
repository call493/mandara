import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { blogs } from '../data/blogs';

/* ── Scroll-reveal hook ── */
function useRevealOnScroll(containerRef) {
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const items = el.querySelectorAll('.reveal-item');
    if (!items.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );

    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [containerRef]);
}

/* ── Image with gradient fallback ── */
function BlogImage({ src, alt, className }) {
  const [failed, setFailed] = useState(false);
  const fullSrc = src.startsWith('http') ? src : `${import.meta.env.BASE_URL}${src}`;
  return failed ? (
    <div
      className={className}
      style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'rgba(255,255,255,0.15)',
        fontSize: '2rem',
      }}
    >
      ✦
    </div>
  ) : (
    <img src={fullSrc} alt={alt} onError={() => setFailed(true)} />
  );
}

/* ── All unique categories ── */
const ALL = 'All';
function getCategories(list) {
  const cats = [ALL, ...new Set(list.map((b) => b.category))];
  return cats;
}

export default function BlogsPage() {
  const [activeCategory, setActiveCategory] = useState(ALL);
  const listRef = useRef(null);
  useRevealOnScroll(listRef);

  const categories = getCategories(blogs);

  const featured = blogs[0];
  const rest = blogs.slice(1);

  const filteredFeatured =
    activeCategory === ALL || featured?.category === activeCategory ? featured : null;
  const filteredRest = rest.filter(
    (b) => activeCategory === ALL || b.category === activeCategory
  );

  const totalFiltered = (filteredFeatured ? 1 : 0) + filteredRest.length;

  return (
    <>
      <style>{`
        /* ── Base ── */
        .blogs-main {
          max-width: 1000px;
          margin: 0 auto;
          padding: 24px 48px 80px;
          min-height: 80vh;
        }

        /* ── Header ── */
        .blog-header {
          margin: 0;
          border-bottom: 1px solid var(--card-border);
          padding: 0 0 1px 0;
        }

        .blog-eyebrow {
          font-family: var(--font-mono);
          color: var(--accent);
          font-size: 0.75rem;
          margin-bottom: 4px;
          display: inline-block;
          letter-spacing: 0.15em;
        }

        .blog-title {
          font-size: clamp(1.8rem, 4vw, 2.8rem);
          margin-bottom: 6px;
          letter-spacing: -0.03em;
          line-height: 1.1;
        }

        .blog-desc {
          font-size: 0.95rem;
          color: var(--text-muted);
          max-width: min(500px, 100%);
          line-height: 1.5;
          margin-bottom: 0;
        }

        /* ── Category Filter ── */
        .category-filters {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          padding: 12px 0 0;
          border-top: none;
        }

        .cat-btn {
          font-family: var(--font-mono);
          font-size: 0.72rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 5px 14px;
          border-radius: 50px;
          border: 1px solid var(--card-border);
          background: transparent;
          color: var(--text-muted);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .cat-btn:hover {
          border-color: var(--accent);
          color: var(--accent);
        }

        .cat-btn.active {
          background: var(--accent);
          border-color: var(--accent);
          color: #000;
          font-weight: 700;
        }

        /* ── Result count ── */
        .result-count {
          font-family: var(--font-mono);
          font-size: 0.72rem;
          color: var(--text-muted);
          margin-top: 6px;
          margin-bottom: 0;
          letter-spacing: 0.05em;
        }

        /* ── Reveal animation ── */
        .reveal-item {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1),
                      transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .reveal-item.revealed {
          opacity: 1;
          transform: translateY(0);
        }

        /* ── Featured Article ── */
        .featured-article {
          margin: 0 0 8px 0;
          padding: 0;
        }

        .featured-link {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0;
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          border-top: none;
          border-top-left-radius: 0;
          border-top-right-radius: 0;
          border-bottom-left-radius: var(--radius-md);
          border-bottom-right-radius: var(--radius-md);
          overflow: hidden;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
          text-decoration: none;
        }

        .featured-link:hover {
          border-color: var(--accent);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5);
        }

        .featured-image {
          position: relative;
          height: 100%;
          min-height: 280px;
          overflow: hidden;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
        }

        .featured-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.8s cubic-bezier(0.25, 1, 0.5, 1);
          display: block;
        }

        .featured-link:hover .featured-image img {
          transform: scale(1.05);
        }

        .featured-badge {
          position: absolute;
          top: 16px;
          left: 16px;
          background: var(--accent);
          color: #000;
          padding: 4px 10px;
          font-family: var(--font-mono);
          font-size: 0.62rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          border-radius: 4px;
          z-index: 2;
        }

        .featured-content {
          padding: 24px 32px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 0;
        }

        .featured-title {
          font-size: clamp(1.4rem, 2.4vw, 2rem);
          margin: 10px 0;
          line-height: 1.2;
          letter-spacing: -0.02em;
          color: var(--text-main);
          font-weight: 800;
        }

        .featured-excerpt {
          font-size: 0.95rem;
          color: var(--text-muted);
          line-height: 1.65;
          margin-bottom: 20px;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .read-more-btn {
          font-family: var(--font-mono);
          color: var(--accent);
          font-weight: 600;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: gap 0.3s ease;
          margin-top: auto;
        }

        .featured-link:hover .read-more-btn { gap: 14px; }

        /* ── Article Meta (shared) ── */
        .article-meta {
          font-family: var(--font-mono);
          font-size: 0.72rem;
          color: var(--text-muted);
          display: flex;
          gap: 12px;
          align-items: center;
          flex-wrap: wrap;
        }

        .category-tag {
          color: var(--accent);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        /* ── Blog List ── */
        .blog-list {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0;
        }

        .article-link {
          display: grid;
          grid-template-columns: clamp(160px, 22%, 220px) 1fr;
          gap: 28px;
          padding: 28px 0;
          border-bottom: 1px solid var(--card-border);
          transition: border-color 0.3s ease;
          text-decoration: none;
          position: relative;
        }

        .article-link:last-child {
          border-bottom: none;
        }

        .article-link:hover {
          border-bottom-color: var(--accent);
        }

        .article-image-wrapper {
          width: 100%;
          aspect-ratio: 16 / 10;
          border-radius: var(--radius-sm);
          overflow: hidden;
          border: 1px solid var(--card-border);
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          flex-shrink: 0;
        }

        .article-image-wrapper img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s ease;
          display: block;
        }

        .article-link:hover .article-image-wrapper img {
          transform: scale(1.05);
        }

        .article-content {
          display: flex;
          flex-direction: column;
          justify-content: center;
          min-width: 0;
        }

        .article-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .article-title {
          font-family: var(--font-heading);
          font-size: clamp(1.2rem, 2vw, 1.6rem);
          font-weight: 700;
          color: var(--text-main);
          margin: 8px 0;
          transition: color 0.3s;
          letter-spacing: -0.01em;
          line-height: 1.25;
        }

        .article-link:hover .article-title {
          color: var(--accent);
        }

        .article-excerpt {
          color: var(--text-muted);
          font-size: 0.9rem;
          line-height: 1.6;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Desktop arrow */
        .arrow-icon {
          font-size: 1.2rem;
          opacity: 0.2;
          transition: all 0.3s ease;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .article-link:hover .arrow-icon {
          opacity: 1;
          color: var(--accent);
          transform: translate(3px, -3px);
        }

        /* Mobile tap cue */
        .mobile-cta {
          display: none;
          font-family: var(--font-mono);
          font-size: 0.72rem;
          color: var(--accent);
          margin-top: 10px;
          letter-spacing: 0.05em;
        }

        /* ── Empty State ── */
        .empty-state {
          padding: 64px 0;
          text-align: center;
          color: var(--text-muted);
        }

        .empty-state-icon {
          font-size: 2.5rem;
          margin-bottom: 16px;
          opacity: 0.4;
        }

        .empty-state h3 {
          font-family: var(--font-heading);
          font-size: 1.2rem;
          color: var(--text-main);
          margin-bottom: 8px;
        }

        .empty-state p {
          font-size: 0.9rem;
          max-width: 320px;
          margin: 0 auto;
          line-height: 1.5;
        }

        /* ── Footer ── */
        .blogs-footer {
          text-align: center;
          padding: 48px 0 0;
          color: var(--text-muted);
          border-top: 1px solid var(--card-border);
          margin-top: 16px;
          font-family: var(--font-mono);
          font-size: 0.78rem;
          letter-spacing: 0.05em;
        }

        /* ── Responsive ── */
        @media (max-width: 900px) {
          .blogs-main {
            padding: 20px 24px 60px;
          }
          .featured-link {
            grid-template-columns: 1fr;
          }
          .featured-image {
            min-height: 240px;
          }
          .featured-content {
            padding: 24px;
          }
        }

        @media (max-width: 640px) {
          .article-link {
            grid-template-columns: 1fr;
            gap: 14px;
            padding: 24px 0;
          }
          .article-image-wrapper {
            aspect-ratio: 16 / 9;
          }
          .arrow-icon {
            display: none;
          }
          .mobile-cta {
            display: block;
          }
          .article-title {
            font-size: 1.2rem;
          }
          .blog-title {
            font-size: 1.8rem;
          }
          .category-filters {
            gap: 6px;
          }
        }
      `}</style>

      <main className="blogs-main">

        {/* Header */}
        <header className="blog-header">
          <span className="blog-eyebrow">THE ARCHIVE</span>
          <h1 className="title blog-title">
            Notes on <span className="text-gradient">Craft</span>.
          </h1>
          <p className="blog-desc">
            Thoughts on product design, engineering systems, and the process of shipping
            high-quality software.
          </p>

          {/* Fix #5: Category filter tabs */}
          <div className="category-filters">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`cat-btn${activeCategory === cat ? ' active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Result count */}
          <div className="result-count">
            {totalFiltered} {totalFiltered === 1 ? 'post' : 'posts'}
            {activeCategory !== ALL ? ` in ${activeCategory}` : ''}
          </div>
        </header>

        {/* Fix #4: Empty state */}
        {totalFiltered === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">✦</div>
            <h3>No posts in "{activeCategory}"</h3>
            <p>Try selecting a different category or view all posts.</p>
          </div>
        )}

        {/* Featured article — Fix #1: image fallback, Fix #3: proper reveal */}
        {filteredFeatured && (
          <section className="featured-article">
            <Link
              to={`/blogs/${filteredFeatured.slug}`}
              className="featured-link reveal-item revealed"
            >
              <div className="featured-image">
                <BlogImage src={filteredFeatured.image} alt={filteredFeatured.title} />
                <div className="featured-badge">LATEST</div>
              </div>
              <div className="featured-content">
                <div className="article-meta">
                  <span className="category-tag">{filteredFeatured.category}</span>
                  <span>{filteredFeatured.date}</span>
                  <span>{filteredFeatured.readTime}</span>
                </div>
                <h2 className="featured-title">{filteredFeatured.title}</h2>
                <p className="featured-excerpt">{filteredFeatured.excerpt}</p>
                <div className="read-more-btn">
                  Read Full Note <span>→</span>
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* Blog list — Fix #3, #6, #7, #8 */}
        <div className="blog-list" ref={listRef}>
          {filteredRest.map((blog, index) => (
            <Link
              key={blog.slug}
              to={`/blogs/${blog.slug}`}
              className="article-link reveal-item"
              style={{ transitionDelay: `${index * 80}ms` }}
            >
              <div className="article-image-wrapper">
                {/* Fix #1: image fallback */}
                <BlogImage src={blog.image} alt={blog.title} />
              </div>
              <div className="article-content">
                <div className="article-header">
                  <div className="article-meta">
                    <span className="category-tag">{blog.category}</span>
                    <span>{blog.date}</span>
                    <span>{blog.readTime}</span>
                  </div>
                  {/* Fix #7: desktop arrow, mobile tap cue handled via CSS */}
                  <span className="arrow-icon">→</span>
                </div>
                <h3 className="article-title">{blog.title}</h3>
                <p className="article-excerpt">{blog.excerpt}</p>
                {/* Fix #7: mobile tap affordance */}
                <span className="mobile-cta">Read full note →</span>
              </div>
            </Link>
          ))}
        </div>

      </main>

      {/* Fix #11: dynamic year */}
      <footer className="blogs-footer">
        © {new Date().getFullYear()} Braxton Mandara
      </footer>
    </>
  );
}
