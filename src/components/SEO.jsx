import { Helmet } from 'react-helmet-async';

export default function SEO({
  title,
  description = 'Award-winning designer and developer specializing in graphic design, UI/UX, and web development.',
  image = '/Assets/Braxton.jpg',
  url = 'https://braxtonmandara.com/mandara/',
  type = 'website',
}) {
  const fullTitle = `${title} | Braxton Mandara`;

  let fullImage = image;
  if (!image.startsWith('http')) {
    // Ensure exactly one slash between domain and path
    const cleanImage = image.startsWith('/') ? image : `/${image}`;
    fullImage = `https://braxtonmandara.com${cleanImage}`;
  }

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />

      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />
    </Helmet>
  );
}
