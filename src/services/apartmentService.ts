import { FeaturedApartment, FEATURED_APARTMENTS, ApartmentPhoto } from '../data/featuredApartments';

const TOKEN_KEY = 'azahar_admin_token';
const USER_KEY = 'azahar_admin_user';

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

// Fetch all apartments from backend database (with fallback to default seed)
export async function fetchApartments(): Promise<FeaturedApartment[]> {
  try {
    const res = await fetch('/api/apartments');
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    const json = await res.json();
    if (json.success && Array.isArray(json.data)) {
      return json.data;
    }
    return FEATURED_APARTMENTS;
  } catch (err) {
    console.warn('API /api/apartments unreachable or loading, using initial data:', err);
    return FEATURED_APARTMENTS;
  }
}

// Create a new apartment in the centralized database
export async function createApartmentApi(data: Partial<FeaturedApartment>): Promise<FeaturedApartment> {
  const token = getStoredAdminToken();
  const res = await fetch('/api/apartments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify(data)
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error || 'Error al crear el apartamento');
  }
  return json.data;
}

// Update existing apartment
export async function updateApartmentApi(id: string, data: Partial<FeaturedApartment>): Promise<FeaturedApartment> {
  const token = getStoredAdminToken();
  const res = await fetch(`/api/apartments/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify(data)
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error || 'Error al guardar los cambios del apartamento');
  }
  return json.data;
}

// Delete apartment
export async function deleteApartmentApi(id: string): Promise<boolean> {
  const token = getStoredAdminToken();
  const res = await fetch(`/api/apartments/${id}`, {
    method: 'DELETE',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error || 'Error al eliminar el apartamento');
  }
  return true;
}

// Sincronización iCal Booking
export async function syncBookingIcalApi(id: string, icalUrl?: string): Promise<{ success: boolean; message: string; eventsCount?: number; rawIcal?: string }> {
  const token = getStoredAdminToken();
  const res = await fetch(`/api/apartments/${id}/ical-sync`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify({ icalUrl })
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error || 'Error al sincronizar con el calendario de Booking');
  }
  return json;
}

// Admin login
export async function loginAdminApi(identifier: string, password: string): Promise<{ success: boolean; token?: string; user?: any; error?: string }> {
  const res = await fetch('/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier, password })
  });

  const json = await res.json();
  if (res.ok && json.success) {
    setStoredAdminSession(json.token, json.user);
  }
  return json;
}

// Admin change password
export async function changePasswordApi(identifier: string, currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
  const token = getStoredAdminToken();
  const res = await fetch('/api/admin/change-password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify({ identifier, currentPassword, newPassword })
  });

  return await res.json();
}

// Get security question for password reset
export async function getSecurityQuestionApi(): Promise<{ success: boolean; question?: string; username?: string; email?: string }> {
  try {
    const res = await fetch('/api/admin/security-question');
    const json = await res.json();
    return {
      success: json.success,
      question: json.securityQuestion,
      username: json.username,
      email: json.email
    };
  } catch {
    return {
      success: true,
      question: '¿En qué provincia opera Azahar Rentals?',
      username: 'admin',
      email: 'admin@azaharrentals.com'
    };
  }
}

// Admin reset password with security answer
export async function resetPasswordApi(identifier: string, securityAnswer: string, newPassword: string): Promise<{ success: boolean; message?: string; error?: string }> {
  const res = await fetch('/api/admin/reset-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier, securityAnswer, newPassword })
  });

  return await res.json();
}
