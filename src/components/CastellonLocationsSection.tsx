import React, { useState } from 'react';
import { 
  MapPin, 
  Waves, 
  TrendingUp, 
  Calendar, 
  ArrowRight, 
  Check, 
  Star, 
  Building2,
  Compass,
  Sparkles
} from 'lucide-react';
import { LOCATIONS_DATA } from '../data/locations';
import { LocationData } from '../types';

interface CastellonLocationsSectionProps {
  onSelectTownForSimulation: (townId: string) => void;
  onOpenLicenseModal: () => void;
}

export const CastellonLocationsSection: React.FC<CastellonLocationsSectionProps> = ({
  onSelectTownForSimulation,
  onOpenLicenseModal
}) => {
  const [activeTab, setActiveTab] = useState<string>('peniscola');

  const activeTown = LOCATIONS_DATA.find(l => l.id === activeTab) || LOCATIONS_DATA[0];

  return (
    <section id="destinos" className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5 text-blue-600" />
            <span>Áreas de Cobertura en la Costa de Castellón</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Municipios de Castellón con Gestión de Alquiler Vacacional y Turístico
          </h2>

          <p className="text-base text-slate-600 leading-relaxed">
            Nuestro equipo y red de colaboradores opera directamente a pie de playa en las principales localidades turísticas de Castellón, garantizando atención inmediata y conocimiento profundo del mercado.
          </p>
        </div>

        {/* Town Tabs */}
        <div 
          className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 scrollbar-none mb-8"
          role="tablist" 
          aria-label="Municipios de la Costa de Castellón"
        >
          {LOCATIONS_DATA.map((town) => {
            const isSelected = town.id === activeTab;
            return (
              <button
                key={town.id}
                role="tab"
                aria-selected={isSelected}
                onClick={() => setActiveTab(town.id)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-cyan-400' : 'text-slate-500'}`} />
                <span>{town.name}</span>
                {town.badge && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-extrabold ${
                    isSelected ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {town.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Active Town Showcase Card */}
        <article 
          aria-label={`Información de alquiler vacacional y rentabilidad en ${activeTown.name}, Castellón`}
          className="bg-slate-900 text-white rounded-3xl overflow-hidden shadow-2xl border border-slate-800 grid grid-cols-1 lg:grid-cols-12"
        >
          
          {/* Left Column: Image with badges */}
          <div className="lg:col-span-6 relative min-h-[320px] lg:min-h-[460px]">
            <img 
              src={activeTown.image.replace(/^\/src\/assets\/images\//, '/images/')} 
              alt={`Gestión de apartamentos y alquiler vacacional en ${activeTown.name} - Costa de Castellón`} 
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.dataset.fallbackTried) {
                  target.dataset.fallbackTried = 'true';
                  target.src = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80';
                }
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
            
            <div className="absolute bottom-6 left-6 right-6 space-y-2">
              <span className="px-3 py-1 bg-blue-600 text-white text-xs font-black uppercase tracking-wider rounded-lg inline-block shadow">
                {activeTown.badge}
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {activeTown.name}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 font-medium">
                {activeTown.subtitle}
              </p>
            </div>
          </div>

          {/* Right Column: Details, Beaches, Statistics */}
          <div className="lg:col-span-6 p-6 sm:p-10 flex flex-col justify-between space-y-6">
            
            <div className="space-y-4">
              <p className="text-sm text-slate-300 leading-relaxed">
                {activeTown.description}
              </p>

              {/* Statistics Grid */}
              <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Rendimiento Anual
                  </span>
                  <span className="text-xs sm:text-sm font-black text-cyan-400 font-mono">
                    {activeTown.averageAnnualYield}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Ocupación
                  </span>
                  <span className="text-xs sm:text-sm font-black text-white font-mono">
                    {activeTown.averageOccupancy}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Tarifa Verano
                  </span>
                  <span className="text-xs sm:text-sm font-black text-cyan-300 font-mono">
                    {activeTown.highSeasonADR}
                  </span>
                </div>
              </div>

              {/* Highlight Beaches from Turisme de Castelló */}
              <div className="space-y-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Waves className="w-3.5 h-3.5 text-cyan-400" />
                  Playas y Zonas Clave de Actuación
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {activeTown.highlightBeaches.map((beach, index) => (
                    <div key={index} className="flex items-center gap-2 text-xs text-slate-200 bg-slate-800/50 px-3 py-2 rounded-lg border border-slate-700/50">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0"></span>
                      <span className="truncate">{beach}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Demand tag pills */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {activeTown.tags.map((tag) => (
                  <span key={tag} className="text-[10px] px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-medium">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* CTAs */}
            <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={() => onSelectTownForSimulation(activeTown.id)}
                className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <TrendingUp className="w-4 h-4" />
                <span>Simular Ingresos en {activeTown.name}</span>
              </button>

              <a
                href="#contacto"
                aria-label={`Ir a la sección Estudio de Rentabilidad y Licencia Gratuito para pedir Licencia en ${activeTown.name}`}
                className="w-full sm:w-auto px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Pedir Licencia en {activeTown.name}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

          </div>

        </article>

      </div>
    </section>
  );
};
