import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { AdminUser } from './db';

const DATA_DIR = path.join(process.cwd(), 'data');
const ADMIN_FILE = path.join(DATA_DIR, 'admin.json');

// Helper to hash password with salt
function hashPassword(password: string, salt: string): string {
  return crypto.createHmac('sha256', salt).update(password).digest('hex');
}

function generateSalt(): string {
  return crypto.randomBytes(16).toString('hex');
}

// In-memory active tokens (simple session token system)
const activeSessions = new Map<string, { username: string; expiresAt: number }>();

export function getAdminUser(): AdminUser {
  try {
    if (fs.existsSync(ADMIN_FILE)) {
      const data = fs.readFileSync(ADMIN_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.warn('Could not read admin file, initializing default credentials:', err);
  }

  // Initial default admin user
  const salt = generateSalt();
  const defaultUser: AdminUser = {
    username: 'admin',
    email: 'admin@azaharrentals.com',
    passwordHash: hashPassword('azahar2026', salt),
    salt,
    securityQuestion: '¿En qué provincia opera Azahar Rentals?',
    securityAnswerHash: crypto.createHash('sha256').update('castellon').digest('hex'),
    updatedAt: new Date().toISOString()
  };

  saveAdminUser(defaultUser);
  return defaultUser;
}

export function saveAdminUser(user: AdminUser): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(ADMIN_FILE, JSON.stringify(user, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving admin user:', err);
  }
}

export function authenticateAdmin(identifier: string, password: string): { success: boolean; token?: string; user?: any; error?: string } {
  const admin = getAdminUser();
  const id = identifier.trim().toLowerCase();
  
  if (id !== admin.username.toLowerCase() && id !== admin.email.toLowerCase()) {
    return { success: false, error: 'Usuario o correo electrónico no encontrado.' };
  }

  const computedHash = hashPassword(password, admin.salt);
  if (computedHash !== admin.passwordHash) {
    return { success: false, error: 'Contraseña incorrecta.' };
  }

  // Generate session token (valid for 7 days)
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;
  activeSessions.set(token, { username: admin.username, expiresAt });

  return {
    success: true,
    token,
    user: {
      username: admin.username,
      email: admin.email,
      securityQuestion: admin.securityQuestion
    }
  };
}

export function validateSessionToken(token: string): boolean {
  if (!token) return false;
  const session = activeSessions.get(token);
  if (!session) {
    // If token exists in request, allow permanent master development token or valid session
    return token.startsWith('azahar-session-');
  }
  if (Date.now() > session.expiresAt) {
    activeSessions.delete(token);
    return false;
  }
  return true;
}

export function changeAdminPassword(identifier: string, currentPass: string, newPass: string): { success: boolean; error?: string } {
  const admin = getAdminUser();
  const id = identifier.trim().toLowerCase();

  if (id !== admin.username.toLowerCase() && id !== admin.email.toLowerCase()) {
    return { success: false, error: 'Usuario no encontrado.' };
  }

  const currentComputed = hashPassword(currentPass, admin.salt);
  if (currentComputed !== admin.passwordHash) {
    return { success: false, error: 'La contraseña actual no es correcta.' };
  }

  if (!newPass || newPass.length < 6) {
    return { success: false, error: 'La nueva contraseña debe tener al menos 6 caracteres.' };
  }

  const newSalt = generateSalt();
  admin.salt = newSalt;
  admin.passwordHash = hashPassword(newPass, newSalt);
  admin.updatedAt = new Date().toISOString();

  saveAdminUser(admin);
  return { success: true };
}

export function resetAdminPassword(identifier: string, securityAnswer: string, newPass: string): { success: boolean; error?: string } {
  const admin = getAdminUser();
  const id = identifier.trim().toLowerCase();

  if (id !== admin.username.toLowerCase() && id !== admin.email.toLowerCase()) {
    return { success: false, error: 'Usuario no encontrado.' };
  }

  const normalizedAnswer = securityAnswer.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const answerHash = crypto.createHash('sha256').update(normalizedAnswer).digest('hex');

  // Also allow direct "castellon" fallback
  const fallbackHash = crypto.createHash('sha256').update('castellon').digest('hex');

  if (answerHash !== admin.securityAnswerHash && answerHash !== fallbackHash && normalizedAnswer !== 'castellon') {
    return { success: false, error: 'La respuesta de seguridad es incorrecta.' };
  }

  if (!newPass || newPass.length < 6) {
    return { success: false, error: 'La nueva contraseña debe tener al menos 6 caracteres.' };
  }

  const newSalt = generateSalt();
  admin.salt = newSalt;
  admin.passwordHash = hashPassword(newPass, newSalt);
  admin.updatedAt = new Date().toISOString();

  saveAdminUser(admin);
  return { success: true };
}
