import React from 'react';
import { 
  Check, 
  X, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight,
  TrendingUp,
  Clock,
  HeartHandshake
} from 'lucide-react';

interface WhyUsComparisonProps {
  onOpenContact: () => void;
  onOpenLicenseModal: () => void;
}

export const WhyUsComparison: React.FC<WhyUsComparisonProps> = ({ 
  onOpenContact, 
  onOpenLicenseModal 
}) => {
  const comparisonRows = [
    {
      feature: 'Tramitación de Licencia Turística (VT)',
      azahar: 'Incluida llave en mano con informe municipal',
      particular: 'Trámite complejo por tu cuenta',
      tradicional: 'No aplicable'
    },
    {
      feature: 'Rentabilidad Anual Neta',
      azahar: '+40% a +75% superior (Máxima)',
      particular: 'Media (por falta de precios dinámicos)',
      tradicional: 'Baja y congelada por ley'
    },
    {
      feature: 'Dedicación de tiempo del propietario',
      azahar: '0 horas / mes (Nos encargamos del 100%)',
      particular: '15-25 horas / mes (Mucho estrés)',
      tradicional: 'Baja (salvo incidencias o impagos)'
    },
    {
      feature: 'Flexibilidad de uso propio del piso',
      azahar: 'Total (bloquea fechas en la app cuando quieras)',
      particular: 'Total (si cancelas reservas)',
      tradicional: 'Ninguna (inmueble bloqueado 5-7 años)'
    },
    {
      feature: 'Riesgo de Impago y "Okupación"',
      azahar: '0% de riesgo (pago previo obligatorio)',
      particular: '0% de riesgo (con plataformas)',
      tradicional: 'Alto riesgo de morosidad y procesos judiciales'
    },
    {
      feature: 'Limpieza e Inspección tras cada estancia',
      azahar: 'Equipo profesional con lavandería industrial',
      particular: 'Limpiezas hechas por ti o subcontratas',
      tradicional: 'El inquilino (desgaste acumulado durante años)'
    },
    {
      feature: 'Atención al huésped 24/7 en varios idiomas',
      azahar: 'Equipo local 24/7/365 en castellano, inglés, francés',
      particular: 'Tu propio teléfono móvil a cualquier hora',
      tradicional: 'No aplicable'
    },
    {
      feature: 'Seguros y depósitos de garantía',
      azahar: 'Cobertura hasta 3M€ + control estricto de fianza',
      particular: 'Solo fianza básica de la plataforma',
      tradicional: 'Fianza legal de 1-2 meses (a menudo insuficiente)'
    }
  ];

  return (
    <section id="comparativa" className="py-20 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider">
            <HeartHandshake className="w-3.5 h-3.5 text-blue-600" />
            <span>Máxima Rentabilidad · 0% Estrés</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Ventajas para Propietarios: Comparativa de Gestión de Alquiler Vacacional
          </h2>

          <p className="text-base text-slate-600 leading-relaxed">
            Compara de un vistazo las diferencias reales entre autogestionar tu alquiler vacacional, optar por un arrendamiento tradicional o confiar en profesionales homologados en la Costa de Castellón.
          </p>
        </div>

        {/* Comparison Table Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="p-5 sm:p-6 text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-wider w-1/3 bg-slate-50/70">
                    Características & Factores Clave
                  </th>
                  
                  {/* Highlighted column: Azahar Rentals */}
                  <th className="p-5 sm:p-6 bg-blue-900 text-white w-1/3 relative shadow-md">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-extrabold text-blue-300 uppercase tracking-widest block">
                          Recomendado
                        </span>
                        <span className="text-base sm:text-lg font-black tracking-tight">
                          Azahar Rentals 360°
                        </span>
                      </div>
                      <Sparkles className="w-5 h-5 text-cyan-400" />
                    </div>
                  </th>

                  <th className="p-5 sm:p-6 text-xs sm:text-sm font-bold text-slate-700 w-1/6 bg-slate-50/70">
                    Gestión Propia
                  </th>

                  <th className="p-5 sm:p-6 text-xs sm:text-sm font-bold text-slate-700 w-1/6 bg-slate-50/70">
                    Alquiler Tradicional
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                {comparisonRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                    
                    {/* Feature name */}
                    <td className="p-5 font-bold text-slate-800 bg-slate-50/30">
                      {row.feature}
                    </td>

                    {/* Azahar Rentals Highlighted cell */}
                    <td className="p-5 font-semibold text-blue-950 bg-blue-50/50 border-x border-blue-100">
                      <div className="flex items-center gap-2">
                        <div className="p-1 rounded-full bg-blue-600 text-white shrink-0">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                        <span className="leading-snug">{row.azahar}</span>
                      </div>
                    </td>

                    {/* Particular */}
                    <td className="p-5 text-slate-600">
                      <span className="leading-snug">{row.particular}</span>
                    </td>

                    {/* Tradicional */}
                    <td className="p-5 text-slate-600">
                      <span className="leading-snug">{row.tradicional}</span>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Bottom Footer CTA */}
          <div className="p-6 bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="text-base font-bold text-white">
                ¿Listo para empezar a ganar más y olvidarte de gestiones?
              </h3>
              <p className="text-xs text-slate-300">
                Estudio de rentabilidad y consulta de licencia turística gratuitos y sin compromiso.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onOpenContact}
                id="btn-comparison-contact"
                aria-label="Solicitar Asesoramiento en la sección de Estudio de Rentabilidad y Licencia Gratuito"
                className="px-5 py-2.5 bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs rounded-xl shadow transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>Solicitar Asesoramiento</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
