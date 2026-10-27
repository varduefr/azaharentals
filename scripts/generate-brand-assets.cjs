const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const fontsDir = path.join(__dirname, 'fonts');
const publicDir = path.join(__dirname, '..', 'public');

// Brand Palette
const COLOR_BLUE_GRAD_START = '#1d4ed8'; // blue-700
const COLOR_BLUE_GRAD_MID = '#2563eb';   // blue-600
const COLOR_CYAN_GRAD_END = '#06b6d4';   // cyan-500
const COLOR_TEXT_DARK = '#0f172a';       // slate-900
const COLOR_TEXT_SUBTITLE = '#64748b';   // slate-500
const COLOR_RENTALS_BLUE = '#2563eb';    // primary royal blue
const COLOR_WHITE = '#ffffff';
const COLOR_RENTALS_LIGHT = '#38bdf8';   // sky-400 for dark mode
const COLOR_TEXT_SUBTITLE_LIGHT = '#94a3b8'; // slate-400

async function generate() {
  console.log('Loading fonts and encoding base64...');
  const ttfExtraBold = fs.readFileSync(path.join(fontsDir, 'PlusJakartaSans-ExtraBold.ttf')).toString('base64');
  const ttfBold = fs.readFileSync(path.join(fontsDir, 'PlusJakartaSans-Bold.ttf')).toString('base64');

  const fontStyle = `
      @font-face {
        font-family: 'Plus Jakarta Sans';
        font-style: normal;
        font-weight: 800;
        src: url('data:font/ttf;base64,${ttfExtraBold}') format('truetype');
      }
      @font-face {
        font-family: 'Plus Jakarta Sans';
        font-style: normal;
        font-weight: 700;
        src: url('data:font/ttf;base64,${ttfBold}') format('truetype');
      }
      .brand-title {
        font-family: 'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-weight: 800;
        font-size: 42px;
        letter-spacing: -0.025em;
      }
      .brand-subtitle {
        font-family: 'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-weight: 700;
        font-size: 12px;
        letter-spacing: 0.18em;
      }
      .brand-title-v {
        font-family: 'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-weight: 800;
        font-size: 40px;
        letter-spacing: -0.025em;
        text-anchor: middle;
      }
      .brand-subtitle-v {
        font-family: 'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-weight: 700;
        font-size: 12px;
        letter-spacing: 0.18em;
        text-anchor: middle;
      }
  `;

  // Building2 paths in 24x24 viewBox from lucide-react
  const buildingPaths = [
    { d: "M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16" },
    { d: "M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2" },
    { d: "M10 8h4" },
    { d: "M10 12h4" },
    { d: "M14 21v-3a2 2 0 0 0-4 0v3" }
  ];

  function getSymbolInner(size, cornerRadius) {
    const iconSize = size * 0.60;
    const offset = (size - iconSize) / 2;
    const scale = iconSize / 24;

    const pathsSvg = buildingPaths.map(p => 
      `<path d="${p.d}" />`
    ).join('\n      ');

    return `
    <rect width="${size}" height="${size}" rx="${cornerRadius}" fill="url(#azaharBrandGrad)" />
    <g transform="translate(${offset.toFixed(2)}, ${offset.toFixed(2)}) scale(${scale.toFixed(4)})" fill="none" stroke="#ffffff" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round">
      ${pathsSvg}
    </g>`;
  }

  // --- 1. HORIZONTAL LOGO (TRANSPARENT BACKGROUND) ---
  console.log('Creating Horizontal Logo Transparent...');
  const hWidth = 760;
  const hHeight = 140;
  const badgeSize = 92;
  const badgeRadius = 23;
  const badgeX = 20;
  const badgeY = (hHeight - badgeSize) / 2; // 24

  const svgHorizontalLight = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${hWidth} ${hHeight}" width="${hWidth}" height="${hHeight}" fill="none">
  <defs>
    <linearGradient id="azaharBrandGrad" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${COLOR_BLUE_GRAD_START}" />
      <stop offset="50%" stop-color="${COLOR_BLUE_GRAD_MID}" />
      <stop offset="100%" stop-color="${COLOR_CYAN_GRAD_END}" />
    </linearGradient>
    <filter id="badgeShadow" x="-10%" y="-10%" width="130%" height="130%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="5" stdDeviation="10" flood-color="${COLOR_BLUE_GRAD_START}" flood-opacity="0.25" />
    </filter>
    <style>
      ${fontStyle}
    </style>
  </defs>

  <!-- Brand Isotipo Mark -->
  <g transform="translate(${badgeX}, ${badgeY})" filter="url(#badgeShadow)">
    ${getSymbolInner(badgeSize, badgeRadius)}
  </g>

  <!-- Brand Typography -->
  <g id="brand-typography">
    <text x="136" y="72" class="brand-title">
      <tspan fill="${COLOR_TEXT_DARK}">AZAHAR </tspan>
      <tspan fill="${COLOR_RENTALS_BLUE}">RENTALS</tspan>
    </text>
    <text x="138" y="104" class="brand-subtitle" fill="${COLOR_TEXT_SUBTITLE}">
      COSTA DE CASTELLÓN · GESTIÓN TURÍSTICA
    </text>
  </g>
</svg>`;

  fs.writeFileSync(path.join(publicDir, 'azahar-rentals-logo.svg'), svgHorizontalLight);

  // --- 1B. HORIZONTAL LOGO (SOLID WHITE BACKGROUND - AS IN MAIN WEB NAVBAR) ---
  console.log('Creating Horizontal Logo on Solid White Background...');
  const svgHorizontalWhiteBg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${hWidth} ${hHeight}" width="${hWidth}" height="${hHeight}">
  <defs>
    <linearGradient id="azaharBrandGrad" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${COLOR_BLUE_GRAD_START}" />
      <stop offset="50%" stop-color="${COLOR_BLUE_GRAD_MID}" />
      <stop offset="100%" stop-color="${COLOR_CYAN_GRAD_END}" />
    </linearGradient>
    <filter id="badgeShadow" x="-10%" y="-10%" width="130%" height="130%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="5" stdDeviation="10" flood-color="${COLOR_BLUE_GRAD_START}" flood-opacity="0.25" />
    </filter>
    <style>
      ${fontStyle}
    </style>
  </defs>

  <!-- Pure White Background as seen in the website header -->
  <rect width="${hWidth}" height="${hHeight}" fill="#ffffff" />

  <!-- Brand Isotipo Mark -->
  <g transform="translate(${badgeX}, ${badgeY})" filter="url(#badgeShadow)">
    ${getSymbolInner(badgeSize, badgeRadius)}
  </g>

  <!-- Brand Typography -->
  <g id="brand-typography">
    <text x="136" y="72" class="brand-title">
      <tspan fill="${COLOR_TEXT_DARK}">AZAHAR </tspan>
      <tspan fill="${COLOR_RENTALS_BLUE}">RENTALS</tspan>
    </text>
    <text x="138" y="104" class="brand-subtitle" fill="${COLOR_TEXT_SUBTITLE}">
      COSTA DE CASTELLÓN · GESTIÓN TURÍSTICA
    </text>
  </g>
</svg>`;

  fs.writeFileSync(path.join(publicDir, 'azahar-rentals-logo-fondo-blanco.svg'), svgHorizontalWhiteBg);

  // --- 2. HORIZONTAL LOGO (DARK BACKGROUND / WHITE VERSION) ---
  console.log('Creating Horizontal Logo White...');
  const svgHorizontalDark = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${hWidth} ${hHeight}" width="${hWidth}" height="${hHeight}" fill="none">
  <defs>
    <linearGradient id="azaharBrandGrad" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${COLOR_BLUE_GRAD_START}" />
      <stop offset="50%" stop-color="${COLOR_BLUE_GRAD_MID}" />
      <stop offset="100%" stop-color="${COLOR_CYAN_GRAD_END}" />
    </linearGradient>
    <filter id="badgeShadowWhite" x="-10%" y="-10%" width="130%" height="130%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="5" stdDeviation="12" flood-color="${COLOR_CYAN_GRAD_END}" flood-opacity="0.35" />
    </filter>
    <style>
      ${fontStyle}
    </style>
  </defs>

  <g transform="translate(${badgeX}, ${badgeY})" filter="url(#badgeShadowWhite)">
    ${getSymbolInner(badgeSize, badgeRadius)}
  </g>

  <g id="brand-typography-white">
    <text x="136" y="72" class="brand-title">
      <tspan fill="${COLOR_WHITE}">AZAHAR </tspan>
      <tspan fill="${COLOR_RENTALS_LIGHT}">RENTALS</tspan>
    </text>
    <text x="138" y="104" class="brand-subtitle" fill="${COLOR_TEXT_SUBTITLE_LIGHT}">
      COSTA DE CASTELLÓN · GESTIÓN TURÍSTICA
    </text>
  </g>
</svg>`;

  fs.writeFileSync(path.join(publicDir, 'azahar-rentals-logo-white.svg'), svgHorizontalDark);

  // --- 3. ISOTIPO / ICON ONLY (SQUARE 512x512 TRANSPARENT) ---
  console.log('Creating Isotipo SVG...');
  const iconSize = 512;
  const isoBadgeSize = 420;
  const isoRadius = 105;
  const isoOffset = (iconSize - isoBadgeSize) / 2;

  const svgIsotipo = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${iconSize} ${iconSize}" width="${iconSize}" height="${iconSize}" fill="none">
  <defs>
    <linearGradient id="azaharBrandGrad" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${COLOR_BLUE_GRAD_START}" />
      <stop offset="50%" stop-color="${COLOR_BLUE_GRAD_MID}" />
      <stop offset="100%" stop-color="${COLOR_CYAN_GRAD_END}" />
    </linearGradient>
    <filter id="isoShadow" x="-10%" y="-10%" width="130%" height="130%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="18" stdDeviation="26" flood-color="${COLOR_BLUE_GRAD_START}" flood-opacity="0.28" />
    </filter>
  </defs>

  <g transform="translate(${isoOffset}, ${isoOffset})" filter="url(#isoShadow)">
    ${getSymbolInner(isoBadgeSize, isoRadius)}
  </g>
</svg>`;

  fs.writeFileSync(path.join(publicDir, 'azahar-rentals-isotipo.svg'), svgIsotipo);

  // --- 3B. ISOTIPO ON SOLID WHITE BACKGROUND ---
  const svgIsotipoWhiteBg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${iconSize} ${iconSize}" width="${iconSize}" height="${iconSize}">
  <defs>
    <linearGradient id="azaharBrandGrad" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${COLOR_BLUE_GRAD_START}" />
      <stop offset="50%" stop-color="${COLOR_BLUE_GRAD_MID}" />
      <stop offset="100%" stop-color="${COLOR_CYAN_GRAD_END}" />
    </linearGradient>
    <filter id="isoShadow" x="-10%" y="-10%" width="130%" height="130%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="18" stdDeviation="26" flood-color="${COLOR_BLUE_GRAD_START}" flood-opacity="0.28" />
    </filter>
  </defs>

  <rect width="${iconSize}" height="${iconSize}" fill="#ffffff" />
  <g transform="translate(${isoOffset}, ${isoOffset})" filter="url(#isoShadow)">
    ${getSymbolInner(isoBadgeSize, isoRadius)}
  </g>
</svg>`;

  fs.writeFileSync(path.join(publicDir, 'azahar-rentals-isotipo-fondo-blanco.svg'), svgIsotipoWhiteBg);

  // --- 4. VERTICAL / STACKED LOGO (SQUARE 540x540) ---
  console.log('Creating Vertical Stacked Logo...');
  const vWidth = 540;
  const vHeight = 540;
  const vBadgeSize = 160;
  const vBadgeRadius = 40;
  const vBadgeX = (vWidth - vBadgeSize) / 2;
  const vBadgeY = 80;

  const svgVertical = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${vWidth} ${vHeight}" width="${vWidth}" height="${vHeight}" fill="none">
  <defs>
    <linearGradient id="azaharBrandGrad" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${COLOR_BLUE_GRAD_START}" />
      <stop offset="50%" stop-color="${COLOR_BLUE_GRAD_MID}" />
      <stop offset="100%" stop-color="${COLOR_CYAN_GRAD_END}" />
    </linearGradient>
    <filter id="vBadgeShadow" x="-10%" y="-10%" width="130%" height="130%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="${COLOR_BLUE_GRAD_START}" flood-opacity="0.25" />
    </filter>
    <style>
      ${fontStyle}
    </style>
  </defs>

  <g transform="translate(${vBadgeX}, ${vBadgeY})" filter="url(#vBadgeShadow)">
    ${getSymbolInner(vBadgeSize, vBadgeRadius)}
  </g>

  <g id="vertical-typography">
    <text x="270" y="325" class="brand-title-v">
      <tspan fill="${COLOR_TEXT_DARK}">AZAHAR </tspan>
      <tspan fill="${COLOR_RENTALS_BLUE}">RENTALS</tspan>
    </text>
    <text x="270" y="365" class="brand-subtitle-v" fill="${COLOR_TEXT_SUBTITLE}">
      COSTA DE CASTELLÓN · GESTIÓN TURÍSTICA
    </text>
  </g>
</svg>`;

  fs.writeFileSync(path.join(publicDir, 'azahar-rentals-logo-vertical.svg'), svgVertical);

  // Vertical on Solid White
  const svgVerticalWhiteBg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${vWidth} ${vHeight}" width="${vWidth}" height="${vHeight}">
  <defs>
    <linearGradient id="azaharBrandGrad" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${COLOR_BLUE_GRAD_START}" />
      <stop offset="50%" stop-color="${COLOR_BLUE_GRAD_MID}" />
      <stop offset="100%" stop-color="${COLOR_CYAN_GRAD_END}" />
    </linearGradient>
    <filter id="vBadgeShadow" x="-10%" y="-10%" width="130%" height="130%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="${COLOR_BLUE_GRAD_START}" flood-opacity="0.25" />
    </filter>
    <style>
      ${fontStyle}
    </style>
  </defs>

  <rect width="${vWidth}" height="${vHeight}" fill="#ffffff" />
  <g transform="translate(${vBadgeX}, ${vBadgeY})" filter="url(#vBadgeShadow)">
    ${getSymbolInner(vBadgeSize, vBadgeRadius)}
  </g>

  <g id="vertical-typography">
    <text x="270" y="325" class="brand-title-v">
      <tspan fill="${COLOR_TEXT_DARK}">AZAHAR </tspan>
      <tspan fill="${COLOR_RENTALS_BLUE}">RENTALS</tspan>
    </text>
    <text x="270" y="365" class="brand-subtitle-v" fill="${COLOR_TEXT_SUBTITLE}">
      COSTA DE CASTELLÓN · GESTIÓN TURÍSTICA
    </text>
  </g>
</svg>`;

  fs.writeFileSync(path.join(publicDir, 'azahar-rentals-logo-vertical-fondo-blanco.svg'), svgVerticalWhiteBg);

  // Vertical Logo White for dark backgrounds
  const svgVerticalDark = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${vWidth} ${vHeight}" width="${vWidth}" height="${vHeight}" fill="none">
  <defs>
    <linearGradient id="azaharBrandGrad" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${COLOR_BLUE_GRAD_START}" />
      <stop offset="50%" stop-color="${COLOR_BLUE_GRAD_MID}" />
      <stop offset="100%" stop-color="${COLOR_CYAN_GRAD_END}" />
    </linearGradient>
    <filter id="vBadgeShadowWhite" x="-10%" y="-10%" width="130%" height="130%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="12" stdDeviation="18" flood-color="${COLOR_CYAN_GRAD_END}" flood-opacity="0.35" />
    </filter>
    <style>
      ${fontStyle}
    </style>
  </defs>

  <g transform="translate(${vBadgeX}, ${vBadgeY})" filter="url(#vBadgeShadowWhite)">
    ${getSymbolInner(vBadgeSize, vBadgeRadius)}
  </g>

  <g id="vertical-typography-white">
    <text x="270" y="325" class="brand-title-v">
      <tspan fill="${COLOR_WHITE}">AZAHAR </tspan>
      <tspan fill="${COLOR_RENTALS_LIGHT}">RENTALS</tspan>
    </text>
    <text x="270" y="365" class="brand-subtitle-v" fill="${COLOR_TEXT_SUBTITLE_LIGHT}">
      COSTA DE CASTELLÓN · GESTIÓN TURÍSTICA
    </text>
  </g>
</svg>`;

  fs.writeFileSync(path.join(publicDir, 'azahar-rentals-logo-vertical-white.svg'), svgVerticalDark);

  // --- 5. RASTERIZE WITH SHARP TO ULTRA HIGH-RES PNG (300 DPI / 4K) ---
  console.log('Rasterizing with Sharp to 300 DPI Ultra High-Res PNGs...');
  
  // Horizontal logo: 3040 x 560 px (Transparent)
  await sharp(Buffer.from(svgHorizontalLight))
    .resize(3040, 560)
    .png({ compressionLevel: 9 })
    .toFile(path.join(publicDir, 'azahar-rentals-logo.png'));
  console.log('Saved azahar-rentals-logo.png (3040x560, transparent)');

  // Horizontal logo: 3040 x 560 px (SOLID WHITE BACKGROUND)
  await sharp(Buffer.from(svgHorizontalWhiteBg))
    .resize(3040, 560)
    .png({ compressionLevel: 9 })
    .toFile(path.join(publicDir, 'azahar-rentals-logo-fondo-blanco.png'));
  console.log('Saved azahar-rentals-logo-fondo-blanco.png (3040x560, fondo blanco)');

  // Horizontal logo JPG: 3040 x 560 px (SOLID WHITE BACKGROUND, 98% quality)
  await sharp(Buffer.from(svgHorizontalWhiteBg))
    .resize(3040, 560)
    .jpeg({ quality: 98 })
    .toFile(path.join(publicDir, 'azahar-rentals-logo-fondo-blanco.jpg'));
  console.log('Saved azahar-rentals-logo-fondo-blanco.jpg (3040x560, fondo blanco)');

  // Horizontal white logo: 3040 x 560 px (Dark mode)
  await sharp(Buffer.from(svgHorizontalDark))
    .resize(3040, 560)
    .png({ compressionLevel: 9 })
    .toFile(path.join(publicDir, 'azahar-rentals-logo-white.png'));
  console.log('Saved azahar-rentals-logo-white.png (3040x560)');

  // Isotipo: 1024 x 1024 px (Transparent)
  await sharp(Buffer.from(svgIsotipo))
    .resize(1024, 1024)
    .png({ compressionLevel: 9 })
    .toFile(path.join(publicDir, 'azahar-rentals-isotipo.png'));
  console.log('Saved azahar-rentals-isotipo.png (1024x1024, transparent)');

  // Isotipo: 1024 x 1024 px (SOLID WHITE BACKGROUND)
  await sharp(Buffer.from(svgIsotipoWhiteBg))
    .resize(1024, 1024)
    .png({ compressionLevel: 9 })
    .toFile(path.join(publicDir, 'azahar-rentals-isotipo-fondo-blanco.png'));
  console.log('Saved azahar-rentals-isotipo-fondo-blanco.png (1024x1024, fondo blanco)');

  await sharp(Buffer.from(svgIsotipoWhiteBg))
    .resize(1024, 1024)
    .jpeg({ quality: 98 })
    .toFile(path.join(publicDir, 'azahar-rentals-isotipo-fondo-blanco.jpg'));
  console.log('Saved azahar-rentals-isotipo-fondo-blanco.jpg (1024x1024, fondo blanco)');

  // Vertical Logo: 2160 x 2160 px (Transparent)
  await sharp(Buffer.from(svgVertical))
    .resize(2160, 2160)
    .png({ compressionLevel: 9 })
    .toFile(path.join(publicDir, 'azahar-rentals-logo-vertical.png'));
  console.log('Saved azahar-rentals-logo-vertical.png (2160x2160)');

  // Vertical Logo: 2160 x 2160 px (SOLID WHITE BACKGROUND)
  await sharp(Buffer.from(svgVerticalWhiteBg))
    .resize(2160, 2160)
    .png({ compressionLevel: 9 })
    .toFile(path.join(publicDir, 'azahar-rentals-logo-vertical-fondo-blanco.png'));
  console.log('Saved azahar-rentals-logo-vertical-fondo-blanco.png (2160x2160, fondo blanco)');

  // Vertical Logo White: 2160 x 2160 px
  await sharp(Buffer.from(svgVerticalDark))
    .resize(2160, 2160)
    .png({ compressionLevel: 9 })
    .toFile(path.join(publicDir, 'azahar-rentals-logo-vertical-white.png'));
  console.log('Saved azahar-rentals-logo-vertical-white.png (2160x2160)');

  // Presentation Showcase Card (1920x1080)
  const cardWidth = 1920;
  const cardHeight = 1080;
  const scale = 2.0;
  const cardLogoWidth = hWidth * scale;
  const cardLogoHeight = hHeight * scale;
  const cardLogoX = (cardWidth - cardLogoWidth) / 2;
  const cardLogoY = (cardHeight - cardLogoHeight) / 2 - 25;

  const svgCard = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${cardWidth} ${cardHeight}" width="${cardWidth}" height="${cardHeight}">
  <defs>
    <radialGradient id="cardBg" cx="50%" cy="45%" r="70%">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="60%" stop-color="#090d16" />
      <stop offset="100%" stop-color="#020617" />
    </radialGradient>
    <linearGradient id="azaharBrandGrad" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${COLOR_BLUE_GRAD_START}" />
      <stop offset="50%" stop-color="${COLOR_BLUE_GRAD_MID}" />
      <stop offset="100%" stop-color="${COLOR_CYAN_GRAD_END}" />
    </linearGradient>
    <filter id="badgeGlow" x="-20%" y="-20%" width="140%" height="140%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="12" stdDeviation="24" flood-color="${COLOR_CYAN_GRAD_END}" flood-opacity="0.35" />
    </filter>
    <style>
      ${fontStyle}
    </style>
  </defs>

  <rect width="${cardWidth}" height="${cardHeight}" fill="url(#cardBg)" />

  <!-- Background decorative light cone -->
  <ellipse cx="960" cy="500" rx="600" ry="250" fill="${COLOR_BLUE_GRAD_MID}" opacity="0.08" filter="blur(80px)" />

  <!-- Centered Logo Scaled -->
  <g transform="translate(${cardLogoX}, ${cardLogoY}) scale(${scale})">
    <g transform="translate(${badgeX}, ${badgeY})" filter="url(#badgeGlow)">
      ${getSymbolInner(badgeSize, badgeRadius)}
    </g>
    <g>
      <text x="136" y="72" class="brand-title">
        <tspan fill="${COLOR_WHITE}">AZAHAR </tspan>
        <tspan fill="${COLOR_RENTALS_LIGHT}">RENTALS</tspan>
      </text>
      <text x="138" y="104" class="brand-subtitle" fill="${COLOR_TEXT_SUBTITLE_LIGHT}">
        COSTA DE CASTELLÓN · GESTIÓN TURÍSTICA
      </text>
    </g>
  </g>

  <!-- Footer branding banner -->
  <text x="${cardWidth / 2}" y="930" text-anchor="middle" font-family="'Plus Jakarta Sans', sans-serif" font-weight="700" font-size="16" fill="#38bdf8" letter-spacing="0.25em">
    AZAHAR RENTALS · BRAND IDENTITY KIT
  </text>
  <text x="${cardWidth / 2}" y="960" text-anchor="middle" font-family="'Plus Jakarta Sans', sans-serif" font-weight="500" font-size="13" fill="#64748b" letter-spacing="0.1em">
    Castellón de la Plana · Peñíscola · Benicàssim · Oropesa del Mar · Vinaròs · Alcossebre
  </text>
</svg>`;

  await sharp(Buffer.from(svgCard))
    .resize(cardWidth, cardHeight)
    .jpeg({ quality: 95 })
    .toFile(path.join(publicDir, 'azahar-rentals-brand-presentation.jpg'));
  console.log('Saved azahar-rentals-brand-presentation.jpg (1920x1080)');

  // Also update favicon.svg to match
  const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" fill="none">
  <defs>
    <linearGradient id="azaharBrandGrad" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${COLOR_BLUE_GRAD_START}" />
      <stop offset="50%" stop-color="${COLOR_BLUE_GRAD_MID}" />
      <stop offset="100%" stop-color="${COLOR_CYAN_GRAD_END}" />
    </linearGradient>
  </defs>

  <rect width="64" height="64" rx="16" fill="url(#azaharBrandGrad)" />
  <g transform="translate(13.6, 13.6) scale(1.533)" fill="none" stroke="#ffffff" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round">
    <path d="M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16" />
    <path d="M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2" />
    <path d="M10 8h4" />
    <path d="M10 12h4" />
    <path d="M10 21v-3a2 2 0 0 0-4 0v3" />
  </g>
</svg>`;
  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), faviconSvg);

  console.log('ALL BRAND ASSETS GENERATED SUCCESSFULLY!');
}

generate().catch(console.error);
