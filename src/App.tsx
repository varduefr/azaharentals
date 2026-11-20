import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { TouristLicenseBanner } from './components/TouristLicenseBanner';
import { FeaturedApartmentsSection } from './components/FeaturedApartmentsSection';
import { PlatformsCarouselSection } from './components/PlatformsCarouselSection';
import { ServicesSection } from './components/ServicesSection';
import { CastellonLocationsSection } from './components/CastellonLocationsSection';
import { WhyUsComparison } from './components/WhyUsComparison';
import { OwnerTestimonials } from './components/OwnerTestimonials';
import { FaqSection } from './components/FaqSection';
import { ContactFormSection } from './components/ContactFormSection';
import { Footer } from './components/Footer';
import { FloatingActions } from './components/FloatingActions';
import { LicenseEligibilityModal } from './components/LicenseEligibilityModal';
import { SimulatorPage } from './pages/SimulatorPage';
import { LaundryPage } from './pages/LaundryPage';
import { ApartmentsPage } from './pages/ApartmentsPage';
import { AdminView } from './components/admin/AdminView';
import { updatePageSeo } from './utils/seo';
import {
  ADMIN_SEO,
  DEFAULT_HOME_SEO,
  getApartmentsSeoForMunicipality,
  getLaundrySeoForMunicipality,
  getSimulatorSeoForMunicipality,
} from './seo/routeMeta';
import {
  MUNICIPALITY_PROFILES,
  MunicipalitySlug,
  normalizeSlugText,
  resolveMunicipalitySlug,
} from './data/municipalitySeoData';

type AppPage = 'home' | 'simulator' | 'admin' | 'laundry' | 'apartments';

function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function resolveRouteFromLocation(): {
  page: AppPage;
  apartmentId: string | null;
  municipalitySlug: MunicipalitySlug | null;
  town?: string;
  bedrooms?: number;
} {
  if (typeof window === 'undefined') {
    return { page: 'home', apartmentId: null, municipalitySlug: null };
  }

  const decodedPathname = safeDecode(window.location.pathname).replace(/\/+$/, '') || '/';
  const normPath = normalizeSlugText(decodedPathname);
  const hash = window.location.hash;
  const searchParams = new URLSearchParams(window.location.search);

  // 1. Pathname check takes absolute precedence over hash
  if (normPath === '/admin' || normPath.startsWith('/admin/')) {
    return { page: 'admin', apartmentId: null, municipalitySlug: null };
  }

  // Industrial Laundry routes: /lavanderia-industrial & /lavanderia-industrial-<municipio>
  if (normPath.startsWith('/lavanderia-industrial-')) {
    const rawMuni = normPath.slice('/lavanderia-industrial-'.length).split('/')[0];
    const muniSlug = rawMuni === 'castellon' ? null : resolveMunicipalitySlug(rawMuni);
    return { page: 'laundry', apartmentId: null, municipalitySlug: muniSlug };
  }
  if (
    normPath === '/lavanderia-industrial' ||
    normPath.startsWith('/lavanderia-industrial/') ||
    normPath === '/laundry' ||
    normPath.startsWith('/laundry/')
  ) {
    return { page: 'laundry', apartmentId: null, municipalitySlug: null };
  }

  // Tourist Apartments routes: /apartamentos-turisticos-castellon & /apartamentos-turisticos-<municipio>
  if (normPath.startsWith('/apartamentos-turisticos-')) {
    const rawMuni = normPath.slice('/apartamentos-turisticos-'.length).split('/')[0];
    const muniSlug = rawMuni === 'castellon' ? null : resolveMunicipalitySlug(rawMuni);
    const aptId = searchParams.get('id') || searchParams.get('apt');
    return { page: 'apartments', apartmentId: aptId, municipalitySlug: muniSlug };
  }
  if (normPath === '/apartamentos' || normPath.startsWith('/apartamentos/')) {
    const aptId = searchParams.get('id') || searchParams.get('apt');
    return { page: 'apartments', apartmentId: aptId, municipalitySlug: null };
  }

  // Simulator routes: /simulador & /simulador-<municipio>
  if (normPath === '/simulador-rentabilidad' || normPath.startsWith('/simulador-rentabilidad/')) {
    const muni = searchParams.get('muni') || searchParams.get('town') || undefined;
    const hab = searchParams.get('hab') || searchParams.get('bedrooms');
    return {
      page: 'simulator',
      apartmentId: null,
      municipalitySlug: null,
      town: muni,
      bedrooms: hab ? Number(hab) || 2 : undefined,
    };
  }
  if (normPath.startsWith('/simulador-')) {
    const rawMuni = normPath.slice('/simulador-'.length).split('/')[0];
    const muniSlug = rawMuni === 'castellon' ? null : resolveMunicipalitySlug(rawMuni);
    const hab = searchParams.get('hab') || searchParams.get('bedrooms');
    return {
      page: 'simulator',
      apartmentId: null,
      municipalitySlug: muniSlug,
      town: muniSlug ? MUNICIPALITY_PROFILES[muniSlug].marketStatsId : undefined,
      bedrooms: hab ? Number(hab) || 2 : undefined,
    };
  }
  if (normPath === '/simulador' || normPath.startsWith('/simulador/')) {
    const muni = searchParams.get('muni') || searchParams.get('town') || undefined;
    const hab = searchParams.get('hab') || searchParams.get('bedrooms');
    return {
      page: 'simulator',
      apartmentId: null,
      municipalitySlug: null,
      town: muni,
      bedrooms: hab ? Number(hab) || 2 : undefined,
    };
  }

  // 2. Fallbacks for query params or hash routing
  if (hash === '#/admin' || hash === '#admin' || searchParams.get('page') === 'admin') {
    return { page: 'admin', apartmentId: null, municipalitySlug: null };
  }
  if (
    hash === '#/lavanderia-industrial' ||
    hash === '#lavanderia-industrial' ||
    hash === '#/laundry' ||
    hash === '#laundry' ||
    searchParams.get('page') === 'laundry' ||
    searchParams.get('page') === 'lavanderia-industrial'
  ) {
    return { page: 'laundry', apartmentId: null, municipalitySlug: null };
  }
  if (
    hash === '#/apartamentos-turisticos-castellon' ||
    hash === '#apartamentos-turisticos-castellon' ||
    searchParams.get('page') === 'apartamentos' ||
    searchParams.get('page') === 'apartamentos-turisticos-castellon'
  ) {
    const aptId = searchParams.get('id') || searchParams.get('apt');
    return { page: 'apartments', apartmentId: aptId, municipalitySlug: null };
  }
  if (hash === '#/simulador' || hash === '#simulador' || searchParams.get('page') === 'simulador') {
    const muni = searchParams.get('muni') || searchParams.get('town') || undefined;
    const hab = searchParams.get('hab') || searchParams.get('bedrooms');
    return {
      page: 'simulator',
      apartmentId: null,
      municipalitySlug: null,
      town: muni,
      bedrooms: hab ? Number(hab) || 2 : undefined,
    };
  }

  return { page: 'home', apartmentId: null, municipalitySlug: null };
}

export default function App() {
  const initialRoute = resolveRouteFromLocation();
  const [currentPage, setCurrentPage] = useState<AppPage>(initialRoute.page);
  const [selectedApartmentId, setSelectedApartmentId] = useState<string | null>(initialRoute.apartmentId);
  const [routeMunicipality, setRouteMunicipality] = useState<MunicipalitySlug | null>(
    initialRoute.municipalitySlug
  );
  const [isLicenseModalOpen, setIsLicenseModalOpen] = useState(false);
  const [selectedTown, setSelectedTown] = useState(initialRoute.town || 'peniscola');
  const [selectedBedrooms, setSelectedBedrooms] = useState(initialRoute.bedrooms || 2);
  const [contactInitialData, setContactInitialData] = useState<any>(null);

  // Sync SEO metadata whenever currentPage or routeMunicipality changes
  useEffect(() => {
    const seo =
      currentPage === 'apartments'
        ? getApartmentsSeoForMunicipality(routeMunicipality)
        : currentPage === 'laundry'
        ? getLaundrySeoForMunicipality(routeMunicipality)
        : currentPage === 'simulator'
        ? getSimulatorSeoForMunicipality(routeMunicipality)
        : currentPage === 'admin'
        ? ADMIN_SEO
        : DEFAULT_HOME_SEO;

    updatePageSeo({
      title: seo.title,
      description: seo.description,
      path: seo.canonicalPath,
      image: seo.image,
      robots: seo.robots,
    });
  }, [currentPage, routeMunicipality]);

  // Listen to browser back/forward buttons and popstate
  useEffect(() => {
    const parseUrlAndSetRoute = () => {
      const resolved = resolveRouteFromLocation();
      setCurrentPage(resolved.page);
      setSelectedApartmentId(resolved.apartmentId);
      setRouteMunicipality(resolved.municipalitySlug);
      if (resolved.town) setSelectedTown(resolved.town);
      if (resolved.bedrooms) setSelectedBedrooms(resolved.bedrooms);
    };

    parseUrlAndSetRoute();

    const handlePopState = () => {
      parseUrlAndSetRoute();
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  const navigateToAdmin = () => {
    setRouteMunicipality(null);
    setCurrentPage('admin');
    try {
      window.history.pushState({ page: 'admin' }, '', '/admin');
      window.dispatchEvent(new PopStateEvent('popstate'));
    } catch {
      window.location.hash = '#/admin';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToLaundry = (municipalitySlug?: MunicipalitySlug | null) => {
    const targetMuni = municipalitySlug ?? null;
    const targetUrl = targetMuni ? `/lavanderia-industrial-${targetMuni}` : '/lavanderia-industrial';
    setRouteMunicipality(targetMuni);
    setCurrentPage('laundry');
    try {
      window.history.pushState({ page: 'laundry', municipalitySlug: targetMuni }, '', targetUrl);
      window.dispatchEvent(new PopStateEvent('popstate'));
    } catch {
      window.location.hash = `#${targetUrl}`;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToApartments = (apartmentId?: string, municipalitySlug?: MunicipalitySlug | null) => {
    const targetMuni = municipalitySlug ?? null;
    const basePath = targetMuni ? `/apartamentos-turisticos-${targetMuni}` : '/apartamentos-turisticos-castellon';
    setSelectedApartmentId(apartmentId || null);
    setRouteMunicipality(targetMuni);
    setCurrentPage('apartments');
    try {
      const targetUrl = apartmentId
        ? `${basePath}?id=${encodeURIComponent(apartmentId)}`
        : basePath;
      window.history.pushState({ page: 'apartments', apartmentId, municipalitySlug: targetMuni }, '', targetUrl);
      window.dispatchEvent(new PopStateEvent('popstate'));
    } catch {
      window.location.hash = apartmentId
        ? `#${basePath}?id=${encodeURIComponent(apartmentId)}`
        : `#${basePath}`;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToSimulator = (
    location?: string,
    bedrooms?: number,
    municipalitySlug?: MunicipalitySlug | null
  ) => {
    const targetMuni = municipalitySlug ?? null;
    if (location) setSelectedTown(location);
    else if (targetMuni) setSelectedTown(MUNICIPALITY_PROFILES[targetMuni].marketStatsId);
    if (bedrooms) setSelectedBedrooms(bedrooms);

    const locToUse = location || (targetMuni ? MUNICIPALITY_PROFILES[targetMuni].marketStatsId : selectedTown);
    const bedToUse = bedrooms || selectedBedrooms;

    setRouteMunicipality(targetMuni);
    setCurrentPage('simulator');

    try {
      const targetUrl = targetMuni
        ? `/simulador-${targetMuni}`
        : `/simulador?muni=${encodeURIComponent(locToUse)}&hab=${bedToUse}`;
      window.history.pushState(
        { page: 'simulator', town: locToUse, bedrooms: bedToUse, municipalitySlug: targetMuni },
        '',
        targetUrl
      );
      window.dispatchEvent(new PopStateEvent('popstate'));
    } catch {
      window.location.hash = '#/simulador';
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToHome = (sectionId?: string) => {
    setRouteMunicipality(null);
    setCurrentPage('home');

    try {
      const targetUrl = sectionId ? `/#${sectionId}` : '/';
      window.history.pushState({ page: 'home' }, '', targetUrl);
      window.dispatchEvent(new PopStateEvent('popstate'));
    } catch {
      window.location.hash = sectionId ? `#${sectionId}` : '#/';
    }

    if (sectionId) {
      let attempts = 0;
      const tryScroll = () => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        } else if (attempts < 6) {
          attempts += 1;
          setTimeout(tryScroll, 60);
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      };
      setTimeout(tryScroll, 40);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleOpenContact = (data?: any) => {
    if (data) {
      setContactInitialData(data);
    }
    if (currentPage !== 'home') {
      navigateToHome('contacto');
    } else {
      const element = document.getElementById('contacto');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col selection:bg-blue-600 selection:text-white">
      
      {/* 1. Dedicated Admin Application */}
      {currentPage === 'admin' ? (
        <AdminView onBackToPublic={() => navigateToHome()} />
      ) : currentPage === 'simulator' ? (
        /* 2. Dedicated Simulator Page */
        <SimulatorPage
          initialLocation={selectedTown}
          initialBedrooms={selectedBedrooms}
          municipalitySlug={routeMunicipality}
          onNavigateHome={navigateToHome}
          onNavigateToAdmin={navigateToAdmin}
          onNavigateToLaundry={navigateToLaundry}
          onNavigateToApartments={navigateToApartments}
          onNavigateToSimulator={navigateToSimulator}
          onOpenLicenseModal={() => setIsLicenseModalOpen(true)}
          onOpenContact={handleOpenContact}
        />
      ) : currentPage === 'laundry' ? (
        /* 3. Dedicated Industrial Laundry Page (/lavanderia-industrial & /lavanderia-industrial-<muni>) */
        <LaundryPage
          municipalitySlug={routeMunicipality}
          onNavigateHome={navigateToHome}
          onNavigateToSimulator={navigateToSimulator}
          onNavigateToAdmin={navigateToAdmin}
          onNavigateToApartments={navigateToApartments}
          onNavigateToLaundry={navigateToLaundry}
          onOpenLicenseModal={() => setIsLicenseModalOpen(true)}
          onOpenContact={handleOpenContact}
        />
      ) : currentPage === 'apartments' ? (
        /* 4. Dedicated Tourist Apartments Page (/apartamentos-turisticos-castellon & /apartamentos-turisticos-<muni>) */
        <ApartmentsPage
          initialApartmentId={selectedApartmentId}
          municipalitySlug={routeMunicipality}
          onNavigateHome={navigateToHome}
          onNavigateToSimulator={navigateToSimulator}
          onNavigateToLaundry={navigateToLaundry}
          onNavigateToApartments={navigateToApartments}
          onNavigateToAdmin={navigateToAdmin}
          onOpenLicenseModal={() => setIsLicenseModalOpen(true)}
          onOpenContact={handleOpenContact}
        />
      ) : (
        /* 5. Main Home Page */
        <>
          {/* Sticky Header / Navbar */}
          <Navbar
            currentPage="home"
            onOpenLicenseModal={() => setIsLicenseModalOpen(true)}
            onOpenCalculator={() => navigateToSimulator()}
            onNavigateToSimulator={() => navigateToSimulator()}
            onNavigateToLaundry={navigateToLaundry}
            onNavigateToApartments={navigateToApartments}
            onNavigateToHome={navigateToHome}
            onNavigateToAdmin={navigateToAdmin}
            onOpenContact={() => handleOpenContact()}
          />

          {/* Main Content Sections */}
          <main className="flex-grow">
            
            {/* 1. Hero with instant value props & quick lead calculator (navigates directly to dedicated simulator page) */}
            <Hero
              onQuickSimulate={(loc, beds) => navigateToSimulator(loc, beds)}
              onOpenLicenseModal={() => setIsLicenseModalOpen(true)}
              onOpenContact={() => handleOpenContact()}
            />

            {/* 2. CRITICAL HIGHLIGHT: Tourist License Turnkey Banner (Licencias Turísticas Generalitat Valenciana) */}
            <TouristLicenseBanner
              onOpenModal={() => setIsLicenseModalOpen(true)}
              onOpenContact={() => handleOpenContact()}
            />

            {/* 3. Featured Vacation Rental Apartments Showcase - Clicking "Reservar apartamento" opens the new dedicated page */}
            <FeaturedApartmentsSection 
              onBookingClick={(apt) => navigateToApartments(apt.id)}
            />

            {/* 4.1 Platforms Booking & Distribution Carousel (BCN Flat Management style) */}
            <PlatformsCarouselSection />

            {/* 5. 360° Comprehensive Services breakdown */}
            <ServicesSection
              onOpenLicenseModal={() => setIsLicenseModalOpen(true)}
              onOpenContact={() => handleOpenContact()}
              onOpenSimulator={() => navigateToSimulator()}
              onNavigateToLaundry={navigateToLaundry}
            />

            {/* 5. Costa de Castellón Locations & Beaches Showcase (Vinaròs, Benicarló, Peñíscola, Oropesa, etc.) */}
            <CastellonLocationsSection
              onSelectTownForSimulation={(townId) =>
                navigateToSimulator(townId, 2, resolveMunicipalitySlug(townId))
              }
              onOpenLicenseModal={() => setIsLicenseModalOpen(true)}
              onNavigateToApartments={navigateToApartments}
              onNavigateToLaundry={navigateToLaundry}
            />

            {/* 6. Why Us & 3-Way Comparison Table (Azahar vs Particular vs Tradicional) */}
            <WhyUsComparison
              onOpenContact={() => handleOpenContact()}
              onOpenLicenseModal={() => setIsLicenseModalOpen(true)}
            />

            {/* 7. Owner Testimonials & Success Stories */}
            <OwnerTestimonials
              onOpenContact={() => handleOpenContact()}
            />

            {/* 9. Comprehensive FAQ Accordion */}
            <FaqSection
              onOpenLicenseModal={() => setIsLicenseModalOpen(true)}
              onOpenContact={() => handleOpenContact()}
            />

            {/* 10. Contact & Valuation Request Form */}
            <ContactFormSection
              initialData={contactInitialData}
              onOpenLicenseModal={() => setIsLicenseModalOpen(true)}
            />

          </main>

          {/* Footer */}
          <Footer
            onOpenLicenseModal={() => setIsLicenseModalOpen(true)}
            onOpenSimulator={() => navigateToSimulator()}
            onNavigateToLaundry={navigateToLaundry}
            onNavigateToApartments={navigateToApartments}
          />
        </>
      )}

      {/* Floating Instant Contact & WhatsApp */}
      <FloatingActions
        onOpenLicenseModal={() => setIsLicenseModalOpen(true)}
        onOpenCalculator={() => navigateToSimulator()}
      />

      {/* Interactive License Eligibility Checker Modal */}
      <LicenseEligibilityModal
        isOpen={isLicenseModalOpen}
        onClose={() => setIsLicenseModalOpen(false)}
        onSuccessSubmit={(data) => {
          setContactInitialData(data);
        }}
      />

    </div>
  );
}
