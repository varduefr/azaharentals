export const BASE_CANONICAL_DOMAIN = 'https://www.azaharentals.com';

export interface RouteSeoMeta {
  canonicalPath: string;
  title: string;
  description: string;
  image: string;
  robots?: string;
}

export const DEFAULT_HOME_SEO: RouteSeoMeta = {
  canonicalPath: '/',
  title: 'Gestión de Alojamientos Turísticos en Castellón | Azahar',
  description:
    'Gestión integral de alquiler vacacional y alojamientos turísticos en Castellón. Maximizamos la rentabilidad para propietarios y tramitamos tu licencia.',
  image: `${BASE_CANONICAL_DOMAIN}/images/castellon_hero_1788275752376.jpg`,
  robots: 'index, follow',
};

export const APARTMENTS_SEO: RouteSeoMeta = {
  canonicalPath: '/apartamentos-turisticos-castellon',
  title: 'Apartamentos Turísticos en Castellón | Alquiler Vacacional Verificado | Azahar Rentals',
  description:
    'Reserva los mejores apartamentos turísticos y vacacionales en la Costa de Castellón: Peñíscola, Benicarló y Alcover. Con licencias turísticas oficiales VT, check-in 24/7 y limpieza profesional hotelera.',
  image: `${BASE_CANONICAL_DOMAIN}/images/peniscola_balcon_terraza_1788561222890.jpg`,
  robots: 'index, follow',
};

export const LAUNDRY_SEO: RouteSeoMeta = {
  canonicalPath: '/lavanderia-industrial',
  title: 'Lavandería Industrial en Castellón | Hoteles, Pisos Turísticos, Clínicas y Gimnasios | Azahar Rentals',
  description:
    'Servicio de lavandería industrial en Castellón para hoteles, apartamentos turísticos, gimnasios y clínicas privadas. Limpieza de sábanas, toallas, batas y uniformes con lavado, secado y planchado calandra.',
  image: `${BASE_CANONICAL_DOMAIN}/images/castellon_hero_1788275752376.jpg`,
  robots: 'index, follow',
};

export const SIMULATOR_SEO: RouteSeoMeta = {
  canonicalPath: '/simulador',
  title: 'Simulador de Rentabilidad Alquiler Vacacional Castellón 2025/2026 | Azahar Rentals',
  description:
    'Calcula gratis los ingresos netos anuales de tu vivienda turística en Castellón (Peñíscola, Benicàssim, Vinaròs, Oropesa). Simulador con datos reales AirDNA y GVA.',
  image: `${BASE_CANONICAL_DOMAIN}/images/castellon_hero_1788275752376.jpg`,
  robots: 'index, follow',
};

export const ADMIN_SEO: RouteSeoMeta = {
  canonicalPath: '/admin',
  title: 'Panel de Administración | Azahar Rentals',
  description: 'Consola privada de gestión de alojamientos turísticos Azahar Rentals.',
  image: `${BASE_CANONICAL_DOMAIN}/images/castellon_hero_1788275752376.jpg`,
  robots: 'noindex, nofollow',
};

export const PRERENDER_ROUTE_FILES: Array<{ filename: string; meta: RouteSeoMeta }> = [
  { filename: 'apartamentos-turisticos-castellon.html', meta: APARTMENTS_SEO },
  { filename: 'apartamentos.html', meta: APARTMENTS_SEO },
  { filename: 'lavanderia-industrial.html', meta: LAUNDRY_SEO },
  { filename: 'laundry.html', meta: LAUNDRY_SEO },
  { filename: 'simulador.html', meta: SIMULATOR_SEO },
  { filename: 'simulador-rentabilidad.html', meta: SIMULATOR_SEO },
  { filename: 'admin.html', meta: ADMIN_SEO },
];

export function getRouteSeoForPath(pathname: string): RouteSeoMeta {
  const cleanPath = (pathname || '/').split('?')[0].split('#')[0].replace(/\/+$/, '') || '/';

  if (cleanPath === '/admin' || cleanPath.startsWith('/admin/')) {
    return ADMIN_SEO;
  }
  if (
    cleanPath === '/apartamentos-turisticos-castellon' ||
    cleanPath.startsWith('/apartamentos-turisticos-castellon/') ||
    cleanPath === '/apartamentos' ||
    cleanPath.startsWith('/apartamentos/')
  ) {
    return APARTMENTS_SEO;
  }
  if (
    cleanPath === '/lavanderia-industrial' ||
    cleanPath.startsWith('/lavanderia-industrial/') ||
    cleanPath === '/laundry' ||
    cleanPath.startsWith('/laundry/')
  ) {
    return LAUNDRY_SEO;
  }
  if (
    cleanPath === '/simulador' ||
    cleanPath.startsWith('/simulador/') ||
    cleanPath === '/simulador-rentabilidad' ||
    cleanPath.startsWith('/simulador-rentabilidad/')
  ) {
    return SIMULATOR_SEO;
  }

  return DEFAULT_HOME_SEO;
}

function escapeHtmlAttr(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escapeHtmlText(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function injectRouteSeoIntoHtml(html: string, pathname: string): string {
  const seo = getRouteSeoForPath(pathname);
  const fullCanonicalUrl =
    seo.canonicalPath === '/' ? `${BASE_CANONICAL_DOMAIN}/` : `${BASE_CANONICAL_DOMAIN}${seo.canonicalPath}`;
  const robots = seo.robots || 'index, follow';

  const safeTitle = escapeHtmlText(seo.title);
  const safeTitleAttr = escapeHtmlAttr(seo.title);
  const safeDescAttr = escapeHtmlAttr(seo.description);
  const safeUrlAttr = escapeHtmlAttr(fullCanonicalUrl);
  const safeImageAttr = escapeHtmlAttr(seo.image);
  const safeRobotsAttr = escapeHtmlAttr(robots);

  let result = html;
  result = result.replace(/<title>[\s\S]*?<\/title>/i, `<title>${safeTitle}</title>`);
  result = result.replace(
    /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="description" content="${safeDescAttr}" />`
  );
  result = result.replace(
    /<meta\s+name="robots"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="robots" content="${safeRobotsAttr}" />`
  );
  result = result.replace(
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i,
    `<link rel="canonical" href="${safeUrlAttr}" />`
  );
  result = result.replace(
    /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:title" content="${safeTitleAttr}" />`
  );
  result = result.replace(
    /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:description" content="${safeDescAttr}" />`
  );
  result = result.replace(
    /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:url" content="${safeUrlAttr}" />`
  );
  result = result.replace(
    /<meta\s+property="og:image"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:image" content="${safeImageAttr}" />`
  );
  result = result.replace(
    /<meta\s+property="og:image:secure_url"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:image:secure_url" content="${safeImageAttr}" />`
  );
  result = result.replace(
    /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="twitter:title" content="${safeTitleAttr}" />`
  );
  result = result.replace(
    /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="twitter:description" content="${safeDescAttr}" />`
  );
  result = result.replace(
    /<meta\s+name="twitter:image"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="twitter:image" content="${safeImageAttr}" />`
  );

  return result;
}
