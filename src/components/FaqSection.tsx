import React, { useState } from 'react';
import { 
  HelpCircle, 
  ChevronDown, 
  ShieldCheck, 
  TrendingUp, 
  KeyRound, 
  Lock,
  Sparkles
} from 'lucide-react';
import { FAQ_DATA } from '../data/faq';

interface FaqSectionProps {
  onOpenLicenseModal: () => void;
  onOpenContact: () => void;
}

export const FaqSection: React.FC<FaqSectionProps> = ({ 
  onOpenLicenseModal, 
  onOpenContact 
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'Todas las preguntas' },
    { id: 'licencias', label: 'Licencia Turística (VT)' },
    { id: 'ingresos', label: 'Ingresos y Pagos' },
    { id: 'gestion', label: 'Gestión y Limpieza' },
    { id: 'seguridad', label: 'Seguridad y Fianzas' }
  ];

  const filteredFaqs = selectedCategory === 'all' 
    ? FAQ_DATA 
    : FAQ_DATA.filter(f => f.category === selectedCategory);

  const toggleAccordion = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-20 bg-slate-50 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
            <span>Respuestas Claras y Transparentes</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Preguntas Frecuentes sobre Alquiler Vacacional y Licencias Turísticas en Castellón
          </h2>

          <p className="text-base text-slate-600 leading-relaxed">
            Resolvemos todas las dudas sobre normativa de la Generalitat Valenciana, pagos mensuales y cuidado de tu vivienda.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-10">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setOpenIndex(0);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {filteredFaqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <article
                key={index}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/60 transition-colors"
                  aria-expanded={isOpen}
                >
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                    {faq.question}
                  </h3>
                  <div className={`p-1.5 rounded-full bg-slate-100 text-slate-600 transition-transform ${
                    isOpen ? 'rotate-180 bg-blue-100 text-blue-700' : ''
                  }`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 animate-in fade-in duration-200">
                    <p>{faq.answer}</p>
                    
                    {faq.category === 'licencias' && (
                      <div className="mt-4 p-3 bg-blue-50 rounded-2xl border border-blue-100 flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-blue-900">
                          ¿Quieres que revisemos la viabilidad de tu licencia hoy mismo?
                        </span>
                        <a
                          href="#contacto"
                          id="btn-faq-request-study"
                          aria-label="Ir a la sección Estudio de Rentabilidad y Licencia Gratuito"
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shrink-0 shadow-sm cursor-pointer whitespace-nowrap inline-flex items-center justify-center"
                        >
                          Solicitar Estudio Gratuito
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div className="mt-12 text-center bg-slate-900 text-white rounded-3xl p-8 shadow-xl border border-blue-900/50 relative overflow-hidden">
          <div className="relative z-10 space-y-3">
            <h3 className="text-xl font-bold">
              ¿Tienes alguna duda específica sobre tu apartamento?
            </h3>
            <p className="text-xs sm:text-sm text-blue-200 max-w-xl mx-auto">
              Nuestro equipo local te atiende por teléfono o WhatsApp para darte una respuesta personalizada sobre tu municipio.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={onOpenContact}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow cursor-pointer transition-all hover:scale-105"
              >
                Contactar con un Asesor en Castellón
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
