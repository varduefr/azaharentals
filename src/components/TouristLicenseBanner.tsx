import React from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Building, 
  FileText, 
  BadgeAlert, 
  Scale,
  Sparkles,
  PhoneCall
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface TouristLicenseBannerProps {
  onOpenModal: () => void;
  onOpenContact: () => void;
}

export const TouristLicenseBanner: React.FC<TouristLicenseBannerProps> = ({ 
  onOpenModal, 
  onOpenContact 
}) => {
  const { currentTheme } = useTheme();

  const steps = [
    {
      num: '01',
      title: 'Compatibilidad Urbanística',
      desc: 'Gestionamos el informe municipal ante los ayuntamientos de Peñíscola, Vinaròs, Benicarló u Oropesa.'
    },
    {
      num: '02',
      title: 'Auditoría Técnica y Estatutos',
      desc: 'Comprobamos los estatutos de tu comunidad y adaptamos el equipamiento según el Decreto 9/2024.'
    },
    {
      num: '03',
      title: 'Registro Generalitat Valenciana',
      desc: 'Presentamos la declaración responsable telemática en Turisme Comunitat Valenciana.'
    },
    {
      num: '04',
      title: 'Entrega de Placa y Código VT',
      desc: 'Te entregamos tu resolución con el código oficial (VT-XXXXXX-CS) y la placa homologada.'
    }
  ];

  return (
    <section 
      id="licencia-turistica" 
      className="py-16 sm:py-20 text-white relative overflow-hidden scroll-mt-20 sm:scroll-mt-24"
      style={{
        backgroundColor: currentTheme.colors.secondary
      }}
    >
      {/* Anchor for Servicio Exclusivo Llave en Mano */}
      <span id="servicio-llave-en-mano" className="absolute -top-24 left-0 pointer-events-none" aria-hidden="true" />

      {/* Background patterns */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
      <div 
        className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-20"
        style={{ backgroundColor: currentTheme.colors.primary }}
      ></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header pill & Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div 
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider"
            style={{
              backgroundColor: `${currentTheme.colors.primary}25`,
              borderColor: `${currentTheme.colors.primary}50`,
              color: currentTheme.colors.primaryLight
            }}
          >
            <ShieldCheck className="w-4 h-4" style={{ color: currentTheme.colors.primaryLight }} />
            <span>Servicio Exclusivo Llave en Mano</span>
          </div>

          <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight ${currentTheme.typography.headingFontClass}`}>
            Tramitación Oficial de Licencias Turísticas en Castellón <br className="hidden sm:inline" />
            <span style={{ color: currentTheme.colors.primaryLight }}>Servicio Llave en Mano para Propietarios</span>
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Olvídate de colas, ayuntamientos, leyes complejas y formularios. En Azahar Rentals nos encargamos de todo el expediente para obtener tu <strong className="text-white">Licencia de Vivienda Turística de la Generalitat Valenciana (VT)</strong> en cualquier municipio de la Costa de Castellón.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {steps.map((step) => (
            <article 
              key={step.num}
              className={`bg-slate-900/90 border border-slate-700/70 ${currentTheme.cardRadius} p-6 relative group hover:border-slate-500 transition-all shadow-lg`}
            >
              <div className="flex items-center justify-between mb-4">
                <span 
                  className="text-2xl font-black transition-colors font-mono opacity-75"
                  style={{ color: currentTheme.colors.primaryLight }}
                >
                  {step.num}
                </span>
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                  style={{ backgroundColor: `${currentTheme.colors.primary}40` }}
                >
                  <CheckCircle2 className="w-4 h-4" style={{ color: currentTheme.colors.primaryLight }} />
                </div>
              </div>
              <h3 className={`text-base font-bold text-white mb-2 leading-snug ${currentTheme.typography.headingFontClass}`}>
                {step.title}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {step.desc}
              </p>
            </article>
          ))}
        </div>

        {/* Key Advantages Highlights Box */}
        <div className={`mt-12 bg-white text-slate-900 ${currentTheme.cardRadius} p-6 sm:p-8 shadow-xl border border-slate-200`}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-4">
              <div 
                className="flex items-center gap-2 font-bold text-xs uppercase tracking-wide"
                style={{ color: currentTheme.colors.primary }}
              >
                <Scale className="w-4 h-4" />
                <span>100% Adaptados al Nuevo Decreto 9/2024 de la Comunitat Valenciana</span>
              </div>
              
              <h3 className={`text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug ${currentTheme.typography.headingFontClass}`}>
                Alquila de forma legal, segura y libre de sanciones de hasta 600.000€
              </h3>
              
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                La Generalitat Valenciana exige que cualquier vivienda publicada en Airbnb, Booking o VRBO cuente con su número de registro oficial visible. Si comienzas a trabajar con nosotros, realizamos una auditoría previa sin coste y gestionamos todo el expediente administrativo.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                  <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: currentTheme.colors.primary }} />
                  <span>Sin costes ocultos ni sorpresas</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                  <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: currentTheme.colors.primary }} />
                  <span>Redacción de memoria y planos técnicos</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                  <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: currentTheme.colors.primary }} />
                  <span>Póliza de seguro de RC incluida</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                  <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: currentTheme.colors.primary }} />
                  <span>Colocación de placa física homologada</span>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div 
              className={`lg:col-span-4 rounded-2xl p-5 border flex flex-col justify-center text-center space-y-4`}
              style={{
                backgroundColor: currentTheme.colors.primaryLight,
                borderColor: currentTheme.colors.primaryBorder
              }}
            >
              <div className="space-y-1">
                <span 
                  className="text-xs font-extrabold uppercase tracking-wider block"
                  style={{ color: currentTheme.colors.primary }}
                >
                  Estudio de Viabilidad
                </span>
                <p className="text-xs text-slate-800 font-medium">
                  Comprueba si tu apartamento cumple con la normativa en 2 minutos.
                </p>
              </div>

              <a
                href="#contacto"
                id="btn-license-banner-contact"
                aria-label="Hablar con un Gestor Turístico en la sección de Estudio de Rentabilidad y Licencia Gratuito"
                className={`w-full py-3 px-4 ${currentTheme.buttonRadius} text-white font-bold text-xs tracking-wide shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer hover:translate-y-[-1px]`}
                style={{
                  backgroundColor: currentTheme.colors.primary
                }}
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Hablar con un Gestor Turístico</span>
              </a>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

