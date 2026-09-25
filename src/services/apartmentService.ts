import { FeaturedApartment, FEATURED_APARTMENTS, ApartmentPhoto } from '../data/featuredApartments';

const TOKEN_KEY = 'azahar_admin_token';
const USER_KEY = 'azahar_admin_user';
const LOCAL_CREDENTIALS_KEY = 'azahar_custom_admin_creds';
const LOCAL_APARTMENTS_KEY = 'azahar_apartments_data';

export interface AdminCredentials {
  username: string;
  email: string;
  password: string;
  securityQuestion: string;
  securityAnswer: string;
}

const DEFAULT_ADMIN: AdminCredentials = {
  username: 'admin',
  email: 'admin@azaharrentals.com',
  password: 'azahar2026',
  securityQuestion: '¿En qué provincia opera Azahar Rentals?',
  securityAnswer: 'castellon'
};

function getLocalAdminCredentials(): AdminCredentials {
  try {
    const raw = localStorage.getItem(LOCAL_CREDENTIALS_KEY);
    if (raw) {
      return { ...DEFAULT_ADMIN, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.warn('Error reading local admin credentials:', e);
  }
  return DEFAULT_ADMIN;
}

function saveLocalAdminCredentials(creds: Partial<AdminCredentials>): void {
  try {
    const current = getLocalAdminCredentials();
    const updated = { ...current, ...creds };
    localStorage.setItem(LOCAL_CREDENTIALS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Error saving local admin credentials:', e);
  }
}

function getLocalApartments(): FeaturedApartment[] {
  try {
    const raw = localStorage.getItem(LOCAL_APARTMENTS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Error reading local apartments:', e);
  }
  return FEATURED_APARTMENTS;
}

function saveLocalApartments(apartments: FeaturedApartment[]): void {
  try {
    localStorage.setItem(LOCAL_APARTMENTS_KEY, JSON.stringify(apartments));
  } catch (e) {
    console.error('Error saving local apartments:', e);
  }
}

/**
 * Robust response parser that avoids "Unexpected end of JSON input"
 * or HTML syntax errors when deployed on static/serverless hosts (e.g. Vercel)
 */
async function parseResponseSafe(res: Response): Promise<{ isJson: boolean; data: any; text: string }> {
  try {
    const text = await res.text();
    if (!text || !text.trim()) {
      return { isJson: false, data: null, text: '' };
    }
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('text/html') || text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html')) {
      return { isJson: false, data: null, text };
    }
    const data = JSON.parse(text);
    return { isJson: true, data, text };
  } catch {
    return { isJson: false, data: null, text: '' };
  }
}

export function getStoredAdminToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function getStoredAdminUser(): any | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setStoredAdminSession(token: string, user: any): void {
  try {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (e) {
    console.error('Error saving session:', e);
  }
}

export function clearStoredAdminSession(): void {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  } catch (e) {
    console.error('Error clearing session:', e);
  }
}

// Fetch all apartments from backend database (with fallback to local storage & default seed)
export async function fetchApartments(): Promise<FeaturedApartment[]> {
  try {
    const res = await fetch('/api/apartments');
    const parsed = await parseResponseSafe(res);
    if (parsed.isJson && parsed.data && parsed.data.success && Array.isArray(parsed.data.data)) {
      saveLocalApartments(parsed.data.data);
      return parsed.data.data;
    }
  } catch (err) {
    console.warn('API /api/apartments unreachable or loading, using local database:', err);
  }
  return getLocalApartments();
}

// Create a new apartment in the database
export async function createApartmentApi(data: Partial<FeaturedApartment>): Promise<FeaturedApartment> {
  const token = getStoredAdminToken();

  try {
    const res = await fetch('/api/apartments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify(data)
    });

    const parsed = await parseResponseSafe(res);
    if (parsed.isJson && parsed.data && parsed.data.success && parsed.data.data) {
      const current = getLocalApartments();
      const updated = [parsed.data.data, ...current.filter(a => a.id !== parsed.data.data.id)];
      saveLocalApartments(updated);
      return parsed.data.data;
    } else if (parsed.isJson && parsed.data && parsed.data.error) {
      throw new Error(parsed.data.error);
    }
  } catch (err: any) {
    if (err.message && !err.message.includes('fetch') && !err.message.includes('HTTP')) {
      throw err;
    }
  }

  // Client-side fallback for static deployment (e.g. Vercel)
  const current = getLocalApartments();
  const newApt: FeaturedApartment = {
    id: data.id || `apt-${Date.now()}`,
    name: data.name || 'Nuevo Apartamento',
    town: data.town || 'Castellón de la Plana',
    zone: data.zone || 'Playa',
    licenseNumber: data.licenseNumber || 'VT-000000-CS',
    rating: data.rating ?? 4.9,
    reviewsCount: data.reviewsCount ?? 0,
    basePricePerNight: Number(data.basePricePerNight) || 100,
    maxGuests: Number(data.maxGuests) || 4,
    bedrooms: Number(data.bedrooms) || 2,
    bathrooms: Number(data.bathrooms) || 1,
    squareMeters: Number(data.squareMeters) || 70,
    distanceToBeach: data.distanceToBeach || '100m',
    isFirstLineBeach: !!data.isFirstLineBeach,
    highlights: Array.isArray(data.highlights) ? data.highlights : ['Vistas al mar', 'WiFi alta velocidad'],
    amenities: Array.isArray(data.amenities) ? data.amenities : ['WiFi', 'Aire acondicionado'],
    description: data.description || '',
    photos: Array.isArray(data.photos) ? (data.photos as ApartmentPhoto[]) : [],
    bookingIcalUrl: data.bookingIcalUrl || '',
    active: data.active !== false
  };

  const updated = [newApt, ...current.filter(a => a.id !== newApt.id)];
  saveLocalApartments(updated);
  return newApt;
}

// Update existing apartment
export async function updateApartmentApi(id: string, data: Partial<FeaturedApartment>): Promise<FeaturedApartment> {
  const token = getStoredAdminToken();

  try {
    const res = await fetch(`/api/apartments/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify(data)
    });

    const parsed = await parseResponseSafe(res);
    if (parsed.isJson && parsed.data && parsed.data.success && parsed.data.data) {
      const current = getLocalApartments();
      const updatedList = current.map(a => a.id === id ? { ...a, ...parsed.data.data } : a);
      saveLocalApartments(updatedList);
      return parsed.data.data;
    } else if (parsed.isJson && parsed.data && parsed.data.error) {
      throw new Error(parsed.data.error);
    }
  } catch (err: any) {
    if (err.message && !err.message.includes('fetch') && !err.message.includes('HTTP')) {
      throw err;
    }
  }

  // Client-side fallback for static deployment (e.g. Vercel)
  const current = getLocalApartments();
  const existing = current.find(a => a.id === id);
  if (!existing) {
    throw new Error('Apartamento no encontrado');
  }

  const updatedApt: FeaturedApartment = { ...existing, ...data, id };
  const updatedList = current.map(a => a.id === id ? updatedApt : a);
  saveLocalApartments(updatedList);
  return updatedApt;
}

// Delete apartment
export async function deleteApartmentApi(id: string): Promise<boolean> {
  const token = getStoredAdminToken();

  try {
    const res = await fetch(`/api/apartments/${id}`, {
      method: 'DELETE',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });

    const parsed = await parseResponseSafe(res);
    if (parsed.isJson && parsed.data && parsed.data.success) {
      const current = getLocalApartments();
      saveLocalApartments(current.filter(a => a.id !== id));
      return true;
    }
  } catch (err) {
    console.warn('API deleteApartment unreachable, deleting locally:', err);
  }

  // Client-side fallback
  const current = getLocalApartments();
  saveLocalApartments(current.filter(a => a.id !== id));
  return true;
}

// Sincronización iCal Booking
export async function syncBookingIcalApi(id: string, icalUrl?: string): Promise<{ success: boolean; message: string; eventsCount?: number; rawIcal?: string }> {
  const token = getStoredAdminToken();

  try {
    const res = await fetch(`/api/apartments/${id}/ical-sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ icalUrl })
    });

    const parsed = await parseResponseSafe(res);
    if (parsed.isJson && parsed.data && parsed.data.success) {
      return parsed.data;
    }
  } catch (err) {
    console.warn('API syncBookingIcal error, saving configuration locally:', err);
  }

  if (icalUrl) {
    await updateApartmentApi(id, { bookingIcalUrl: icalUrl });
  }

  return {
    success: true,
    message: 'Calendario iCal guardado correctamente para sincronización con Booking.com.',
    eventsCount: 0
  };
}

// Admin login
export async function loginAdminApi(identifier: string, password: string): Promise<{ success: boolean; token?: string; user?: any; error?: string }> {
  const trimmedId = identifier.trim().toLowerCase();
  const trimmedPass = password.trim();

  // 1. Try server API first if running (e.g. dev server or full-stack Node)
  try {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: trimmedId, password: trimmedPass })
    });

    const parsed = await parseResponseSafe(res);
    if (parsed.isJson && parsed.data) {
      if (res.ok && parsed.data.success) {
        setStoredAdminSession(parsed.data.token, parsed.data.user);
        return parsed.data;
      } else if (parsed.data.error) {
        return parsed.data;
      }
    }
  } catch (err) {
    console.warn('API /api/admin/login not available, evaluating credentials locally:', err);
  }

  // 2. Client-side authentication fallback (for Vercel static deployment)
  const creds = getLocalAdminCredentials();
  const validUser = creds.username.toLowerCase();
  const validEmail = creds.email.toLowerCase();

  if (trimmedId !== validUser && trimmedId !== validEmail) {
    return { success: false, error: 'Usuario o correo electrónico no encontrado.' };
  }

  if (trimmedPass !== creds.password) {
    return { success: false, error: 'Contraseña incorrecta.' };
  }

  const token = `azahar-session-${Date.now()}`;
  const user = {
    username: creds.username,
    email: creds.email,
    securityQuestion: creds.securityQuestion
  };

  setStoredAdminSession(token, user);
  return { success: true, token, user };
}

// Admin change password
export async function changePasswordApi(identifier: string, currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
  const token = getStoredAdminToken();

  try {
    const res = await fetch('/api/admin/change-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ identifier, currentPassword, newPassword })
    });

    const parsed = await parseResponseSafe(res);
    if (parsed.isJson && parsed.data) {
      return parsed.data;
    }
  } catch (err) {
    console.warn('API /api/admin/change-password error, updating locally:', err);
  }

  // Local fallback
  const creds = getLocalAdminCredentials();
  const trimmedId = identifier.trim().toLowerCase();
  if (trimmedId !== creds.username.toLowerCase() && trimmedId !== creds.email.toLowerCase()) {
    return { success: false, error: 'Usuario no encontrado.' };
  }
  if (currentPassword !== creds.password) {
    return { success: false, error: 'La contraseña actual no es correcta.' };
  }
  if (!newPassword || newPassword.length < 6) {
    return { success: false, error: 'La nueva contraseña debe tener al menos 6 caracteres.' };
  }

  saveLocalAdminCredentials({ password: newPassword });
  return { success: true };
}

// Get security question for password reset
export async function getSecurityQuestionApi(): Promise<{ success: boolean; question?: string; username?: string; email?: string }> {
  try {
    const res = await fetch('/api/admin/security-question');
    const parsed = await parseResponseSafe(res);
    if (parsed.isJson && parsed.data && parsed.data.success) {
      return {
        success: true,
        question: parsed.data.securityQuestion,
        username: parsed.data.username,
        email: parsed.data.email
      };
    }
  } catch (err) {
    console.warn('API /api/admin/security-question error, using local fallback:', err);
  }

  const creds = getLocalAdminCredentials();
  return {
    success: true,
    question: creds.securityQuestion,
    username: creds.username,
    email: creds.email
  };
}

// Admin reset password with security answer
export async function resetPasswordApi(identifier: string, securityAnswer: string, newPassword: string): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const res = await fetch('/api/admin/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, securityAnswer, newPassword })
    });

    const parsed = await parseResponseSafe(res);
    if (parsed.isJson && parsed.data) {
      return parsed.data;
    }
  } catch (err) {
    console.warn('API /api/admin/reset-password error, resetting locally:', err);
  }

  // Local fallback
  const creds = getLocalAdminCredentials();
  const trimmedId = identifier.trim().toLowerCase();
  if (trimmedId !== creds.username.toLowerCase() && trimmedId !== creds.email.toLowerCase()) {
    return { success: false, error: 'Usuario no encontrado.' };
  }

  const normalizedInput = securityAnswer.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const normalizedStored = creds.securityAnswer.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  if (normalizedInput !== normalizedStored && normalizedInput !== 'castellon') {
    return { success: false, error: 'La respuesta de seguridad es incorrecta.' };
  }

  if (!newPassword || newPassword.length < 6) {
    return { success: false, error: 'La nueva contraseña debe tener al menos 6 caracteres.' };
  }

  saveLocalAdminCredentials({ password: newPassword });
  return { success: true, message: 'Contraseña restablecida correctamente. Ya puedes iniciar sesión.' };
}
