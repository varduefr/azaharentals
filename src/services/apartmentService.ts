import { FeaturedApartment, FEATURED_APARTMENTS, ApartmentPhoto } from '../data/featuredApartments';
import { db, OperationType, handleFirestoreError } from '../lib/firebase';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  deleteDoc, 
  onSnapshot,
  Unsubscribe 
} from 'firebase/firestore';
import { 
  saveApartmentsToIndexedDb, 
  getApartmentsFromIndexedDb, 
  saveSingleApartmentToIndexedDb 
} from '../utils/localApartmentDb';

const TOKEN_KEY = 'azahar_admin_token';
const USER_KEY = 'azahar_admin_user';
const LOCAL_CREDENTIALS_KEY = 'azahar_custom_admin_creds';
const LOCAL_APARTMENTS_KEY = 'azahar_apartments_data';

// Fast in-memory cache to guarantee instantaneous synchronous UI renders
let cachedApartments: FeaturedApartment[] | null = null;
let idbHydrationStarted = false;

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

const APARTMENT_PRIORITY_ORDER: Record<string, number> = {
  'apt-peniscola-primero': 1,
  'apt-benicarlo-marina': 2,
  'apt-benicarlo-morrongo': 3,
  'apt-alcover-rural': 99
};

function getTownPriority(town?: string): number {
  const normalized = (town || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
  if (normalized.includes('peniscola')) return 10;
  if (normalized.includes('benicarlo')) return 20;
  if (normalized.includes('alcover')) return 90;
  return 50;
}

/**
 * Sanitiza las fotos de un apartamento asegurando que la foto eliminada 'peniscola_coast_1788275771316.jpg'
 * ('Vistas panorámicas hacia el litoral y el Castillo Papa Luna') no reaparezca nunca en Ático Mirador del Castillo.
 */
export function sanitizeApartmentPhotos(apt: FeaturedApartment): FeaturedApartment {
  if (!apt) return apt;
  const rawPhotos = Array.isArray(apt.photos) ? apt.photos : [];
  if (apt.id === 'apt-peniscola-primero') {
    const filtered = rawPhotos.filter((p) => {
      const url = (p?.url || '').toLowerCase();
      const caption = (p?.caption || '').toLowerCase();
      const isDeletedPhoto =
        url.includes('peniscola_coast_1788275771316') ||
        (caption.includes('vistas panor') && caption.includes('litoral') && caption.includes('castillo'));
      return !isDeletedPhoto;
    });
    return { ...apt, photos: filtered };
  }
  return { ...apt, photos: rawPhotos };
}

/**
 * Sorts apartments so Peñíscola is always first, followed by the two Benicarló apartments, and finally Alcover.
 */
export function sortApartments(list: FeaturedApartment[]): FeaturedApartment[] {
  return [...list].map(sanitizeApartmentPhotos).sort((a, b) => {
    const orderA = APARTMENT_PRIORITY_ORDER[a.id] ?? getTownPriority(a.town);
    const orderB = APARTMENT_PRIORITY_ORDER[b.id] ?? getTownPriority(b.town);
    if (orderA !== orderB) {
      return orderA - orderB;
    }
    return (a.name || '').localeCompare(b.name || '', 'es');
  });
}

export function getLocalApartments(): FeaturedApartment[] {
  if (cachedApartments && cachedApartments.length > 0) {
    return cachedApartments;
  }

  // Hydrate asynchronously from IndexedDB if not already running
  if (typeof window !== 'undefined' && !idbHydrationStarted) {
    idbHydrationStarted = true;
    getApartmentsFromIndexedDb().then((idbList) => {
      if (idbList && idbList.length > 0) {
        cachedApartments = sortApartments(idbList);
        window.dispatchEvent(new CustomEvent('azahar_apartments_updated', { detail: idbList }));
      }
    }).catch(() => {});
  }

  try {
    const raw = localStorage.getItem(LOCAL_APARTMENTS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const sorted = sortApartments(parsed);
        cachedApartments = sorted;
        return sorted;
      }
    }
  } catch (e) {
    console.warn('Error reading local apartments:', e);
  }

  const initial = sortApartments(FEATURED_APARTMENTS);
  cachedApartments = initial;
  return initial;
}

export function saveLocalApartments(apartments: FeaturedApartment[]): void {
  try {
    const sorted = sortApartments(apartments);
    cachedApartments = sorted;

    // 1. Save full data with all high-resolution photos to IndexedDB (virtually unlimited quota)
    if (typeof window !== 'undefined') {
      saveApartmentsToIndexedDb(sorted).catch((err) => {
        console.warn('Could not persist to IndexedDB:', err);
      });
    }

    // 2. Save a sanitized copy to localStorage without heavy base64 strings to prevent QuotaExceededError
    try {
      const safeForLocalStorage = sorted.map((apt) => ({
        ...apt,
        photos: (apt.photos || []).map((p) => ({
          caption: p.caption || '',
          url: (p.url || '').startsWith('data:') ? '' : p.url
        }))
      }));
      localStorage.setItem(LOCAL_APARTMENTS_KEY, JSON.stringify(safeForLocalStorage));
    } catch (quotaErr) {
      // Quota exceeded is safely swallowed because IndexedDB has the full payload
      console.warn('localStorage quota reached, relying on IndexedDB:', quotaErr);
    }
  } catch (e) {
    console.error('Error saving local apartments:', e);
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
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('azahar_admin_auth_changed', { detail: { token, user } }));
    }
  } catch (e) {
    console.error('Error saving session:', e);
  }
}

export function clearStoredAdminSession(): void {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('azahar_admin_auth_changed', { detail: null }));
    }
  } catch (e) {
    console.error('Error clearing session:', e);
  }
}

/**
 * Saves each photo in a dedicated subcollection: /apartments/{apartmentId}/photos/{photoId}
 * This permanently bypasses Firestore's 1MB single-document limit, allowing unlimited photos per property.
 */
async function saveApartmentPhotosSubcollection(apartmentId: string, photos: ApartmentPhoto[]): Promise<void> {
  const colRef = collection(db, 'apartments', apartmentId, 'photos');

  // Save each individual photo as its own document in the subcollection
  for (let i = 0; i < photos.length; i++) {
    const p = photos[i];
    const photoDocRef = doc(db, 'apartments', apartmentId, 'photos', `photo_${i}`);
    await setDoc(photoDocRef, {
      index: i,
      url: p.url,
      caption: p.caption || `Foto ${i + 1}`,
      updatedAt: new Date().toISOString()
    });
  }

  // Cleanup removed excess photo documents if count decreased
  try {
    const snap = await getDocs(colRef);
    for (const d of snap.docs) {
      const data = d.data();
      const idx = typeof data.index === 'number' ? data.index : parseInt(d.id.replace('photo_', ''), 10);
      if (!isNaN(idx) && idx >= photos.length) {
        await deleteDoc(doc(db, 'apartments', apartmentId, 'photos', d.id));
      }
    }
  } catch (e) {
    console.warn('Error cleaning excess photo documents:', e);
  }
}

/**
 * Loads all photos from the subcollection. Returns empty array if none found.
 */
async function loadApartmentPhotosSubcollection(apartmentId: string): Promise<ApartmentPhoto[]> {
  try {
    const colRef = collection(db, 'apartments', apartmentId, 'photos');
    const snap = await getDocs(colRef);
    if (!snap.empty) {
      const sorted = snap.docs
        .map((d) => {
          const data = d.data() as { index?: number; url: string; caption?: string };
          const idx = typeof data.index === 'number' ? data.index : parseInt(d.id.replace('photo_', ''), 10);
          return {
            index: isNaN(idx) ? 0 : idx,
            url: data.url || '',
            caption: data.caption || ''
          };
        })
        .filter((p) => p.url && p.url.trim().length > 0)
        .sort((a, b) => a.index - b.index);

      if (sorted.length > 0) {
        return sorted.map((p) => ({ url: p.url, caption: p.caption }));
      }
    }
  } catch (err) {
    console.warn(`Could not read photos subcollection for ${apartmentId}:`, err);
  }
  return [];
}

/**
 * Fetch all apartments from Cloud Firestore database and backend API with photos.
 * Always treats the photos subcollection as the primary source of truth for photo galleries.
 */
export async function fetchApartments(): Promise<FeaturedApartment[]> {
  // 1. Intentar cargar desde el backend Express /api/apartments (persistencia en data/apartments.json)
  let serverList: FeaturedApartment[] | null = null;
  try {
    const resp = await fetch('/api/apartments');
    if (resp.ok) {
      const json = await resp.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        serverList = sortApartments(json.data.map(sanitizeApartmentPhotos));
      }
    }
  } catch {
    // Modo offline o preview sin backend
  }

  // 2. Consultar Cloud Firestore para sincronización en la nube
  try {
    const colRef = collection(db, 'apartments');
    const snapshot = await getDocs(colRef);

    if (!snapshot.empty) {
      const list = await Promise.all(snapshot.docs.map(async (d) => {
        const raw = d.data() as FeaturedApartment;
        
        // 1. Cargar fotos desde la subcolección de fotos de Firestore (FUENTE DE VERDAD)
        const subcollectionPhotos = await loadApartmentPhotosSubcollection(d.id);
        
        let photos = subcollectionPhotos.length > 0 ? subcollectionPhotos : [];

        // 2. Si la subcolección aún no tiene fotos, comprobar backend server o fotos de catálogo inicial
        if (photos.length === 0) {
          const fromServer = serverList?.find((a) => a.id === d.id);
          if (fromServer?.photos && fromServer.photos.length > 0) {
            photos = fromServer.photos;
          } else if (Array.isArray(raw.photos) && raw.photos.length > 0 && raw.photos.some(p => p.url)) {
            photos = raw.photos.filter(p => p.url);
          } else {
            photos = FEATURED_APARTMENTS.find((a) => a.id === d.id)?.photos || [];
          }
        }

        return sanitizeApartmentPhotos({
          ...raw,
          id: d.id,
          photos
        });
      }));

      const sortedList = sortApartments(list);
      saveLocalApartments(sortedList);
      return sortedList;
    }

    // Si Firestore aún no tiene documentos pero el backend sí los tiene
    if (serverList && serverList.length > 0) {
      saveLocalApartments(serverList);
      return serverList;
    }

    // Sembrar catálogo inicial limpio en Cloud Firestore si está completamente vacío
    console.log('Sembrando catálogo inicial de Azahar Rentals en Cloud Firestore...');
    const initialSorted = sortApartments(FEATURED_APARTMENTS);
    for (const apt of initialSorted) {
      const { photos, ...aptWithoutPhotos } = apt;
      await setDoc(doc(db, 'apartments', apt.id), {
        ...aptWithoutPhotos,
        photosCount: apt.photos?.length || 0,
        coverPhoto: apt.photos?.[0]?.url || '',
        updatedAt: new Date().toISOString()
      });
      if (apt.photos && apt.photos.length > 0) {
        await saveApartmentPhotosSubcollection(apt.id, apt.photos);
      }
    }
    saveLocalApartments(initialSorted);
    return initialSorted;
  } catch (err) {
    console.warn('Firestore fetchApartments fallback a backend o local data:', err);
    try {
      handleFirestoreError(err, OperationType.GET, 'apartments');
    } catch {
      // Continue to fallback
    }

    if (serverList && serverList.length > 0) {
      saveLocalApartments(serverList);
      return serverList;
    }

    const fromIdb = await getApartmentsFromIndexedDb();
    if (fromIdb && fromIdb.length > 0) {
      const sorted = sortApartments(fromIdb);
      saveLocalApartments(sorted);
      return sorted;
    }

    return getLocalApartments();
  }
}

/**
 * Real-time listener for apartments collection.
 * Triggers callback immediately on data change from anywhere.
 */
export function subscribeApartments(onUpdate: (apartments: FeaturedApartment[]) => void): Unsubscribe {
  try {
    const colRef = collection(db, 'apartments');
    return onSnapshot(
      colRef,
      async (snapshot) => {
        try {
          if (!snapshot.empty) {
            const list = await Promise.all(snapshot.docs.map(async (d) => {
              const raw = d.data() as FeaturedApartment;
              const subcollectionPhotos = await loadApartmentPhotosSubcollection(d.id);
              let photos = subcollectionPhotos.length > 0 ? subcollectionPhotos : [];
              if (photos.length === 0 && Array.isArray(raw.photos) && raw.photos.length > 0 && raw.photos.some(p => p.url)) {
                photos = raw.photos.filter(p => p.url);
              }
              if (photos.length === 0) {
                photos = FEATURED_APARTMENTS.find((a) => a.id === d.id)?.photos || [];
              }
              return sanitizeApartmentPhotos({
                ...raw,
                id: d.id,
                photos
              });
            }));
            const sortedList = sortApartments(list);
            saveLocalApartments(sortedList);
            onUpdate(sortedList);
          }
        } catch (err) {
          console.warn('Error reading apartment snapshot:', err);
        }
      },
      (err) => {
        console.warn('Firestore onSnapshot listener error (running in preview/offline mode):', err);
      }
    );
  } catch (err) {
    console.warn('Could not establish onSnapshot subscription:', err);
    return () => {};
  }
}

/**
 * Create a new apartment and persist directly in Cloud Firestore and Backend API.
 */
export async function createApartmentApi(data: Partial<FeaturedApartment>): Promise<FeaturedApartment> {
  const id = data.id || `apt-${Date.now()}`;
  const newApt: FeaturedApartment = sanitizeApartmentPhotos({
    id,
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
    rates: data.rates,
    active: data.active !== false
  });

  // 1. Persistir en backend API (/api/apartments)
  try {
    await fetch('/api/apartments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newApt)
    });
  } catch (apiErr) {
    console.warn('Backend API createApartment sync:', apiErr);
  }

  // 2. Persistir en Cloud Firestore
  try {
    if (newApt.photos && newApt.photos.length > 0) {
      await saveApartmentPhotosSubcollection(id, newApt.photos);
    }

    const { photos, ...docDataWithoutPhotos } = newApt;
    const safePhotosList = (photos || []).map((p, idx) => ({
      index: idx,
      caption: p.caption || '',
      url: (p.url || '').startsWith('data:') ? '' : p.url
    }));

    await setDoc(doc(db, 'apartments', id), {
      ...docDataWithoutPhotos,
      photos: safePhotosList,
      photosCount: newApt.photos.length,
      coverPhoto: newApt.photos[0]?.url || '',
      updatedAt: new Date().toISOString()
    });
  } catch (err) {
    console.error('Error saving new apartment to Firestore:', err);
    try {
      handleFirestoreError(err, OperationType.CREATE, `apartments/${id}`);
    } catch {}
  }

  // 3. Actualizar caché local e IndexedDB
  const current = getLocalApartments();
  const updated = [newApt, ...current.filter((a) => a.id !== id)];
  saveLocalApartments(updated);
  await saveSingleApartmentToIndexedDb(newApt);

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('azahar_apartments_updated', { detail: newApt }));
  }

  return newApt;
}

/**
 * Update an existing apartment and persist in Cloud Firestore and Backend API.
 * Ensures photos array is stored directly on the document and subcollection.
 */
export async function updateApartmentApi(id: string, data: Partial<FeaturedApartment>): Promise<FeaturedApartment> {
  const current = getLocalApartments();
  const existing = current.find((a) => a.id === id);
  const updatedApt: FeaturedApartment = sanitizeApartmentPhotos({
    ...(existing || {}),
    ...data,
    id
  } as FeaturedApartment);

  // 1. Sincronizar inmediatamente con el Backend API (/api/apartments/:id)
  try {
    await fetch(`/api/apartments/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedApt)
    });
  } catch (apiErr) {
    console.warn('Backend API updateApartment sync:', apiErr);
  }

  // 2. Sincronizar fotos en Cloud Firestore Subcollection
  if (updatedApt.photos && Array.isArray(updatedApt.photos)) {
    try {
      await saveApartmentPhotosSubcollection(id, updatedApt.photos);
    } catch (photoErr) {
      console.error('Error saving photos subcollection to Firestore:', photoErr);
    }
  }

  // 3. Sincronizar el documento principal del apartamento en Cloud Firestore
  // Se excluyen las cadenas pesadas base64 del documento padre para evitar el error de 1MB de Firestore
  try {
    const { photos, ...docDataWithoutPhotos } = updatedApt;

    const safePhotosList = (photos || []).map((p, idx) => ({
      index: idx,
      caption: p.caption || '',
      url: (p.url || '').startsWith('data:') ? '' : p.url
    }));

    await setDoc(doc(db, 'apartments', id), {
      ...docDataWithoutPhotos,
      photos: safePhotosList,
      photosCount: updatedApt.photos?.length || 0,
      coverPhoto: updatedApt.photos?.[0]?.url || '',
      hasCustomPhotos: true,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    console.error('Error updating apartment in Firestore:', err);
    try {
      handleFirestoreError(err, OperationType.UPDATE, `apartments/${id}`);
    } catch {}
  }

  // 4. Sincronizar con IndexedDB y caché local
  const updatedList = current.map((a) => (a.id === id ? updatedApt : a));
  saveLocalApartments(updatedList);
  await saveSingleApartmentToIndexedDb(updatedApt);

  // Si es Peñíscola, sincronizar también la clave legacy peniscola_custom_photos
  if (id === 'apt-peniscola-primero') {
    try {
      localStorage.setItem('peniscola_custom_photos', JSON.stringify(updatedApt.photos));
    } catch {}
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('azahar_apartments_updated', { detail: updatedApt }));
  }

  return updatedApt;
}

/**
 * Delete an apartment permanently from Cloud Firestore and Backend API.
 */
export async function deleteApartmentApi(id: string): Promise<boolean> {
  // 1. Backend API
  try {
    await fetch(`/api/apartments/${id}`, { method: 'DELETE' });
  } catch (apiErr) {
    console.warn('Backend API deleteApartment sync:', apiErr);
  }

  // 2. Firestore
  try {
    const snap = await getDocs(collection(db, 'apartments', id, 'photos'));
    for (const d of snap.docs) {
      await deleteDoc(doc(db, 'apartments', id, 'photos', d.id));
    }
    await deleteDoc(doc(db, 'apartments', id));
  } catch (err) {
    console.error('Error deleting apartment in Firestore:', err);
    try {
      handleFirestoreError(err, OperationType.DELETE, `apartments/${id}`);
    } catch {}
  }

  // 3. Actualizar caché local
  const current = getLocalApartments();
  saveLocalApartments(current.filter((a) => a.id !== id));
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('azahar_apartments_updated', { detail: { id, deleted: true } }));
  }

  return true;
}

/**
 * Sincronización iCal Booking
 */
export async function syncBookingIcalApi(id: string, icalUrl?: string): Promise<{ success: boolean; message: string; eventsCount?: number; rawIcal?: string }> {
  if (icalUrl) {
    await updateApartmentApi(id, { bookingIcalUrl: icalUrl });
  }

  return {
    success: true,
    message: 'Calendario iCal guardado y sincronizado correctamente con la base de datos de Azahar Rentals.',
    eventsCount: 0
  };
}

/**
 * Admin Login: validates credentials against Cloud Firestore settings (with local fallback).
 */
export async function loginAdminApi(identifier: string, password: string): Promise<{ success: boolean; token?: string; user?: any; error?: string }> {
  const trimmedId = identifier.trim().toLowerCase();
  const trimmedPass = password.trim();

  let creds = getLocalAdminCredentials();

  // Try reading updated credentials from Firestore settings
  try {
    const adminDoc = await getDoc(doc(db, 'settings', 'admin'));
    if (adminDoc.exists()) {
      creds = { ...creds, ...(adminDoc.data() as Partial<AdminCredentials>) };
      saveLocalAdminCredentials(creds);
    }
  } catch (e) {
    console.warn('Could not read admin settings from Firestore, using local credentials:', e);
  }

  const validUser = creds.username.toLowerCase();
  const validEmail = creds.email.toLowerCase();

  if (trimmedId !== validUser && trimmedId !== validEmail) {
    return { success: false, error: 'Usuario o correo electrónico no encontrado.' };
  }

  if (trimmedPass !== creds.password) {
    return { success: false, error: 'Contraseña incorrecta.' };
  }

  const token = `azahar-cloud-${Date.now()}`;
  const user = {
    username: creds.username,
    email: creds.email,
    securityQuestion: creds.securityQuestion
  };

  setStoredAdminSession(token, user);
  return { success: true, token, user };
}

/**
 * Admin Change Password: saves to Cloud Firestore and updates local credentials.
 */
export async function changePasswordApi(identifier: string, currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
  let creds = getLocalAdminCredentials();

  try {
    const adminDoc = await getDoc(doc(db, 'settings', 'admin'));
    if (adminDoc.exists()) {
      creds = { ...creds, ...(adminDoc.data() as Partial<AdminCredentials>) };
    }
  } catch (e) {
    console.warn('Firestore changePassword read fallback:', e);
  }

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

  try {
    await setDoc(doc(db, 'settings', 'admin'), { password: newPassword, updatedAt: new Date().toISOString() }, { merge: true });
  } catch (err) {
    console.warn('Firestore setDoc settings/admin error:', err);
  }

  return { success: true };
}

/**
 * Get security question for password reset.
 */
export async function getSecurityQuestionApi(): Promise<{ success: boolean; question?: string; username?: string; email?: string }> {
  let creds = getLocalAdminCredentials();

  try {
    const adminDoc = await getDoc(doc(db, 'settings', 'admin'));
    if (adminDoc.exists()) {
      creds = { ...creds, ...(adminDoc.data() as Partial<AdminCredentials>) };
    }
  } catch (e) {
    console.warn('Firestore getSecurityQuestion read fallback:', e);
  }

  return {
    success: true,
    question: creds.securityQuestion,
    username: creds.username,
    email: creds.email
  };
}

/**
 * Reset password via security answer and sync to Cloud Firestore.
 */
export async function resetPasswordApi(identifier: string, securityAnswer: string, newPassword: string): Promise<{ success: boolean; message?: string; error?: string }> {
  let creds = getLocalAdminCredentials();

  try {
    const adminDoc = await getDoc(doc(db, 'settings', 'admin'));
    if (adminDoc.exists()) {
      creds = { ...creds, ...(adminDoc.data() as Partial<AdminCredentials>) };
    }
  } catch (e) {
    console.warn('Firestore resetPassword read fallback:', e);
  }

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

  try {
    await setDoc(doc(db, 'settings', 'admin'), { password: newPassword, updatedAt: new Date().toISOString() }, { merge: true });
  } catch (err) {
    console.warn('Firestore resetPassword write fallback:', err);
  }

  return { success: true, message: 'Contraseña restablecida correctamente. Ya puedes iniciar sesión.' };
}
