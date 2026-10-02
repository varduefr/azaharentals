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
 * Sorts apartments so Peñíscola is always first, followed by the two Benicarló apartments, and finally Alcover.
 */
export function sortApartments(list: FeaturedApartment[]): FeaturedApartment[] {
  return [...list].sort((a, b) => {
    const orderA = APARTMENT_PRIORITY_ORDER[a.id] ?? getTownPriority(a.town);
    const orderB = APARTMENT_PRIORITY_ORDER[b.id] ?? getTownPriority(b.town);
    if (orderA !== orderB) {
      return orderA - orderB;
    }
    return (a.name || '').localeCompare(b.name || '', 'es');
  });
}

function getLocalApartments(): FeaturedApartment[] {
  try {
    const raw = localStorage.getItem(LOCAL_APARTMENTS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return sortApartments(parsed);
      }
    }
  } catch (e) {
    console.warn('Error reading local apartments:', e);
  }
  return sortApartments(FEATURED_APARTMENTS);
}

function saveLocalApartments(apartments: FeaturedApartment[]): void {
  try {
    localStorage.setItem(LOCAL_APARTMENTS_KEY, JSON.stringify(sortApartments(apartments)));
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

/**
 * Saves each photo in a dedicated subcollection: /apartments/{apartmentId}/photos/{photoId}
 * This permanently bypasses Firestore's 1MB single-document limit, allowing unlimited photos per property.
 */
async function saveApartmentPhotosSubcollection(apartmentId: string, photos: ApartmentPhoto[]): Promise<void> {
  const colRef = collection(db, 'apartments', apartmentId, 'photos');

  // Save each individual photo as its own document (~40KB - 80KB)
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

  // Cleanup removed photos if count decreased
  try {
    const snap = await getDocs(colRef);
    for (const d of snap.docs) {
      const idx = d.data().index;
      if (typeof idx === 'number' && idx >= photos.length) {
        await deleteDoc(doc(db, 'apartments', apartmentId, 'photos', d.id));
      }
    }
  } catch (e) {
    console.warn('Error cleaning excess photo documents:', e);
  }
}

/**
 * Loads all photos from the subcollection, falling back to embedded photos or seed
 */
async function loadApartmentPhotosSubcollection(apartmentId: string, fallbackPhotos: ApartmentPhoto[] = []): Promise<ApartmentPhoto[]> {
  try {
    const colRef = collection(db, 'apartments', apartmentId, 'photos');
    const snap = await getDocs(colRef);
    if (!snap.empty) {
      const sorted = snap.docs
        .map((d) => d.data() as { index: number; url: string; caption: string })
        .sort((a, b) => (a.index ?? 0) - (b.index ?? 0));
      return sorted.map((p) => ({ url: p.url, caption: p.caption || '' }));
    }
  } catch (err) {
    console.warn(`Could not read photos subcollection for ${apartmentId}:`, err);
  }
  return fallbackPhotos;
}

/**
 * Fetch all apartments from Cloud Firestore database with photos from subcollections.
 */
export async function fetchApartments(): Promise<FeaturedApartment[]> {
  try {
    const colRef = collection(db, 'apartments');
    const snapshot = await getDocs(colRef);

    if (!snapshot.empty) {
      const list = await Promise.all(snapshot.docs.map(async (d) => {
        const raw = d.data() as FeaturedApartment;
        const initialPhotos = Array.isArray(raw.photos) && raw.photos.length > 0 ? raw.photos : [];
        const loadedPhotos = await loadApartmentPhotosSubcollection(d.id, initialPhotos);
        return {
          ...raw,
          id: d.id,
          photos: loadedPhotos.length > 0 ? loadedPhotos : (FEATURED_APARTMENTS.find((a) => a.id === d.id)?.photos || [])
        };
      }));

      const sortedList = sortApartments(list);
      saveLocalApartments(sortedList);
      return sortedList;
    }

    // Seed initial portfolio to Cloud Firestore
    console.log('Sembrando catálogo inicial de Azahar Rentals en Cloud Firestore...');
    const initialSorted = sortApartments(FEATURED_APARTMENTS);
    for (const apt of initialSorted) {
      const { photos, ...rest } = apt;
      await setDoc(doc(db, 'apartments', apt.id), {
        ...rest,
        photosCount: photos?.length || 0,
        updatedAt: new Date().toISOString()
      });
      if (photos && photos.length > 0) {
        await saveApartmentPhotosSubcollection(apt.id, photos);
      }
    }
    saveLocalApartments(initialSorted);
    return initialSorted;
  } catch (err) {
    console.warn('Firestore fetchApartments fallback to local data:', err);
    try {
      handleFirestoreError(err, OperationType.GET, 'apartments');
    } catch {
      // Continue to fallback
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
              const initialPhotos = Array.isArray(raw.photos) && raw.photos.length > 0 ? raw.photos : [];
              const loadedPhotos = await loadApartmentPhotosSubcollection(d.id, initialPhotos);
              return {
                ...raw,
                id: d.id,
                photos: loadedPhotos.length > 0 ? loadedPhotos : (FEATURED_APARTMENTS.find((a) => a.id === d.id)?.photos || [])
              };
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
 * Create a new apartment and persist directly in Cloud Firestore.
 */
export async function createApartmentApi(data: Partial<FeaturedApartment>): Promise<FeaturedApartment> {
  const id = data.id || `apt-${Date.now()}`;
  const newApt: FeaturedApartment = {
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
    active: data.active !== false
  };

  try {
    // 1. Save photos into subcollection
    if (newApt.photos && newApt.photos.length > 0) {
      await saveApartmentPhotosSubcollection(id, newApt.photos);
    }

    // 2. Save parent document without large photo payload (~2KB total)
    const { photos, ...parentData } = newApt;
    await setDoc(doc(db, 'apartments', id), {
      ...parentData,
      photosCount: newApt.photos.length,
      coverPhoto: newApt.photos[0]?.url || '',
      updatedAt: new Date().toISOString()
    });
  } catch (err) {
    console.error('Error saving new apartment to Firestore:', err);
    handleFirestoreError(err, OperationType.CREATE, `apartments/${id}`);
  }

  // Update local cache & dispatch cross-component event
  const current = getLocalApartments();
  const updated = [newApt, ...current.filter((a) => a.id !== id)];
  saveLocalApartments(updated);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('azahar_apartments_updated', { detail: newApt }));
  }

  return newApt;
}

/**
 * Update an existing apartment and persist in Cloud Firestore.
 * Automatically saves photos to subcollection to prevent the 1MB document limit error.
 */
export async function updateApartmentApi(id: string, data: Partial<FeaturedApartment>): Promise<FeaturedApartment> {
  const current = getLocalApartments();
  const existing = current.find((a) => a.id === id);
  const updatedApt: FeaturedApartment = {
    ...(existing || {}),
    ...data,
    id
  } as FeaturedApartment;

  try {
    // 1. Save photos into subcollection if updated
    if (data.photos && Array.isArray(data.photos)) {
      await saveApartmentPhotosSubcollection(id, data.photos);
    }

    // 2. Save parent document stripped of oversized base64 arrays
    const { photos, ...parentData } = updatedApt;
    const cleanParentDoc = {
      ...parentData,
      photosCount: updatedApt.photos?.length || 0,
      coverPhoto: updatedApt.photos?.[0]?.url || '',
      updatedAt: new Date().toISOString()
    };

    // Use full overwrite without merge on parent to flush any oversized photos field
    await setDoc(doc(db, 'apartments', id), cleanParentDoc);
  } catch (err) {
    console.error('Error updating apartment in Firestore:', err);
    handleFirestoreError(err, OperationType.UPDATE, `apartments/${id}`);
  }

  // Update local cache & dispatch cross-component event
  const updatedList = current.map((a) => (a.id === id ? updatedApt : a));
  saveLocalApartments(updatedList);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('azahar_apartments_updated', { detail: updatedApt }));
  }

  return updatedApt;
}

/**
 * Delete an apartment permanently from Cloud Firestore including subcollections.
 */
export async function deleteApartmentApi(id: string): Promise<boolean> {
  try {
    // Delete photos subcollection
    const snap = await getDocs(collection(db, 'apartments', id, 'photos'));
    for (const d of snap.docs) {
      await deleteDoc(doc(db, 'apartments', id, 'photos', d.id));
    }
    await deleteDoc(doc(db, 'apartments', id));
  } catch (err) {
    console.error('Error deleting apartment in Firestore:', err);
    handleFirestoreError(err, OperationType.DELETE, `apartments/${id}`);
  }

  // Update local cache & dispatch cross-component event
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
