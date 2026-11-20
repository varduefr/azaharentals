/**
 * Dynamic SEO metadata manager for SPA pages
 * Ensures canonical tags, titles, descriptions, robots, and OpenGraph tags
 * correctly match the active URL on www.azaharentals.com
 */
import { BASE_CANONICAL_DOMAIN } from '../seo/routeMeta';

export interface PageSeoOptions {
  title: string;
  description: string;
  path?: string;
  image?: string;
  robots?: string;
}

export { BASE_CANONICAL_DOMAIN };

export function updatePageSeo({
  title,
  description,
  path = '',
  image = `${BASE_CANONICAL_DOMAIN}/images/castellon_hero_1788275752376.jpg`,
  robots = 'index, follow',
}: PageSeoOptions) {
  // Normalize path
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const fullCanonicalUrl =
    path === '/' || path === ''
      ? `${BASE_CANONICAL_DOMAIN}/`
      : `${BASE_CANONICAL_DOMAIN}${cleanPath}`;

  // Update Page Title
  document.title = title;

  // Update Meta Description
  let metaDesc = document.querySelector('meta[name="description"]');
  if (!metaDesc) {
    metaDesc = document.createElement('meta');
    metaDesc.setAttribute('name', 'description');
    document.head.appendChild(metaDesc);
  }
  metaDesc.setAttribute('content', description);

  // Update Robots Directive
  let metaRobots = document.querySelector('meta[name="robots"]');
  if (!metaRobots) {
    metaRobots = document.createElement('meta');
    metaRobots.setAttribute('name', 'robots');
    document.head.appendChild(metaRobots);
  }
  metaRobots.setAttribute('content', robots);

  // Update Link Canonical (ensure only one canonical tag exists)
  const canonicalLinks = document.querySelectorAll('link[rel="canonical"]');
  let canonicalLink = canonicalLinks[0] || null;
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalLink);
  } else if (canonicalLinks.length > 1) {
    for (let i = 1; i < canonicalLinks.length; i++) {
      canonicalLinks[i].remove();
    }
  }
  canonicalLink.setAttribute('href', fullCanonicalUrl);

  // Update OpenGraph Tags
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute('content', title);

  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc) ogDesc.setAttribute('content', description);

  const ogUrl = document.querySelector('meta[property="og:url"]');
  if (ogUrl) ogUrl.setAttribute('content', fullCanonicalUrl);

  const ogImage = document.querySelector('meta[property="og:image"]');
  if (ogImage) ogImage.setAttribute('content', image);

  const ogImageSecure = document.querySelector('meta[property="og:image:secure_url"]');
  if (ogImageSecure) ogImageSecure.setAttribute('content', image);

  // Update Twitter Tags
  const twTitle = document.querySelector('meta[name="twitter:title"]');
  if (twTitle) twTitle.setAttribute('content', title);

  const twDesc = document.querySelector('meta[name="twitter:description"]');
  if (twDesc) twDesc.setAttribute('content', description);

  const twImage = document.querySelector('meta[name="twitter:image"]');
  if (twImage) twImage.setAttribute('content', image);
}
