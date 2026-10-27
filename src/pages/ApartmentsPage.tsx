import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Building2, 
  Home, 
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
  CheckCircle2,
  RefreshCw,
  AlertTriangle,
  Sliders,
  Search,
  Images,
  Coffee,
  Car,
  Wifi,
  Wind,
  Tv,
  Utensils,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { PlatformsCarouselSection } from '../components/PlatformsCarouselSection';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import { updatePageSeo } from '../utils/seo';
import { FEATURED_APARTMENTS, FeaturedApartment, ApartmentPhoto } from '../data/featuredApartments';
import { 
  fetchApartments, 
  subscribeApartments, 
  sortApartments, 
  updateApartmentApi, 
  getStoredAdminToken, 
  sanitizeApartmentPhotos, 
  getLocalApartments 
} from '../services/apartmentService';
import { normalizePhotoUrl } from '../components/FeaturedApartmentsSection';
import { DatePickerInput, formatToDDMMAAAA } from '../components/DatePickerInput';
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
  getStoredBookingRates,
  getApartmentBookingRates,
  getDefaultRatesForApartment,
  saveStoredBookingRates,
  calculateBookingStayRate
} from '../utils/bookingRates';
import { sendEmailNotification } from '../services/emailService';

interface ApartmentsPageProps {
  initialApartmentId?: string | null;
  onNavigateHome: (sectionId?: string) => void;
  onNavigateToSimulator?: () => void;
  onNavigateToLaundry?: () => void;
  onNavigateToAdmin?: () => void;
  onOpenLicenseModal?: () => void;
  onOpenContact?: (data?: any) => void;
}

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

export const ApartmentsPage: React.FC<ApartmentsPageProps> = ({
  initialApartmentId,
  onNavigateHome,
  onNavigateToSimulator,
  onNavigateToLaundry,
  onNavigateToAdmin,
  onOpenLicenseModal = () => {},
  onOpenContact = () => {}
}) => {
  const { currentTheme } = useTheme();
  const { showSuccess } = useToast();

  // Apartment list state
  const [apartments, setApartments] = useState<FeaturedApartment[]>(() =>
    getLocalApartments().map((apt) => ({
      ...apt,
      photos: (apt.photos || []).map((p) => ({
        ...p,
        url: normalizePhotoUrl(p.url)
      }))
    }))
  );

  // Selected apartment for detailed booking view
  const [selectedApartment, setSelectedApartment] = useState<FeaturedApartment | null>(() => {
    if (initialApartmentId) {
      const match = getLocalApartments().find(a => a.id === initialApartmentId);
      return match || null;
    }
    return null;
  });

  // Admin access state
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

  // Update URL and SEO metadata
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    updatePageSeo({
      title: "Apartamentos Turísticos en Castellón | Alquiler Vacacional Verificado | Azahar Rentals",
      description: "Reserva los mejores apartamentos turísticos y vacacionales en la Costa de Castellón: Peñíscola, Benicarló y Alcover. Con licencias turísticas oficiales VT, check-in 24/7 y limpieza profesional hotelera.",
      path: "/apartamentos-turisticos-castellon",
      image: "https://www.azaharentals.com/images/peniscola_balcon_terraza_1788561222890.jpg"
    });

    return () => {
      updatePageSeo({
        title: "Gestión de Alojamientos Turísticos en Castellón | Azahar",
        description: "Gestión integral de alquiler vacacional y alojamientos turísticos en Castellón. Maximizamos la rentabilidad para propietarios y tramitamos tu licencia.",
        path: "/",
        image: "https://www.azaharentals.com/images/castellon_hero_1788275752376.jpg"
      });
    };
  }, []);

  // Sync apartments with database & real-time updates
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

        if (initialApartmentId) {
          const found = sanitized.find(a => a.id === initialApartmentId);
          if (found) {
            setSelectedApartment(found);
          }
        }
      }
    };

    fetchApartments().then(handleListUpdate).catch((e) => {
      console.warn('Usando catálogo local:', e);
    });

    const unsubscribe = subscribeApartments(handleListUpdate);
    const handleUpdate = () => {
      fetchApartments().then(handleListUpdate).catch(() => {});
    };

    window.addEventListener('azahar_apartments_updated', handleUpdate);
    window.addEventListener('focus', handleUpdate);

    return () => {
      unsubscribe();
      window.removeEventListener('azahar_apartments_updated', handleUpdate);
      window.removeEventListener('focus', handleUpdate);
    };
  }, [initialApartmentId]);

  // Card photo carousel indices
  const [activePhotoIndices, setActivePhotoIndices] = useState<Record<string, number>>({
    'apt-peniscola-primero': 0,
    'apt-benicarlo-marina': 0,
    'apt-benicarlo-morrongo': 0,
    'apt-alcover-rural': 0,
  });

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

  // Booking Form State
  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 3);
  const defaultCheckOutStr = tomorrow.toISOString().split('T')[0];

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
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);

  // iCal Availability and Rates State
  const [icalEvents, setIcalEvents] = useState<IcalBlockedEvent[]>(() => parseIcalContent(INITIAL_BOOKING_ICAL_SNAPSHOT));
  const [hasSearchedAvailability, setHasSearchedAvailability] = useState<boolean>(false);
  const [isSearchingAvailability, setIsSearchingAvailability] = useState<boolean>(false);
  const [bookingRates, setBookingRates] = useState<BookingSeasonRateConfig>(() =>
    getStoredBookingRates('apt-peniscola-primero')
  );
  const [rateInputDraft, setRateInputDraft] = useState<BookingSeasonRateConfig>(() =>
    getStoredBookingRates('apt-peniscola-primero')
  );
  const [rateSuccessAlert, setRateSuccessAlert] = useState<string>('');

  // Gallery Lightbox State
  const [galleryApartment, setGalleryApartment] = useState<FeaturedApartment | null>(null);
  const [galleryPhotoIndex, setGalleryPhotoIndex] = useState<number>(0);

  // Active apartment currently being viewed for booking
  const activeApartment = useMemo(() => {
    if (!selectedApartment) return null;
    return apartments.find((a) => a.id === selectedApartment.id) || selectedApartment;
  }, [selectedApartment, apartments]);

  // Open booking view for an apartment
  const handleSelectApartmentForBooking = (apt: FeaturedApartment) => {
    const latestApt = apartments.find((a) => a.id === apt.id) || apt;
    setSelectedApartment(latestApt);
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

    // Fetch iCal feed if configured
    const urlToFetch = latestApt.bookingIcalUrl || (latestApt.id === 'apt-peniscola-primero' ? (localStorage.getItem('booking_ical_apt-peniscola-primero') || DEFAULT_PENISCOLA_ICAL_URL) : '');
    if (urlToFetch) {
      fetchBookingIcalFeed(urlToFetch)
        .then((events) => {
          if (events && events.length > 0) {
            setIcalEvents(events);
          }
        })
        .catch(() => {});
    } else {
      setIcalEvents([]);
    }

    // Scroll smoothly to top of booking details
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Search availability in real time
  const handleSearchAvailability = async () => {
    if (!activeApartment) return;
    setIsSearchingAvailability(true);
    try {
      const urlToFetch = activeApartment.bookingIcalUrl || (activeApartment.id === 'apt-peniscola-primero' ? (localStorage.getItem('booking_ical_apt-peniscola-primero') || DEFAULT_PENISCOLA_ICAL_URL) : '');
      if (urlToFetch) {
        const events = await fetchBookingIcalFeed(urlToFetch);
        if (events && events.length > 0) {
          setIcalEvents(events);
        }
      }
    } catch (e) {
      console.warn('Consulta de disponibilidad completada');
    } finally {
      setTimeout(() => {
        setIsSearchingAvailability(false);
        setHasSearchedAvailability(true);
      }, 400);
    }
  };

  // Current booking availability calculation
  const currentAvailability = useMemo(() => {
    if (!activeApartment) return { isAvailable: true, conflictingEvent: null };
    const hasIcalFeed = Boolean(activeApartment.id === 'apt-peniscola-primero' || activeApartment.bookingIcalUrl);
    if (!hasIcalFeed) {
      return { isAvailable: true, conflictingEvent: null };
    }
    return checkAvailability(bookingDates.checkIn, bookingDates.checkOut, icalEvents);
  }, [activeApartment, bookingDates.checkIn, bookingDates.checkOut, icalEvents]);

  // Current stay rate calculation
  const currentStayRate = useMemo(() => {
    if (!activeApartment) {
      return {
        nightsCount: 1,
        totalPrice: 70,
        averagePricePerNight: 70,
        dominantSeason: 'Temporada Oficial',
        seasonBreakdown: [],
        nightsDetail: []
      };
    }
    return calculateBookingStayRate(
      bookingDates.checkIn,
      bookingDates.checkOut,
      bookingRates
    );
  }, [activeApartment, bookingDates.checkIn, bookingDates.checkOut, bookingRates]);

  const nightsCount = currentStayRate.nightsCount;
  const totalPrice = currentStayRate.totalPrice;

  // WhatsApp reservation link generator
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

  // Submit booking confirmation
  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeApartment) return;
    setIsSubmittingBooking(true);
    const randomRef = 'AZR-' + Math.floor(10000 + Math.random() * 90000);
    setBookingReference(randomRef);

    const totalEstimate = currentStayRate.totalPrice;

    await sendEmailNotification(
      `Nueva Pre-Reserva (${randomRef}): ${activeApartment.name} - ${bookingDates.name}`,
      {
        formType: 'solicitud_reserva',
        referenciaReserva: randomRef,
        apartamento: activeApartment.name,
        municipio: activeApartment.town,
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
      `Referencia: ${randomRef}. Hemos recibido tu solicitud para ${activeApartment.name}. Nos comunicaremos contigo para confirmar las fechas.`,
      {
        badge: 'Reserva Directa'
      }
    );
  };

  const handleSaveRates = (newRates?: BookingSeasonRateConfig) => {
    if (!activeApartment) return;
    const toSave = newRates || rateInputDraft;
    const targetAptId = activeApartment.id;
    saveStoredBookingRates(targetAptId, toSave);
    setBookingRates(toSave);
    setRateInputDraft(toSave);
    
    setApartments((prev) =>
      prev.map((a) => (a.id === targetAptId ? { ...a, rates: toSave } : a))
    );
    
    updateApartmentApi(targetAptId, { rates: toSave }).catch((err) => {
      console.warn('Error sincronizando tarifas en Firestore:', err);
    });

    setRateSuccessAlert('✓ Tarifas oficiales actualizadas con éxito.');
    setTimeout(() => setRateSuccessAlert(''), 6000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "RealEstateAgent",
            "name": "Azahar Rentals - Alquiler Vacacional y Turístico en Castellón",
            "url": "https://www.azaharentals.com/apartamentos-turisticos-castellon",
            "telephone": "+34637968999",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Castellón de la Plana",
              "addressRegion": "Castellón",
              "addressCountry": "ES"
            },
            "description": "Alquiler vacacional y apartamentos turísticos verificados en la Costa de Castellón: Peñíscola, Benicarló y Alcover con licencias turísticas oficiales VT.",
            "areaServed": ["Castellón", "Peñíscola", "Benicarló", "Vinaròs", "Oropesa del Mar", "Benicàssim", "Alcover"]
          })
        }}
      />

      {/* Shared Navbar */}
      <Navbar
        currentPage="apartments"
        onOpenLicenseModal={onOpenLicenseModal}
        onOpenCalculator={() => {
          if (onNavigateToSimulator) onNavigateToSimulator();
        }}
        onNavigateToSimulator={onNavigateToSimulator}
        onNavigateToLaundry={onNavigateToLaundry}
        onNavigateToApartments={() => {
          setSelectedApartment(null);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onNavigateToHome={onNavigateHome}
        onNavigateToAdmin={onNavigateToAdmin}
        onOpenContact={() => onOpenContact()}
      />

      {/* Navigation Breadcrumb Bar */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-xs text-slate-500" aria-label="Breadcrumb">
            <button 
              type="button"
              onClick={() => onNavigateHome()}
              className="hover:text-blue-600 transition-colors flex items-center gap-1 cursor-pointer font-medium"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Inicio</span>
            </button>
            <span aria-hidden="true">/</span>
            <button 
              type="button"
              onClick={() => {
                setSelectedApartment(null);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-blue-600 transition-colors cursor-pointer"
            >
              Apartamentos Turísticos
            </button>
            {activeApartment && (
              <>
                <span aria-hidden="true">/</span>
                <span className="text-slate-900 font-semibold" aria-current="page">
                  {activeApartment.name}
                </span>
              </>
            )}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow">
        {activeApartment ? (
          /* ================================================================= */
          /* VISTA 1: FICHA DE RESERVA DEL APARTAMENTO (INFO DEL POP-UP)     */
          /* ================================================================= */
          <div className="bg-slate-900 text-white min-h-[85vh] py-8 sm:py-12">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
              
              {/* Top back button & breadcrumb indicator */}
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedApartment(null);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Ver todos los 4 apartamentos</span>
                </button>

                <span className="text-xs text-emerald-400 font-mono bg-emerald-950/80 px-2.5 py-1 rounded border border-emerald-800/60">
                  {activeApartment.licenseNumber}
                </span>
              </div>

              {/* Booking Container */}
              <div className="bg-slate-900/90 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
                
                {/* Header Title */}
                <div className="bg-slate-800/90 border-b border-slate-700/80 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      {activeApartment.town} • Alquiler Vacacional Verificado
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                      {activeApartment.name}
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-300 mt-1">
                      {activeApartment.zone} • {activeApartment.town}, Costa de Castellón
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1.5 rounded-xl bg-cyan-950/80 border border-cyan-700/60 text-cyan-300 font-mono font-bold text-sm">
                      desde {activeApartment.basePricePerNight} € / noche
                    </span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5 sm:p-7 space-y-6">
                  {!bookingConfirmed ? (
                    <form onSubmit={handleConfirmBooking} className="space-y-6">
                      
                      {/* Section 0: Photos Showcase & Specs */}
                      <div className="bg-slate-800/80 rounded-2xl p-4 sm:p-6 border border-slate-700/80 space-y-5">
                        
                        {/* Header info row */}
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

                          {/* Badges */}
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

                        {/* 4 Photos Grid */}
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

                        {/* Services and Amenities */}
                        {(() => {
                          const rawList = (activeApartment.amenities && activeApartment.amenities.length > 0)
                            ? [...activeApartment.amenities]
                            : ['Parking privado', 'Cafetera Nespresso', 'Wifi 600Mb', 'Aire acondicionado', 'Piscina comunitaria', 'Terraza exterior', 'Ascensor', 'Lavavajillas'];

                          const filteredList = rawList.filter((item) => {
                            const lower = item.toLowerCase();
                            return !lower.includes('primera línea') && !lower.includes('primera linea');
                          });

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

                      {/* Step 1: Select Dates & Guests */}
                      <div className="space-y-3">
                        <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-cyan-400" />
                          <span>1. Selecciona las fechas de estancia y número de personas:</span>
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
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

                              <button
                                type="button"
                                onClick={handleSearchAvailability}
                                disabled={isSearchingAvailability}
                                id="btn-search-availability-page"
                                aria-label="Buscar disponibilidad según calendario en tiempo real"
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

                      {/* Availability Notice */}
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

                      {/* Price Breakdown and Step 2 Contact */}
                      {hasSearchedAvailability && currentAvailability.isAvailable && (
                        <>
                          <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-4 space-y-2.5 text-xs animate-fadeIn">
                            <div className="flex justify-between text-slate-300 items-baseline">
                              <span>Estancia seleccionada ({currentStayRate.nightsCount} {currentStayRate.nightsCount === 1 ? 'noche' : 'noches'}):</span>
                              <span className="font-mono font-semibold text-sm text-white">{currentStayRate.totalPrice} €</span>
                            </div>

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

                              {isAdmin && isEditingRatesInline && (
                                <div className="p-3 bg-slate-900/95 border border-cyan-500/40 rounded-xl space-y-2 mt-2">
                                  <div className="flex items-center justify-between text-[11px] font-bold text-cyan-300">
                                    <span>Modificar tarifas de {activeApartment.name}:</span>
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
                            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                              <Users className="w-4 h-4 text-cyan-400" />
                              <span>2. Datos del titular de la reserva:</span>
                            </h2>

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

                      {/* Actions */}
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
                            id="btn-confirm-reservation-page"
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
                        <h2 className="text-xl font-bold text-white">
                          Código de Pre-Reserva: <span className="font-mono text-cyan-300">{bookingReference}</span>
                        </h2>
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

                      <div className="pt-4 flex flex-wrap justify-center gap-3">
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
                          type="button"
                          onClick={() => {
                            setSelectedApartment(null);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
                        >
                          Ver otros apartamentos
                        </button>
                      </div>
                    </div>
                  )}
                </div>

              </div>

            </div>
          </div>
        ) : (
          /* ================================================================= */
          /* VISTA 2: LISTADO DE LOS 4 APARTAMENTOS (MISMO DISEÑO Y BREADCRUMB)*/
          /* ================================================================= */
          <div className="bg-slate-900 text-white py-12 sm:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              
              {/* Single H1 for Technical SEO on this Page */}
              <div className="text-center max-w-3xl mx-auto mb-12">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-950/80 border border-cyan-700/60 text-cyan-300 mb-3">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Alquiler Vacacional Turístico Verificado</span>
                </div>

                <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4 tracking-tight ${currentTheme.typography.headingFontClass}`}>
                  Apartamentos Turísticos y Vacacionales en Castellón
                </h1>

                <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
                  Alojamientos turísticos exclusivos gestionados con servicio hotelero 360°, número de registro oficial VT de la Generalitat Valenciana y atención 24 horas.
                </p>

                {/* Trust Badges */}
                <div className="mt-4 flex flex-wrap justify-center gap-4 text-xs text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Licencias VT oficiales verificadas</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Check-in flexible 24/7</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Lavandería y limpieza hotelera</span>
                  </div>
                </div>
              </div>

              {/* 4 Apartment Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {apartments.map((apt) => {
                  const currentPhotoIdx = activePhotoIndices[apt.id] || 0;
                  const currentPhoto = apt.photos[currentPhotoIdx] || apt.photos[0];

                  return (
                    <article
                      key={apt.id}
                      id={`card-page-${apt.id}`}
                      aria-label={`Alojamiento turístico ${apt.name} en ${apt.town}, Castellón`}
                      className="bg-slate-800/90 border border-slate-700/80 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col group hover:border-slate-600"
                    >
                      {/* Photo Carousel Container */}
                      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-950">
                        <img
                          src={normalizePhotoUrl(currentPhoto?.url)}
                          alt={`${apt.name} - ${currentPhoto?.caption || 'Foto del alojamiento vacacional'}`}
                          loading="lazy"
                          decoding="async"
                          onError={(e) => {
                            const target = e.currentTarget;
                            if (!target.dataset.fallbackTried) {
                              target.dataset.fallbackTried = 'true';
                              target.src = 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80';
                            }
                          }}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />

                        {/* Town & Location Tag */}
                        <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1">
                          <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-900/90 text-white backdrop-blur-md border border-slate-700/80 shadow-md flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-cyan-400" />
                            {apt.town}
                          </span>
                        </div>

                        {/* Photo Count Indicator */}
                        <div className="absolute top-2.5 right-2.5 z-10">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-medium bg-black/70 text-slate-200 backdrop-blur-md border border-white/10 flex items-center gap-1">
                            <Camera className="w-2.5 h-2.5 text-cyan-400" />
                            {currentPhotoIdx + 1}/{apt.photos.length}
                          </span>
                        </div>

                        {/* Navigation Arrows */}
                        {apt.photos.length > 1 && (
                          <>
                            <button
                              type="button"
                              onClick={(e) => handlePrevPhoto(e, apt.id, apt.photos.length)}
                              aria-label={`Foto anterior de ${apt.name}`}
                              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-all opacity-80 hover:opacity-100 hover:scale-110 cursor-pointer backdrop-blur-xs"
                            >
                              <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => handleNextPhoto(e, apt.id, apt.photos.length)}
                              aria-label={`Foto siguiente de ${apt.name}`}
                              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-all opacity-80 hover:opacity-100 hover:scale-110 cursor-pointer backdrop-blur-xs"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </>
                        )}
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
                          <h2 className="font-bold text-white text-base leading-snug group-hover:text-cyan-300 transition-colors mb-1 line-clamp-1">
                            {apt.name}
                          </h2>
                          <p className="text-xs text-slate-400 mb-3 flex items-center gap-1 line-clamp-1">
                            <span className="text-slate-300">{apt.zone}</span>
                          </p>

                          {/* Amenities Badges */}
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

                          {/* Specs Grid */}
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

                          {/* Highlight bullet */}
                          <p className="text-xs text-slate-300 leading-relaxed mb-4 line-clamp-2">
                            {apt.highlights[0]}
                          </p>
                        </div>

                        {/* Price & Action Button */}
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

                          <button
                            type="button"
                            onClick={() => handleSelectApartmentForBooking(apt)}
                            aria-label={`Reservar estancia en ${apt.name}`}
                            className="w-full py-2.5 px-4 text-xs font-bold text-white rounded-xl shadow-lg cursor-pointer flex items-center justify-center gap-2 transition-all duration-200 hover:brightness-110 active:scale-[0.98]"
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

              {/* Bottom Support Banner */}
              <div className="mt-14 p-5 sm:p-6 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3.5 text-left">
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">¿Buscas otra ubicación o fechas en la Costa de Castellón?</h3>
                    <p className="text-xs sm:text-sm text-slate-400">Gestionamos más de 45 viviendas turísticas entre Vinaròs, Benicarló, Peñíscola, Oropesa y Benicàssim.</p>
                  </div>
                </div>

                <a
                  href="https://wa.me/34637968999?text=Hola%20Azahar%20Rentals,%20busco%20alquiler%20vacacional%20en%20la%20Costa%20de%20Castell%C3%B3n"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-md transition-colors shrink-0"
                >
                  <Phone className="w-4 h-4" />
                  <span>Consultar por WhatsApp</span>
                </a>
              </div>

            </div>

            {/* Platforms Booking & Distribution Carousel (BCN Flat Management style) */}
            <div className="mt-16">
              <PlatformsCarouselSection />
            </div>
          </div>
        )}
      </main>

      {/* Lightbox / Gallery Viewer */}
      {galleryApartment && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-6 bg-black/95 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-5xl h-full max-h-[92vh] flex flex-col justify-between text-white">
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
                  type="button"
                  onClick={() => setGalleryApartment(null)}
                  aria-label="Cerrar visor de fotos"
                  className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

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

            <div className="space-y-2 pt-2 border-t border-slate-800">
              <p className="text-center text-xs text-slate-300 font-medium truncate px-4">
                {galleryApartment.photos[galleryPhotoIndex]?.caption || galleryApartment.name}
              </p>

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
                      alt={`Miniatura ${idx + 1}`}
                      className="w-14 h-10 object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Shared Footer */}
      <Footer
        onOpenLicenseModal={onOpenLicenseModal}
        onOpenSimulator={onNavigateToSimulator}
        onNavigateToLaundry={onNavigateToLaundry}
        onNavigateToApartments={() => {
          setSelectedApartment(null);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
};
