import React, { useEffect } from 'react';
import { 
  Home, 
  Calculator, 
  ShieldCheck, 
  TrendingUp, 
  MapPin, 
  Award, 
  CheckCircle2, 
  BarChart3
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { RevenueSimulator } from '../components/RevenueSimulator';
import { Footer } from '../components/Footer';
import { useTheme } from '../context/ThemeContext';
import { MUNICIPALITIES_MARKET_DATA } from '../data/marketStats';
import { updatePageSeo } from '../utils/seo';
import { getSimulatorSeoForMunicipality } from '../seo/routeMeta';
import {
  MUNICIPALITY_LIST,
  MUNICIPALITY_PROFILES,
  MunicipalitySlug,
} from '../data/municipalitySeoData';

interface SimulatorPageProps {
  initialLocation?: string;
  initialBedrooms?: number;
  municipalitySlug?: MunicipalitySlug | null;
  onNavigateHome: (sectionId?: string) => void;
  onOpenLicenseModal: () => void;
  onOpenContact: (data?: any) => void;
  onNavigateToAdmin?: () => void;
  onNavigateToLaundry?: (municipalitySlug?: MunicipalitySlug | null) => void;
  onNavigateToApartments?: (apartmentId?: string, municipalitySlug?: MunicipalitySlug | null) => void;
  onNavigateToSimulator?: (location?: string, bedrooms?: number, municipalitySlug?: MunicipalitySlug | null) => void;
}

export const SimulatorPage: React.FC<SimulatorPageProps> = ({
  initialLocation = 'peniscola',
  initialBedrooms = 2,
  municipalitySlug = null,
  onNavigateHome,
  onOpenLicenseModal,
  onOpenContact,
  onNavigateToAdmin,
  onNavigateToLaundry,
  onNavigateToApartments,
  onNavigateToSimulator
}) => {
  const { currentTheme } = useTheme();
  const municipalityProfile = municipalitySlug ? MUNICIPALITY_PROFILES[municipalitySlug] : null;
  const pageSeoMeta = getSimulatorSeoForMunicipality(municipalitySlug);
  const resolvedLocation = municipalityProfile?.marketStatsId || initialLocation;

  // Scroll to top and update document title & SEO metadata on mount / route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    updatePageSeo({
      title: pageSeoMeta.title,
      description: pageSeoMeta.description,
      path: pageSeoMeta.canonicalPath,
      image: pageSeoMeta.image,
      robots: pageSeoMeta.robots
    });
  }, [pageSeoMeta]);

  const municipalityList = Object.values(MUNICIPALITIES_MARKET_DATA);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col selection:bg-cyan-600 selection:text-white">
      
      {/* Top Header - Exact same Navbar as the main page */}
      <Navbar
        currentPage="simulator"
        onOpenLicenseModal={onOpenLicenseModal}
        onOpenCalculator={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        onNavigateToSimulator={() => {
          if (onNavigateToSimulator && municipalitySlug) {
            onNavigateToSimulator(undefined, 2, null);
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
        onNavigateToLaundry={() => {
          if (onNavigateToLaundry) onNavigateToLaundry(municipalitySlug);
        }}
        onNavigateToApartments={(aptId) => {
          if (onNavigateToApartments) onNavigateToApartments(aptId, municipalitySlug);
        }}
        onNavigateToHome={onNavigateHome}
        onNavigateToAdmin={onNavigateToAdmin}
        onOpenContact={() => onOpenContact()}
      />

      {/* Navigation Breadcrumb Bar */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-xs text-slate-500 flex-wrap" aria-label="Breadcrumb">
            <button 
              type="button"
              onClick={() => onNavigateHome()}
              className="hover:text-blue-600 transition-colors flex items-center gap-1 cursor-pointer font-medium"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Inicio</span>
            </button>
            <span aria-hidden="true">/</span>
            <a
              href="/simulador"
              onClick={(e) => {
                if (onNavigateToSimulator) {
                  e.preventDefault();
                  onNavigateToSimulator(undefined, 2, null);
                }
              }}
              className={`hover:text-blue-600 transition-colors cursor-pointer ${
                !municipalityProfile ? 'text-slate-900 font-semibold' : ''
              }`}
            >
              Simulador de Rentabilidad Castellón
            </a>
            {municipalityProfile && (
              <>
                <span aria-hidden="true">/</span>
                <span className="text-slate-900 font-semibold" aria-current="page">
                  {municipalityProfile.name}
                </span>
              </>
            )}
          </nav>
        </div>
      </div>

      {/* Main Container */}
      <main className="flex-grow">
        
        {/* Page Hero Header - Single H1 for Technical SEO */}
        <section className="relative pt-12 pb-8 px-4 sm:px-6 lg:px-8 border-b border-slate-800/80 overflow-hidden">
          {/* Ambient light glow */}
          <div 
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] rounded-full blur-3xl opacity-20 pointer-events-none"
            style={{ backgroundColor: currentTheme.colors.primary }}
          />

          <div className="max-w-4xl mx-auto text-center space-y-4 relative z-10">
            
            {/* Tag Badge */}
            <div 
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider"
              style={{
                backgroundColor: `${currentTheme.colors.primary}25`,
                borderColor: `${currentTheme.colors.primary}60`,
                color: currentTheme.colors.primaryLight
              }}
            >
              <Calculator className="w-4 h-4" style={{ color: currentTheme.colors.accent }} />
              <span>
                {municipalityProfile
                  ? municipalityProfile.simulatorSeo.badge
                  : 'Herramienta Oficial para Propietarios'}
              </span>
            </div>

            {/* Single H1 on page */}
            <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight ${currentTheme.typography.headingFontClass}`}>
              {municipalityProfile
                ? municipalityProfile.simulatorSeo.h1
                : 'Simulador Interactivo de Rentabilidad 2025 / 2026: Alquiler Vacacional en Castellón'}
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-3xl mx-auto">
              {municipalityProfile ? (
                <>
                  {municipalityProfile.simulatorSeo.subtitle}{' '}
                  <strong className="text-cyan-300">{municipalityProfile.simulatorSeo.localHighlight}</strong>
                </>
              ) : (
                <>
                  Calcula con precisión matemática los ingresos brutos y netos anuales de tu vivienda en la Costa de Azahar. Algoritmo calibrado con <strong>estadísticas reales de AirDNA y Turisme Comunitat Valenciana</strong>, discriminando ADR por temporada y número de habitaciones.
                </>
              )}
            </p>

            {/* Municipality Switcher */}
            <nav
              aria-label="Simulador de rentabilidad por municipio de Castellón"
              className="pt-3 flex flex-wrap justify-center gap-2"
            >
              <a
                href="/simulador"
                onClick={(e) => {
                  if (onNavigateToSimulator) {
                    e.preventDefault();
                    onNavigateToSimulator('peniscola', 2, null);
                  }
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                  !municipalitySlug
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                    : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:text-white'
                }`}
              >
                Toda Castellón
              </a>
              {MUNICIPALITY_LIST.map((m) => {
                const isActive = municipalitySlug === m.slug;
                return (
                  <a
                    key={m.slug}
                    href={m.simulatorSeo.canonicalPath}
                    onClick={(e) => {
                      if (onNavigateToSimulator) {
                        e.preventDefault();
                        onNavigateToSimulator(m.marketStatsId, 2, m.slug);
                      }
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1 ${
                      isActive
                        ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                        : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:text-white'
                    }`}
                  >
                    <MapPin className={`w-3 h-3 ${isActive ? 'text-slate-950' : 'text-cyan-400'}`} />
                    <span>{m.name}</span>
                  </a>
                );
              })}
            </nav>

            {/* Key trust bullets */}
            <div className="pt-2 flex flex-wrap justify-center gap-3 sm:gap-6 text-xs text-slate-300">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Datos de ocupación real por temporada</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Impacto de Licencia Turística GVA</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Comparativa neta vs. Alquiler tradicional</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Descarga de informe de tasación PDF</span>
              </div>
            </div>

          </div>
        </section>

        {/* The Revenue Simulator Component */}
        <div className="relative">
          <RevenueSimulator
            key={`${resolvedLocation}-${initialBedrooms}`}
            initialLocation={resolvedLocation}
            initialBedrooms={initialBedrooms}
            onOpenLicenseModal={onOpenLicenseModal}
            onOpenContact={onOpenContact}
          />
        </div>

        {/* Detailed Market Comparison Table */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-950/60 border-t border-slate-800">
          <div className="max-w-7xl mx-auto space-y-8">
            
            <div className="text-center max-w-3xl mx-auto space-y-2">
              <span className="text-xs uppercase font-bold text-cyan-400 tracking-wider">
                Benchmark Sectorial Costa de Azahar
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Rentabilidad Media Estimada por Municipio en Castellón
              </h2>
              <p className="text-sm text-slate-400">
                Datos promedio de viviendas turísticas gestionadas profesionalmente en 2024 / 2025.
              </p>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl">
              <table className="w-full text-left text-xs sm:text-sm text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[11px] font-bold tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-4 px-4 sm:px-6">Municipio (Costa de Castellón)</th>
                    <th className="py-4 px-4 sm:px-6">Ingresos Brutos (Base 2 hab.)</th>
                    <th className="py-4 px-4 sm:px-6">Ocupación Media Anual</th>
                    <th className="py-4 px-4 sm:px-6">ADR Temporada Alta</th>
                    <th className="py-4 px-4 sm:px-6">Neto Estimado Propietario</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {municipalityList.map((muni) => {
                    const bed = muni.bedroomsData[2] || Object.values(muni.bedroomsData)[0];
                    return (
                      <tr key={muni.id} className="hover:bg-slate-800/60 transition-colors">
                        <td className="py-4 px-4 sm:px-6 font-bold text-white">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
                            <span>{muni.name}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-normal block pl-6">
                            {muni.twoBedroomShare}
                          </span>
                        </td>
                        <td className="py-4 px-4 sm:px-6 font-mono text-cyan-300 font-semibold">
                          {bed.optimizedGrossAnnual.toLocaleString('es-ES')} € / año
                        </td>
                        <td className="py-4 px-4 sm:px-6">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-xs font-mono font-bold">
                            {bed.annualOccupancy}% ({bed.occupiedNights} noches)
                          </span>
                        </td>
                        <td className="py-4 px-4 sm:px-6 font-mono text-slate-200">
                          {bed.highSeasonADR} € / noche
                        </td>
                        <td className="py-4 px-4 sm:px-6 font-bold text-emerald-400 font-mono">
                          {bed.estimatedNetAnnual.toLocaleString('es-ES')} € / año
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

          </div>
        </section>

        {/* Methodology and Explanatory Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-900 border-t border-slate-800">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-700/60 flex items-center justify-center text-cyan-400 mb-2">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">1. ¿Cómo se calcula el ADR y la ocupación?</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  El simulador pondera las noches reservadas en 4 tramos anuales: Temporada Baja (invierno y entretiempo), Temporada Media (puentes, Semana Santa, mayo, junio, septiembre y octubre), Temporada Alta (julio) y Temporada Punta (agosto y festivales). Los precios se corrigen según piscina, vistas al mar, terraza y aire acondicionado.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-700/60 flex items-center justify-center text-cyan-400 mb-2">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">2. Impacto de la Licencia Turística (GVA)</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Tener el número oficial de Vivienda Turística (VT) otorgado por Turisme Comunitat Valenciana te permite operar legalmente en Booking, Airbnb y Vrbo. Cumplir con el Decreto Ley 9/2024 eleva el ADR hasta un 35% y te protege de multas municipales y autonómicas de hasta 100.000 €.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-700/60 flex items-center justify-center text-cyan-400 mb-2">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">3. Vacacional vs. Alquiler Tradicional</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Con Azahar Rentals, una vivienda turística en Peñíscola o Benicàssim genera de media entre un 35% y un 55% más de rentabilidad neta que un contrato de larga estancia de 5 años. Además, mantienes disponibilidad total de tu piso cuando quieras disfrutarlo tú mismo y eliminas el riesgo de morosidad o inquiocupación.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* Bottom CTA Banner */}
        <section className="py-14 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-t border-slate-800">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              ¿Quieres un informe de tasación in situ 100% personalizado?
            </h2>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto">
              Un gestor especialista de Azahar Rentals visitará tu piso en Peñíscola, Benicàssim, Vinaròs u Oropesa para calcular su potencial exacto y el plan de puesta a punto sin compromiso.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => onOpenContact({ location: initialLocation, bedrooms: initialBedrooms })}
                className="px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs sm:text-sm shadow-lg transition-all cursor-pointer"
              >
                Solicitar Visita y Valoración Gratuita
              </button>
              <button
                type="button"
                onClick={() => onNavigateHome()}
                className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs sm:text-sm border border-slate-700 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Home className="w-4 h-4 text-slate-400" />
                <span>Volver al Inicio</span>
              </button>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <Footer 
        onOpenLicenseModal={onOpenLicenseModal} 
        onOpenSimulator={() => {
          if (onNavigateToSimulator && municipalitySlug) {
            onNavigateToSimulator(undefined, 2, null);
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
        onNavigateToLaundry={(muniSlug) => {
          if (onNavigateToLaundry) onNavigateToLaundry(muniSlug ?? municipalitySlug);
        }}
        onNavigateToApartments={(aptId, muniSlug) => {
          if (onNavigateToApartments) onNavigateToApartments(aptId, muniSlug ?? municipalitySlug);
        }}
      />

    </div>
  );
};
