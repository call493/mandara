import { useParams, Link } from 'react-router-dom';
import { blogs } from '../data/blogs';
import { useEffect, useState } from 'react';

export default function BlogDetail() {
  const { slug } = useParams();
  const blog = blogs.find((b) => b.slug === slug);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const handleScroll = () => {
      const doc = document.documentElement;
      const scrollPx = doc.scrollTop;
      const winHeightPx = doc.scrollHeight - doc.clientHeight;
      const scrolled = (scrollPx / winHeightPx) * 100;
      setScrollProgress(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [slug]);

  if (!blog) {
    return (
      <main style={{ padding: '120px 24px', textAlign: 'center' }}>
        <h1 className="title">Post not found</h1>
        <Link to="/blogs" className="btn-pill secondary">Back to Blogs</Link>
      </main>
    );
  }

  const shareUrl = window.location.href;
  const shareText = `Check out this article: ${blog.title}`;

  return (
    <>
      <style>{`
        .reading-progress-bar {
          position: fixed;
          top: 0;
          left: 0;
          height: 3px;
          background: var(--accent);
          z-index: 1001;
          transition: width 0.1s ease-out;
          box-shadow: 0 0 10px var(--accent-glow);
        }

        .blog-detail-container {
          max-width: 850px;
          margin: 0 auto;
          padding: 120px 24px 96px;
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-mono);
          color: var(--text-muted);
          font-size: 0.9rem;
          margin-bottom: 40px;
          transition: color 0.3s;
        }

        .back-link:hover {
          color: var(--accent);
        }

        .blog-detail-header {
          margin-bottom: 64px;
        }

        .blog-detail-meta {
          font-family: var(--font-mono);
          color: var(--accent);
          font-size: 0.85rem;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .category-pill {
          background: var(--accent-dim);
          padding: 4px 12px;
          border-radius: 20px;
          border: 1px solid rgba(157, 78, 221, 0.2);
        }

        .blog-detail-title {
          font-size: clamp(2.5rem, 6vw, 4.5rem);
          margin-bottom: 32px;
          line-height: 1.05;
          letter-spacing: -0.04em;
          font-weight: 800;
        }

        .blog-hero-image {
          width: 100%;
          aspect-ratio: 16/9;
          object-fit: cover;
          border-radius: var(--radius-lg);
          border: 1px solid var(--card-border);
          margin-bottom: 64px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        }

        .blog-detail-excerpt {
          font-size: 1.5rem;
          color: var(--text-main);
          line-height: 1.5;
          margin-bottom: 64px;
          font-weight: 500;
          letter-spacing: -0.01em;
        }

        .blog-content {
          font-size: 1.2rem;
          line-height: 1.8;
          color: var(--text-main);
        }

        .blog-content p {
          margin-bottom: 32px;
          opacity: 0.9;
        }

        .blog-content h3 {
          font-family: var(--font-heading);
          font-size: 2rem;
          margin: 64px 0 24px;
          color: #fff;
          letter-spacing: -0.02em;
        }

        .blog-content blockquote {
          margin: 48px 0;
          padding: 32px;
          background: var(--card-bg);
          border-radius: var(--radius-sm);
          border-left: 4px solid var(--accent);
          font-style: italic;
          font-size: 1.4rem;
          color: #fff;
          line-height: 1.5;
        }

        .blog-content ul {
          margin-bottom: 32px;
          padding-left: 24px;
        }

        .blog-content li {
          margin-bottom: 16px;
          padding-left: 8px;
        }

        .blog-content pre {
          background: #0d0d0f;
          padding: 24px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--card-border);
          margin: 40px 0;
          overflow-x: auto;
          font-family: var(--font-mono);
          font-size: 0.95rem;
          line-height: 1.6;
          color: #d1d1d1;
        }

        .blog-content code {
          color: var(--accent);
        }

        .blog-share-actions {
          display: flex;
          gap: 16px;
          margin-top: 80px;
          padding-top: 40px;
          border-top: 1px solid var(--card-border);
          align-items: center;
        }

        .share-label {
          font-family: var(--font-mono);
          font-size: 0.8rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .share-btn {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          color: var(--text-muted);
          transition: 0.3s;
        }

        .share-btn:hover {
          border-color: var(--accent);
          color: var(--accent);
          transform: translateY(-2px);
        }

        .blog-footer {
          margin-top: 64px;
          text-align: center;
        }

        @media (max-width: 600px) {
          .blog-detail-title {
            font-size: 2.25rem;
          }
          .blog-hero-image {
            aspect-ratio: 4/3;
          }
          .blog-content h3 {
            font-size: 1.5rem;
          }
        }
      `}</style>

      <div className="reading-progress-bar" style={{ width: `${scrollProgress}%` }} />

      <main className="blog-detail-container">
        <Link to="/blogs" className="back-link">
          ← Back to archive
        </Link>

        <header className="blog-detail-header">
          <div className="blog-detail-meta">
            <span className="category-pill">{blog.category}</span>
            <span>•</span>
            <span>{blog.date}</span>
            <span>•</span>
            <span>{blog.readTime}</span>
          </div>
          <h1 className="title blog-detail-title">{blog.title}</h1>
        </header>

        {blog.image && (
          <img src={blog.image} alt="" className="blog-hero-image" />
        )}

        <div className="blog-detail-excerpt">
          {blog.excerpt}
        </div>

        <article 
          className="blog-content"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        <div className="blog-share-actions">
          <span className="share-label">Share article</span>
          <a 
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
            target="_blank" 
            rel="noopener noreferrer"
            className="share-btn"
            aria-label="Share on X"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          </a>
          <a 
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
            target="_blank" 
            rel="noopener noreferrer"
            className="share-btn"
            aria-label="Share on LinkedIn"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
          </a>
        </div>

        <footer className="blog-footer">
          <Link to="/blogs" className="btn-pill secondary">
            Explore more insights
          </Link>
        </footer>
      </main>
    </>
  );
}
