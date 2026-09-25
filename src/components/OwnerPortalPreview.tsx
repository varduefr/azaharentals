import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  Euro, 
  Star, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  Smartphone, 
  ArrowRight,
  Sparkles,
  Eye
} from 'lucide-react';

export const OwnerPortalPreview: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'calendar' | 'financials' | 'reviews'>('calendar');
  const [blockedDates, setBlockedDates] = useState(false);

  return (
    <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
      
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-wider border border-blue-500/30">
            <LayoutDashboard className="w-3.5 h-3.5 text-cyan-400" />
            <span>Transparencia Total en Tiempo Real</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Portal del Propietario: Control y Transparencia de tu Vivienda Turística
          </h2>

          <p className="text-base text-slate-300 leading-relaxed">
            Sin cajas negras ni dudas. Accede en cualquier momento a tus reservas confirmadas, ingresos generados y bloquea fechas con un solo clic para disfrutar de tu propia casa.
          </p>
        </div>

        {/* Dashboard Preview Frame */}
        <article 
          aria-label="Demostración interactiva del panel de control del propietario de alojamiento turístico"
          className="bg-slate-950 rounded-3xl border border-slate-800 shadow-2xl p-4 sm:p-8 max-w-5xl mx-auto"
        >
          
          {/* Top Bar of the Mock App */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-cyan-500/80"></div>
              <span className="text-xs font-mono text-slate-400 ml-2">
                app.azaharrentals.com/owner/peniscola-playa-norte
              </span>
            </div>

            {/* Sub-nav tabs in mock */}
            <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('calendar')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === 'calendar' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Calendario & Reservas
              </button>
              <button
                onClick={() => setActiveTab('financials')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === 'financials' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Liquidaciones (Julio)
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === 'reviews' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Huéspedes & Reseñas (4.96★)
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800/80">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Ingresos de Julio</span>
              <span className="text-lg sm:text-xl font-black text-cyan-400 font-mono">4.820,00 €</span>
              <span className="text-[10px] text-cyan-300 block font-medium">+18% vs año anterior</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800/80">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Ocupación Mensual</span>
              <span className="text-lg sm:text-xl font-black text-white font-mono">96,8 %</span>
              <span className="text-[10px] text-slate-400 block">30 de 31 noches</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800/80">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Tarifa Media (ADR)</span>
              <span className="text-lg sm:text-xl font-black text-white font-mono">182,50 €</span>
              <span className="text-[10px] text-slate-400 block">Optimizada con IA</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800/80">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Licencia VT Oficial</span>
              <span className="text-xs font-bold text-cyan-400 flex items-center gap-1 mt-1 font-mono">
                <ShieldCheck className="w-3.5 h-3.5" />
                VT-441920-CS
              </span>
              <span className="text-[10px] text-slate-400 block">100% Homologado GVA</span>
            </div>
          </div>

          {/* Tab Content 1: Calendar */}
          {activeTab === 'calendar' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 p-4 rounded-2xl border border-slate-800">
                <div>
                  <h4 className="text-sm font-bold text-white">
                    Apartamento Ático "Papa Luna" · Peñíscola (Playa Norte)
                  </h4>
                  <p className="text-xs text-slate-400">
                    Sincronizado en tiempo real con Airbnb, Booking.com y VRBO
                  </p>
                </div>

                <button
                  onClick={() => setBlockedDates(!blockedDates)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    blockedDates 
                      ? 'bg-amber-500 text-slate-950 shadow-md' 
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>{blockedDates ? 'Fechas Bloqueadas para Ti (15-22 Ago)' : 'Bloquear Fechas de Vacaciones Propias'}</span>
                </button>
              </div>

              {/* Booking Sample List in mock */}
              <div className="space-y-2">
                {[
                  { dates: '01 Jul - 08 Jul (7 noches)', guest: 'Sophie & Marc Laurent (Francia)', channel: 'Airbnb Superhost', payout: '1.240 €', status: 'Completada / Limpieza 5★' },
                  { dates: '09 Jul - 17 Jul (8 noches)', guest: 'Familia Martínez (Madrid)', channel: 'Booking.com Genius', payout: '1.480 €', status: 'Completada / Inspeccionado' },
                  { dates: '18 Jul - 25 Jul (7 noches)', guest: 'Thomas Weber (Alemania)', channel: 'Direct Booking', payout: '1.350 €', status: 'Completada / Check-in Autónomo' },
                  { dates: '26 Jul - 31 Jul (5 noches)', guest: 'David & Clara (Valencia)', channel: 'Airbnb', payout: '950 €', status: 'Completada' }
                ].map((res, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-cyan-400 shrink-0"></div>
                      <div>
                        <span className="font-bold text-white">{res.dates}</span>
                        <span className="text-slate-400 block sm:inline sm:ml-2">· {res.guest}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-right">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[11px]">{res.channel}</span>
                      <span className="font-bold text-cyan-400 font-mono text-sm">{res.payout}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab Content 2: Financials */}
          {activeTab === 'financials' && (
            <div className="space-y-3 bg-slate-900 p-6 rounded-2xl border border-slate-800 animate-in fade-in duration-200">
              <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                <span className="text-xs font-bold uppercase text-slate-400">Concepto de Liquidación</span>
                <span className="text-xs font-bold uppercase text-slate-400">Importe</span>
              </div>
              <div className="flex justify-between text-xs text-slate-300">
                <span>Ingresos Brutos por Reservas (Julio)</span>
                <span className="font-mono font-bold text-white">5.890,00 €</span>
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>Comisión Canales (Airbnb / Booking)</span>
                <span className="font-mono text-red-400">- 420,00 €</span>
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>Servicios de Limpieza & Lavandería (A cargo de huéspedes)</span>
                <span className="font-mono text-slate-300">+ 480,00 €</span>
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>Comisión Gestión Integral Azahar Rentals (18%)</span>
                <span className="font-mono text-red-400">- 1.060,20 €</span>
              </div>
              <div className="pt-3 border-t border-slate-800 flex justify-between text-sm font-bold text-cyan-400">
                <span>Transferencia Neta Pagada a tu Cuenta Bancaria</span>
                <span className="font-mono text-lg">4.889,80 €</span>
              </div>
            </div>
          )}

          {/* Tab Content 3: Reviews */}
          {activeTab === 'reviews' && (
            <div className="space-y-3 animate-in fade-in duration-200">
              {[
                { author: 'Marie D. (Burdeos)', rating: 5, date: 'Julio 2025', comment: 'El apartamento en Peñíscola estaba impoluto. La comunicación con el equipo de Azahar Rentals fue de 10, check-in facilísimo con el código y recomendaciones locales fabulosas.' },
                { author: 'Javier M. (Zaragoza)', rating: 5, date: 'Julio 2025', comment: 'Todo perfecto. Apartamento con aire acondicionado funcionando a la perfección, sábanas impecables como de hotel 5 estrellas.' }
              ].map((rev, i) => (
                <div key={i} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{rev.author}</span>
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(5)].map((_, idx) => (
                        <Star key={idx} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-slate-300 italic">"{rev.comment}"</p>
                </div>
              ))}
            </div>
          )}

        </article>

      </div>
    </section>
  );
};
