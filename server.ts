import express from 'express';
import path from 'path';
import fs from 'fs';
import https from 'https';
import http from 'http';
import { createServer as createViteServer } from 'vite';
import {
  getApartments,
  getApartmentById,
  createApartment,
  updateApartment,
  deleteApartment
} from './server/db';
import {
  authenticateAdmin,
  changeAdminPassword,
  resetAdminPassword,
  validateSessionToken,
  getAdminUser
} from './server/auth';

const PORT = 3000;

async function startServer() {
  const app = express();

  // Generous limit for high-resolution base64 photo uploads
  app.use(express.json({ limit: '60mb' }));
  app.use(express.urlencoded({ extended: true, limit: '60mb' }));

  // Request logger for API calls
  app.use((req, res, next) => {
    if (req.path.startsWith('/api/')) {
      console.log(`[API] ${req.method} ${req.path}`);
    }
    next();
  });

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'Azahar Rentals Backend API',
      timestamp: new Date().toISOString()
    });
  });

  // ==========================================
  // APARTMENTS API
  // ==========================================

  // List all apartments
  app.get('/api/apartments', (req, res) => {
    try {
      const list = getApartments();
      res.json({ success: true, data: list });
    } catch (err: any) {
      console.error('Error fetching apartments:', err);
      res.status(500).json({ success: false, error: err.message || 'Error al obtener apartamentos' });
    }
  });

  // Get single apartment
  app.get('/api/apartments/:id', (req, res) => {
    try {
      const apt = getApartmentById(req.params.id);
      if (!apt) {
        return res.status(404).json({ success: false, error: 'Apartamento no encontrado' });
      }
      res.json({ success: true, data: apt });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Create apartment
  app.post('/api/apartments', (req, res) => {
    try {
      const newApt = createApartment(req.body);
      res.status(201).json({ success: true, data: newApt });
    } catch (err: any) {
      console.error('Error creating apartment:', err);
      res.status(500).json({ success: false, error: err.message || 'Error al crear apartamento' });
    }
  });

  // Update apartment
  app.put('/api/apartments/:id', (req, res) => {
    try {
      const updated = updateApartment(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ success: false, error: 'Apartamento no encontrado' });
      }
      res.json({ success: true, data: updated });
    } catch (err: any) {
      console.error('Error updating apartment:', err);
      res.status(500).json({ success: false, error: err.message || 'Error al actualizar' });
    }
  });

  // Delete apartment
  app.delete('/api/apartments/:id', (req, res) => {
    try {
      const ok = deleteApartment(req.params.id);
      if (!ok) {
        return res.status(404).json({ success: false, error: 'Apartamento no encontrado' });
      }
      res.json({ success: true, message: 'Apartamento eliminado correctamente' });
    } catch (err: any) {
      console.error('Error deleting apartment:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Update apartment photos directly
  app.post('/api/apartments/:id/photos', (req, res) => {
    try {
      const { photos } = req.body;
      if (!Array.isArray(photos)) {
        return res.status(400).json({ success: false, error: 'El campo photos debe ser un array' });
      }
      const updated = updateApartment(req.params.id, { photos });
      if (!updated) {
        return res.status(404).json({ success: false, error: 'Apartamento no encontrado' });
      }
      res.json({ success: true, data: updated });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Update apartment amenities/services directly
  app.post('/api/apartments/:id/amenities', (req, res) => {
    try {
      const { amenities } = req.body;
      if (!Array.isArray(amenities)) {
        return res.status(400).json({ success: false, error: 'El campo amenities debe ser un array' });
      }
      const updated = updateApartment(req.params.id, { amenities });
      if (!updated) {
        return res.status(404).json({ success: false, error: 'Apartamento no encontrado' });
      }
      res.json({ success: true, data: updated });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Helper function to fetch iCal feed following redirects
  const fetchBookingIcalStream = (url: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const client = url.startsWith('https') ? https : http;
      const req = client.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; AzaharRentalsSync/1.0; +https://azaharrentals.com)'
        }
      }, (response) => {
        // Handle redirects
        if (response.statusCode && response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
          return resolve(fetchBookingIcalStream(response.headers.location));
        }
        if (response.statusCode !== 200) {
          return reject(new Error(`Booking iCal respondió con estado HTTP ${response.statusCode}`));
        }
        let data = '';
        response.on('data', (chunk) => { data += chunk; });
        response.on('end', () => resolve(data));
      });
      req.on('error', reject);
      req.setTimeout(10000, () => {
        req.destroy();
        reject(new Error('Tiempo de espera agotado al conectar con Booking.com'));
      });
    });
  };

  // GET /api/booking-ical proxy (used by client-side calendar sync)
  app.get('/api/booking-ical', async (req, res) => {
    try {
      const targetUrl = req.query.url as string;
      if (!targetUrl || !targetUrl.startsWith('http')) {
        return res.status(400).send('URL iCal no válida o no especificada');
      }

      const icalContent = await fetchBookingIcalStream(targetUrl);
      res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
      res.setHeader('Cache-Control', 'public, max-age=300'); // 5 minutes cache
      res.send(icalContent);
    } catch (err: any) {
      console.error('Error fetching Booking iCal proxy GET:', err);
      res.status(502).send(err.message || 'Error al conectar con Booking.com');
    }
  });

  // Server-side iCal proxy sync (avoids browser CORS issues when fetching Booking.com iCal feeds)
  app.post('/api/apartments/:id/ical-sync', async (req, res) => {
    try {
      const { icalUrl } = req.body;
      const targetUrl = icalUrl || getApartmentById(req.params.id)?.bookingIcalUrl;

      if (!targetUrl || !targetUrl.startsWith('http')) {
        return res.status(400).json({ success: false, error: 'URL iCal no válida o no especificada' });
      }

      const icalContent = await fetchBookingIcalStream(targetUrl);
      
      // Save icalUrl if provided
      if (icalUrl) {
        updateApartment(req.params.id, { bookingIcalUrl: icalUrl });
      }

      // Simple regex count of VEVENT blocks
      const eventMatches = icalContent.match(/BEGIN:VEVENT/g) || [];

      res.json({
        success: true,
        message: `Sincronización exitosa con Booking.com: ${eventMatches.length} reservas/bloqueos detectados.`,
        eventsCount: eventMatches.length,
        rawIcal: icalContent
      });
    } catch (err: any) {
      console.error('Error syncing Booking iCal:', err);
      res.status(500).json({ success: false, error: err.message || 'Error al sincronizar con Booking.com' });
    }
  });

  // ==========================================
  // ADMIN AUTHENTICATION API
  // ==========================================

  // Admin login
  app.post('/api/admin/login', (req, res) => {
    try {
      const { identifier, password } = req.body;
      if (!identifier || !password) {
        return res.status(400).json({ success: false, error: 'Debes proporcionar usuario/email y contraseña' });
      }
      const result = authenticateAdmin(identifier, password);
      if (!result.success) {
        return res.status(401).json(result);
      }
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Get security question for password reset
  app.get('/api/admin/security-question', (req, res) => {
    try {
      const user = getAdminUser();
      res.json({
        success: true,
        username: user.username,
        email: user.email,
        securityQuestion: user.securityQuestion
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Change password
  app.post('/api/admin/change-password', (req, res) => {
    try {
      const { identifier, currentPassword, newPassword } = req.body;
      if (!identifier || !currentPassword || !newPassword) {
        return res.status(400).json({ success: false, error: 'Faltan campos requeridos' });
      }
      const result = changeAdminPassword(identifier, currentPassword, newPassword);
      if (!result.success) {
        return res.status(400).json(result);
      }
      res.json({ success: true, message: 'Contraseña actualizada con éxito' });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Reset password via security answer
  app.post('/api/admin/reset-password', (req, res) => {
    try {
      const { identifier, securityAnswer, newPassword } = req.body;
      if (!identifier || !securityAnswer || !newPassword) {
        return res.status(400).json({ success: false, error: 'Faltan campos requeridos para el restablecimiento' });
      }
      const result = resetAdminPassword(identifier, securityAnswer, newPassword);
      if (!result.success) {
        return res.status(400).json(result);
      }
      res.json({ success: true, message: 'Contraseña restablecida correctamente. Ya puedes iniciar sesión.' });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Verify token
  app.get('/api/admin/verify', (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader ? authHeader.replace('Bearer ', '') : '';
    const isValid = validateSessionToken(token);
    res.json({ success: isValid });
  });

  // ==========================================
  // STATIC ASSETS SERVING (IMAGES & PLATFORMS)
  // ==========================================
  const publicPath = path.join(process.cwd(), 'public');
  const publicImagesPath = path.join(process.cwd(), 'public', 'images');
  const srcAssetsImagesPath = path.join(process.cwd(), 'src', 'assets', 'images');
  const publicPlatformsPath = path.join(process.cwd(), 'public', 'platforms');

  // Explicit handlers for SEO crawlers and search engine indexing
  app.get('/robots.txt', (req, res) => {
    const robotsPath = fs.existsSync(path.join(publicPath, 'robots.txt'))
      ? path.join(publicPath, 'robots.txt')
      : path.join(process.cwd(), 'dist', 'robots.txt');
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.sendFile(robotsPath, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8'
      }
    });
  });

  app.get('/sitemap.xml', (req, res) => {
    const sitemapPath = fs.existsSync(path.join(publicPath, 'sitemap.xml'))
      ? path.join(publicPath, 'sitemap.xml')
      : path.join(process.cwd(), 'dist', 'sitemap.xml');
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.sendFile(sitemapPath, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'X-Content-Type-Options': 'nosniff'
      }
    });
  });

  // Serve static files from public root, images and platforms
  app.use(express.static(publicPath));
  app.use('/images', express.static(publicImagesPath, { maxAge: '30d' }));
  app.use('/platforms', express.static(publicPlatformsPath, { maxAge: '30d' }));

  // ==========================================
  // VITE & STATIC SERVING
  // ==========================================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Azahar Rentals Full-Stack Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
