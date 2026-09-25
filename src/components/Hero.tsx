import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  MapPin, 
  Calculator, 
  Award, 
  Star, 
  KeyRound, 
  TrendingUp, 
  FileCheck 
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface HeroProps {
  onQuickSimulate: (location: string, bedrooms: number) => void;
  onOpenLicenseModal: () => void;
  onOpenContact: () => void;
}

export const Hero: React.FC<HeroProps> = ({ 
  onQuickSimulate, 
  onOpenLicenseModal, 
  onOpenContact 
}) => {
  const { currentTheme } = useTheme();
  const [selectedLocation, setSelectedLocation] = useState('peniscola');
  const [selectedBedrooms, setSelectedBedrooms] = useState(2);
  const [needLicense, setNeedLicense] = useState(true);

  const handleSubmitQuick = (e: React.FormEvent) => {
    e.preventDefault();
    onQuickSimulate(selectedLocation, selectedBedrooms);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-white pt-10 pb-20 lg:pt-16 lg:pb-28">
      {/* Background hero image overlay with soft gradient */}
      <div className="absolute inset-0 z-0 opacity-25 mix-blend-luminosity">
        <img 
          src="/images/castellon_hero_1788275752376.jpg" 
          alt="Gestión integral de alojamientos turísticos en Castellón - Costa de Azahar y Peñíscola" 
          loading="eager"
          decoding="async"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
          onError={(e) => {
            const target = e.currentTarget;
            if (!target.dataset.fallbackTried) {
              target.dataset.fallbackTried = 'true';
              target.src = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80';
            }
          }}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-transparent z-0"></div>

      {/* Decorative ambient glow */}
      <div 
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-20"
        style={{ backgroundColor: currentTheme.colors.primary }}
      ></div>
      <div 
        className="absolute bottom-10 right-10 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-15"
        style={{ backgroundColor: currentTheme.colors.accent }}
      ></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Value Proposition & Copy */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Top Pill / Badge */}
            <div 
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold"
              style={{
                backgroundColor: `${currentTheme.colors.primary}20`,
                borderColor: `${currentTheme.colors.primary}50`,
                color: currentTheme.colors.primaryLight
              }}
            >
              <Sparkles className="w-3.5 h-3.5" style={{ color: currentTheme.colors.accent }} />
              <span>Líderes en Gestión Turística en Costa de Castellón</span>
            </div>

            {/* Main Headline - SINGLE H1 ON PAGE */}
            <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight ${currentTheme.typography.headingFontClass}`}>
              Gestión Integral de{' '}
              <span 
                className="text-transparent bg-clip-text"
                style={{
                  backgroundImage: `linear-gradient(to right, ${currentTheme.colors.primaryLight}, ${currentTheme.colors.accentLight || '#fff'})`
                }}
              >
                Alojamientos Turísticos en Castellón
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-normal">
              Multiplica la rentabilidad de tu apartamento en <strong className="text-white">Peñíscola, Vinaròs, Benicarló, Oropesa del Mar y Benicàssim</strong> sin mover un solo dedo. Nos encargamos de todo el ciclo: limpieza hotelera, check-in 24/7, precios dinámicos con IA y posicionamiento Superhost.
            </p>

            {/* CRITICAL USP BANNER IN HERO: LICENCIA TURÍSTICA */}
            <div 
              className="border rounded-2xl p-4 flex items-start gap-3 backdrop-blur-sm shadow-inner"
              style={{
                backgroundColor: `${currentTheme.colors.primary}18`,
                borderColor: `${currentTheme.colors.primary}45`
              }}
            >
              <div 
                className="p-2 rounded-xl text-white shrink-0"
                style={{ backgroundColor: currentTheme.colors.primary }}
              >
                <FileCheck className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white uppercase tracking-wide">
                    ¿No tienes Licencia Turística (VT)?
                  </span>
                  <span 
                    className="text-[10px] px-2 py-0.5 rounded text-slate-950 font-extrabold uppercase"
                    style={{ backgroundColor: currentTheme.colors.accent }}
                  >
                    Servicio Llave en Mano
                  </span>
                </div>
                <p className="text-xs text-slate-200 leading-normal">
                  <strong className="text-white">Nosotros tramitamos y te entregamos tu Licencia Oficial</strong> ante la Generalitat Valenciana y ayuntamientos locales para que alquiles 100% legal y sin sanciones.
                </p>
                <a
                  href="#contacto"
                  id="btn-hero-license-info"
                  aria-label="Contacta con un asesor para comprobar viabilidad de mi vivienda"
                  className="text-xs font-semibold underline inline-flex items-center gap-1 pt-1 cursor-pointer hover:opacity-90"
                  style={{ color: currentTheme.colors.accent }}
                >
                  <span>Contacta con un asesor para comprobar viabilidad de mi vivienda</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Key Bullet Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-200">
                <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: currentTheme.colors.primary }} />
                <span>+40% más de rentabilidad neta</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-200">
                <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: currentTheme.colors.primary }} />
                <span>Cero permanencia ni costes fijos</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-200">
                <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: currentTheme.colors.primary }} />
                <span>Usa tu apartamento cuando quieras</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-200">
                <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: currentTheme.colors.primary }} />
                <span>Cobro garantizado y seguro anti-daños</span>
              </div>
            </div>

            {/* Trust and Platform Badges */}
            <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-6 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="font-semibold text-slate-200">4.9/5</span>
                <span>(más de 480 valoraciones)</span>
              </div>
              <div className="h-4 w-px bg-slate-800 hidden sm:block"></div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium text-[11px]">
                  Airbnb Superhost
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium text-[11px]">
                  Booking.com Genius Partner
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium text-[11px]">
                  VRBO Premier Host
                </span>
              </div>
            </div>

          </div>

          {/* Right Column: Instant Simulation & Valuation Card */}
          <div className="lg:col-span-5">
            <div className={`bg-white text-slate-900 ${currentTheme.cardRadius} p-6 sm:p-8 shadow-2xl border border-slate-100 relative`}>
              
              {/* Card Header */}
              <div className="mb-6 space-y-1">
                <div className="flex items-center justify-between">
                  <span 
                    className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md"
                    style={{
                      backgroundColor: currentTheme.colors.primaryLight,
                      color: currentTheme.colors.primary,
                      border: `1px solid ${currentTheme.colors.primaryBorder}`
                    }}
                  >
                    Simulador Gratuito
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    Respuesta en 10 seg
                  </span>
                </div>
                <h3 className={`text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight ${currentTheme.typography.headingFontClass}`}>
                  ¿Cuánto puede generar tu vivienda?
                </h3>
                <p className="text-xs text-slate-600">
                  Calcula los ingresos anuales estimados según datos reales de ocupación en la Costa de Castellón.
                </p>
              </div>

              {/* Fast Form */}
              <form onSubmit={handleSubmitQuick} className="space-y-4">
                
                {/* Municipio / Zona */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Municipio en Costa de Castellón
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: currentTheme.colors.primary }} />
                    <select
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:border-transparent cursor-pointer"
                      style={{ outlineColor: currentTheme.colors.primary }}
                    >
                      <option value="peniscola">Peñíscola (Playa Norte, Sur, Casco Antiguo)</option>
                      <option value="vinaroz">Vinaròs (Playa Fortí, Fora Forat, Calas)</option>
                      <option value="benicarlo">Benicarló (Playa Morrongo, Puerto)</option>
                      <option value="oropesa">Oropesa del Mar (La Concha, Marina d'Or)</option>
                      <option value="alcossebre">Alcossebre / Alcalà de Xivert (Romana, Fuentes)</option>
                      <option value="benicassim">Benicàssim (Voramar, Heliópolis)</option>
                    </select>
                  </div>
                </div>

                {/* Dormitorios Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Número de dormitorios
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[1, 2, 3, 4].map((num) => (
                      <button
                        type="button"
                        key={num}
                        onClick={() => setSelectedBedrooms(num)}
                        className={`py-2.5 text-xs font-bold ${currentTheme.buttonRadius} border transition-all cursor-pointer ${
                          selectedBedrooms === num
                            ? 'text-white shadow-sm'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                        style={selectedBedrooms === num ? {
                          backgroundColor: currentTheme.colors.primary,
                          borderColor: currentTheme.colors.primary
                        } : {}}
                      >
                        {num === 4 ? '4+ hab' : `${num} hab`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Checkbox for tourist license */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                  <div className="flex items-start gap-2.5">
                    <input
                      type="checkbox"
                      id="hero-need-license-check"
                      checked={needLicense}
                      onChange={(e) => setNeedLicense(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded cursor-pointer"
                      style={{ accentColor: currentTheme.colors.primary }}
                    />
                    <label htmlFor="hero-need-license-check" className="text-xs text-slate-700 font-medium cursor-pointer">
                      <span className="font-bold text-slate-900">Necesito que tramitéis la Licencia Turística (VT)</span>
                      <p className="text-[11px] text-slate-600 mt-0.5">
                        Nos encargamos del certificado urbanístico y del alta oficial ante Turisme CV.
                      </p>
                    </label>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  id="btn-hero-simulate-submit"
                  className={`w-full py-3.5 px-6 ${currentTheme.buttonRadius} text-white font-extrabold text-sm tracking-wide shadow-lg transition-all flex items-center justify-center gap-2 group cursor-pointer hover:translate-y-[-1px]`}
                  style={{
                    backgroundColor: currentTheme.colors.primary
                  }}
                >
                  <Calculator className="w-4 h-4" />
                  <span>Ver Estimación Detallada de Ingresos</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <p className="text-center text-[11px] text-slate-500">
                  Sin compromiso · Simulación basada en tarifas reales de 2025/2026
                </p>

              </form>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

