import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Building2, 
  Home, 
  Dumbbell, 
  Stethoscope, 
  CheckCircle2, 
  Truck, 
  ShieldCheck, 
  Phone, 
  ArrowLeft, 
  Clock, 
  Flame, 
  Wind, 
  Shirt, 
  Award, 
  FileText, 
  Send,
  Layers,
  ChevronRight,
  Package,
  Calendar,
  MapPin,
  Check
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useTheme } from '../context/ThemeContext';

interface LaundryPageProps {
  onNavigateHome: (sectionId?: string) => void;
  onNavigateToSimulator?: () => void;
  onNavigateToAdmin?: () => void;
  onNavigateToApartments?: (apartmentId?: string) => void;
  onOpenLicenseModal?: () => void;
  onOpenContact?: (data?: any) => void;
}

export const LaundryPage: React.FC<LaundryPageProps> = ({
  onNavigateHome,
  onNavigateToSimulator,
  onNavigateToAdmin,
  onNavigateToApartments,
  onOpenLicenseModal = () => {},
  onOpenContact = () => {}
}) => {
  const { currentTheme } = useTheme();

  // Form state
  const [clientType, setClientType] = useState<'hoteles' | 'pisos_turisticos' | 'gimnasios' | 'clinicas'>('pisos_turisticos');
  const [selectedGarments, setSelectedGarments] = useState<string[]>(['sabanas', 'toallas']);
  const [estimatedVolume, setEstimatedVolume] = useState<string>('50-200');
  const [name, setName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Scroll to top and update SEO tags
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const originalTitle = document.title;
    document.title = "Lavandería Industrial en Castellón | Hoteles, Pisos Turísticos, Clínicas y Gimnasios | Azahar Rentals";

    const metaDesc = document.querySelector('meta[name="description"]');
    const originalDesc = metaDesc ? metaDesc.getAttribute('content') : '';
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'Servicio de lavandería industrial en Castellón para hoteles, apartamentos turísticos, gimnasios y clínicas privadas. Limpieza de sábanas, toallas, batas y uniformes con lavado, secado y planchado calandra.'
      );
    }

    return () => {
      document.title = originalTitle;
      if (metaDesc && originalDesc) {
        metaDesc.setAttribute('content', originalDesc);
      }
    };
  }, []);

  const toggleGarment = (id: string) => {
    setSelectedGarments(prev => 
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    );
  };

  const handleSubmitQuote = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // Prepare lead data
    const leadPayload = {
      tipo: 'lavanderia_industrial_b2b',
      sector: clientType,
      prendas: selectedGarments,
      volumen: estimatedVolume,
      nombre: name,
      empresa: businessName,
      telefono: phone,
      email: email,
      observaciones: notes,
      fecha: new Date().toISOString()
    };

    // Store in localStorage for offline reliability
    try {
      const existing = JSON.parse(localStorage.getItem('azahar_laundry_leads') || '[]');
      existing.push(leadPayload);
      localStorage.setItem('azahar_laundry_leads', JSON.stringify(existing));
    } catch {
      // Ignored in private modes
    }

    // Simulate instant process
    setTimeout(() => {
      setSubmitting(false);
      setFormSubmitted(true);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      
      {/* Schema.org Structured Data for B2B Industrial Laundry */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "DryCleaningOrLaundry",
            "name": "Azahar Rentals - Servicio de Lavandería Industrial",
            "image": "https://azaharentals.com/images/industrial_laundry.jpg",
            "telephone": "+34637968999",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Castellón de la Plana",
              "addressRegion": "Castellón",
              "addressCountry": "ES"
            },
            "areaServed": [
              "Castellón de la Plana",
              "Peñíscola",
              "Benicàssim",
              "Benicarló",
              "Vinaròs",
              "Oropesa del Mar",
              "Alcossebre"
            ],
            "description": "Lavandería industrial profesional para hoteles, alojamientos turísticos, clínicas privadas y gimnasios. Lavado, secado, planchado y desinfección térmica de sábanas, toallas, batas e uniformes.",
            "serviceType": [
              "Lavandería industrial para hoteles",
              "Lavandería para pisos turísticos y apartamentos vacacionales",
              "Lavandería para gimnasios y spas",
              "Lavandería y desinfección para clínicas privadas y consultas médicas",
              "Planchado industrial y calandrado de sábanas",
              "Higienización y tratamiento de toallas",
              "Lavado y planchado de batas y uniformes laborales"
            ]
          })
        }}
      />

      {/* Shared Navbar */}
      <Navbar
        currentPage="laundry"
        onOpenLicenseModal={onOpenLicenseModal}
        onOpenCalculator={() => {
          if (onNavigateToSimulator) onNavigateToSimulator();
        }}
        onNavigateToSimulator={onNavigateToSimulator}
        onNavigateToLaundry={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        onNavigateToApartments={onNavigateToApartments}
        onNavigateToHome={onNavigateHome}
        onNavigateToAdmin={onNavigateToAdmin}
        onOpenContact={() => {
          const formElement = document.getElementById('formulario-lavanderia');
          if (formElement) {
            formElement.scrollIntoView({ behavior: 'smooth' });
          } else {
            onOpenContact();
          }
        }}
      />

      {/* Main Content */}
      <main className="flex-grow">
        
        {/* Navigation Breadcrumb Bar */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav className="flex items-center gap-2 text-xs text-slate-500" aria-label="Breadcrumb">
              <button 
                onClick={() => onNavigateHome()}
                className="hover:text-blue-600 transition-colors flex items-center gap-1 cursor-pointer font-medium"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Inicio</span>
              </button>
              <span aria-hidden="true">/</span>
              <button 
                onClick={() => onNavigateHome('servicios')}
                className="hover:text-blue-600 transition-colors cursor-pointer"
              >
                Servicios 360°
              </button>
              <span aria-hidden="true">/</span>
              <span className="text-slate-900 font-semibold" aria-current="page">
                Lavanderia Industrial B2B
              </span>
            </nav>
          </div>
        </div>

        {/* HERO SECTION */}
        <section className="relative bg-gradient-to-b from-white via-slate-50 to-blue-50/40 py-12 lg:py-20 border-b border-slate-200/80 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Left Column: Heading, Value Props & CTAs */}
              <div className="lg:col-span-7 space-y-6">
                
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-900 text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>Servicio Profesional B2B · Castellón & Costa de Azahar</span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  Lavandería Industrial y Lencería para Hoteles, Pisos Turísticos, Gimnasios y Clínicas
                </h1>

                <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
                  Garantizamos los máximos estándares de higiene, suavidad y presentación con nuestro servicio integral de <strong>lavado, secado y planchado industrial</strong>. Tratamiento profesional de <strong>sábanas, toallas, batas sanitarias e uniformes</strong> con recogida y entrega puntual puerta a puerta.
                </p>

                {/* Highlights quick list */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="flex items-center gap-2.5 text-sm font-medium text-slate-700">
                    <div className="p-1 rounded-full bg-blue-100 text-blue-700">
                      <Check className="w-4 h-4" />
                    </div>
                    <span>Desinfección térmica hasta 85°C</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-sm font-medium text-slate-700">
                    <div className="p-1 rounded-full bg-blue-100 text-blue-700">
                      <Check className="w-4 h-4" />
                    </div>
                    <span>Planchado calandra satinado sin arrugas</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-sm font-medium text-slate-700">
                    <div className="p-1 rounded-full bg-blue-100 text-blue-700">
                      <Check className="w-4 h-4" />
                    </div>
                    <span>Embolsado hermético por unidades o sets</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-sm font-medium text-slate-700">
                    <div className="p-1 rounded-full bg-blue-100 text-blue-700">
                      <Check className="w-4 h-4" />
                    </div>
                    <span>Rutas diarias de recogida y entrega</span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                  <a
                    href="#formulario-lavanderia"
                    className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 hover:translate-y-[-1px] text-center"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Pedir Presupuesto a Medida</span>
                  </a>

                  <a
                    href="tel:+34637968999"
                    className="px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 font-bold text-sm rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 hover:border-slate-400 text-center"
                  >
                    <Phone className="w-4 h-4 text-blue-600" />
                    <span>Llamar: +34 637 96 89 99</span>
                  </a>
                </div>

                <div className="pt-2 flex items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Certificación higiénico-sanitaria
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-blue-600" />
                    Entregas en 24h / 48h
                  </span>
                </div>

              </div>

              {/* Right Column: Hero Visual Image */}
              <div className="lg:col-span-5">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 bg-white">
                  <img 
                    src="/images/industrial_laundry.jpg" 
                    alt="Planta de lavandería industrial Azahar Rentals con sábanas y toallas dobladas para hoteles y clínicas en Castellón" 
                    className="w-full h-80 sm:h-96 object-cover"
                    loading="eager"
                    width={800}
                    height={600}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent flex flex-col justify-end p-6 text-white">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600/90 text-white text-xs font-bold w-fit mb-2">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Calidad Hotelera 5 Estrellas</span>
                    </div>
                    <p className="text-sm font-semibold text-white/95">
                      Tratamiento especializado de lencería de cama, toallas, batas y vestuario laboral con calandras industriales.
                    </p>
                    <p className="text-xs text-slate-300 mt-1">
                      Servicio activo en Castellón de la Plana, Peñíscola, Benicàssim, Vinaròs, Benicarló y Oropesa.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* SECTION 1: SECTORES Y CLIENTES OBJETIVO (LOS 4 SECTORES PEDIDOS) */}
        <section className="py-16 sm:py-20 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Soluciones B2B por Sector
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Lavandería Industrial Adaptada a tu Tipo de Negocio
              </h2>
              <p className="text-sm sm:text-base text-slate-600">
                Cada actividad requiere un protocolo térmico, químico y logístico específico. Diseñamos planes de servicio a la medida de tu volumen y exigencia.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Card 1: Hoteles */}
              <article className="p-6 rounded-3xl bg-slate-50 border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all flex flex-col justify-between group">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Hoteles & Hostales
                    </h3>
                    <p className="text-xs text-blue-700 font-semibold mt-0.5">
                      Alta capacidad y rotación diaria
                    </p>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Gestión masiva de lencería de cama y baño con calandrado impecable. Soporte reforzado en picos de alta ocupación estival y festivos en toda la Costa de Castellón.
                  </p>
                  <ul className="space-y-2 text-xs text-slate-700 pt-2 border-t border-slate-200/70">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 mt-0.5 shrink-0" />
                      <span>Juegos de sábanas satinadas de 150/180 hilos</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 mt-0.5 shrink-0" />
                      <span>Toallas de baño de alto gramaje (500g/m²)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 mt-0.5 shrink-0" />
                      <span>Uniformes de recepción, cocina y pisos</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-200/60">
                  <button
                    onClick={() => {
                      setClientType('hoteles');
                      document.getElementById('formulario-lavanderia')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full py-2 px-3 text-xs font-bold text-blue-700 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>Cotizar para Hotel</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </article>

              {/* Card 2: Pisos Turísticos */}
              <article className="p-6 rounded-3xl bg-slate-50 border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all flex flex-col justify-between group">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-100 text-cyan-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Home className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Pisos Turísticos
                    </h3>
                    <p className="text-xs text-cyan-700 font-semibold mt-0.5">
                      Alquiler Vacacional & Airbnb
                    </p>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Packs preparados por cambio de huésped y empaquetados herméticamente por apartamento. Sin mínimos abusivos para propietarios o gestores de apartamentos turísticos.
                  </p>
                  <ul className="space-y-2 text-xs text-slate-700 pt-2 border-t border-slate-200/70">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600 mt-0.5 shrink-0" />
                      <span>Kits por cama (matrimonio o individual)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600 mt-0.5 shrink-0" />
                      <span>Sets de toallas de baño, lavabo y alfombrín</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600 mt-0.5 shrink-0" />
                      <span>Sincronización con check-in y check-out</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-200/60">
                  <button
                    onClick={() => {
                      setClientType('pisos_turisticos');
                      document.getElementById('formulario-lavanderia')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full py-2 px-3 text-xs font-bold text-cyan-700 hover:text-cyan-800 bg-cyan-50 hover:bg-cyan-100 rounded-xl transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>Cotizar para Pisos Turísticos</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </article>

              {/* Card 3: Gimnasios */}
              <article className="p-6 rounded-3xl bg-slate-50 border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all flex flex-col justify-between group">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Dumbbell className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Gimnasios & Spas
                    </h3>
                    <p className="text-xs text-amber-700 font-semibold mt-0.5">
                      Centros Deportivos & Bienestar
                    </p>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Tratamiento fungicida y desodorizante para toallas de sudor, toallas de ducha y albornoces de spa. Conservación de la esponjosidad y máxima absorbencia tras continuos lavados.
                  </p>
                  <ul className="space-y-2 text-xs text-slate-700 pt-2 border-t border-slate-200/70">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 mt-0.5 shrink-0" />
                      <span>Toallas de sala de entrenamiento y fitness</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 mt-0.5 shrink-0" />
                      <span>Toallas de vestuario y albornoces de spa</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 mt-0.5 shrink-0" />
                      <span>Eliminación bacteriana sin dañar las fibras</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-200/60">
                  <button
                    onClick={() => {
                      setClientType('gimnasios');
                      document.getElementById('formulario-lavanderia')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full py-2 px-3 text-xs font-bold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 rounded-xl transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>Cotizar para Gimnasio</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </article>

              {/* Card 4: Clínicas Privadas */}
              <article className="p-6 rounded-3xl bg-slate-50 border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all flex flex-col justify-between group">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Stethoscope className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Clínicas Privadas
                    </h3>
                    <p className="text-xs text-emerald-700 font-semibold mt-0.5">
                      Consultas Médicas & Dentales
                    </p>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Protocolos de desinfección sanitaria y biocida. Cuidado estricto para batas de consulta, sábanas de camilla, toallas médicas e indumentaria de personal clínico.
                  </p>
                  <ul className="space-y-2 text-xs text-slate-700 pt-2 border-t border-slate-200/70">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                      <span>Batas médicas y pijamas sanitarios</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                      <span>Sábanas y paños para camillas de exploración</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                      <span>Embolsado aséptico sellado listo para consulta</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-200/60">
                  <button
                    onClick={() => {
                      setClientType('clinicas');
                      document.getElementById('formulario-lavanderia')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full py-2 px-3 text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>Cotizar para Clínica</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </article>

            </div>

          </div>
        </section>

        {/* SECTION 2: PRENDAS Y TEXTILES QUE TRATAMOS */}
        <section className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Catálogo de Prendas y Textiles
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Servicio Especializado de Limpieza por Tipo de Prenda
              </h2>
              <p className="text-sm sm:text-base text-slate-600">
                Cuidamos cada fibra textil con detergentes ecológicos homologados, oxidantes no agresivos y maquinaria industrial de última generación.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Garment 1: Sábanas y lencería */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Sábanas & Lencería de Cama
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Sábanas encimeras, bajeras ajustables, fundas de almohada, fundas nórdicas y protectores acolchados.
                </p>
                <div className="bg-slate-50 p-3 rounded-2xl text-xs text-slate-700 space-y-1.5 border border-slate-100">
                  <div className="font-semibold text-blue-800">Tratamiento específico:</div>
                  <div>• Lavado térmico 65°C - 85°C</div>
                  <div>• Calandrado de rodillo a presión</div>
                  <div>• Acabado ultra suave y libre de arrugas</div>
                </div>
              </div>

              {/* Garment 2: Toallas y felpas */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Toallas & Ropa de Baño
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Toallas de ducha, lavabo, bidé, toallas de gimnasio, albornoces y alfombrines de baño de alta densidad.
                </p>
                <div className="bg-slate-50 p-3 rounded-2xl text-xs text-slate-700 space-y-1.5 border border-slate-100">
                  <div className="font-semibold text-blue-800">Tratamiento específico:</div>
                  <div>• Desinfección bactericida profunda</div>
                  <div>• Secado en flujo de inversión envolvente</div>
                  <div>• Recuperación de esponjosidad y rizo</div>
                </div>
              </div>

              {/* Garment 3: Batas de clínica */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Batas de Clínica & Sanidad
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Batas médicas, pijamas sanitarios (casacas y pantalones), sábanas de camilla y toallas para consultas privadas.
                </p>
                <div className="bg-slate-50 p-3 rounded-2xl text-xs text-slate-700 space-y-1.5 border border-slate-100">
                  <div className="font-semibold text-blue-800">Tratamiento específico:</div>
                  <div>• Desinfección química de grado sanitario</div>
                  <div>• Planchado a vapor con prensas térmicas</div>
                  <div>• Embolsado higiénico individual</div>
                </div>
              </div>

              {/* Garment 4: Uniformes */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                  <Shirt className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Uniformes Laborales
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Uniformes de camareros, cocineros, recepcionistas, personal de limpieza hotelera y técnicos de mantenimiento.
                </p>
                <div className="bg-slate-50 p-3 rounded-2xl text-xs text-slate-700 space-y-1.5 border border-slate-100">
                  <div className="font-semibold text-blue-800">Tratamiento específico:</div>
                  <div>• Eliminación de manchas difíciles y grasas</div>
                  <div>• Planchado esmerado de cuellos y mangas</div>
                  <div>• En percha o plegado según preferencia</div>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* SECTION 3: EL PROCESO INDUSTRIAL COMPLETO (LAVADO, SECADO Y PLANCHADO) */}
        <section className="py-16 sm:py-20 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Tecnología & Proceso
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                El Ciclo Integral: Lavado, Secado y Planchado Industrial
              </h2>
              <p className="text-sm sm:text-base text-slate-600">
                Así es el recorrido que garantiza la máxima pulcritud e higiene desde que recogemos la ropa sucia hasta que la entregamos lista para su uso.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Step 1: Lavado */}
              <div className="relative bg-slate-50 rounded-3xl p-8 border border-slate-200 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-extrabold text-lg shadow-md">
                  1
                </div>
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-blue-600" />
                  <h3 className="text-xl font-bold text-slate-900">
                    Lavado Industrial Desinfectante
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Lavadoras automáticas de gran capacidad con dosificación informatizada de detergentes ecológicos, agentes tensioactivos y oxigenados biocidas.
                </p>
                <div className="pt-2 text-xs text-slate-500 space-y-1">
                  <div>✓ Control milimétrico de temperatura (hasta 85°C)</div>
                  <div>✓ Eliminación del 99,9% de bacterias, ácaros y virus</div>
                  <div>✓ Protección del blanco óptico y brillo de colores</div>
                </div>
              </div>

              {/* Step 2: Secado */}
              <div className="relative bg-slate-50 rounded-3xl p-8 border border-slate-200 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-extrabold text-lg shadow-md">
                  2
                </div>
                <div className="flex items-center gap-2">
                  <Wind className="w-5 h-5 text-blue-600" />
                  <h3 className="text-xl font-bold text-slate-900">
                    Secado Industrial Envolvente
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Secadoras de tambor con inversión de giro y flujo radial de aire caliente que evaporan la humedad residual de forma suave y controlada.
                </p>
                <div className="pt-2 text-xs text-slate-500 space-y-1">
                  <div>✓ Secado homogéneo sin apelmazar el rizo</div>
                  <div>✓ Eliminación de pelusas mediante filtros ciclónicos</div>
                  <div>✓ Toallas con tacto esponjoso y máxima suavidad</div>
                </div>
              </div>

              {/* Step 3: Planchado */}
              <div className="relative bg-slate-50 rounded-3xl p-8 border border-slate-200 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-extrabold text-lg shadow-md">
                  3
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                  <h3 className="text-xl font-bold text-slate-900">
                    Planchado & Calandrado Industrial
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Calandras de vapor de rodillo ancho para sábanas y fundas de cama, combinadas con prensas térmicas de vapor para batas y uniformes.
                </p>
                <div className="pt-2 text-xs text-slate-500 space-y-1">
                  <div>✓ Acabado liso hotelero 100% libre de arrugas</div>
                  <div>✓ Desinfección complementaria por choque térmico</div>
                  <div>✓ Plegado y doblado milimétrico automatizado</div>
                </div>
              </div>

            </div>

            {/* Packaging and logistics banner */}
            <div className="mt-12 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="p-4 bg-white/10 rounded-2xl shrink-0">
                  <Truck className="w-8 h-8 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">
                    Logística con Recogida y Entrega Puerta a Puerta
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
                    Rutas regulares en Castellón de la Plana, Benicàssim, Peñíscola, Oropesa, Vinaròs, Benicarló y Alcossebre. Ropa empaquetada en film reciclable sellado y clasificada con albarán por cliente.
                  </p>
                </div>
              </div>
              <div className="shrink-0 flex items-center gap-3">
                <a
                  href="tel:+34637968999"
                  className="px-5 py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs transition-colors flex items-center gap-2 shadow-sm"
                >
                  <Phone className="w-4 h-4" />
                  <span>+34 637 96 89 99</span>
                </a>
              </div>
            </div>

          </div>
        </section>

        {/* SECTION 4: FORMULARIO DE PRESUPUESTO PERSONALIZADO */}
        <section id="formulario-lavanderia" className="py-16 sm:py-20 bg-slate-100 border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8 sm:p-12 relative overflow-hidden">
              
              <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-900 text-xs font-bold uppercase tracking-wider">
                  <FileText className="w-3.5 h-3.5 text-blue-600" />
                  <span>Sin Compromiso · Respuesta en menos de 2 horas</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  Solicita Presupuesto de Lavandería Industrial
                </h2>
                <p className="text-xs sm:text-sm text-slate-600">
                  Cuéntanos las características de tu negocio y te enviaremos una propuesta tarifaria con recogida, lavado, secado, planchado y entrega incluidos.
                </p>
              </div>

              {formSubmitted ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center space-y-4 animate-in fade-in zoom-in-95">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">
                    ¡Solicitud de Presupuesto Recibida!
                  </h3>
                  <p className="text-sm text-slate-600 max-w-lg mx-auto">
                    Gracias, <strong>{name || 'cliente'}</strong>. Nuestro responsable del área de Lavandería Industrial B2B se pondrá en contacto contigo en el teléfono <strong>{phone}</strong> en breve para enviarte la propuesta personalizada.
                  </p>
                  <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
                    <button
                      onClick={() => setFormSubmitted(false)}
                      className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                    >
                      Enviar otra solicitud
                    </button>
                    <a
                      href="https://wa.me/34637968999?text=Hola,%20acabo%20de%20solicitar%20presupuesto%20de%20lavander%C3%ADa%20industrial%20en%20la%20web"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                      <span>Contactar por WhatsApp ahora</span>
                    </a>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmitQuote} className="space-y-6">
                  
                  {/* Selector 1: Sector / Tipo de Negocio */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                      1. Tipo de Establecimiento o Actividad
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {[
                        { id: 'pisos_turisticos', label: 'Pisos Turísticos', icon: Home },
                        { id: 'hoteles', label: 'Hoteles / Hostales', icon: Building2 },
                        { id: 'gimnasios', label: 'Gimnasios / Spas', icon: Dumbbell },
                        { id: 'clinicas', label: 'Clínicas Privadas', icon: Stethoscope }
                      ].map(type => {
                        const Icon = type.icon;
                        const isSelected = clientType === type.id;
                        return (
                          <button
                            key={type.id}
                            type="button"
                            onClick={() => setClientType(type.id as any)}
                            className={`p-3 rounded-2xl border text-left transition-all flex flex-col items-start gap-2 cursor-pointer ${
                              isSelected
                                ? 'bg-blue-50 border-blue-600 text-blue-900 shadow-sm ring-1 ring-blue-500'
                                : 'bg-slate-50 border-slate-200 hover:bg-white text-slate-700'
                            }`}
                          >
                            <Icon className={`w-5 h-5 ${isSelected ? 'text-blue-600' : 'text-slate-500'}`} />
                            <span className="text-xs font-bold leading-tight">{type.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Selector 2: Prendas principales */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                      2. Prendas y Textiles a Tratar (Selecciona una o varias)
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {[
                        { id: 'sabanas', label: 'Sábanas y Lencería' },
                        { id: 'toallas', label: 'Toallas y Ropa de Baño' },
                        { id: 'batas', label: 'Batas de Clínica' },
                        { id: 'uniformes', label: 'Uniformes Laborales' }
                      ].map(garment => {
                        const isChecked = selectedGarments.includes(garment.id);
                        return (
                          <button
                            key={garment.id}
                            type="button"
                            onClick={() => toggleGarment(garment.id)}
                            className={`p-3 rounded-xl border text-xs font-semibold text-center transition-all flex items-center justify-between cursor-pointer ${
                              isChecked
                                ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            <span>{garment.label}</span>
                            {isChecked && <Check className="w-3.5 h-3.5 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Selector 3: Volumen Estimado Semanal */}
                  <div>
                    <label htmlFor="volume-select" className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                      3. Volumen Estimado Semanal
                    </label>
                    <select
                      id="volume-select"
                      value={estimatedVolume}
                      onChange={(e) => setEstimatedVolume(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="menos-50">Menos de 50 kg / prendas semanales</option>
                      <option value="50-200">50 a 200 kg / prendas semanales (estándar)</option>
                      <option value="200-500">200 a 500 kg / prendas semanales</option>
                      <option value="mas-500">Más de 500 kg / gran establecimiento</option>
                    </select>
                  </div>

                  {/* Contact Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200/80">
                    <div>
                      <label htmlFor="contact-name" className="block text-xs font-semibold text-slate-700 mb-1">
                        Nombre y Apellidos *
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ej. Carmen Navarro"
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="contact-business" className="block text-xs font-semibold text-slate-700 mb-1">
                        Nombre del Negocio / Razón Social
                      </label>
                      <input
                        id="contact-business"
                        type="text"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        placeholder="Ej. Clínica Dental / Apartamentos Playa"
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="contact-phone" className="block text-xs font-semibold text-slate-700 mb-1">
                        Teléfono de Contacto *
                      </label>
                      <input
                        id="contact-phone"
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Ej. +34 637 96 89 99"
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="contact-email" className="block text-xs font-semibold text-slate-700 mb-1">
                        Correo Electrónico *
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Ej. contacto@empresa.com"
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="contact-notes" className="block text-xs font-semibold text-slate-700 mb-1">
                      Comentarios adicionales o frecuencias deseadas
                    </label>
                    <textarea
                      id="contact-notes"
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Detalla si necesitas entregas los fines de semana, número de camas de los apartamentos, etc."
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-[11px] text-slate-500">
                      Tus datos se tratan confidencialmente de acuerdo con el RGPD exclusivamente para la propuesta de servicio.
                    </p>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer hover:translate-y-[-1px] shrink-0"
                    >
                      <Send className="w-4 h-4" />
                      <span>{submitting ? 'Enviando Solicitud...' : 'Solicitar Presupuesto Gratuito'}</span>
                    </button>
                  </div>

                </form>
              )}

            </div>

          </div>
        </section>

        {/* SECTION 5: PREGUNTAS FRECUENTES SOBRE LAVANDERÍA INDUSTRIAL */}
        <section className="py-16 bg-white border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            
            <div className="text-center space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Dudas Habituales
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900">
                Preguntas Frecuentes sobre el Servicio de Lavandería
              </h2>
            </div>

            <div className="space-y-4">
              <details className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 group">
                <summary className="font-bold text-sm text-slate-900 cursor-pointer flex justify-between items-center list-none">
                  <span>¿Cuál es el tiempo de entrega habitual de la ropa limpia?</span>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-open:rotate-90 transition-transform" />
                </summary>
                <p className="text-xs sm:text-sm text-slate-600 mt-3 pt-3 border-t border-slate-200/60 leading-relaxed">
                  El tiempo estándar es de <strong>24 a 48 horas</strong> desde la recogida. Para alojamientos turísticos y hoteles con alta rotación en fin de semana disponemos de servicio express programado con recogida matinal y devolución para el siguiente check-in.
                </p>
              </details>

              <details className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 group">
                <summary className="font-bold text-sm text-slate-900 cursor-pointer flex justify-between items-center list-none">
                  <span>¿Cómo se entregan las sábanas y toallas para pisos turísticos?</span>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-open:rotate-90 transition-transform" />
                </summary>
                <p className="text-xs sm:text-sm text-slate-600 mt-3 pt-3 border-t border-slate-200/60 leading-relaxed">
                  Se entregan <strong>dobladas de forma milimétrica y embolsadas en paquetes de film transparente termo-sellado</strong> higiénico. Cada paquete puede configurarse por cama (sábana bajera + encimera + fundas de almohada) o por set de baño (toalla ducha + lavabo + alfombrín) para que el personal de limpieza solo tenga que abrir y colocar.
                </p>
              </details>

              <details className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 group">
                <summary className="font-bold text-sm text-slate-900 cursor-pointer flex justify-between items-center list-none">
                  <span>¿Cumplís con los protocolos de desinfección higiénico-sanitarios para clínicas privadas?</span>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-open:rotate-90 transition-transform" />
                </summary>
                <p className="text-xs sm:text-sm text-slate-600 mt-3 pt-3 border-t border-slate-200/60 leading-relaxed">
                  Sí. Aplicamos ciclos de lavado térmico y químico con biocidas registrados y dosificación automatizada que garantizan la destrucción de bacterias, virus y hongos patógenos conforme a las normativas de sanidad ambiental y prevención laboral.
                </p>
              </details>

              <details className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 group">
                <summary className="font-bold text-sm text-slate-900 cursor-pointer flex justify-between items-center list-none">
                  <span>¿Hay un volumen mínimo de prendas para contratar el servicio?</span>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-open:rotate-90 transition-transform" />
                </summary>
                <p className="text-xs sm:text-sm text-slate-600 mt-3 pt-3 border-t border-slate-200/60 leading-relaxed">
                  No imponemos mínimos mensuales rígidos. Adaptamos las tarifas al volumen real de cada cliente, tanto para un propietario que gestiona 1 o 2 viviendas turísticas como para hoteles o clínicas de gran volumen con recogida diaria fija.
                </p>
              </details>
            </div>

          </div>
        </section>

      </main>

      {/* Shared Footer with direct links */}
      <Footer
        onOpenLicenseModal={onOpenLicenseModal}
        onOpenSimulator={onNavigateToSimulator}
        onNavigateToLaundry={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        onNavigateToApartments={onNavigateToApartments}
      />

    </div>
  );
};
