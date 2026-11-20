import {
  MUNICIPALITY_LIST,
  MUNICIPALITY_PROFILES,
  MunicipalitySlug,
  normalizeSlugText,
  resolveMunicipalitySlug,
} from '../data/municipalitySeoData';

export const BASE_CANONICAL_DOMAIN = 'https://www.azaharentals.com';

export interface SitemapImageMeta {
  loc: string;
  title: string;
  caption?: string;
}

export interface SitemapMeta {
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: string;
  images?: SitemapImageMeta[];
  excludeFromSitemap?: boolean;
}

export interface RouteSeoMeta {
  canonicalPath: string;
  title: string;
  description: string;
  image: string;
  robots?: string;
  sitemap?: SitemapMeta;
}

export const DEFAULT_HOME_SEO: RouteSeoMeta = {
  canonicalPath: '/',
  title: 'Gestión de Alojamientos Turísticos en Castellón | Azahar',
  description:
    'Gestión integral de alquiler vacacional y alojamientos turísticos en Castellón. Maximizamos la rentabilidad para propietarios y tramitamos tu licencia.',
  image: `${BASE_CANONICAL_DOMAIN}/images/castellon_hero_1788275752376.jpg`,
  robots: 'index, follow',
  sitemap: {
    changefreq: 'weekly',
    priority: '1.0',
    images: [
      {
        loc: `${BASE_CANONICAL_DOMAIN}/images/castellon_hero_1788275752376.jpg`,
        title: 'Gestión de Alojamientos Turísticos en Castellón - Azahar Rentals',
        caption: 'Servicio integral de gestión de alquiler vacacional y licencias turísticas en la Costa de Castellón',
      },
    ],
  },
};

export const APARTMENTS_SEO: RouteSeoMeta = {
  canonicalPath: '/apartamentos-turisticos-castellon',
  title: 'Apartamentos Turísticos en Castellón | Alquiler Vacacional Verificado | Azahar Rentals',
  description:
    'Reserva los mejores apartamentos turísticos y vacacionales en la Costa de Castellón: Peñíscola, Benicarló y Alcover. Con licencias turísticas oficiales VT, check-in 24/7 y limpieza profesional hotelera.',
  image: `${BASE_CANONICAL_DOMAIN}/images/peniscola_balcon_terraza_1788561222890.jpg`,
  robots: 'index, follow',
  sitemap: {
    changefreq: 'daily',
    priority: '0.9',
    images: [
      {
        loc: `${BASE_CANONICAL_DOMAIN}/images/peniscola_balcon_terraza_1788561222890.jpg`,
        title: 'Ático Mirador del Castillo en Peñíscola - VT-42819-CS',
        caption: 'Apartamento turístico en primera línea de playa con terraza y vistas al Castillo Papa Luna',
      },
      {
        loc: `${BASE_CANONICAL_DOMAIN}/images/benicarlo_marina_apt_1788444573430.jpg`,
        title: 'Residencial Marina y Puerto Deportivo en Benicarló - VT-43180-CS',
        caption: 'Alojamiento turístico con piscina comunitaria junto a la playa Morrongo',
      },
      {
        loc: `${BASE_CANONICAL_DOMAIN}/images/benicarlo_morrongo_suite_1788444588447.jpg`,
        title: 'Brisas del Morrongo y Costa Papa Luna en Benicarló - VT-43612-CS',
        caption: 'Apartamento vacacional en primera línea con terraza chill-out y piscina',
      },
      {
        loc: `${BASE_CANONICAL_DOMAIN}/images/alcover_rural_retreat_1788444605887.jpg`,
        title: 'Villa Rural y Vistas de Alcover - HUT-029415',
        caption: 'Alojamiento rústico con encanto en las montañas y valle del Glorieta',
      },
    ],
  },
};

export const LAUNDRY_SEO: RouteSeoMeta = {
  canonicalPath: '/lavanderia-industrial',
  title: 'Lavandería Industrial en Castellón | Hoteles, Pisos Turísticos, Clínicas y Gimnasios | Azahar Rentals',
  description:
    'Servicio de lavandería industrial en Castellón para hoteles, apartamentos turísticos, gimnasios y clínicas privadas. Limpieza de sábanas, toallas, batas y uniformes con lavado, secado y planchado calandra.',
  image: `${BASE_CANONICAL_DOMAIN}/images/industrial_laundry.jpg`,
  robots: 'index, follow',
  sitemap: {
    changefreq: 'monthly',
    priority: '0.8',
    images: [
      {
        loc: `${BASE_CANONICAL_DOMAIN}/images/industrial_laundry.jpg`,
        title: 'Lavandería Industrial en Castellón - Azahar Rentals',
        caption: 'Servicio B2B de lavandería industrial para hoteles, apartamentos turísticos, clínicas y gimnasios en Castellón',
      },
    ],
  },
};

export const SIMULATOR_SEO: RouteSeoMeta = {
  canonicalPath: '/simulador',
  title: 'Simulador de Rentabilidad Alquiler Vacacional Castellón 2025/2026 | Azahar Rentals',
  description:
    'Calcula gratis los ingresos netos anuales de tu vivienda turística en Castellón (Peñíscola, Benicàssim, Vinaròs, Oropesa). Simulador con datos reales AirDNA y GVA.',
  image: `${BASE_CANONICAL_DOMAIN}/images/castellon_hero_1788275752376.jpg`,
  robots: 'index, follow',
  sitemap: {
    changefreq: 'monthly',
    priority: '0.8',
  },
};

export const ADMIN_SEO: RouteSeoMeta = {
  canonicalPath: '/admin',
  title: 'Panel de Administración | Azahar Rentals',
  description: 'Consola privada de gestión de alojamientos turísticos Azahar Rentals.',
  image: `${BASE_CANONICAL_DOMAIN}/images/castellon_hero_1788275752376.jpg`,
  robots: 'noindex, nofollow',
  sitemap: {
    excludeFromSitemap: true,
  },
};

/**
 * Registro extensible para nuevas páginas públicas e indexables que se creen en el futuro.
 * Cualquier ruta añadida aquí se incluirá automáticamente en:
 * 1. `PRERENDER_ROUTE_FILES` (HTML estático con canonical y Google Tag)
 * 2. `getRouteSeoForPath()` (metadatos y canonical en runtime/SSR)
 * 3. `generateSitemapXml()` (actualización automática de `public/sitemap.xml` y `dist/sitemap.xml`)
 */
export const EXTRA_INDEXABLE_ROUTES: RouteSeoMeta[] = [];

export function getApartmentsSeoForMunicipality(slug?: MunicipalitySlug | null): RouteSeoMeta {
  if (!slug || !MUNICIPALITY_PROFILES[slug]) return APARTMENTS_SEO;
  const profile = MUNICIPALITY_PROFILES[slug];
  const s = profile.apartmentsSeo;
  const isPrimaryHub = slug === 'peniscola' || slug === 'benicarlo';
  return {
    canonicalPath: s.canonicalPath,
    title: s.title,
    description: s.description,
    image: s.image,
    robots: 'index, follow',
    sitemap: {
      changefreq: isPrimaryHub ? 'daily' : 'weekly',
      priority: isPrimaryHub ? '0.9' : '0.85',
      images: [
        {
          loc: s.image,
          title: `Apartamentos Turísticos en ${profile.name} - Azahar Rentals`,
          caption: s.badge,
        },
      ],
    },
  };
}

export function getLaundrySeoForMunicipality(slug?: MunicipalitySlug | null): RouteSeoMeta {
  if (!slug || !MUNICIPALITY_PROFILES[slug]) return LAUNDRY_SEO;
  const profile = MUNICIPALITY_PROFILES[slug];
  const s = profile.laundrySeo;
  return {
    canonicalPath: s.canonicalPath,
    title: s.title,
    description: s.description,
    image: s.image,
    robots: 'index, follow',
    sitemap: {
      changefreq: 'monthly',
      priority: '0.8',
      images: [
        {
          loc: s.image,
          title: `Lavandería Industrial en ${profile.name} - Azahar Rentals`,
          caption: s.heroImageCaption,
        },
      ],
    },
  };
}

export function getSimulatorSeoForMunicipality(slug?: MunicipalitySlug | null): RouteSeoMeta {
  if (!slug || !MUNICIPALITY_PROFILES[slug]) return SIMULATOR_SEO;
  const profile = MUNICIPALITY_PROFILES[slug];
  const s = profile.simulatorSeo;
  return {
    canonicalPath: s.canonicalPath,
    title: s.title,
    description: s.description,
    image: s.image,
    robots: 'index, follow',
    sitemap: {
      changefreq: 'monthly',
      priority: '0.8',
    },
  };
}

const MUNICIPALITY_PRERENDER_FILES: Array<{ filename: string; meta: RouteSeoMeta }> = MUNICIPALITY_LIST.flatMap(
  (m) => [
    {
      filename: `apartamentos-turisticos-${m.slug}.html`,
      meta: getApartmentsSeoForMunicipality(m.slug),
    },
    {
      filename: `lavanderia-industrial-${m.slug}.html`,
      meta: getLaundrySeoForMunicipality(m.slug),
    },
    {
      filename: `simulador-${m.slug}.html`,
      meta: getSimulatorSeoForMunicipality(m.slug),
    },
  ]
);

const EXTRA_PRERENDER_FILES: Array<{ filename: string; meta: RouteSeoMeta }> = EXTRA_INDEXABLE_ROUTES.map(
  (meta) => {
    const clean = meta.canonicalPath.replace(/^\/+|\/+$/g, '') || 'index';
    return {
      filename: `${clean}.html`,
      meta,
    };
  }
);

export const PRERENDER_ROUTE_FILES: Array<{ filename: string; meta: RouteSeoMeta }> = [
  { filename: 'apartamentos-turisticos-castellon.html', meta: APARTMENTS_SEO },
  { filename: 'apartamentos.html', meta: APARTMENTS_SEO },
  { filename: 'lavanderia-industrial.html', meta: LAUNDRY_SEO },
  { filename: 'laundry.html', meta: LAUNDRY_SEO },
  { filename: 'simulador.html', meta: SIMULATOR_SEO },
  { filename: 'simulador-rentabilidad.html', meta: SIMULATOR_SEO },
  { filename: 'admin.html', meta: ADMIN_SEO },
  ...MUNICIPALITY_PRERENDER_FILES,
  ...EXTRA_PRERENDER_FILES,
];

function safeDecodePath(pathname: string): string {
  const raw = (pathname || '/').split('?')[0].split('#')[0];
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

export function getRouteSeoForPath(pathname: string): RouteSeoMeta {
  const decoded = safeDecodePath(pathname).replace(/\/+$/, '') || '/';
  const normPath = normalizeSlugText(decoded);

  if (normPath === '/admin' || normPath.startsWith('/admin/')) {
    return ADMIN_SEO;
  }

  // Exact or nested match against any extra indexable routes
  const extraMatch = EXTRA_INDEXABLE_ROUTES.find((route) => {
    const cleanCanonical = normalizeSlugText(route.canonicalPath.replace(/\/+$/, '') || '/');
    return normPath === cleanCanonical || (cleanCanonical !== '/' && normPath.startsWith(`${cleanCanonical}/`));
  });
  if (extraMatch) {
    return extraMatch;
  }

  // Municipality apartments: /apartamentos-turisticos-<municipio>
  if (normPath.startsWith('/apartamentos-turisticos-')) {
    const rawMuni = normPath.slice('/apartamentos-turisticos-'.length).split('/')[0];
    if (rawMuni === 'castellon') return APARTMENTS_SEO;
    const slug = resolveMunicipalitySlug(rawMuni);
    if (slug) return getApartmentsSeoForMunicipality(slug);
    return APARTMENTS_SEO;
  }

  if (
    normPath === '/apartamentos' ||
    normPath.startsWith('/apartamentos/')
  ) {
    return APARTMENTS_SEO;
  }

  // Municipality laundry: /lavanderia-industrial-<municipio>
  if (normPath.startsWith('/lavanderia-industrial-')) {
    const rawMuni = normPath.slice('/lavanderia-industrial-'.length).split('/')[0];
    if (rawMuni === 'castellon') return LAUNDRY_SEO;
    const slug = resolveMunicipalitySlug(rawMuni);
    if (slug) return getLaundrySeoForMunicipality(slug);
    return LAUNDRY_SEO;
  }

  if (
    normPath === '/lavanderia-industrial' ||
    normPath.startsWith('/lavanderia-industrial/') ||
    normPath === '/laundry' ||
    normPath.startsWith('/laundry/')
  ) {
    return LAUNDRY_SEO;
  }

  // Municipality simulator: /simulador-<municipio>
  if (normPath === '/simulador-rentabilidad' || normPath.startsWith('/simulador-rentabilidad/')) {
    return SIMULATOR_SEO;
  }
  if (normPath.startsWith('/simulador-')) {
    const rawMuni = normPath.slice('/simulador-'.length).split('/')[0];
    if (rawMuni === 'castellon') return SIMULATOR_SEO;
    const slug = resolveMunicipalitySlug(rawMuni);
    if (slug) return getSimulatorSeoForMunicipality(slug);
    return SIMULATOR_SEO;
  }

  if (normPath === '/simulador' || normPath.startsWith('/simulador/')) {
    return SIMULATOR_SEO;
  }

  return DEFAULT_HOME_SEO;
}

/**
 * Devuelve todas las rutas únicas e indexables del sitio en orden lógico
 * para generar automáticamente `sitemap.xml` (tanto en build como en servidor).
 */
export function getIndexableSitemapRoutes(): RouteSeoMeta[] {
  const orderedCandidates: RouteSeoMeta[] = [
    DEFAULT_HOME_SEO,
    APARTMENTS_SEO,
    ...MUNICIPALITY_LIST.map((m) => getApartmentsSeoForMunicipality(m.slug)),
    SIMULATOR_SEO,
    ...MUNICIPALITY_LIST.map((m) => getSimulatorSeoForMunicipality(m.slug)),
    LAUNDRY_SEO,
    ...MUNICIPALITY_LIST.map((m) => getLaundrySeoForMunicipality(m.slug)),
    ...EXTRA_INDEXABLE_ROUTES,
    ...PRERENDER_ROUTE_FILES.map((entry) => entry.meta),
  ];

  const seenPaths = new Set<string>();
  const indexable: RouteSeoMeta[] = [];

  for (const route of orderedCandidates) {
    const robots = (route.robots || 'index, follow').toLowerCase();
    if (robots.includes('noindex') || route.sitemap?.excludeFromSitemap) {
      continue;
    }

    const normalizedCanonical =
      route.canonicalPath === '/'
        ? '/'
        : `/${route.canonicalPath.replace(/^\/+|\/+$/g, '')}`;

    if (seenPaths.has(normalizedCanonical)) {
      continue;
    }

    seenPaths.add(normalizedCanonical);
    indexable.push({
      ...route,
      canonicalPath: normalizedCanonical,
    });
  }

  return indexable;
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Genera el XML completo de `sitemap.xml` a partir de todas las rutas indexables
 * registradas en `src/seo/routeMeta.ts`.
 */
export function generateSitemapXml(lastmodDate?: string): string {
  const lastmod = lastmodDate || new Date().toISOString().split('T')[0];
  const routes = getIndexableSitemapRoutes();

  const urlBlocks = routes.map((route) => {
    const loc =
      route.canonicalPath === '/'
        ? `${BASE_CANONICAL_DOMAIN}/`
        : `${BASE_CANONICAL_DOMAIN}${route.canonicalPath}`;
    const changefreq = route.sitemap?.changefreq || 'weekly';
    const priority = route.sitemap?.priority || '0.8';
    const images = route.sitemap?.images || [];

    const imageXml = images
      .map((img) => {
        const captionTag = img.caption
          ? `\n      <image:caption>${escapeXml(img.caption)}</image:caption>`
          : '';
        return `    <image:image>
      <image:loc>${escapeXml(img.loc)}</image:loc>
      <image:title>${escapeXml(img.title)}</image:title>${captionTag}
    </image:image>`;
      })
      .join('\n');

    return `  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${escapeXml(lastmod)}</lastmod>
    <changefreq>${escapeXml(changefreq)}</changefreq>
    <priority>${escapeXml(priority)}</priority>${imageXml ? `\n${imageXml}` : ''}
  </url>`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urlBlocks.join('\n')}
</urlset>
`;
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
