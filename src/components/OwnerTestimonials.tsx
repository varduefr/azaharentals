import React from 'react';
import { 
  Star, 
  Quote, 
  CheckCircle2, 
  TrendingUp, 
  Award,
  ShieldCheck
} from 'lucide-react';
import { TESTIMONIALS_DATA } from '../data/testimonials';

interface OwnerTestimonialsProps {
  onOpenContact: () => void;
}

export const OwnerTestimonials: React.FC<OwnerTestimonialsProps> = ({ onOpenContact }) => {
  return (
    <section id="opiniones" className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>Casos Reales de Éxito en Costa de Castellón</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Opiniones de Propietarios de Alojamientos Turísticos en Castellón
          </h2>

          <p className="text-base text-slate-600 leading-relaxed">
            De Peñíscola a Oropesa del Mar, ayudamos a decenas de propietarios a despreocuparse del papeleo de la licencia turística y multiplicar sus ingresos mes a mes.
          </p>
        </div>

        {/* Testimonials Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {TESTIMONIALS_DATA.map((item) => (
            <article 
              key={item.id}
              aria-label={`Testimonio de ${item.name}, propietario en ${item.location}, Castellón`}
              className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-6 relative group"
            >
              <div className="space-y-4">
                
                {/* Header with Avatar and details */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <img 
                      src={item.avatar} 
                      alt={`Propietario de alojamiento turístico en ${item.location}, Castellón - ${item.name}`} 
                      loading="lazy"
                      decoding="async"
                      className="w-12 h-12 rounded-full object-cover border-2 border-blue-500/40 shadow-sm"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h3 className="text-base font-bold text-slate-900 leading-tight">
                        {item.name}
                      </h3>
                      <span className="text-xs font-semibold text-blue-700 block">
                        {item.location}
                      </span>
                      <span className="text-[11px] text-slate-500 block">
                        {item.propertyType}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-0.5 text-amber-400">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                </div>

                {/* License Tag */}
                {item.hasLicenseHelp && (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-100 text-blue-800 text-[11px] font-bold">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                    <span>Licencia Turística tramitada por Azahar Rentals</span>
                  </div>
                )}

                {/* Quote */}
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                  "{item.quote}"
                </p>
              </div>

              {/* Financial Transformation Badge */}
              <div className="pt-4 border-t border-slate-200/80 flex items-center justify-between bg-white p-3.5 rounded-2xl border border-slate-100">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">
                    Resultado con Azahar Rentals
                  </span>
                  <span className="text-xs sm:text-sm font-extrabold text-slate-900 font-mono">
                    {item.currentIncome}
                  </span>
                </div>
                
                <span className="px-2.5 py-1 bg-blue-50 text-blue-700 font-extrabold text-xs rounded-lg border border-blue-200">
                  {item.increasePercentage}
                </span>
              </div>

            </article>
          ))}
        </div>

      </div>
    </section>
  );
};
