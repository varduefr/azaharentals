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
import { AdminView } from './components/admin/AdminView';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'simulator' | 'admin' | 'laundry'>('home');
  const [isLicenseModalOpen, setIsLicenseModalOpen] = useState(false);
  const [selectedTown, setSelectedTown] = useState('peniscola');
  const [selectedBedrooms, setSelectedBedrooms] = useState(2);
  const [contactInitialData, setContactInitialData] = useState<any>(null);

  // Initialize route from current browser URL & listen to browser back/forward buttons
  useEffect(() => {
    const parseUrlAndSetRoute = () => {
      const pathname = window.location.pathname;
      const hash = window.location.hash;
      const searchParams = new URLSearchParams(window.location.search);

      // 1. Pathname check takes absolute precedence over hash
      if (pathname === '/admin' || pathname.startsWith('/admin')) {
        setCurrentPage('admin');
        return;
      }
      if (pathname === '/laundry' || pathname.startsWith('/laundry')) {
        setCurrentPage('laundry');
        return;
      }
      if (pathname === '/simulador' || pathname.startsWith('/simulador') || pathname === '/simulador-rentabilidad') {
        setCurrentPage('simulator');
        const muni = searchParams.get('muni') || searchParams.get('town');
        const hab = searchParams.get('hab') || searchParams.get('bedrooms');
        if (muni) setSelectedTown(muni);
        if (hab) setSelectedBedrooms(Number(hab) || 2);
        return;
      }

      // 2. Fallbacks for query params or hash routing
      if (hash === '#/admin' || hash === '#admin' || searchParams.get('page') === 'admin') {
        setCurrentPage('admin');
      } else if (hash === '#/laundry' || hash === '#laundry' || searchParams.get('page') === 'laundry') {
        setCurrentPage('laundry');
      } else if (hash === '#/simulador' || hash === '#simulador' || searchParams.get('page') === 'simulador') {
        setCurrentPage('simulator');
        const muni = searchParams.get('muni') || searchParams.get('town');
        const hab = searchParams.get('hab') || searchParams.get('bedrooms');
        if (muni) setSelectedTown(muni);
        if (hab) setSelectedBedrooms(Number(hab) || 2);
      } else {
        setCurrentPage('home');
      }
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
    setCurrentPage('admin');
    try {
      window.history.pushState({ page: 'admin' }, '', '/admin');
      window.dispatchEvent(new PopStateEvent('popstate'));
    } catch {
      window.location.hash = '#/admin';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToLaundry = () => {
    setCurrentPage('laundry');
    try {
      window.history.pushState({ page: 'laundry' }, '', '/laundry');
      window.dispatchEvent(new PopStateEvent('popstate'));
    } catch {
      window.location.hash = '#/laundry';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToSimulator = (location?: string, bedrooms?: number) => {
    if (location) setSelectedTown(location);
    if (bedrooms) setSelectedBedrooms(bedrooms);

    const locToUse = location || selectedTown;
    const bedToUse = bedrooms || selectedBedrooms;

    setCurrentPage('simulator');

    try {
      const targetUrl = `/simulador?muni=${encodeURIComponent(locToUse)}&hab=${bedToUse}`;
      window.history.pushState({ page: 'simulator', town: locToUse, bedrooms: bedToUse }, '', targetUrl);
      window.dispatchEvent(new PopStateEvent('popstate'));
    } catch {
      window.location.hash = '#/simulador';
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToHome = (sectionId?: string) => {
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
          onNavigateHome={navigateToHome}
          onNavigateToAdmin={navigateToAdmin}
          onNavigateToLaundry={navigateToLaundry}
          onOpenLicenseModal={() => setIsLicenseModalOpen(true)}
          onOpenContact={handleOpenContact}
        />
      ) : currentPage === 'laundry' ? (
        /* 3. Dedicated Industrial Laundry Page (/laundry) */
        <LaundryPage
          onNavigateHome={navigateToHome}
          onNavigateToSimulator={() => navigateToSimulator()}
          onNavigateToAdmin={navigateToAdmin}
          onOpenLicenseModal={() => setIsLicenseModalOpen(true)}
          onOpenContact={handleOpenContact}
        />
      ) : (
        /* 4. Main Home Page */
        <>
          {/* Sticky Header / Navbar */}
          <Navbar
            currentPage="home"
            onOpenLicenseModal={() => setIsLicenseModalOpen(true)}
            onOpenCalculator={() => navigateToSimulator()}
            onNavigateToSimulator={() => navigateToSimulator()}
            onNavigateToLaundry={navigateToLaundry}
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

            {/* 3. Featured Vacation Rental Apartments Showcase */}
            <FeaturedApartmentsSection />

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
              onSelectTownForSimulation={(townId) => navigateToSimulator(townId, 2)}
              onOpenLicenseModal={() => setIsLicenseModalOpen(true)}
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
