import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {defineConfig} from 'vite';
import {PRERENDER_ROUTE_FILES, generateSitemapXml, injectRouteSeoIntoHtml} from './src/seo/routeMeta';

function bookingIcalProxyPlugin() {
  return {
    name: 'booking-ical-proxy',
    configureServer(server: any) {
      server.middlewares.use('/api/booking-ical', async (req: any, res: any) => {
        try {
          const urlObj = new URL(req.url, 'http://localhost:3000');
          const targetUrl = urlObj.searchParams.get('url');
          if (!targetUrl) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Missing url query param' }));
            return;
          }
          const response = await fetch(targetUrl, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
          });
          if (!response.ok) {
            res.statusCode = response.status;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: `Booking responded with ${response.status}` }));
            return;
          }
          const text = await response.text();
          res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.end(text);
        } catch (err: any) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: err.message || 'Failed to fetch iCal' }));
        }
      });
    }
  };
}

function routeSeoHtmlPlugin() {
  return {
    name: 'azahar-route-seo-html',
    configureServer(server: any) {
      server.middlewares.use((req: any, res: any, next: any) => {
        const urlPath = (req.url || '').split('?')[0];
        if (urlPath === '/sitemap.xml' || urlPath === '/site-maps.xml') {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/xml; charset=utf-8');
          res.setHeader('X-Content-Type-Options', 'nosniff');
          res.end(generateSitemapXml());
          return;
        }
        next();
      });
    },
    transformIndexHtml: {
      order: 'post' as const,
      handler(html: string, ctx: { originalUrl?: string }) {
        const reqPath = ctx?.originalUrl || '/';
        return injectRouteSeoIntoHtml(html, reqPath);
      },
    },
    closeBundle() {
      const distDir = path.resolve(__dirname, 'dist');
      const indexPath = path.join(distDir, 'index.html');
      if (fs.existsSync(indexPath)) {
        const baseHtml = fs.readFileSync(indexPath, 'utf-8');
        for (const { filename, meta } of PRERENDER_ROUTE_FILES) {
          const routeHtml = injectRouteSeoIntoHtml(baseHtml, meta.canonicalPath);
          fs.writeFileSync(path.join(distDir, filename), routeHtml, 'utf-8');
        }
      }

      // Sync sitemap.xml automatically into both public/ and dist/ on every build
      const sitemapXml = generateSitemapXml();
      if (fs.existsSync(distDir)) {
        fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemapXml, 'utf-8');
      }
      const publicSitemapPath = path.resolve(__dirname, 'public', 'sitemap.xml');
      fs.writeFileSync(publicSitemapPath, sitemapXml, 'utf-8');
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), bookingIcalProxyPlugin(), routeSeoHtmlPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
