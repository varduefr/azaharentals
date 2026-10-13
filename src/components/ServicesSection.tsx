import React, { useState } from 'react';
import { 
  FileCheck, 
  TrendingUp, 
  Globe, 
  KeyRound, 
  Sparkles, 
  Wrench, 
  LayoutDashboard,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { SERVICES_DATA } from '../data/services';
import { ServiceItem } from '../types';

interface ServicesSectionProps {
  onOpenLicenseModal: () => void;
  onOpenContact: () => void;
  onOpenSimulator?: () => void;
  onNavigateToLaundry?: () => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  FileCheck: <FileCheck className="w-6 h-6 text-blue-600" />,
  TrendingUp: <TrendingUp className="w-6 h-6 text-blue-600" />,
  Globe: <Globe className="w-6 h-6 text-blue-600" />,
  KeyRound: <KeyRound className="w-6 h-6 text-blue-600" />,
  Sparkles: <Sparkles className="w-6 h-6 text-blue-600" />,
  Wrench: <Wrench className="w-6 h-6 text-blue-600" />,
  LayoutDashboard: <LayoutDashboard className="w-6 h-6 text-blue-600" />
};

export const ServicesSection: React.FC<ServicesSectionProps> = ({ 
  onOpenLicenseModal, 
  onOpenContact,
  onOpenSimulator,
  onNavigateToLaundry
}) => {
  const [selectedServiceId, setSelectedServiceId] = useState<string>('licencia-turistica');

  const activeService = SERVICES_DATA.find(s => s.id === selectedServiceId) || SERVICES_DATA[0];

  return (
    <section id="servicios" className="py-20 bg-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Gestión 360° Integral sin Preocupaciones</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Servicios Integrales de Gestión de Alojamientos Turísticos en Castellón
          </h2>

          <p className="text-base text-slate-600 leading-relaxed">
            Inspirados en los mejores estándares europeos de hostelería, combinamos tecnología puntera con presencia física directa en los municipios de la Costa de Castellón.
          </p>
        </div>

        {/* Master-Detail Interactive View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Service navigation list */}
          <div className="lg:col-span-5 space-y-3" role="tablist" aria-label="Servicios de gestión vacacional">
            {SERVICES_DATA.map((service) => {
              const isSelected = service.id === selectedServiceId;
              return (
                <button
                  key={service.id}
                  id={`btn-service-${service.id}`}
                  role="tab"
                  aria-selected={isSelected}
                  aria-controls={`panel-service-${service.id}`}
                  onClick={() => setSelectedServiceId(service.id)}
                  className={`w-full p-4 rounded-3xl text-left transition-all border flex items-center justify-between cursor-pointer group ${
                    isSelected
                      ? 'bg-white border-blue-500 shadow-md shadow-blue-500/10 ring-2 ring-blue-500/20'
                      : 'bg-white/70 hover:bg-white border-slate-200/80 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`p-2.5 rounded-2xl transition-colors ${
                      isSelected ? 'bg-blue-100' : 'bg-slate-100 group-hover:bg-slate-200/70'
                    }`}>
                      {ICON_MAP[service.iconName] || <Sparkles className="w-5 h-5 text-blue-600" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-bold ${
                          isSelected ? 'text-slate-900' : 'text-slate-700'
                        }`}>
                          {service.title}
                        </span>
                        {service.badge && (
                          <span className="px-2 py-0.5 text-[10px] font-extrabold bg-blue-100 text-blue-800 rounded-md">
                            {service.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                        {service.shortDescription}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 transition-transform ${
                    isSelected ? 'text-blue-600 translate-x-1' : 'text-slate-400 group-hover:translate-x-0.5'
                  }`} />
                </button>
              );
            })}
          </div>

          {/* Right: Detailed Service Highlight */}
          <div className="lg:col-span-7">
            <article 
              id={`panel-service-${activeService.id}`}
              role="tabpanel"
              aria-label={`Detalle del servicio ${activeService.title}`}
              className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-6 relative overflow-hidden"
            >
              
              {/* Decorative top corner accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -z-0 pointer-events-none"></div>

              <div className="relative z-10 space-y-4">
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-100 text-blue-700 rounded-2xl">
                      {ICON_MAP[activeService.iconName]}
                    </div>
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-blue-700 block">
                        Servicio Especializado
                      </span>
                      <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                        {activeService.title}
                      </h3>
                    </div>
                  </div>

                  {activeService.badge && (
                    <span className="hidden sm:inline-block px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full shadow-sm">
                      {activeService.badge}
                    </span>
                  )}
                </div>

                <p className="text-sm text-slate-600 leading-relaxed pt-2">
                  {activeService.fullDescription}
                </p>

                {/* Key Checklist for this service */}
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                    ¿Qué incluye exactamente este servicio?
                  </h4>
                  <div className="space-y-2.5">
                    {activeService.bulletPoints.map((point, index) => (
                      <div key={index} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700">
                        <div className="p-0.5 bg-blue-100 text-blue-700 rounded-full mt-0.5 shrink-0">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>
                        <span className="leading-snug">{point}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Special callout when cleaning-laundry is selected */}
                {activeService.id === 'cleaning-laundry' && (
                  <div className="p-4 rounded-2xl bg-blue-50/90 border border-blue-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mt-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs font-bold text-blue-900">
                        <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
                        <span>Lavandería Industrial B2B para Hoteles, Pisos Turísticos, Gimnasios y Clínicas</span>
                      </div>
                      <p className="text-xs text-blue-800/90 leading-snug">
                        Tratamiento especializado de sábanas, toallas, batas sanitarias e uniformes con lavado, secado y planchado calandra industrial.
                      </p>
                    </div>
                  </div>
                )}

                {/* Action button inside service card */}
                <div className="pt-6 flex flex-col sm:flex-row items-center gap-3">
                  {activeService.id === 'licencia-turistica' ? (
                    <a
                      href="#contacto"
                      id="btn-service-request-license"
                      aria-label="Ir a la sección Estudio de Rentabilidad y Licencia Gratuito"
                      className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer hover:translate-y-[-1px]"
                    >
                      <FileCheck className="w-4 h-4" />
                      <span>Tramitar mi Licencia Turística Gratis</span>
                    </a>
                  ) : activeService.id === 'cleaning-laundry' ? (
                    <>
                      {/* Botón de Más Información solicitado que abre /lavanderia-industrial */}
                      <a
                        href="/lavanderia-industrial"
                        id="btn-service-laundry-more-info"
                        onClick={(e) => {
                          if (onNavigateToLaundry) {
                            e.preventDefault();
                            onNavigateToLaundry();
                          }
                        }}
                        aria-label="Más Información sobre lavandería industrial para hoteles, pisos turísticos, gimnasios y clínicas"
                        className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer hover:translate-y-[-1px]"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>Más Información</span>
                        <ArrowRight className="w-4 h-4" />
                      </a>

                      <button
                        onClick={onOpenContact}
                        id="btn-service-request-info"
                        className="w-full sm:w-auto px-5 py-3 border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer hover:translate-y-[-1px]"
                      >
                        <span>Solicitar Propuesta para mi Vivienda</span>
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={onOpenContact}
                      id="btn-service-request-info"
                      className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer hover:translate-y-[-1px]"
                    >
                      <span>Solicitar Propuesta para mi Vivienda</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      if (onOpenSimulator) {
                        onOpenSimulator();
                      } else {
                        document.getElementById('calculadora')?.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="w-full sm:w-auto px-5 py-3 text-center text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                  >
                    Simulador de Ingresos →
                  </button>
                </div>

              </div>

            </article>
          </div>

        </div>

      </div>
    </section>
  );
};
