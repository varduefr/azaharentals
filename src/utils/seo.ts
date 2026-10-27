/**
 * Dynamic SEO metadata manager for SPA pages
 * Ensures canonical tags, titles, descriptions, and OpenGraph tags
 * correctly match the active URL on www.azaharentals.com
 */

export interface PageSeoOptions {
  title: string;
  description: string;
  path?: string;
  image?: string;
}

export const BASE_CANONICAL_DOMAIN = 'https://www.azaharentals.com';

export function updatePageSeo({
  title,
  description,
  path = '',
  image = `${BASE_CANONICAL_DOMAIN}/images/castellon_hero_1788275752376.jpg`
}: PageSeoOptions) {
  // Normalize path
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const fullCanonicalUrl = path === '/' || path === '' 
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

  // Update Link Canonical
  let canonicalLink = document.querySelector('link[rel="canonical"]');
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalLink);
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

  // Update Twitter Tags
  const twTitle = document.querySelector('meta[name="twitter:title"]');
  if (twTitle) twTitle.setAttribute('content', title);

  const twDesc = document.querySelector('meta[name="twitter:description"]');
  if (twDesc) twDesc.setAttribute('content', description);

  const twImage = document.querySelector('meta[name="twitter:image"]');
  if (twImage) twImage.setAttribute('content', image);
}
