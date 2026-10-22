import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  Users, 
  MapPin, 
  Star, 
  BedDouble, 
  Bath, 
  Waves, 
  ShieldCheck, 
  Sparkles, 
  X, 
  Check, 
  Phone, 
  Clock,
  ArrowRight,
  Info,
  Camera,
  UploadCloud,
  ImageIcon,
  RotateCcw,
  CheckCircle2,
  Link2,
  RefreshCw,
  AlertTriangle,
  ExternalLink,
  Save,
  Sliders,
  Plus,
  Trash2,
  HelpCircle,
  DollarSign,
  Calculator,
  Search,
  Images,
  Coffee,
  Car,
  Wifi,
  Wind,
  Tv,
  Utensils,
  Maximize2
} from 'lucide-react';
import { FEATURED_APARTMENTS, FeaturedApartment, ApartmentPhoto } from '../data/featuredApartments';
import { fetchApartments, subscribeApartments, sortApartments, updateApartmentApi, getStoredAdminToken, sanitizeApartmentPhotos, getLocalApartments } from '../services/apartmentService';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import { sendEmailNotification } from '../services/emailService';
import { DatePickerInput, formatToDDMMAAAA } from './DatePickerInput';
import {
  DEFAULT_PENISCOLA_ICAL_URL,
  INITIAL_BOOKING_ICAL_SNAPSHOT,
  IcalBlockedEvent,
  checkAvailability,
  fetchBookingIcalFeed,
  formatIcalDateEs,
  parseIcalContent
} from '../utils/bookingIcal';
import {
  BookingSeasonRateConfig,
  DEFAULT_BOOKING_RATES,
  getStoredBookingRates,
  getApartmentBookingRates,
  getDefaultRatesForApartment,
  saveStoredBookingRates,
  calculateBookingStayRate
} from '../utils/bookingRates';

// Helper icon resolver for apartment amenities
const getAmenityIcon = (amenity: string) => {
  const lower = amenity.toLowerCase();
  if (lower.includes('wifi') || lower.includes('internet')) return <Wifi className="w-3.5 h-3.5 text-cyan-400 shrink-0" />;
  if (lower.includes('aire') || lower.includes('clima') || lower.includes('ac')) return <Wind className="w-3.5 h-3.5 text-cyan-400 shrink-0" />;
  if (lower.includes('park') || lower.includes('gara') || lower.includes('coche')) return <Car className="w-3.5 h-3.5 text-cyan-400 shrink-0" />;
  if (lower.includes('cafe') || lower.includes('nespresso')) return <Coffee className="w-3.5 h-3.5 text-cyan-400 shrink-0" />;
  if (lower.includes('piscina privada')) return <Waves className="w-3.5 h-3.5 text-cyan-300 shrink-0" />;
  if (lower.includes('piscina') || lower.includes('mar') || lower.includes('playa') || lower.includes('vistas')) return <Waves className="w-3.5 h-3.5 text-cyan-400 shrink-0" />;
  if (lower.includes('tv') || lower.includes('television') || lower.includes('smart')) return <Tv className="w-3.5 h-3.5 text-cyan-400 shrink-0" />;
  if (lower.includes('cocina') || lower.includes('lavavajillas') || lower.includes('horno')) return <Utensils className="w-3.5 h-3.5 text-cyan-400 shrink-0" />;
  return <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />;
};

// Normalize image URLs to ensure they work in both dev and production
export const normalizePhotoUrl = (url?: string): string => {
  if (!url) return 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80';
  if (url.startsWith('/src/assets/images/')) {
    return url.replace('/src/assets/images/', '/images/');
  }
  return url;
};

// Fallback photos ensuring at least 4 photos are always present
const DEFAULT_FALLBACK_APARTMENT_PHOTOS: ApartmentPhoto[] = [
  { url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80', caption: 'Salón luminoso con luz mediterránea' },
  { url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80', caption: 'Cocina totalmente equipada' },
  { url: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80', caption: 'Dormitorio principal confortable' },
  { url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80', caption: 'Baño moderno con ducha termostática' }
];

const getApartmentDisplayPhotos = (apt: FeaturedApartment): ApartmentPhoto[] => {
  const sanitizedApt = sanitizeApartmentPhotos(apt);
  const rawPhotos = sanitizedApt.photos || [];
  const normalized = rawPhotos.map((p) => ({
    ...p,
    url: normalizePhotoUrl(p.url)
  }));
  if (normalized.length === 0) {
    return DEFAULT_FALLBACK_APARTMENT_PHOTOS;
  }
  if (normalized.length >= 4) {
    return normalized;
  }
  const result = [...normalized];
  let fallbackIdx = 0;
  while (result.length < 4) {
    result.push(DEFAULT_FALLBACK_APARTMENT_PHOTOS[fallbackIdx % DEFAULT_FALLBACK_APARTMENT_PHOTOS.length]);
    fallbackIdx++;
  }
  return result;
};

export interface FeaturedApartmentsSectionProps {
  onBookingClick?: (apt: FeaturedApartment) => void;
}

export const FeaturedApartmentsSection: React.FC<FeaturedApartmentsSectionProps> = ({
  onBookingClick
}) => {
  const { currentTheme } = useTheme();
  const { showSuccess } = useToast();

  // Apartment list in state, initialized from local cache/backend and refreshed from central DB
  const [apartments, setApartments] = useState<FeaturedApartment[]>(() =>
    getLocalApartments().map((apt) => ({
      ...apt,
      photos: (apt.photos || []).map((p) => ({
        ...p,
        url: normalizePhotoUrl(p.url)
      }))
    }))
  );

  useEffect(() => {
    const handleListUpdate = (list: FeaturedApartment[]) => {
      if (list && list.length > 0) {
        const sanitized = sortApartments(list).map((apt) => ({
          ...apt,
          photos: (apt.photos || []).map((p) => ({
            ...p,
            url: normalizePhotoUrl(p.url)
          }))
        }));
        setApartments(sanitized);
      }
    };

    // Initial fetch from Cloud Firestore
    fetchApartments().then(handleListUpdate).catch((e) => {
      console.warn('Usando catálogo local:', e);
    });

    // Real-time listener for Firestore changes across all clients/devices
    const unsubscribeFirestore = subscribeApartments(handleListUpdate);

    const handleUpdate = () => {
      fetchApartments().then(handleListUpdate).catch(() => {});
    };

    window.addEventListener('azahar_apartments_updated', handleUpdate);
    window.addEventListener('focus', handleUpdate);

    return () => {
      unsubscribeFirestore();
      window.removeEventListener('azahar_apartments_updated', handleUpdate);
      window.removeEventListener('focus', handleUpdate);
    };
  }, []);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState<boolean>(false);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Booking iCal synchronization state for Peñíscola apartment
  const [peniscolaIcalUrl, setPeniscolaIcalUrl] = useState<string>(() => {
    try {
      return localStorage.getItem('booking_ical_apt-peniscola-primero') || DEFAULT_PENISCOLA_ICAL_URL;
    } catch {
      return DEFAULT_PENISCOLA_ICAL_URL;
    }
  });
  const [icalInputDraft, setIcalInputDraft] = useState<string>(peniscolaIcalUrl);
  const [icalEvents, setIcalEvents] = useState<IcalBlockedEvent[]>(() => parseIcalContent(INITIAL_BOOKING_ICAL_SNAPSHOT));
  const [isSyncingIcal, setIsSyncingIcal] = useState<boolean>(false);
  const [icalSuccessAlert, setIcalSuccessAlert] = useState<string>('');
  const [lastSyncTime, setLastSyncTime] = useState<string>('Sincronizado');
  const [isConsultingBooking, setIsConsultingBooking] = useState<boolean>(false);
  const [showBlockedDatesList, setShowBlockedDatesList] = useState<boolean>(false);

  // Booking dynamic rates state (per apartment)
  const [activeRateApartmentId, setActiveRateApartmentId] = useState<string>('apt-peniscola-primero');
  const [bookingRates, setBookingRates] = useState<BookingSeasonRateConfig>(() =>
    getStoredBookingRates('apt-peniscola-primero')
  );
  const [rateInputDraft, setRateInputDraft] = useState<BookingSeasonRateConfig>(() =>
    getStoredBookingRates('apt-peniscola-primero')
  );
  const [rateSuccessAlert, setRateSuccessAlert] = useState<string>('');
  const [isAdmin, setIsAdmin] = useState<boolean>(() => !!getStoredAdminToken());
  const [isEditingRatesInline, setIsEditingRatesInline] = useState<boolean>(false);
  const [showNightsBreakdown, setShowNightsBreakdown] = useState<boolean>(false);

  useEffect(() => {
    const checkAdmin = () => {
      setIsAdmin(!!getStoredAdminToken());
    };
    checkAdmin();
    window.addEventListener('storage', checkAdmin);
    window.addEventListener('focus', checkAdmin);
    window.addEventListener('azahar_admin_auth_changed', checkAdmin);
    return () => {
      window.removeEventListener('storage', checkAdmin);
      window.removeEventListener('focus', checkAdmin);
      window.removeEventListener('azahar_admin_auth_changed', checkAdmin);
    };
  }, []);

  // Live simulation test states inside the admin rate panel
  const [simTestCheckIn, setSimTestCheckIn] = useState<string>('2026-10-05');
  const [simTestCheckOut, setSimTestCheckOut] = useState<string>('2026-10-08');

  // Custom date period form
  const [newCustomLabel, setNewCustomLabel] = useState<string>('');
  const [newCustomStart, setNewCustomStart] = useState<string>('');
  const [newCustomEnd, setNewCustomEnd] = useState<string>('');
  const [newCustomPrice, setNewCustomPrice] = useState<number>(110);

  const handleSaveRates = (newRates?: BookingSeasonRateConfig) => {
    const toSave = newRates || rateInputDraft;
    const targetAptId = activeRateApartmentId;
    saveStoredBookingRates(targetAptId, toSave);
    setBookingRates(toSave);
    setRateInputDraft(toSave);
    
    // Update local apartments list state
    setApartments((prev) =>
      prev.map((a) => (a.id === targetAptId ? { ...a, rates: toSave } : a))
    );
    
    // Persist in Firestore
    updateApartmentApi(targetAptId, { rates: toSave }).catch((err) => {
      console.warn('Error sincronizando tarifas en Firestore:', err);
    });

    setRateSuccessAlert('✓ Tarifas de Booking.com guardadas y publicadas con éxito.');
    setTimeout(() => setRateSuccessAlert(''), 6000);
  };

  const handleResetDefaultRates = () => {
    const targetAptId = activeRateApartmentId;
    const activeApt = apartments.find((a) => a.id === targetAptId);
    const defaults = getDefaultRatesForApartment(activeApt?.basePricePerNight || 70);
    saveStoredBookingRates(targetAptId, defaults);
    setBookingRates(defaults);
    setRateInputDraft(defaults);
    setApartments((prev) =>
      prev.map((a) => (a.id === targetAptId ? { ...a, rates: defaults } : a))
    );
    updateApartmentApi(targetAptId, { rates: defaults }).catch(() => {});
    setRateSuccessAlert('Tarifas restablecidas a los valores recomendados según el precio base.');
    setTimeout(() => setRateSuccessAlert(''), 6000);
  };

  const handleAddCustomDateRange = () => {
    if (!newCustomStart || !newCustomEnd || !newCustomPrice) return;
    const updatedRanges = [
      ...(rateInputDraft.customDateRanges || []),
      {
        id: 'rng-' + Date.now(),
        label: newCustomLabel.trim() || 'Período Especial Booking',
        startDate: newCustomStart,
        endDate: newCustomEnd,
        pricePerNight: Number(newCustomPrice)
      }
    ];
    const updated: BookingSeasonRateConfig = { ...rateInputDraft, customDateRanges: updatedRanges };
    setRateInputDraft(updated);
    handleSaveRates(updated);
    setNewCustomLabel('');
    setNewCustomStart('');
    setNewCustomEnd('');
    setNewCustomPrice(110);
  };

  const handleDeleteCustomRange = (id: string) => {
    const updatedRanges = (rateInputDraft.customDateRanges || []).filter((r) => r.id !== id);
    const updated: BookingSeasonRateConfig = { ...rateInputDraft, customDateRanges: updatedRanges };
    setRateInputDraft(updated);
    handleSaveRates(updated);
  };

  // Listen for global rates updates
  useEffect(() => {
    const onRatesUpdated = (e: any) => {
      const detail = e.detail;
      if (detail && detail.aptId === activeRateApartmentId) {
        setBookingRates(detail.config);
        setRateInputDraft(detail.config);
      }
    };
    window.addEventListener('azahar_rates_updated', onRatesUpdated);
    return () => window.removeEventListener('azahar_rates_updated', onRatesUpdated);
  }, [activeRateApartmentId]);

  // Synchronize live Booking iCal in background when URL changes or on mount
  useEffect(() => {
    let isMounted = true;
    const loadFreshIcal = async () => {
      try {
        const events = await fetchBookingIcalFeed(peniscolaIcalUrl);
        if (isMounted && events.length > 0) {
          setIcalEvents(events);
          setLastSyncTime(new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }));
        }
      } catch (err) {
        console.warn('Sincronización inicial iCal feed:', err);
      }
    };
    loadFreshIcal();
    return () => {
      isMounted = false;
    };
  }, [peniscolaIcalUrl]);

  // Load custom photos from localStorage on mount if user uploaded custom files
  useEffect(() => {
    try {
      const saved = localStorage.getItem('peniscola_custom_photos');
      if (saved) {
        const parsed = JSON.parse(saved) as ApartmentPhoto[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          const sanitized = parsed.filter((p) => {
            const url = (p?.url || '').toLowerCase();
            const caption = (p?.caption || '').toLowerCase();
            return !url.includes('peniscola_coast_1788275771316') &&
              !(caption.includes('vistas panor') && caption.includes('litoral') && caption.includes('castillo'));
          });
          if (sanitized.length > 0) {
            setApartments((prev) =>
              prev.map((apt) =>
                apt.id === 'apt-peniscola-primero' ? { ...apt, photos: sanitized } : apt
              )
            );
            localStorage.setItem('peniscola_custom_photos', JSON.stringify(sanitized));
          } else {
            localStorage.removeItem('peniscola_custom_photos');
          }
        }
      }
    } catch (err) {
      console.error('Error loading saved photos', err);
    }
  }, []);

  // Selected dates for default booking modal
  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 3);
  const defaultCheckOutStr = tomorrow.toISOString().split('T')[0];

  // Active photo index per apartment (keyed by apartment id)
  const [activePhotoIndices, setActivePhotoIndices] = useState<Record<string, number>>({
    'apt-peniscola-primero': 0,
    'apt-benicarlo-marina': 0,
    'apt-benicarlo-morrongo': 0,
    'apt-alcover-rural': 0,
  });

  // Modal State
  const [selectedApartment, setSelectedApartment] = useState<FeaturedApartment | null>(null);
  const [bookingDates, setBookingDates] = useState({
    checkIn: todayStr,
    checkOut: defaultCheckOutStr,
    guests: 4,
    name: '',
    email: '',
    phone: '',
    notes: ''
  });
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [bookingReference, setBookingReference] = useState('');

  // Real-time booking availability check state
  const [hasSearchedAvailability, setHasSearchedAvailability] = useState<boolean>(false);
  const [isSearchingAvailability, setIsSearchingAvailability] = useState<boolean>(false);

  // Gallery Lightbox State for viewing full apartment photos
  const [galleryApartment, setGalleryApartment] = useState<FeaturedApartment | null>(null);
  const [galleryPhotoIndex, setGalleryPhotoIndex] = useState<number>(0);

  // Handle cycling photos
  const handlePrevPhoto = (e: React.MouseEvent, aptId: string, totalPhotos: number) => {
    e.stopPropagation();
    setActivePhotoIndices((prev) => {
      const currentIndex = prev[aptId] || 0;
      return {
        ...prev,
        [aptId]: (currentIndex - 1 + totalPhotos) % totalPhotos,
      };
    });
  };

  const handleNextPhoto = (e: React.MouseEvent, aptId: string, totalPhotos: number) => {
    e.stopPropagation();
    setActivePhotoIndices((prev) => {
      const currentIndex = prev[aptId] || 0;
      return {
        ...prev,
        [aptId]: (currentIndex + 1) % totalPhotos,
      };
    });
  };

  const activeApartment = useMemo(() => {
    if (!selectedApartment) return null;
    return apartments.find((a) => a.id === selectedApartment.id) || selectedApartment;
  }, [selectedApartment, apartments]);

  const handleOpenBooking = async (apt: FeaturedApartment) => {
    const latestApt = apartments.find((a) => a.id === apt.id) || apt;
    setSelectedApartment(latestApt);
    setActiveRateApartmentId(latestApt.id);
    const aptRates = getApartmentBookingRates(latestApt);
    setBookingRates(aptRates);
    setRateInputDraft(aptRates);

    setBookingDates((prev) => ({
      ...prev,
      checkIn: todayStr,
      checkOut: defaultCheckOutStr,
      guests: Math.min(prev.guests || 2, latestApt.maxGuests)
    }));
    setBookingConfirmed(false);
    setHasSearchedAvailability(false);
    setIsSearchingAvailability(false);

    // Cargar disponibilidad iCal del apartamento seleccionado
    const urlToFetch = latestApt.bookingIcalUrl || (latestApt.id === 'apt-peniscola-primero' ? peniscolaIcalUrl : '');
    if (urlToFetch) {
      try {
        fetchBookingIcalFeed(urlToFetch).then((events) => {
          if (events && events.length > 0) {
            setIcalEvents(events);
            setLastSyncTime(new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }));
          }
        }).catch(() => {});
      } catch (e) {
        // no-op
      }
    } else {
      setIcalEvents([]);
    }
  };

  const handleSearchAvailability = async () => {
    if (!selectedApartment) return;
    setIsSearchingAvailability(true);
    try {
      const urlToFetch = selectedApartment.bookingIcalUrl || (selectedApartment.id === 'apt-peniscola-primero' ? peniscolaIcalUrl : '');
      if (urlToFetch) {
        const events = await fetchBookingIcalFeed(urlToFetch);
        if (events && events.length > 0) {
          setIcalEvents(events);
          setLastSyncTime(new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }));
        }
      } else {
        setIcalEvents([]);
      }
    } catch (e) {
      console.warn('Consulta en tiempo real completada');
    } finally {
      setTimeout(() => {
        setIsSearchingAvailability(false);
        setHasSearchedAvailability(true);
      }, 400);
    }
  };

  const handleSaveIcal = async (customUrl?: string) => {
    const url = (customUrl !== undefined ? customUrl : icalInputDraft).trim();
    if (!url) return;
    setIsSyncingIcal(true);
    try {
      localStorage.setItem('booking_ical_apt-peniscola-primero', url);
      setPeniscolaIcalUrl(url);
      setIcalInputDraft(url);
      const events = await fetchBookingIcalFeed(url);
      if (events.length > 0) {
        setIcalEvents(events);
      }
      setLastSyncTime(new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }));
      setIcalSuccessAlert(`✓ iCal guardado. ${events.length} períodos de ocupación sincronizados con Booking.com.`);
    } catch (err) {
      setIcalSuccessAlert('URL iCal guardada en almacenamiento local.');
    } finally {
      setIsSyncingIcal(false);
      setTimeout(() => setIcalSuccessAlert(''), 5000);
    }
  };

  const handleResetIcal = () => {
    try {
      localStorage.removeItem('booking_ical_apt-peniscola-primero');
    } catch (e) {
      console.warn(e);
    }
    setPeniscolaIcalUrl(DEFAULT_PENISCOLA_ICAL_URL);
    setIcalInputDraft(DEFAULT_PENISCOLA_ICAL_URL);
    handleSaveIcal(DEFAULT_PENISCOLA_ICAL_URL);
  };

  const calculateNights = (inDate: string, outDate: string) => {
    if (!inDate || !outDate) return 1;
    const start = new Date(inDate);
    const end = new Date(outDate);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingBooking(true);
    const randomRef = 'AZR-' + Math.floor(10000 + Math.random() * 90000);
    setBookingReference(randomRef);

    const totalEstimate = currentStayRate.totalPrice;

    await sendEmailNotification(
      `Nueva Pre-Reserva (${randomRef}): ${selectedApartment?.name || 'Apartamento'} - ${bookingDates.name}`,
      {
        formType: 'solicitud_reserva',
        referenciaReserva: randomRef,
        apartamento: selectedApartment?.name || 'No especificado',
        municipio: selectedApartment?.town || 'No especificado',
        nombreHuesped: bookingDates.name,
        email: bookingDates.email,
        telefono: bookingDates.phone,
        fechaEntrada: formatToDDMMAAAA(bookingDates.checkIn),
        fechaSalida: formatToDDMMAAAA(bookingDates.checkOut),
        nochesEstancia: currentStayRate.nightsCount,
        tarifaMediaNoche: `${currentStayRate.averagePricePerNight} €/noche`,
        temporadaBooking: currentStayRate.dominantSeason,
        numeroHuespedes: bookingDates.guests,
        totalEstimadoEuros: `${totalEstimate} €`,
        observaciones: bookingDates.notes || 'Ninguna'
      }
    );

    setIsSubmittingBooking(false);
    setBookingConfirmed(true);

    showSuccess(
      '¡Pre-reserva enviada con éxito!',
      `Referencia: ${randomRef}. Hemos recibido tu solicitud para ${selectedApartment?.name || 'el apartamento'}. Nos comunicaremos contigo para confirmar las fechas.`,
      {
        badge: 'Reserva Directa'
      }
    );
  };

  // Custom photo upload handlers for Peñíscola apartment
  const handleFilesSelected = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    const readPromises = fileArray.map((file) => {
      return new Promise<ApartmentPhoto>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve({
            url: reader.result as string,
            caption: file.name
          });
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readPromises).then((loadedPhotos) => {
      // Find photo with 'balcon1' or 'balcon' as cover, then 'portada' or 'cover'
      let portadaIndex = loadedPhotos.findIndex((p) =>
        p.caption.toLowerCase().includes('balcon1')
      );
      if (portadaIndex === -1) {
        portadaIndex = loadedPhotos.findIndex((p) =>
          p.caption.toLowerCase().includes('balcon')
        );
      }
      if (portadaIndex === -1) {
        portadaIndex = loadedPhotos.findIndex((p) =>
          p.caption.toLowerCase().includes('portada') || p.caption.toLowerCase().includes('cover')
        );
      }

      let ordered = [...loadedPhotos];
      if (portadaIndex > 0) {
        const [portada] = ordered.splice(portadaIndex, 1);
        ordered.unshift(portada);
      }

      // Format captions nicely with filenames
      ordered = ordered.map((p, idx) => ({
        url: p.url,
        caption: idx === 0 
          ? `Foto de Portada: ${p.caption}` 
          : `Foto ${idx + 1}: ${p.caption}`
      }));

      // Update apartments state
      setApartments((prev) =>
        prev.map((apt) =>
          apt.id === 'apt-peniscola-primero' ? { ...apt, photos: ordered } : apt
        )
      );

      // Reset active index to 0 so cover is immediately shown
      setActivePhotoIndices((prev) => ({ ...prev, 'apt-peniscola-primero': 0 }));

      // Persist in Backend API, Cloud Firestore & LocalStorage
      updateApartmentApi('apt-peniscola-primero', { photos: ordered }).catch((err) => {
        console.warn('Error guardando fotos en base de datos:', err);
      });

      setUploadSuccessMsg(`¡${ordered.length} fotos cargadas con éxito! Portada: ${ordered[0].caption}`);
      setTimeout(() => setUploadSuccessMsg(''), 4000);
    });
  };

  const handleSetAsPortada = (indexToMove: number) => {
    const currentApt = apartments.find((a) => a.id === 'apt-peniscola-primero');
    if (!currentApt) return;
    const reordered = [...currentApt.photos];
    const [picked] = reordered.splice(indexToMove, 1);
    reordered.unshift(picked);

    const updated = reordered.map((p, idx) => ({
      url: p.url,
      caption: idx === 0 
        ? p.caption.replace(/^Foto \d+:\s*/, 'Foto de Portada: ') 
        : p.caption.replace(/^Foto de Portada:\s*/, `Foto ${idx + 1}: `)
    }));

    setApartments((prev) =>
      prev.map((apt) => (apt.id === 'apt-peniscola-primero' ? { ...apt, photos: updated } : apt))
    );
    setActivePhotoIndices((prev) => ({ ...prev, 'apt-peniscola-primero': 0 }));

    // Persist in Backend API, Cloud Firestore & LocalStorage
    updateApartmentApi('apt-peniscola-primero', { photos: updated }).catch((err) => {
      console.warn('Error guardando portada en base de datos:', err);
    });
  };

  const handleResetPhotos = () => {
    try {
      localStorage.removeItem('peniscola_custom_photos');
    } catch {
      // Ignore storage errors
    }
    const cleanDefaultPhotos = FEATURED_APARTMENTS.find((a) => a.id === 'apt-peniscola-primero')?.photos || [];
    setApartments((prev) =>
      prev.map((apt) =>
        apt.id === 'apt-peniscola-primero'
          ? { ...apt, photos: cleanDefaultPhotos }
          : apt
      )
    );
    setActivePhotoIndices((prev) => ({ ...prev, 'apt-peniscola-primero': 0 }));

    // Persist reset in Backend API & Firestore
    updateApartmentApi('apt-peniscola-primero', { photos: cleanDefaultPhotos }).catch(() => {});

    setUploadSuccessMsg('Fotos restablecidas a las fotos originales del catálogo.');
    setTimeout(() => setUploadSuccessMsg(''), 3000);
  };

  const currentAvailability = useMemo(() => {
    if (!selectedApartment || (selectedApartment.id !== 'apt-peniscola-primero' && !selectedApartment.bookingIcalUrl)) {
      return { isAvailable: true, allEventsCount: 0, lastChecked: '' };
    }
    return checkAvailability(bookingDates.checkIn, bookingDates.checkOut, icalEvents);
  }, [selectedApartment, bookingDates.checkIn, bookingDates.checkOut, icalEvents]);

  const currentStayRate = useMemo(() => {
    if (!selectedApartment) {
      return calculateBookingStayRate(bookingDates.checkIn, bookingDates.checkOut, bookingRates);
    }
    // Utilizar las tarifas configuradas exactas de este apartamento (Firestore / LocalStorage / modelo)
    const aptRates = selectedApartment.id === activeRateApartmentId
      ? bookingRates
      : getApartmentBookingRates(selectedApartment);

    return calculateBookingStayRate(bookingDates.checkIn, bookingDates.checkOut, aptRates);
  }, [selectedApartment, bookingDates.checkIn, bookingDates.checkOut, bookingRates, activeRateApartmentId]);

  const nightsCount = currentStayRate.nightsCount;
  const totalPrice = currentStayRate.totalPrice;

  const generateWhatsAppUrl = (apt: FeaturedApartment) => {
    const total = currentStayRate.totalPrice;
    const ratePerNight = currentStayRate.averagePricePerNight;
    const entradaFmt = formatToDDMMAAAA(bookingDates.checkIn);
    const salidaFmt = formatToDDMMAAAA(bookingDates.checkOut);
    const hasIcal = apt.id === 'apt-peniscola-primero' || apt.bookingIcalUrl;
    const bookingNote = hasIcal && !currentAvailability.isAvailable
      ? `\n\n(Aviso de ocupación: las fechas del ${formatIcalDateEs(currentAvailability.conflictingEvent?.start || '') || '24/09/2026'} al ${formatIcalDateEs(currentAvailability.conflictingEvent?.end || '') || '30/09/2026'} figuran con reserva en el calendario oficial de este apartamento, desearía consultar alternativas o fechas cercanas).`
      : '';
    const msg = `Hola Azahar Rentals, deseo consultar la reserva del apartamento "${apt.name}" en ${apt.town} (VT: ${apt.licenseNumber}).\n\n- Fechas: del ${entradaFmt} al ${salidaFmt} (${nightsCount} noches)\n- Huéspedes: ${bookingDates.guests} personas\n- Tarifa calculada según calendario oficial: ${total} € (media ${ratePerNight} €/noche - ${currentStayRate.dominantSeason})${bookingNote}\n\n¿Tienen disponibilidad para estas fechas? Muchas gracias.`;
    return `https://wa.me/34637968999?text=${encodeURIComponent(msg)}`;
  };

  return (
    <section id="apartamentos" className="py-20 bg-slate-900 text-white relative overflow-hidden">
      {/* Background glow styling */}
      <div 
        className="absolute top-0 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-15 pointer-events-none"
        style={{ backgroundColor: currentTheme.colors.primary }}
      />
      <div 
        className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-10 pointer-events-none"
        style={{ backgroundColor: currentTheme.colors.secondary }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-950/80 border border-cyan-700/60 text-cyan-300 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Alquiler Vacacional Turístico Verificado</span>
          </div>

          <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mb-3 tracking-tight ${currentTheme.typography.headingFontClass}`}>
            Apartamentos Turísticos en la Costa de Castellón
          </h2>

          <p className="text-base sm:text-lg text-slate-300">
            Algunos de los apartamentos de los que disponemos con gestión 360°, licencias turísticas oficiales registradas y máxima valoración de huéspedes.
          </p>
        </div>

        {/* 4 Featured Apartments in Horizontal Cards Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {apartments.map((apt) => {
            const currentPhotoIdx = activePhotoIndices[apt.id] || 0;
            const currentPhoto = apt.photos[currentPhotoIdx] || apt.photos[0];

            return (
              <article
                key={apt.id}
                id={`card-${apt.id}`}
                aria-label={`Alojamiento turístico ${apt.name} en ${apt.town}, Castellón`}
                className="bg-slate-800/90 border border-slate-700/80 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col group hover:border-slate-600"
              >
                {/* Photo Carousel Container with Left & Right Arrows */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-950 select-none">
                  <img
                    src={normalizePhotoUrl(currentPhoto?.url)}
                    alt={`Alojamiento turístico ${apt.name} en ${apt.town}, Castellón - Licencia oficial ${apt.licenseNumber} - ${currentPhoto?.caption || apt.name}`}
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (!target.dataset.fallbackTried) {
                        target.dataset.fallbackTried = 'true';
                        target.src = 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80';
                      }
                    }}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/40 pointer-events-none" />

                  {/* Town Name Badge (Highlighted prominently) */}
                  <div className="absolute top-3 left-3 z-10">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-900/90 text-cyan-300 border border-cyan-500/40 shadow-lg backdrop-blur-md">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                      {apt.town}
                    </span>
                  </div>

                  {/* Photo Counter Badge */}
                  <div className="absolute top-3 right-3 z-10">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-black/70 text-white/90 backdrop-blur-sm">
                      {currentPhotoIdx + 1} / {apt.photos.length}
                    </span>
                  </div>

                  {/* Photo Filename / Caption overlay */}
                  <div className="absolute bottom-6 left-2 right-2 z-10 pointer-events-none">
                    <div className="bg-slate-950/85 text-[10px] text-cyan-200/90 px-2 py-1 rounded-md backdrop-blur-md border border-cyan-500/20 truncate text-center shadow-md">
                      {currentPhoto.caption}
                    </div>
                  </div>

                  {/* Left Arrow Button */}
                  <button
                    onClick={(e) => handlePrevPhoto(e, apt.id, apt.photos.length)}
                    aria-label={`Foto anterior de ${apt.name}`}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-900/80 hover:bg-cyan-600 text-white flex items-center justify-center backdrop-blur-sm transition-all shadow-md z-20 opacity-90 hover:opacity-100 hover:scale-110 active:scale-95 cursor-pointer"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  {/* Right Arrow Button */}
                  <button
                    onClick={(e) => handleNextPhoto(e, apt.id, apt.photos.length)}
                    aria-label={`Foto siguiente de ${apt.name}`}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-900/80 hover:bg-cyan-600 text-white flex items-center justify-center backdrop-blur-sm transition-all shadow-md z-20 opacity-90 hover:opacity-100 hover:scale-110 active:scale-95 cursor-pointer"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  {/* Dots Indicator */}
                  <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10 bg-black/60 px-2 py-0.5 rounded-full backdrop-blur-sm">
                    {apt.photos.map((_, i) => (
                      <button
                        key={i}
                        onClick={(e) => {
                          e.stopPropagation();
                          setActivePhotoIndices((prev) => ({ ...prev, [apt.id]: i }));
                        }}
                        aria-label={`Ver foto ${i + 1}`}
                        className={`h-1.5 rounded-full transition-all cursor-pointer ${
                          i === currentPhotoIdx ? 'w-4 bg-cyan-400' : 'w-1.5 bg-white/50 hover:bg-white'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Rating & Tourist License */}
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="flex items-center gap-1 font-bold text-amber-300">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        {apt.rating}
                        <span className="text-slate-400 font-normal">({apt.reviewsCount})</span>
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-900/60 px-2 py-0.5 rounded border border-slate-700/60">
                        {apt.licenseNumber}
                      </span>
                    </div>

                    {/* Apartment Name & Zone */}
                    <h3 className="font-bold text-white text-base leading-snug group-hover:text-cyan-300 transition-colors mb-1 line-clamp-1">
                      {apt.name}
                    </h3>
                    <p className="text-xs text-slate-400 mb-3 flex items-center gap-1 line-clamp-1">
                      <span className="text-slate-300">{apt.zone}</span>
                    </p>

                    {/* Services and Amenities Badges (Managed from Admin in real-time) */}
                    {apt.amenities && apt.amenities.length > 0 && (() => {
                      const sortedBadges = [...apt.amenities].sort((a, b) => {
                        const aLower = a.toLowerCase();
                        const bLower = b.toLowerCase();
                        if (aLower.includes('piscina privada')) return -1;
                        if (bLower.includes('piscina privada')) return 1;
                        if (aLower.includes('primera')) return -1;
                        if (bLower.includes('primera')) return 1;
                        return 0;
                      });
                      return (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {sortedBadges.slice(0, 3).map((amenity, idx) => {
                            const isPrivPool = amenity.toLowerCase().includes('piscina privada');
                            return (
                              <span
                                key={idx}
                                className={`px-2 py-0.5 rounded-md text-[10px] font-medium flex items-center gap-1 ${
                                  isPrivPool
                                    ? 'bg-cyan-950/90 border border-cyan-500/70 text-cyan-300 shadow-2xs font-semibold'
                                    : 'bg-slate-900/90 border border-slate-700/70 text-cyan-200'
                                }`}
                              >
                                {isPrivPool && <Waves className="w-2.5 h-2.5 text-cyan-400 shrink-0" />}
                                <span>{amenity}</span>
                              </span>
                            );
                          })}
                          {sortedBadges.length > 3 && (
                            <span className="px-1.5 py-0.5 rounded-md bg-slate-900/60 border border-slate-800 text-[10px] text-slate-400">
                              +{sortedBadges.length - 3}
                            </span>
                          )}
                        </div>
                      );
                    })()}

                    {/* Specs / Capacity Grid */}
                    <div className="grid grid-cols-3 gap-1.5 py-2 border-y border-slate-700/60 text-center mb-3 text-[11px] text-slate-300">
                      <div className="flex flex-col items-center justify-center">
                        <Users className="w-3.5 h-3.5 text-cyan-400 mb-0.5" />
                        <span>Hasta {apt.maxGuests} pers.</span>
                      </div>
                      <div className="flex flex-col items-center justify-center border-x border-slate-700/60">
                        <BedDouble className="w-3.5 h-3.5 text-cyan-400 mb-0.5" />
                        <span>{apt.bedrooms} dorms.</span>
                      </div>
                      <div className="flex flex-col items-center justify-center">
                        <Waves className="w-3.5 h-3.5 text-cyan-400 mb-0.5" />
                        <span className="truncate max-w-[85px]" title={apt.isFirstLineBeach ? 'Primera línea (25m)' : apt.distanceToBeach}>
                          {apt.isFirstLineBeach ? '1ª línea (25m)' : apt.distanceToBeach}
                        </span>
                      </div>
                    </div>

                    {/* Top Highlight bullet */}
                    <p className="text-xs text-slate-300 leading-relaxed mb-4 line-clamp-2">
                      {apt.highlights[0]}
                    </p>
                  </div>

                  {/* Price & Booking Button */}
                  <div className="pt-2 border-t border-slate-700/60">
                    <div className="flex items-baseline justify-between mb-3">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Tarifa por noche</span>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-xs text-slate-400 font-medium">desde</span>
                          <span className="text-xl font-bold text-white font-mono">{apt.basePricePerNight} €</span>
                          <span className="text-xs text-slate-400">/ noche</span>
                        </div>
                      </div>
                      <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded">
                        Disponible
                      </span>
                    </div>

                    {/* Action Button: Reservar fechas */}
                    <button
                      id={`btn-book-${apt.id}`}
                      onClick={() => {
                        if (onBookingClick) {
                          onBookingClick(apt);
                        } else {
                          handleOpenBooking(apt);
                        }
                      }}
                      aria-label={`Reservar estancia en el apartamento turístico ${apt.name} en ${apt.town}`}
                      className={`w-full py-2.5 px-4 text-xs font-bold text-white rounded-xl shadow-lg cursor-pointer flex items-center justify-center gap-2 transition-all duration-200 hover:brightness-110 active:scale-[0.98]`}
                      style={{ backgroundColor: currentTheme.colors.primary }}
                    >
                      <Calendar className="w-4 h-4" />
                      <span>Reservar apartamento</span>
                    </button>
                  </div>
                </div>

              </article>
            );
          })}
        </div>

        {/* Bottom Trust Banner */}
        <div className="mt-12 p-4 sm:p-5 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-left">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">¿Buscas otra ubicación o fechas especiales en la Costa de Castellón?</h4>
              <p className="text-xs text-slate-400">Gestionamos más de 45 viviendas turísticas entre Vinaròs, Benicarló, Peñíscola, Oropesa y Benicàssim.</p>
            </div>
          </div>

          <a
            href="https://wa.me/34637968999?text=Hola%20Azahar%20Rentals,%20busco%20alquiler%20vacacional%20en%20la%20Costa%20de%20Castell%C3%B3n"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-md transition-colors shrink-0"
          >
            <Phone className="w-4 h-4" />
            <span>Consultar por WhatsApp</span>
          </a>
        </div>

      </div>

      {/* Booking Modal with Date & Guest Selector */}
      {selectedApartment && activeApartment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl relative text-white">
            
            {/* Modal Header */}
            <div className="sticky top-0 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 p-4 sm:p-5 flex items-center justify-between z-10">
              <div>
                <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {activeApartment.town} • Alquiler Vacacional
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                  <span>{activeApartment.name}</span>
                  <span className="text-xs font-mono font-normal text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/50 hidden sm:inline">
                    {activeApartment.licenseNumber}
                  </span>
                </h3>
              </div>
              <button
                onClick={() => setSelectedApartment(null)}
                aria-label="Cerrar modal de reserva"
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 space-y-6">
              {!bookingConfirmed ? (
                <form onSubmit={handleConfirmBooking} className="space-y-6">
                  
                  {/* Section 0: Photos Showcase & Apartment Details */}
                  <div className="bg-slate-800/80 rounded-2xl p-4 sm:p-5 border border-slate-700/80 space-y-4">
                    {/* Header info row (sincronizado con la configuración guardada en el Admin) */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700/60 pb-3">
                      <div>
                        <div className="text-sm font-bold text-white flex items-center gap-2">
                          <span>{activeApartment.name}</span>
                          <span className="text-xs font-mono text-cyan-300 sm:hidden">
                            {activeApartment.licenseNumber}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                          <span>{activeApartment.zone} ({activeApartment.town})</span>
                        </div>
                      </div>

                      {/* Datos configurados en el Admin: Primera línea (si está seleccionada), personas máx, habitaciones, baños y tarifa base */}
                      {(() => {
                        const isFirstLineSelected = Boolean(
                          activeApartment.amenities?.some((a) => {
                            const norm = a.toLowerCase();
                            return norm.includes('primera línea') || norm.includes('primera linea');
                          }) ||
                          activeApartment.isFirstLineBeach ||
                          activeApartment.distanceToBeach?.toLowerCase().includes('primera')
                        );

                        return (
                          <div className="flex flex-wrap items-center gap-2 text-xs">
                            {isFirstLineSelected && (
                              <span className="px-2.5 py-1 rounded-lg bg-emerald-950/90 border border-emerald-600/80 text-emerald-300 font-bold flex items-center gap-1.5 shadow-sm">
                                <Waves className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Primera línea (25m)</span>
                              </span>
                            )}
                            <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 flex items-center gap-1 font-medium">
                              <Users className="w-3.5 h-3.5 text-cyan-400" />
                              <span>Hasta {activeApartment.maxGuests} personas</span>
                            </span>
                            <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 flex items-center gap-1 font-medium">
                              <BedDouble className="w-3.5 h-3.5 text-cyan-400" />
                              <span>{activeApartment.bedrooms} {activeApartment.bedrooms === 1 ? 'hab' : 'habs'}</span>
                            </span>
                            <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 flex items-center gap-1 font-medium">
                              <Bath className="w-3.5 h-3.5 text-cyan-400" />
                              <span>{activeApartment.bathrooms} {activeApartment.bathrooms === 1 ? 'baño' : 'baños'}</span>
                            </span>
                            <span className="px-2.5 py-1 rounded-lg bg-cyan-950/70 border border-cyan-700/60 text-cyan-300 font-mono font-bold">
                              desde {activeApartment.basePricePerNight} € / noche
                            </span>
                          </div>
                        );
                      })()}
                    </div>

                    {/* 4 Photos Grid (Double the previous size: h-40 sm:h-44 md:h-48) */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                          <Camera className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Fotografías del alojamiento:</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setGalleryApartment(activeApartment);
                            setGalleryPhotoIndex(0);
                          }}
                          className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer font-medium hover:underline"
                        >
                          <Images className="w-3.5 h-3.5" />
                          <span>Ver todas ({activeApartment.photos.length} fotos)</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                        {getApartmentDisplayPhotos(activeApartment).slice(0, 4).map((photo, pIdx) => {
                          const isFourthAndMore = pIdx === 3 && activeApartment.photos.length > 4;
                          const extraCount = activeApartment.photos.length - 4;

                          return (
                            <div
                              key={pIdx}
                              onClick={() => {
                                setGalleryApartment(activeApartment);
                                setGalleryPhotoIndex(pIdx);
                              }}
                              className="relative rounded-xl overflow-hidden cursor-pointer group shadow-md bg-slate-950 border border-slate-700/60"
                              title={isFourthAndMore ? `Ver ${extraCount} fotos más` : photo.caption || `Foto ${pIdx + 1}`}
                            >
                              <img
                                src={normalizePhotoUrl(photo.url)}
                                alt={photo.caption || `${activeApartment.name} - Foto ${pIdx + 1}`}
                                loading="lazy"
                                decoding="async"
                                onError={(e) => {
                                  const target = e.currentTarget;
                                  if (!target.dataset.fallbackTried) {
                                    target.dataset.fallbackTried = 'true';
                                    target.src = 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80';
                                  }
                                }}
                                className="w-full h-40 sm:h-44 md:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                              />

                              {isFourthAndMore ? (
                                <div className="absolute inset-0 bg-slate-950/75 hover:bg-slate-950/65 backdrop-blur-[2px] transition-colors flex flex-col items-center justify-center text-center p-2 text-white">
                                  <div className="w-10 h-10 rounded-full bg-cyan-500/25 border border-cyan-400/60 flex items-center justify-center text-cyan-300 mb-1 shadow-md group-hover:scale-110 transition-transform">
                                    <Images className="w-5 h-5 text-cyan-300" />
                                  </div>
                                  <span className="font-extrabold text-sm sm:text-base text-white tracking-wide">
                                    +{extraCount} fotos
                                  </span>
                                  <span className="text-[11px] text-cyan-300 font-semibold underline mt-0.5">
                                    Ver galería completa
                                  </span>
                                </div>
                              ) : (
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                  <div className="w-8 h-8 rounded-full bg-slate-900/80 border border-white/40 flex items-center justify-center text-white shadow-md">
                                    <Maximize2 className="w-4 h-4" />
                                  </div>
                                </div>
                              )}

                              {photo.caption && !isFourthAndMore && (
                                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-1.5 text-[10px] text-slate-200 truncate opacity-0 group-hover:opacity-100 transition-opacity">
                                  {photo.caption}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Services and Amenities saved in Admin (Excludes Primera línea because it is shown above with capacity) */}
                    {(() => {
                      const rawList = (activeApartment.amenities && activeApartment.amenities.length > 0)
                        ? [...activeApartment.amenities]
                        : ['Parking privado', 'Cafetera Nespresso', 'Wifi 600Mb', 'Aire acondicionado', 'Piscina comunitaria', 'Terraza exterior', 'Ascensor', 'Lavavajillas'];

                      // Filter out "Primera línea" as requested, since it is displayed above in the capacity & distribution section
                      const filteredList = rawList.filter((item) => {
                        const lower = item.toLowerCase();
                        return !lower.includes('primera línea') && !lower.includes('primera linea');
                      });

                      // Deduplicate list
                      const uniqueList: string[] = [];
                      const seen = new Set<string>();
                      for (const item of filteredList) {
                        const normalized = item.trim().toLowerCase();
                        if (!seen.has(normalized)) {
                          seen.add(normalized);
                          uniqueList.push(item);
                        }
                      }

                      return (
                        <div className="space-y-2 pt-2 border-t border-slate-700/60">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                              <span>Servicios y equipamiento disponibles en el apartamento:</span>
                            </span>
                            <span className="text-[10px] text-cyan-400 font-mono">
                              {uniqueList.length} servicios
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {uniqueList.map((amenity, aIdx) => {
                              const isPrivPool = amenity.toLowerCase().includes('piscina privada');
                              return (
                                <span
                                  key={aIdx}
                                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium shadow-2xs transition-colors ${
                                    isPrivPool
                                      ? 'bg-cyan-950/80 border border-cyan-500/60 text-cyan-200 ring-1 ring-cyan-500/30 font-semibold'
                                      : 'bg-slate-900/90 border border-slate-700/90 text-slate-200 hover:border-cyan-500/40'
                                  }`}
                                >
                                  {getAmenityIcon(amenity)}
                                  <span>{amenity}</span>
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })()}

                  </div>

                  {/* Step 1: Select Dates & Guests with Real-Time Search Button */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-cyan-400" />
                      1. Selecciona las fechas de estancia y número de personas:
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                      {/* Fecha de Entrada */}
                      <div className="sm:col-span-4">
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                          Fecha de Entrada <span className="text-blue-400 font-normal lowercase">(dd/mm/aaaa)</span> *
                        </label>
                        <DatePickerInput
                          required
                          value={bookingDates.checkIn}
                          onChange={(val) => {
                            const newDates = { ...bookingDates, checkIn: val };
                            if (bookingDates.checkOut <= val) {
                              const next = new Date(val);
                              next.setDate(next.getDate() + 2);
                              newDates.checkOut = next.toISOString().split('T')[0];
                            }
                            setBookingDates(newDates);
                            setHasSearchedAvailability(false);
                          }}
                          min={todayStr}
                          bgClass="bg-slate-800"
                          hideRightIndicator
                        />
                      </div>

                      {/* Fecha de Salida */}
                      <div className="sm:col-span-4">
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                          Fecha de Salida <span className="text-blue-400 font-normal lowercase">(dd/mm/aaaa)</span> *
                        </label>
                        <DatePickerInput
                          required
                          value={bookingDates.checkOut}
                          onChange={(val) => {
                            setBookingDates({ ...bookingDates, checkOut: val });
                            setHasSearchedAvailability(false);
                          }}
                          min={bookingDates.checkIn || todayStr}
                          bgClass="bg-slate-800"
                          hideRightIndicator
                        />
                      </div>

                      {/* Número de Personas con Icono/Botón de Buscar a la derecha */}
                      <div className="sm:col-span-4">
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                          Número de Personas *
                        </label>
                        <div className="flex items-center gap-2">
                          <select
                            value={bookingDates.guests}
                            onChange={(e) => {
                              setBookingDates({ ...bookingDates, guests: Number(e.target.value) });
                              setHasSearchedAvailability(false);
                            }}
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none cursor-pointer h-[42px]"
                          >
                            {Array.from({ length: activeApartment.maxGuests }, (_, i) => i + 1).map((n) => (
                              <option key={n} value={n}>
                                {n} {n === 1 ? 'persona' : 'personas'} (máx {activeApartment.maxGuests})
                              </option>
                            ))}
                          </select>

                          {/* Botón e Icono de Buscar disponibilidad a la derecha de Número de Personas */}
                          <button
                            type="button"
                            onClick={handleSearchAvailability}
                            disabled={isSearchingAvailability}
                            id="btn-search-availability"
                            aria-label="Buscar disponibilidad según calendario en tiempo real"
                            title="Buscar disponibilidad en el calendario oficial de este apartamento en tiempo real"
                            className="shrink-0 h-[42px] px-3.5 sm:px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md hover:shadow-cyan-500/25 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
                          >
                            {isSearchingAvailability ? (
                              <RefreshCw className="w-4 h-4 animate-spin text-white shrink-0" />
                            ) : (
                              <Search className="w-4 h-4 text-white shrink-0" />
                            )}
                            <span className="hidden sm:inline font-semibold">
                              {isSearchingAvailability ? 'Consultando...' : 'Buscar'}
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Calendario oficial Live Availability & Consultation Notice (sin botón Comprobar ahora) */}
                  <div className="space-y-2">
                    {isSearchingAvailability ? (
                      <div className="p-3.5 bg-cyan-950/80 border border-cyan-500/50 rounded-xl flex items-center gap-2.5 text-cyan-300 text-xs animate-pulse">
                        <RefreshCw className="w-4 h-4 animate-spin text-cyan-400 shrink-0" />
                        <span>Consultando disponibilidad oficial y tarifas en tiempo real en el calendario de este apartamento...</span>
                      </div>
                    ) : !hasSearchedAvailability ? (
                      <div className="p-3.5 bg-slate-800/80 border border-cyan-800/40 rounded-xl flex items-center gap-3 text-xs text-slate-300">
                        <Info className="w-4 h-4 text-cyan-400 shrink-0" />
                        <div>
                          <span className="font-bold text-white block">Comprueba la disponibilidad en tiempo real:</span>
                          <span className="text-slate-400">
                            Selecciona tus fechas y pulsa el botón de <strong>Buscar</strong> (icono de lupa a la derecha de Personas) para consultar el calendario oficial de este apartamento.
                          </span>
                        </div>
                      </div>
                    ) : currentAvailability.isAvailable ? (
                      <div className="p-3.5 bg-emerald-950/75 border border-emerald-500/50 rounded-xl text-xs space-y-1 animate-fadeIn">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-emerald-300 font-bold">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            <span>Disponibilidad Confirmada</span>
                          </div>
                          <span className="text-[10px] text-emerald-400 bg-emerald-900/60 border border-emerald-700/50 px-2 py-0.5 rounded font-mono">
                            100% Libre
                          </span>
                        </div>
                        <p className="text-emerald-200/90 text-[11px] leading-relaxed">
                          Las fechas seleccionadas (del <strong>{formatToDDMMAAAA(bookingDates.checkIn)}</strong> al <strong>{formatToDDMMAAAA(bookingDates.checkOut)}</strong>) están <strong>100% libres</strong> en el calendario oficial de este apartamento. Tarifa oficial calculada: <strong>{currentStayRate.averagePricePerNight} € / noche</strong> ({currentStayRate.dominantSeason}).
                        </p>
                      </div>
                    ) : (
                      <div className="p-3.5 bg-red-950/90 border border-red-500/60 rounded-xl text-xs space-y-2 animate-fadeIn">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-red-300 font-bold">
                            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                            <span>Fechas Ocupadas</span>
                          </div>
                          <span className="text-[10px] text-red-300 bg-red-900/80 border border-red-700/60 px-2 py-0.5 rounded font-mono">
                            No disponible
                          </span>
                        </div>
                        <p className="text-red-200 text-[11px] leading-relaxed">
                          El apartamento figura con reserva u ocupación del{' '}
                          <strong>{formatIcalDateEs(currentAvailability.conflictingEvent?.start || '') || '24/09/2026'}</strong> al{' '}
                          <strong>{formatIcalDateEs(currentAvailability.conflictingEvent?.end || '') || '30/09/2026'}</strong> en el calendario oficial de este apartamento.
                        </p>
                        <p className="text-slate-300 text-[11px]">
                          Por favor modifica las fechas y pulsa de nuevo en <strong>Buscar</strong> para consultar otros días disponibles, o contacta con nosotros por WhatsApp para ofrecerte alojamientos alternativos en la misma zona.
                        </p>
                        <div className="pt-1">
                          <a
                            href={generateWhatsAppUrl(activeApartment)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow transition-colors cursor-pointer"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            <span>Consultar alternativas por WhatsApp</span>
                          </a>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Summary of Price & Step 2 Contact info: ONLY shown when availability is verified and free */}
                  {hasSearchedAvailability && currentAvailability.isAvailable && (
                    <>
                      {/* Summary of Price & Duration */}
                      <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-4 space-y-2.5 text-xs animate-fadeIn">
                        <div className="flex justify-between text-slate-300 items-baseline">
                          <span>Estancia seleccionada ({currentStayRate.nightsCount} {currentStayRate.nightsCount === 1 ? 'noche' : 'noches'}):</span>
                          <span className="font-mono font-semibold text-sm text-white">{currentStayRate.totalPrice} €</span>
                        </div>

                        {(activeApartment.id === 'apt-peniscola-primero' || activeApartment.bookingIcalUrl) && (
                          <div className="space-y-1.5 pt-1.5 border-t border-slate-700/60">
                            <div className="flex items-center justify-between text-cyan-300">
                              <span className="flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                                <span>Tarifa según calendario oficial ({currentStayRate.dominantSeason}):</span>
                              </span>
                              <span className="font-mono font-bold text-cyan-200 text-sm">
                                {currentStayRate.averagePricePerNight} € / noche
                              </span>
                            </div>

                            {currentStayRate.seasonBreakdown.length > 1 && (
                              <div className="bg-slate-900/60 p-2.5 rounded-lg space-y-1 text-[11px] text-slate-300">
                                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                                  Desglose de tarifas por temporada:
                                </div>
                                {currentStayRate.seasonBreakdown.map((sb, idx) => (
                                  <div key={idx} className="flex justify-between">
                                    <span>{sb.nights} {sb.nights === 1 ? 'noche' : 'noches'} en {sb.seasonName} ({sb.ratePerNight} €/noche):</span>
                                    <span className="font-mono text-cyan-300">{sb.subtotal} €</span>
                                  </div>
                                ))}
                              </div>
                            )}

                            <div className="flex items-center justify-between pt-1 text-[11px]">
                              <button
                                type="button"
                                onClick={() => setShowNightsBreakdown(!showNightsBreakdown)}
                                className="text-cyan-400 hover:text-cyan-300 underline cursor-pointer"
                              >
                                {showNightsBreakdown ? 'Ocultar desglose noche a noche' : 'Ver desglose noche a noche'}
                              </button>

                              {isAdmin && (
                                <button
                                  type="button"
                                  onClick={() => setIsEditingRatesInline(!isEditingRatesInline)}
                                  className="text-slate-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer font-medium"
                                >
                                  <Sliders className="w-3 h-3 text-cyan-400" />
                                  <span>{isEditingRatesInline ? 'Ocultar ajuste rápido' : 'Ajustar tarifas'}</span>
                                </button>
                              )}
                            </div>

                            {/* Nights detail list */}
                            {showNightsBreakdown && (
                              <div className="max-h-36 overflow-y-auto space-y-1 p-2 bg-slate-900/90 rounded-lg border border-slate-700/60 text-[11px]">
                                {currentStayRate.nightsDetail.map((nd, idx) => (
                                  <div key={idx} className="flex justify-between items-center py-0.5 border-b border-slate-800 last:border-0">
                                    <span className="font-mono text-slate-300">{formatToDDMMAAAA(nd.date)}</span>
                                    <span className="text-slate-400 text-[10px]">{nd.seasonName}{nd.isWeekend ? ' (Fin de semana)' : ''}</span>
                                    <span className="font-mono font-semibold text-cyan-300">{nd.price} €</span>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Inline Quick Rate Editor for Owner */}
                            {isAdmin && isEditingRatesInline && (
                              <div className="p-3 bg-slate-900/95 border border-cyan-500/40 rounded-xl space-y-2 mt-2">
                                <div className="flex items-center justify-between text-[11px] font-bold text-cyan-300">
                                  <span>Modificar tarifas de {activeApartment.name}:</span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setIsPhotoModalOpen(true);
                                      setSelectedApartment(null);
                                    }}
                                    className="text-[10px] text-cyan-400 hover:underline cursor-pointer"
                                  >
                                    Abrir panel completo ↗
                                  </button>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px]">
                                  <div>
                                    <label className="block text-slate-400 mb-0.5">Baja (Invierno)</label>
                                    <div className="relative">
                                      <input
                                        type="number"
                                        min="30"
                                        max="500"
                                        value={rateInputDraft.lowSeason}
                                        onChange={(e) => setRateInputDraft({ ...rateInputDraft, lowSeason: Number(e.target.value) })}
                                        className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-white font-mono text-xs focus:border-cyan-400 focus:outline-none"
                                      />
                                      <span className="absolute right-1.5 top-1 text-slate-400 text-[10px]">€</span>
                                    </div>
                                  </div>
                                  <div>
                                    <label className="block text-slate-400 mb-0.5">Media (Primavera/Otoño)</label>
                                    <div className="relative">
                                      <input
                                        type="number"
                                        min="30"
                                        max="500"
                                        value={rateInputDraft.midSeason}
                                        onChange={(e) => setRateInputDraft({ ...rateInputDraft, midSeason: Number(e.target.value) })}
                                        className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-white font-mono text-xs focus:border-cyan-400 focus:outline-none"
                                      />
                                      <span className="absolute right-1.5 top-1 text-slate-400 text-[10px]">€</span>
                                    </div>
                                  </div>
                                  <div>
                                    <label className="block text-slate-400 mb-0.5">Alta (Julio)</label>
                                    <div className="relative">
                                      <input
                                        type="number"
                                        min="30"
                                        max="500"
                                        value={rateInputDraft.highSeasonJuly}
                                        onChange={(e) => setRateInputDraft({ ...rateInputDraft, highSeasonJuly: Number(e.target.value) })}
                                        className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-white font-mono text-xs focus:border-cyan-400 focus:outline-none"
                                      />
                                      <span className="absolute right-1.5 top-1 text-slate-400 text-[10px]">€</span>
                                    </div>
                                  </div>
                                  <div>
                                    <label className="block text-slate-400 mb-0.5">Punta (Agosto)</label>
                                    <div className="relative">
                                      <input
                                        type="number"
                                        min="30"
                                        max="500"
                                        value={rateInputDraft.peakSeasonAugust}
                                        onChange={(e) => setRateInputDraft({ ...rateInputDraft, peakSeasonAugust: Number(e.target.value) })}
                                        className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-white font-mono text-xs focus:border-cyan-400 focus:outline-none"
                                      />
                                      <span className="absolute right-1.5 top-1 text-slate-400 text-[10px]">€</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex justify-end gap-2 pt-1">
                                  <button
                                    type="button"
                                    onClick={() => handleSaveRates()}
                                    className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-[11px] font-bold cursor-pointer transition-colors shadow"
                                  >
                                    Guardar tarifas y recalcular
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        <div className="flex justify-between text-slate-400">
                          <span>Limpieza profesional, sábanas y toallas:</span>
                          <span className="text-emerald-400 font-semibold">Incluido</span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                          <span>Check-in presencial y asistencia telefónica 24/7:</span>
                          <span className="text-emerald-400 font-semibold">Incluido</span>
                        </div>
                        <div className="pt-2 border-t border-slate-700 flex justify-between items-baseline text-sm">
                          <span className="font-bold text-white">Importe total de la estancia:</span>
                          <span className="text-xl font-extrabold text-cyan-300 font-mono">{currentStayRate.totalPrice} €</span>
                        </div>
                      </div>

                      {/* Step 2: Contact Information */}
                      <div className="space-y-3 animate-fadeIn">
                        <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                          <Users className="w-4 h-4 text-cyan-400" />
                          2. Datos del titular de la reserva:
                        </h4>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs text-slate-300 mb-1">Nombre y Apellidos *</label>
                            <input
                              type="text"
                              required
                              placeholder="Ej. Carlos Martínez"
                              value={bookingDates.name}
                              onChange={(e) => setBookingDates({ ...bookingDates, name: e.target.value })}
                              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-xs text-slate-300 mb-1">Teléfono móvil (WhatsApp) *</label>
                            <input
                              type="tel"
                              required
                              placeholder="Ej. +34 600 000 000"
                              value={bookingDates.phone}
                              onChange={(e) => setBookingDates({ ...bookingDates, phone: e.target.value })}
                              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                            />
                          </div>

                          <div className="sm:col-span-2">
                            <label className="block text-xs text-slate-300 mb-1">Correo Electrónico *</label>
                            <input
                              type="email"
                              required
                              placeholder="Ej. carlos@correo.es"
                              value={bookingDates.email}
                              onChange={(e) => setBookingDates({ ...bookingDates, email: e.target.value })}
                              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                            />
                          </div>

                          <div className="sm:col-span-2">
                            <label className="block text-xs text-slate-300 mb-1">Observaciones o peticiones (opcional)</label>
                            <input
                              type="text"
                              placeholder="Ej. Hora de llegada prevista, cuna de viaje para bebé, plaza de parking..."
                              value={bookingDates.notes}
                              onChange={(e) => setBookingDates({ ...bookingDates, notes: e.target.value })}
                              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Actions / Buttons: WhatsApp always accessible, Confirm only when available */}
                  <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <a
                      href={generateWhatsAppUrl(activeApartment)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow cursor-pointer transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                      <span>Consultar por WhatsApp con mis fechas</span>
                    </a>

                    {hasSearchedAvailability && currentAvailability.isAvailable && (
                      <button
                        type="submit"
                        id="btn-confirm-reservation-request"
                        disabled={isSubmittingBooking}
                        className="w-full sm:w-auto px-6 py-3 rounded-xl text-white text-xs font-bold flex items-center justify-center gap-2 shadow transition-all cursor-pointer hover:brightness-110 active:scale-[0.98]"
                        style={{
                          backgroundColor: currentTheme.colors.primary
                        }}
                      >
                        <span>
                          {isSubmittingBooking ? 'Enviando solicitud...' : 'Confirmar Solicitud de Reserva'}
                        </span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </form>
              ) : (
                /* Instant Confirmation State */
                <div className="text-center py-6 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <Check className="w-8 h-8" />
                  </div>

                  <div>
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                      ¡Solicitud Enviada con Éxito!
                    </span>
                    <h4 className="text-xl font-bold text-white">
                      Código de Pre-Reserva: <span className="font-mono text-cyan-300">{bookingReference}</span>
                    </h4>
                    <p className="text-xs text-slate-300 max-w-md mx-auto mt-2">
                      Hemos recibido tu solicitud para el <strong className="text-white">{activeApartment.name}</strong> en {activeApartment.town}. Te hemos enviado un correo a <strong className="text-white">{bookingDates.email}</strong> y un agente de Azahar Rentals se pondrá en contacto contigo en breve para confirmar la disponibilidad y el check-in.
                    </p>
                  </div>

                  <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-4 max-w-md mx-auto text-left text-xs space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Entrada:</span>
                      <span className="font-bold text-white">{formatToDDMMAAAA(bookingDates.checkIn)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Salida:</span>
                      <span className="font-bold text-white">{formatToDDMMAAAA(bookingDates.checkOut)} ({nightsCount} noches)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Huéspedes:</span>
                      <span className="font-bold text-white">{bookingDates.guests} personas</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-slate-700">
                      <span className="font-bold text-white">Total Estimado:</span>
                      <span className="font-bold text-cyan-300 font-mono text-sm">{totalPrice} €</span>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-center gap-3">
                    <a
                      href={generateWhatsAppUrl(activeApartment)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2"
                    >
                      <Phone className="w-4 h-4" />
                      <span>Agilizar confirmación por WhatsApp</span>
                    </a>
                    <button
                      onClick={() => setSelectedApartment(null)}
                      className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                    >
                      Cerrar
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Interactive Fullscreen Photo Lightbox / Gallery Viewer */}
      {galleryApartment && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-6 bg-black/95 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-5xl h-full max-h-[92vh] flex flex-col justify-between text-white">
            {/* Top Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-xs text-cyan-400 font-semibold">{galleryApartment.town} • Galería de fotos</span>
                <h3 className="text-base sm:text-lg font-bold text-white">{galleryApartment.name}</h3>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400 bg-slate-800 px-3 py-1 rounded-full font-mono">
                  Foto {galleryPhotoIndex + 1} de {galleryApartment.photos.length}
                </span>
                <button
                  onClick={() => setGalleryApartment(null)}
                  aria-label="Cerrar visor de fotos"
                  className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Main Photo Area with Navigation */}
            <div className="relative flex-1 flex items-center justify-center my-3 overflow-hidden">
              <button
                type="button"
                onClick={() => setGalleryPhotoIndex((prev) => (prev - 1 + galleryApartment.photos.length) % galleryApartment.photos.length)}
                aria-label="Foto anterior"
                className="absolute left-2 sm:left-4 z-10 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-sm border border-white/20 transition-all cursor-pointer hover:scale-110"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <img
                src={normalizePhotoUrl(galleryApartment.photos[galleryPhotoIndex]?.url || galleryApartment.photos[0]?.url)}
                alt={galleryApartment.photos[galleryPhotoIndex]?.caption || galleryApartment.name}
                className="max-h-[60vh] sm:max-h-[65vh] max-w-full object-contain rounded-xl shadow-2xl"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.dataset.fallbackTried) {
                    target.dataset.fallbackTried = 'true';
                    target.src = 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80';
                  }
                }}
              />

              <button
                type="button"
                onClick={() => setGalleryPhotoIndex((prev) => (prev + 1) % galleryApartment.photos.length)}
                aria-label="Foto siguiente"
                className="absolute right-2 sm:right-4 z-10 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-sm border border-white/20 transition-all cursor-pointer hover:scale-110"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Caption & Thumbnails */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <p className="text-center text-xs text-slate-300 font-medium truncate px-4">
                {galleryApartment.photos[galleryPhotoIndex]?.caption || galleryApartment.name}
              </p>

              {/* Thumbnails strip */}
              <div className="flex items-center justify-center gap-2 overflow-x-auto py-1 max-w-full">
                {galleryApartment.photos.map((ph, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setGalleryPhotoIndex(idx)}
                    className={`relative shrink-0 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                      idx === galleryPhotoIndex ? 'border-cyan-400 scale-105 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={normalizePhotoUrl(ph.url)}
                      alt=""
                      className="w-16 h-12 object-cover"
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (!target.dataset.fallbackTried) {
                          target.dataset.fallbackTried = 'true';
                          target.src = 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=300&q=80';
                        }
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Photo Management & Upload Modal for Peñíscola Apartment */}
      {isAdmin && isPhotoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl text-white">
            {/* Modal Header */}
            <div className="sticky top-0 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 p-4 sm:p-5 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    Fotos y Calendario iCal Booking - Peñíscola
                    <span className="text-xs font-mono font-normal text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/50">
                      {apartments.find((a) => a.id === 'apt-peniscola-primero')?.photos.length || 11} fotos
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Sincronización en tiempo real con Booking.com y gestión de fotos del apartamento.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsPhotoModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 sm:p-6 space-y-6">
              {/* Booking.com iCal Synchronization Panel */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-slate-800/90 to-slate-850/95 border border-cyan-500/40 shadow-lg space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-400/40 flex items-center justify-center text-blue-400">
                      <Calendar className="w-5 h-5 text-cyan-300" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        Sincronización de Calendario iCal (Booking.com)
                        <span className="text-[10px] font-semibold bg-blue-950 text-blue-300 border border-blue-500/40 px-2 py-0.5 rounded-full font-mono">
                          Booking Connect
                        </span>
                      </h4>
                      <p className="text-xs text-slate-400">
                        Al pulsar &quot;Reservar apartamento&quot;, el sistema consultará este calendario oficial para verificar fechas libres y tarifas.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="inline-flex items-center gap-1.5 text-[11px] text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-2.5 py-1 rounded-full font-medium">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      {icalEvents.length} reservas registradas
                    </span>
                  </div>
                </div>

                {/* Input field */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <Link2 className="w-3.5 h-3.5 text-cyan-400" />
                      <span>URL del Feed de Exportación iCal de Booking:</span>
                    </label>
                    <span className="text-[11px] text-slate-400">
                      Estado: <strong className="text-cyan-300 font-normal">{lastSyncTime}</strong>
                    </span>
                  </div>

                  <div className="relative">
                    <input
                      type="url"
                      value={icalInputDraft}
                      onChange={(e) => setIcalInputDraft(e.target.value)}
                      placeholder="https://ical.booking.com/v1/export?t=..."
                      className="w-full bg-slate-900/90 border border-slate-700 focus:border-cyan-400 rounded-xl px-3.5 py-2.5 text-xs text-cyan-200 font-mono focus:outline-none pr-10"
                    />
                    {icalInputDraft && (
                      <button
                        type="button"
                        onClick={() => setIcalInputDraft('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-1 cursor-pointer"
                        title="Borrar campo"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Success alert message */}
                {icalSuccessAlert && (
                  <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{icalSuccessAlert}</span>
                  </div>
                )}

                {/* Buttons: Guardar, Sincronizar, Restablecer */}
                <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleSaveIcal()}
                      disabled={isSyncingIcal || !icalInputDraft.trim()}
                      className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 shadow transition-colors cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{isSyncingIcal ? 'Sincronizando...' : 'Guardar iCal'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSaveIcal(icalInputDraft)}
                      disabled={isSyncingIcal}
                      className="px-3.5 py-2 rounded-xl bg-slate-700/80 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isSyncingIcal ? 'animate-spin' : ''}`} />
                      <span>Comprobar conexión ahora</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleResetIcal}
                      className="text-[11px] text-slate-400 hover:text-cyan-300 flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Restablecer URL oficial</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowBlockedDatesList(!showBlockedDatesList)}
                      className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer font-medium"
                    >
                      <span>{showBlockedDatesList ? 'Ocultar bloqueos' : `Ver ${icalEvents.length} fechas ocupadas`}</span>
                    </button>
                  </div>
                </div>

                {/* Collapsible View of Sync Periods */}
                {showBlockedDatesList && (
                  <div className="mt-3 p-3 bg-slate-900/95 rounded-xl border border-slate-700 text-xs space-y-2 max-h-48 overflow-y-auto">
                    <div className="flex items-center justify-between pb-1 border-b border-slate-800">
                      <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                        Períodos de reserva / bloqueo registrados en Booking.com:
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">Total: {icalEvents.length}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {icalEvents.map((evt, i) => (
                        <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-slate-800/80 border border-slate-700/60 text-[11px]">
                          <span className="font-mono text-cyan-300 font-semibold">
                            {formatIcalDateEs(evt.start)} → {formatIcalDateEs(evt.end)}
                          </span>
                          <span className="text-[10px] text-slate-400 truncate max-w-[120px]" title={evt.summary}>
                            {evt.summary}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Dynamic Rates Configuration for Booking.com */}
              <div className="p-4 rounded-2xl bg-slate-800/90 border border-cyan-500/50 space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-cyan-950 border border-cyan-500/60 flex items-center justify-center text-cyan-400">
                      <DollarSign className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <span>Configurador de Tarifas Booking.com (Peñíscola)</span>
                        <span className="text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-700/60 px-2 py-0.5 rounded font-mono">
                          Precios en tiempo real
                        </span>
                      </h4>
                      <p className="text-xs text-slate-400">
                        Indica los precios por noche configurados en tu extranet de Booking.com para que el pop-up calcule la tarifa exacta según las fechas de estancia.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Rates Alert */}
                {rateSuccessAlert && (
                  <div className="p-3 rounded-xl bg-emerald-950/90 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{rateSuccessAlert}</span>
                  </div>
                )}

                {/* Season Inputs Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
                  <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block truncate">
                      1. Baja (Invierno)
                    </span>
                    <span className="text-[10px] text-slate-500 block">Ene, Feb, Mar, Nov, Dic</span>
                    <div className="relative mt-1">
                      <input
                        type="number"
                        min="30"
                        max="500"
                        value={rateInputDraft.lowSeason}
                        onChange={(e) => setRateInputDraft({ ...rateInputDraft, lowSeason: Number(e.target.value) })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono text-sm font-bold focus:border-cyan-400 focus:outline-none pr-6"
                      />
                      <span className="absolute right-2 top-1.5 text-xs text-slate-400 font-mono">€</span>
                    </div>
                    <span className="text-[9px] text-cyan-400 block">Precio base actual</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block truncate">
                      2. Media (Primavera/Otoño)
                    </span>
                    <span className="text-[10px] text-slate-500 block">Abr, May, Jun, Sep, Oct</span>
                    <div className="relative mt-1">
                      <input
                        type="number"
                        min="30"
                        max="500"
                        value={rateInputDraft.midSeason}
                        onChange={(e) => setRateInputDraft({ ...rateInputDraft, midSeason: Number(e.target.value) })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono text-sm font-bold focus:border-cyan-400 focus:outline-none pr-6"
                      />
                      <span className="absolute right-2 top-1.5 text-xs text-slate-400 font-mono">€</span>
                    </div>
                    <span className="text-[9px] text-slate-400 block">Tarifa intermedia</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-amber-400 block truncate">
                      3. Alta (Julio)
                    </span>
                    <span className="text-[10px] text-slate-500 block">Mes completo de Julio</span>
                    <div className="relative mt-1">
                      <input
                        type="number"
                        min="30"
                        max="600"
                        value={rateInputDraft.highSeasonJuly}
                        onChange={(e) => setRateInputDraft({ ...rateInputDraft, highSeasonJuly: Number(e.target.value) })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono text-sm font-bold focus:border-cyan-400 focus:outline-none pr-6"
                      />
                      <span className="absolute right-2 top-1.5 text-xs text-slate-400 font-mono">€</span>
                    </div>
                    <span className="text-[9px] text-amber-400/90 block">Alta demanda playa</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-rose-400 block truncate">
                      4. Punta (Agosto)
                    </span>
                    <span className="text-[10px] text-slate-500 block">Mes completo de Agosto</span>
                    <div className="relative mt-1">
                      <input
                        type="number"
                        min="30"
                        max="800"
                        value={rateInputDraft.peakSeasonAugust}
                        onChange={(e) => setRateInputDraft({ ...rateInputDraft, peakSeasonAugust: Number(e.target.value) })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono text-sm font-bold focus:border-cyan-400 focus:outline-none pr-6"
                      />
                      <span className="absolute right-2 top-1.5 text-xs text-slate-400 font-mono">€</span>
                    </div>
                    <span className="text-[9px] text-rose-400/90 block">Máxima ocupación</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 space-y-1 col-span-2 sm:col-span-1">
                    <span className="text-[10px] uppercase font-bold text-purple-400 block truncate">
                      5. Semana Santa / Puentes
                    </span>
                    <span className="text-[10px] text-slate-500 block">Semana Santa y festivos</span>
                    <div className="relative mt-1">
                      <input
                        type="number"
                        min="30"
                        max="500"
                        value={rateInputDraft.easterHoliday}
                        onChange={(e) => setRateInputDraft({ ...rateInputDraft, easterHoliday: Number(e.target.value) })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono text-sm font-bold focus:border-cyan-400 focus:outline-none pr-6"
                      />
                      <span className="absolute right-2 top-1.5 text-xs text-slate-400 font-mono">€</span>
                    </div>
                    <span className="text-[9px] text-purple-400/90 block">Festividades clave</span>
                  </div>
                </div>

                {/* Custom Specific Date Ranges / Promotions */}
                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-700/80 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Períodos de Fechas Específicos o Promociones en Booking</span>
                    </span>
                    <span className="text-[10px] text-slate-400">Opcional para semanas concretas</span>
                  </div>

                  {/* Add form */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
                    <div>
                      <label className="block text-[10px] text-slate-400 mb-1">Nombre / Motivo</label>
                      <input
                        type="text"
                        placeholder="Ej. Fin de semana eventos"
                        value={newCustomLabel}
                        onChange={(e) => setNewCustomLabel(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-cyan-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 mb-1">Fecha Inicio</label>
                      <DatePickerInput
                        value={newCustomStart}
                        onChange={(val) => setNewCustomStart(val)}
                        min="2025-01-01"
                        bgClass="bg-slate-800 text-xs py-1.5"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 mb-1">Fecha Fin</label>
                      <DatePickerInput
                        value={newCustomEnd}
                        onChange={(val) => setNewCustomEnd(val)}
                        min={newCustomStart || '2025-01-01'}
                        bgClass="bg-slate-800 text-xs py-1.5"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 mb-1">Tarifa €/noche</label>
                      <div className="flex gap-1.5">
                        <div className="relative flex-1">
                          <input
                            type="number"
                            min="30"
                            max="800"
                            value={newCustomPrice}
                            onChange={(e) => setNewCustomPrice(Number(e.target.value))}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-white font-mono focus:border-cyan-400 focus:outline-none pr-5"
                          />
                          <span className="absolute right-1.5 top-1.5 text-[10px] text-slate-400">€</span>
                        </div>
                        <button
                          type="button"
                          onClick={handleAddCustomDateRange}
                          disabled={!newCustomStart || !newCustomEnd || !newCustomPrice}
                          className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors shrink-0"
                          title="Añadir período"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Añadir</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* List of custom ranges */}
                  {rateInputDraft.customDateRanges && rateInputDraft.customDateRanges.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[10px] font-semibold text-slate-400 block">
                        Períodos específicos activos:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {rateInputDraft.customDateRanges.map((rng) => (
                          <div
                            key={rng.id}
                            className="flex items-center justify-between p-2 rounded-lg bg-slate-800/90 border border-slate-700 text-xs"
                          >
                            <div>
                              <div className="font-semibold text-white text-[11px]">{rng.label}</div>
                              <div className="text-[10px] text-slate-400 font-mono">
                                {formatToDDMMAAAA(rng.startDate)} → {formatToDDMMAAAA(rng.endDate)}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-cyan-300 text-xs">
                                {rng.pricePerNight} €/noche
                              </span>
                              <button
                                type="button"
                                onClick={() => handleDeleteCustomRange(rng.id)}
                                className="p-1 text-slate-400 hover:text-red-400 rounded transition-colors cursor-pointer"
                                title="Eliminar período"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Real-time Simulator Test */}
                <div className="p-3 bg-cyan-950/40 rounded-xl border border-cyan-800/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                      <Calculator className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Simulador en Tiempo Real de Cálculo de Tarifas:</span>
                    </span>
                    <span className="text-[10px] text-slate-400">Comprueba qué precio verá el huésped</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="block text-[10px] text-slate-300 mb-1">Entrada prueba</label>
                      <DatePickerInput
                        value={simTestCheckIn}
                        onChange={(val) => setSimTestCheckIn(val)}
                        min="2025-01-01"
                        bgClass="bg-slate-900 text-xs py-1.5"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-300 mb-1">Salida prueba</label>
                      <DatePickerInput
                        value={simTestCheckOut}
                        onChange={(val) => setSimTestCheckOut(val)}
                        min={simTestCheckIn || '2025-01-01'}
                        bgClass="bg-slate-900 text-xs py-1.5"
                      />
                    </div>
                  </div>

                  {/* Simulator result */}
                  {(() => {
                    const sim = calculateBookingStayRate(simTestCheckIn, simTestCheckOut, rateInputDraft);
                    return (
                      <div className="p-2.5 rounded-lg bg-slate-900/90 border border-cyan-500/40 flex flex-wrap items-center justify-between gap-2 text-xs">
                        <div className="text-slate-300">
                          <span className="font-semibold text-white">{sim.nightsCount} noches</span> ({sim.dominantSeason})
                          <span className="text-slate-400 text-[11px] block">
                            Media calculada: <strong className="text-cyan-300 font-mono">{sim.averagePricePerNight} €</strong> / noche
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 block uppercase">Total estancia:</span>
                          <span className="text-base font-extrabold text-cyan-300 font-mono">{sim.totalPrice} €</span>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-700/60">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleSaveRates()}
                      className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center gap-1.5 shadow transition-colors cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Guardar Tarifas de Booking.com</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleResetDefaultRates}
                      className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1 border border-slate-700 transition-colors cursor-pointer"
                      title="Restablecer tarifas a valores recomendados"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Valores Recomendados</span>
                    </button>
                  </div>

                  <span className="text-[11px] text-slate-400">
                    Se guardan de inmediato y se aplican a todas las reservas del apartamento.
                  </span>
                </div>
              </div>

              {/* Notice */}
              <div className="p-3.5 rounded-xl bg-slate-800/80 border border-cyan-500/30 text-xs text-slate-300 flex items-start gap-3">
                <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p>
                    Galería fotográfica verificada: <span className="text-cyan-300 font-semibold">Terraza exterior panorámica</span> como foto principal, salón luminoso y vistas al Castillo Papa Luna.
                  </p>
                  <p className="text-slate-400">
                    Todas las imágenes están disponibles en alta resolución en el carrusel de la ficha del apartamento.
                  </p>
                </div>
              </div>

              {/* Upload Dropzone */}
              <div 
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  handleFilesSelected(e.dataTransfer.files);
                }}
                className="border-2 border-dashed border-cyan-500/40 hover:border-cyan-400 bg-slate-800/50 hover:bg-slate-800/80 rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 group"
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  multiple 
                  accept="image/*" 
                  className="hidden" 
                  onChange={(e) => handleFilesSelected(e.target.files)} 
                />
                <div className="w-12 h-12 rounded-full bg-cyan-500/10 group-hover:bg-cyan-500/20 text-cyan-400 flex items-center justify-center transition-colors">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                    Seleccionar fotos de tu equipo o arrastrar imágenes aquí
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Puedes seleccionar las 11 fotos a la vez (PNG, JPG, WebP)
                  </p>
                </div>
              </div>

              {/* Success alert */}
              {uploadSuccessMsg && (
                <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{uploadSuccessMsg}</span>
                </div>
              )}

              {/* Current Photos Grid */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Fotos actuales del apartamento (Peñíscola):
                  </h4>
                  <button
                    onClick={handleResetPhotos}
                    className="text-xs text-slate-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Restablecer</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {apartments
                    .find((a) => a.id === 'apt-peniscola-primero')
                    ?.photos.map((photo, idx) => {
                      const isPortada = idx === 0;

                      return (
                        <div
                          key={idx}
                          className={`relative rounded-xl overflow-hidden border p-2 flex flex-col justify-between transition-all ${
                            isPortada
                              ? 'bg-slate-800 border-cyan-400/80 ring-1 ring-cyan-400/50'
                              : 'bg-slate-800/60 border-slate-700/80 hover:border-slate-600'
                          }`}
                        >
                          <div className="relative aspect-[4/3] w-full rounded-lg overflow-hidden bg-slate-950 mb-2">
                            <img
                              src={normalizePhotoUrl(photo.url)}
                              alt={`Fotografía ${photo.caption} de alojamiento turístico en Peñíscola, Costa de Castellón`}
                              loading="lazy"
                              decoding="async"
                              referrerPolicy="no-referrer"
                              onError={(e) => {
                                const target = e.currentTarget;
                                if (!target.dataset.fallbackTried) {
                                  target.dataset.fallbackTried = 'true';
                                  target.src = 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80';
                                }
                              }}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-1.5 left-1.5 z-10">
                              {isPortada ? (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500 text-slate-950 shadow-md">
                                  ★ PORTADA
                                </span>
                              ) : (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-black/70 text-white backdrop-blur-sm">
                                  Carrusel #{idx + 1}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <p className="text-[11px] font-mono text-slate-300 truncate" title={photo.caption}>
                              {photo.caption}
                            </p>

                            {!isPortada && (
                              <button
                                type="button"
                                onClick={() => handleSetAsPortada(idx)}
                                className="w-full py-1 px-2 rounded-lg bg-slate-700 hover:bg-cyan-600 text-white text-[11px] font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1"
                              >
                                <span>Poner como Portada</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 p-4 sm:p-5 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Los cambios se aplican y guardan automáticamente en tu navegador.
              </span>
              <button
                onClick={() => setIsPhotoModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold cursor-pointer transition-colors shadow-lg"
              >
                Cerrar y Ver Apartamento
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
