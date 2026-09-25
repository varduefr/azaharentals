import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  TrendingUp, 
  MapPin, 
  Check, 
  Building, 
  Sparkles, 
  Waves, 
  Sun, 
  Wind, 
  Award,
  ArrowRight,
  Download,
  Mail,
  Phone,
  ShieldCheck,
  CheckCircle2,
  BarChart2
} from 'lucide-react';
import { SimulationParams } from '../types';
import { calculateEstimatedRevenue } from '../utils/calculator';
import { MUNICIPALITIES_MARKET_DATA } from '../data/marketStats';
import { useTheme } from '../context/ThemeContext';
import { sendEmailNotification } from '../services/emailService';
import { useToast } from '../context/ToastContext';

interface RevenueSimulatorProps {
  initialLocation?: string;
  initialBedrooms?: number;
  onOpenLicenseModal: () => void;
  onOpenContact: (data?: any) => void;
}

export const RevenueSimulator: React.FC<RevenueSimulatorProps> = ({
  initialLocation = 'peniscola',
  initialBedrooms = 2,
  onOpenLicenseModal,
  onOpenContact
}) => {
  const { currentTheme } = useTheme();
  const { showSuccess } = useToast();
  const [params, setParams] = useState<SimulationParams>({
    location: initialLocation,
    bedrooms: initialBedrooms,
    bathrooms: 1,
    capacity: 4,
    hasPool: true,
    hasSeaView: true,
    hasTerrace: true,
    hasAirConditioning: true,
    qualityLevel: 'superior',
    hasLicense: 'no'
  });

  const [leadFormOpen, setLeadFormOpen] = useState(false);
  const [leadData, setLeadData] = useState({ name: '', email: '', phone: '' });
  const [leadSubmitted, setLeadSubmitted] = useState(false);

  const currentMuniData = useMemo(() => {
    const locKey = params.location.toLowerCase();
    return MUNICIPALITIES_MARKET_DATA[locKey] || MUNICIPALITIES_MARKET_DATA['peniscola'];
  }, [params.location]);

  const currentBedData = useMemo(() => {
    const bed = Math.min(4, Math.max(1, params.bedrooms));
    return currentMuniData.bedroomsData[bed] || currentMuniData.bedroomsData[2];
  }, [currentMuniData, params.bedrooms]);

  const result = useMemo(() => {
    return calculateEstimatedRevenue(params);
  }, [params]);

  const maxMonthAmount = useMemo(() => {
    return Math.max(...result.estimatedMonthlyBreakdown.map(m => m.amount));
  }, [result]);

  const [isSendingLead, setIsSendingLead] = useState(false);

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSendingLead(true);

    await sendEmailNotification(
      `Nuevo Lead Simulador: ${leadData.name} - ${params.location.toUpperCase()} (${result.estimatedAnnualGross} €/año)`,
      {
        formType: 'simulador_rentabilidad',
        nombre: leadData.name,
        telefono: leadData.phone,
        email: leadData.email,
        municipio: params.location,
        dormitorios: params.bedrooms,
        banos: params.bathrooms,
        capacidadHuespedes: params.capacity,
        piscina: params.hasPool ? 'Sí' : 'No',
        vistasAlMar: params.hasSeaView ? 'Sí' : 'No',
        terraza: params.hasTerrace ? 'Sí' : 'No',
        aireAcondicionado: params.hasAirConditioning ? 'Sí' : 'No',
        calidadAcabados: params.qualityLevel,
        licenciaActual: params.hasLicense,
        ingresosEstimadosAnuales: `${result.estimatedAnnualGross} €`,
        ocupacionMedia: `${result.estimatedOccupancyPercent}%`,
        precioMedioNoche: `${Math.round((result.highSeasonDailyRate + result.lowSeasonDailyRate) / 2)} €`
      }
    );

    setIsSendingLead(false);
    setLeadSubmitted(true);

    showSuccess(
      '¡Informe de rentabilidad solicitado!',
      `Hemos generado la auditoría para tu inmueble en ${params.location.toUpperCase()} (${result.estimatedAnnualGross.toLocaleString()} €/año est.). Un gestor turístico te contactará con el estudio completo.`,
      {
        badge: 'Simulador de Ingresos'
      }
    );

    setTimeout(() => {
      onOpenContact({
        ...params,
        ...leadData,
        estimatedRevenue: result.estimatedAnnualGross
      });
    }, 1200);
  };

  return (
    <section id="calculadora" className="py-16 sm:py-24 bg-slate-900 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div 
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider"
            style={{
              backgroundColor: `${currentTheme.colors.primary}20`,
              borderColor: `${currentTheme.colors.primary}50`,
              color: currentTheme.colors.primaryLight
            }}
          >
            <Calculator className="w-3.5 h-3.5" style={{ color: currentTheme.colors.accent }} />
            <span>Simulador Interactivo de Rentabilidad 2025 / 2026</span>
          </div>

          <h2 className={`text-2xl sm:text-4xl font-extrabold tracking-tight text-white ${currentTheme.typography.headingFontClass}`}>
            Tarifas e Ingresos Estimados: Simulador de Rentabilidad en Castellón
          </h2>

          <p className="text-sm sm:text-base text-slate-300">
            Ajusta los parámetros de tu vivienda en la Costa de Castellón. Calibrado con estadísticas reales de mercado (AirDNA y Turisme Comunitat Valenciana) con datos base oficiales de 2 habitaciones y extrapolación sectorial por capacidad para 3 y 4 habitaciones.
          </p>
        </div>

        {/* Simulator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Panel: Inputs Controls */}
          <div className={`lg:col-span-6 bg-slate-800/80 border border-slate-700/80 ${currentTheme.cardRadius} p-6 sm:p-8 backdrop-blur-sm space-y-6`}>
            
            <h3 className={`text-lg font-bold text-white flex items-center gap-2 border-b border-slate-700 pb-3 ${currentTheme.typography.headingFontClass}`}>
              <Building className="w-5 h-5" style={{ color: currentTheme.colors.primary }} />
              <span>Características de la propiedad</span>
            </h3>

            {/* Location selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Ubicación en Costa de Castellón
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { id: 'peniscola', name: 'Peñíscola' },
                  { id: 'vinaroz', name: 'Vinaròs' },
                  { id: 'benicarlo', name: 'Benicarló' },
                  { id: 'oropesa', name: 'Oropesa del Mar' },
                  { id: 'alcossebre', name: 'Alcossebre' },
                  { id: 'benicassim', name: 'Benicàssim' }
                ].map((loc) => (
                  <button
                    key={loc.id}
                    type="button"
                    onClick={() => setParams({ ...params, location: loc.id })}
                    className={`py-2.5 px-3 ${currentTheme.buttonRadius} text-xs font-bold border transition-all text-center cursor-pointer ${
                      params.location === loc.id
                        ? 'text-white shadow-md'
                        : 'bg-slate-900/60 border-slate-700 text-slate-300 hover:bg-slate-700/60'
                    }`}
                    style={params.location === loc.id ? {
                      backgroundColor: currentTheme.colors.primary,
                      borderColor: currentTheme.colors.primary
                    } : {}}
                  >
                    {loc.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Bedrooms & Bathrooms */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                    Dormitorios
                  </label>
                  <span className="text-[10px] font-bold text-cyan-300">
                    {currentBedData.isRealBase ? 'Base Real AirDNA' : currentBedData.bedrooms === 3 ? '+20% Familias' : currentBedData.bedrooms === 4 ? '+38% Grupos' : '0.78x Parejas'}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {[1, 2, 3, 4].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setParams({ ...params, bedrooms: n })}
                      className={`py-2 text-xs font-bold ${currentTheme.buttonRadius} border transition-all ${
                        params.bedrooms === n
                          ? 'text-white'
                          : 'bg-slate-900/60 border-slate-700 text-slate-400 hover:bg-slate-700'
                      }`}
                      style={params.bedrooms === n ? {
                        backgroundColor: currentTheme.colors.primary,
                        borderColor: currentTheme.colors.primary
                      } : {}}
                    >
                      {n === 4 ? '4+' : n}
                    </button>
                  ))}
                </div>
                <span className="text-[10px] text-slate-400 block mt-1.5 truncate">
                  {currentMuniData.name}: {currentBedData.guestCapacity}
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Nivel de acabados
                </label>
                <select
                  value={params.qualityLevel}
                  onChange={(e) => setParams({ ...params, qualityLevel: e.target.value as any })}
                  className="w-full py-2.5 px-3 bg-slate-900/90 border border-slate-700 rounded-lg text-xs text-white focus:outline-none"
                >
                  <option value="standard">Estándar / Funcional</option>
                  <option value="superior">Superior / Reformado</option>
                  <option value="luxury">Premium / Lujo en Playa</option>
                </select>
                <span className="text-[10px] text-slate-400 block mt-1.5">
                  Ajusta la tarifa según calidades
                </span>
              </div>
            </div>

            {/* Amenities Checkbox Toggles */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Equipamiento y Extras
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                
                <button
                  type="button"
                  onClick={() => setParams({ ...params, hasSeaView: !params.hasSeaView })}
                  className={`p-2.5 ${currentTheme.cardRadius} border text-xs font-medium flex items-center justify-between transition-all cursor-pointer ${
                    params.hasSeaView 
                      ? 'border-slate-500 text-white' 
                      : 'bg-slate-900/60 border-slate-700 text-slate-400'
                  }`}
                  style={params.hasSeaView ? {
                    backgroundColor: `${currentTheme.colors.primary}25`,
                    borderColor: currentTheme.colors.primary
                  } : {}}
                >
                  <span className="flex items-center gap-2">
                    <Waves className="w-4 h-4 text-cyan-400" />
                    Vistas al Mar
                  </span>
                  {params.hasSeaView && <Check className="w-3.5 h-3.5" style={{ color: currentTheme.colors.primaryLight }} />}
                </button>

                <button
                  type="button"
                  onClick={() => setParams({ ...params, hasPool: !params.hasPool })}
                  className={`p-2.5 ${currentTheme.cardRadius} border text-xs font-medium flex items-center justify-between transition-all cursor-pointer ${
                    params.hasPool 
                      ? 'border-slate-500 text-white' 
                      : 'bg-slate-900/60 border-slate-700 text-slate-400'
                  }`}
                  style={params.hasPool ? {
                    backgroundColor: `${currentTheme.colors.primary}25`,
                    borderColor: currentTheme.colors.primary
                  } : {}}
                >
                  <span className="flex items-center gap-2">
                    <Sun className="w-4 h-4 text-amber-400" />
                    Piscina Comunitaria
                  </span>
                  {params.hasPool && <Check className="w-3.5 h-3.5" style={{ color: currentTheme.colors.primaryLight }} />}
                </button>

                <button
                  type="button"
                  onClick={() => setParams({ ...params, hasTerrace: !params.hasTerrace })}
                  className={`p-2.5 ${currentTheme.cardRadius} border text-xs font-medium flex items-center justify-between transition-all cursor-pointer ${
                    params.hasTerrace 
                      ? 'border-slate-500 text-white' 
                      : 'bg-slate-900/60 border-slate-700 text-slate-400'
                  }`}
                  style={params.hasTerrace ? {
                    backgroundColor: `${currentTheme.colors.primary}25`,
                    borderColor: currentTheme.colors.primary
                  } : {}}
                >
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    Terraza / Balcón
                  </span>
                  {params.hasTerrace && <Check className="w-3.5 h-3.5" style={{ color: currentTheme.colors.primaryLight }} />}
                </button>

                <button
                  type="button"
                  onClick={() => setParams({ ...params, hasAirConditioning: !params.hasAirConditioning })}
                  className={`p-2.5 ${currentTheme.cardRadius} border text-xs font-medium flex items-center justify-between transition-all cursor-pointer ${
                    params.hasAirConditioning 
                      ? 'border-slate-500 text-white' 
                      : 'bg-slate-900/60 border-slate-700 text-slate-400'
                  }`}
                  style={params.hasAirConditioning ? {
                    backgroundColor: `${currentTheme.colors.primary}25`,
                    borderColor: currentTheme.colors.primary
                  } : {}}
                >
                  <span className="flex items-center gap-2">
                    <Wind className="w-4 h-4 text-teal-400" />
                    Aire Acondicionado
                  </span>
                  {params.hasAirConditioning && <Check className="w-3.5 h-3.5" style={{ color: currentTheme.colors.primaryLight }} />}
                </button>

              </div>
            </div>

            {/* Tourist License State */}
            <div 
              className={`p-3.5 border ${currentTheme.cardRadius} space-y-2`}
              style={{
                backgroundColor: `${currentTheme.colors.primary}15`,
                borderColor: `${currentTheme.colors.primary}40`
              }}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white uppercase tracking-wide flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" style={{ color: currentTheme.colors.primaryLight }} />
                  Estado de la Licencia Turística (VT)
                </span>
                <span 
                  className="text-[10px] text-slate-950 px-2 py-0.5 rounded font-extrabold"
                  style={{ backgroundColor: currentTheme.colors.accent }}
                >
                  Nosotros la tramitamos
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setParams({ ...params, hasLicense: 'no' })}
                  className={`py-2 px-3 ${currentTheme.buttonRadius} text-xs font-semibold border transition-all text-center ${
                    params.hasLicense === 'no'
                      ? 'text-white'
                      : 'bg-slate-900/80 text-slate-300 border-slate-700'
                  }`}
                  style={params.hasLicense === 'no' ? {
                    backgroundColor: currentTheme.colors.primary,
                    borderColor: currentTheme.colors.primary
                  } : {}}
                >
                  No tengo licencia (Tramitádmela)
                </button>
                <button
                  type="button"
                  onClick={() => setParams({ ...params, hasLicense: 'yes' })}
                  className={`py-2 px-3 ${currentTheme.buttonRadius} text-xs font-semibold border transition-all text-center ${
                    params.hasLicense === 'yes'
                      ? 'text-white'
                      : 'bg-slate-900/80 text-slate-300 border-slate-700'
                  }`}
                  style={params.hasLicense === 'yes' ? {
                    backgroundColor: currentTheme.colors.primary,
                    borderColor: currentTheme.colors.primary
                  } : {}}
                >
                  Ya tengo número VT oficial
                </button>
              </div>
            </div>

          </div>

          {/* Right Panel: Results & Breakdown */}
          <div className={`lg:col-span-6 bg-slate-800/95 border border-slate-700 ${currentTheme.cardRadius} p-6 sm:p-8 space-y-6 shadow-2xl relative`}>
            
            {/* Highlighted Gross Revenue */}
            <div 
              className={`border ${currentTheme.cardRadius} p-6 relative overflow-hidden`}
              style={{
                backgroundColor: `${currentTheme.colors.secondary}90`,
                borderColor: `${currentTheme.colors.primary}50`
              }}
            >
              <div className="relative z-10 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5" style={{ color: currentTheme.colors.primaryLight }}>
                  <TrendingUp className="w-4 h-4" />
                  Estimación de Ingresos Anuales
                </span>

                <div className="flex items-baseline gap-2">
                  <span className="text-4xl sm:text-5xl font-black tracking-tight text-white font-mono">
                    {result.estimatedAnnualGross.toLocaleString('es-ES')} €
                  </span>
                  <span className="text-xs font-medium" style={{ color: currentTheme.colors.primaryLight }}>/ año brutos</span>
                </div>

                <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-300 border-t border-slate-700/60">
                  <div>
                    <span className="text-slate-400">Beneficio Neto Estimado:</span>{' '}
                    <strong className="text-sm font-bold" style={{ color: currentTheme.colors.primaryLight }}>
                      {result.estimatedNetProfit.toLocaleString('es-ES')} €
                    </strong>
                  </div>
                  <div className="h-3 w-px bg-slate-700 hidden sm:block"></div>
                  <div>
                    <span className="text-slate-400">Tarifa media verano:</span>{' '}
                    <strong className="text-white font-bold">{result.highSeasonDailyRate} € / noche</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Vacation Rental Performance & Market Breakdown */}
            <div className="grid grid-cols-2 gap-4">
              <div className={`p-4 ${currentTheme.cardRadius} bg-slate-900/80 border border-slate-700/80 space-y-1`}>
                <span className="text-[11px] font-semibold text-slate-400 block">
                  Media Mercado Vacacional ({params.bedrooms} {params.bedrooms === 1 ? 'Hab' : 'Hab'})
                </span>
                <span className="text-xl font-bold text-slate-300 font-mono">
                  {result.marketAverageGross.toLocaleString('es-ES')} €
                </span>
                <p className="text-[10px] text-slate-400 leading-tight">
                  Media en {currentMuniData.name} sin gestión dinámica
                </p>
              </div>

              <div 
                className={`p-4 ${currentTheme.cardRadius} border space-y-1`}
                style={{
                  backgroundColor: `${currentTheme.colors.primary}20`,
                  borderColor: `${currentTheme.colors.primary}60`
                }}
              >
                <span className="text-[11px] font-bold block" style={{ color: currentTheme.colors.primaryLight }}>
                  Mejora con Azahar Rentals
                </span>
                <span className="text-xl font-extrabold text-white font-mono">
                  +{result.optimizationUplift.toLocaleString('es-ES')} € / año
                </span>
                <p className="text-[10px] text-slate-200 leading-tight">
                  Tarificación algorítmica y canal directo Superhost
                </p>
              </div>
            </div>

            {/* Tourist Rental Quick Specs */}
            <div className="grid grid-cols-3 gap-2 p-3 bg-slate-900/60 rounded-xl border border-slate-800 text-center text-xs">
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Capacidad</span>
                <span className="font-bold text-white text-[11px] sm:text-xs">{result.guestCapacity}</span>
              </div>
              <div className="border-x border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Noches/Año</span>
                <span className="font-bold text-white text-[11px] sm:text-xs font-mono">~{result.occupiedNights} noches</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Temp. Baja</span>
                <span className="font-bold text-white text-[11px] sm:text-xs font-mono">{result.lowSeasonDailyRate} €/noche</span>
              </div>
            </div>

            {/* Source authenticity banner */}
            <div className="px-3.5 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 flex items-center justify-between text-xs">
              <span className="text-slate-400 text-[11px]">
                {result.isRealBase ? (
                  <strong className="text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Dato Base Real Vacacional: Tipología de 2 hab (AirDNA & Turisme CV)
                  </strong>
                ) : (
                  <span className="text-cyan-300 font-medium">
                    Extrapolación vacacional: {result.extrapolationNote}
                  </span>
                )}
              </span>
              <span className="text-[10px] text-slate-500 font-mono shrink-0 ml-2">
                {currentMuniData.name}
              </span>
            </div>

            {/* Month-by-month occupancy chart representation */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs text-slate-400">
                <span className="font-semibold text-slate-300">Curva mensual de ingresos estimada</span>
                <span>Ocupación media anual: <strong style={{ color: currentTheme.colors.primaryLight }}>{result.estimatedOccupancyPercent}%</strong></span>
              </div>

              <div className={`grid grid-cols-12 gap-1.5 h-28 items-end bg-slate-900/90 p-3 ${currentTheme.cardRadius} border border-slate-700/60`}>
                {result.estimatedMonthlyBreakdown.map((m) => {
                  const heightPercent = Math.max(12, Math.round((m.amount / maxMonthAmount) * 100));
                  const isHighSeason = m.month === 'Jul' || m.month === 'Ago' || m.month === 'Jun' || m.month === 'Sep';
                  return (
                    <div key={m.month} className="flex flex-col items-center gap-1 h-full justify-end group relative">
                      {/* Tooltip on hover */}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 bg-slate-950 text-[10px] font-mono px-1.5 py-0.5 rounded text-white border border-slate-700 pointer-events-none whitespace-nowrap z-20">
                        {m.amount.toLocaleString()}€ ({m.occupancy}%)
                      </div>
                      <div
                        style={{ 
                          height: `${heightPercent}%`,
                          backgroundColor: isHighSeason ? currentTheme.colors.primary : undefined
                        }}
                        className={`w-full rounded-t-md transition-all duration-300 ${
                          !isHighSeason ? 'bg-slate-700 hover:bg-slate-600' : 'shadow-sm'
                        }`}
                      />
                      <span className="text-[9px] font-mono text-slate-400 font-semibold">{m.month}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CTA action to request full audit */}
            <div className="pt-2">
              {!leadFormOpen ? (
                <button
                  onClick={() => setLeadFormOpen(true)}
                  id="btn-simulator-request-audit"
                  className={`w-full py-3.5 px-6 ${currentTheme.buttonRadius} text-white font-extrabold text-xs sm:text-sm tracking-wide shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer hover:translate-y-[-1px]`}
                  style={{
                    backgroundColor: currentTheme.colors.primary
                  }}
                >
                  <Download className="w-4 h-4" />
                  <span>Descargar Auditoría Personalizada & Hablar con un Asesor</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <form onSubmit={handleLeadSubmit} className={`bg-slate-900 p-4 ${currentTheme.cardRadius} border border-slate-700 space-y-3 animate-in fade-in`}>
                  <h4 className={`text-xs font-bold text-white ${currentTheme.typography.headingFontClass}`}>
                    Introduce tus datos para enviarte el estudio detallado:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      required
                      placeholder="Tu Nombre"
                      value={leadData.name}
                      onChange={(e) => setLeadData({ ...leadData, name: e.target.value })}
                      className="px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none"
                    />
                    <input
                      type="tel"
                      required
                      placeholder="Teléfono (WhatsApp)"
                      value={leadData.phone}
                      onChange={(e) => setLeadData({ ...leadData, phone: e.target.value })}
                      className="px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none"
                    />
                    <input
                      type="email"
                      required
                      placeholder="Tu Correo"
                      value={leadData.email}
                      onChange={(e) => setLeadData({ ...leadData, email: e.target.value })}
                      className="px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="button"
                      onClick={() => setLeadFormOpen(false)}
                      className="text-xs text-slate-400 hover:text-white"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      id="btn-simulator-lead-send"
                      disabled={isSendingLead}
                      className={`px-5 py-2 text-white font-bold text-xs ${currentTheme.buttonRadius} shadow cursor-pointer flex items-center gap-1.5 disabled:opacity-75`}
                      style={{ backgroundColor: currentTheme.colors.primary }}
                    >
                      <span>{isSendingLead ? 'Enviando...' : 'Enviar Estudio a mi Correo'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </form>
              )}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

