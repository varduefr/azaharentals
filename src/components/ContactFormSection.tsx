import React, { useState } from 'react';
import { 
  Send, 
  Phone, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  CheckCircle2, 
  MessageSquare,
  Clock,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { ContactFormData } from '../types';
import { sendEmailNotification } from '../services/emailService';
import { useToast } from '../context/ToastContext';

interface ContactFormSectionProps {
  initialData?: any;
  onOpenLicenseModal: () => void;
}

export const ContactFormSection: React.FC<ContactFormSectionProps> = ({ 
  initialData, 
  onOpenLicenseModal 
}) => {
  const { showSuccess, showLicenseToast } = useToast();
  const [formData, setFormData] = useState<ContactFormData>({
    fullName: initialData?.name || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    location: initialData?.location || 'peniscola',
    propertyAddress: '',
    bedrooms: String(initialData?.bedrooms || '2'),
    hasLicense: initialData?.hasLicense === 'yes' ? 'yes' : 'no_need_help',
    message: '',
    preferredContact: 'phone'
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const getMunicipalityName = (loc: string) => {
    const map: Record<string, string> = {
      peniscola: 'Peñíscola',
      vinaroz: 'Vinaròs',
      benicarlo: 'Benicarló',
      oropesa: 'Oropesa del Mar',
      alcossebre: 'Alcossebre',
      benicassim: 'Benicàssim',
      moncofa: 'Moncofa / Burriana',
      castellon: 'Castellón de la Plana'
    };
    return map[loc?.toLowerCase()] || loc || 'Castellón';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    await sendEmailNotification(
      `Nueva Consulta Propietario: ${formData.fullName} (${formData.location.toUpperCase()})`,
      {
        formType: 'contacto_rentabilidad',
        nombreCompleto: formData.fullName,
        email: formData.email,
        telefono: formData.phone,
        municipio: formData.location,
        direccionPropiedad: formData.propertyAddress || 'No especificada',
        numeroDormitorios: formData.bedrooms,
        licenciaTuristica: formData.hasLicense === 'yes' ? 'Dispone de Licencia' : 'Requiere tramitación / Ayuda',
        preferenciaContacto: formData.preferredContact === 'phone' ? 'Teléfono' : 'Email',
        mensajeUsuario: formData.message || 'Sin mensaje adicional'
      }
    );

    setLoading(false);
    setSubmitted(true);

    const muniName = getMunicipalityName(formData.location);
    if (formData.hasLicense === 'no_need_help') {
      showLicenseToast(
        '¡Solicitud de estudio y licencia enviada!',
        `Hemos recibido la consulta para tu vivienda en ${muniName}. Un gestor especializado revisará la viabilidad de la licencia y te contactará.`,
        {
          badge: 'Licencia Turística + Estudio'
        }
      );
    } else {
      showSuccess(
        '¡Consulta enviada con éxito!',
        `Muchas gracias, ${formData.fullName || 'propietario'}. Hemos recibido tu solicitud para ${muniName}. Nos pondremos en contacto contigo hoy mismo.`,
        {
          badge: 'Auditoría de Rentabilidad'
        }
      );
    }
  };

  return (
    <section id="contacto" className="py-20 bg-white relative scroll-mt-20 sm:scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Direct Info & Trust Badges */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Estudio de Rentabilidad y Licencia Gratuito</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Contacto y Asesoramiento para Propietarios en Castellón
            </h2>

            <p className="text-base text-slate-600 leading-relaxed">
              Tanto si quieres empezar a alquilar como si ya tienes un apartamento y buscas optimizar tus ingresos o conseguir tu <strong className="text-slate-900">Licencia Turística oficial</strong>, estamos a tu disposición.
            </p>

            {/* Direct Contact Cards */}
            <div className="space-y-3 pt-2">
              <a 
                href="tel:+34637968999" 
                aria-label="Llamar al teléfono de atención a propietarios de Castellón +34 637 96 89 99"
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-blue-500 hover:bg-blue-50/40 transition-all flex items-center gap-4 group cursor-pointer block"
              >
                <div className="p-3 bg-blue-100 text-blue-700 rounded-xl group-hover:scale-110 transition-transform">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-500 font-medium block">Llámanos directamente</span>
                  <span className="text-base font-bold text-slate-900">+34 637 96 89 99</span>
                </div>
              </a>

              <a 
                href="https://wa.me/34637968999?text=Hola,%20quisiera%20información%20sobre%20la%20gestión%20y%20licencia%20turística%20de%20mi%20apartamento%20en%20Castellón"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Contactar por WhatsApp con un asesor de alquiler turístico en Castellón"
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-green-500 hover:bg-green-50/40 transition-all flex items-center gap-4 group cursor-pointer block"
              >
                <div className="p-3 bg-green-600 text-white rounded-xl group-hover:scale-110 transition-transform shadow-sm">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-500 font-medium block">WhatsApp Inmediato</span>
                  <span className="text-base font-bold text-slate-900">Chatear con un Asesor (+34 637 96 89 99)</span>
                </div>
              </a>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-4">
                <div className="p-3 bg-slate-200 text-slate-700 rounded-xl">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-500 font-medium block">Oficinas y Cobertura Operativa</span>
                  <span className="text-xs font-bold text-slate-900 block">
                    Peñíscola · Vinaròs · Benicarló · Oropesa del Mar · Benicàssim
                  </span>
                </div>
              </div>
            </div>

            {/* License guarantee note */}
            <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2 border border-blue-900/60">
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-400">
                <ShieldCheck className="w-4 h-4" />
                <span>Gestoría Homologada de Alojamientos Turísticos</span>
              </div>
              <p className="text-xs text-blue-100 leading-relaxed">
                Nos encargamos del 100% de la tramitación de licencias ante la Generalitat Valenciana sin que tengas que desplazarte.
              </p>
            </div>

          </div>

          {/* Right Column: Lead Form Card */}
          <div className="lg:col-span-7">
            <article 
              aria-label="Formulario de solicitud de estudio de rentabilidad y gestión de licencia turística"
              className="bg-slate-50 rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl"
            >
              
              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-1">
                    <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                      Solicita tu Estudio de Rentabilidad y Licencia
                    </h3>
                    <p className="text-xs text-slate-600">
                      Rellena este breve formulario y te enviaremos una propuesta económica personalizada en menos de 24 horas.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Nombre completo *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ej. Manuel Navarro"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Teléfono / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="Ej. 612 34 56 78"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Correo electrónico *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="manuel@ejemplo.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Municipio del apartamento *
                      </label>
                      <select
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
                      >
                        <option value="peniscola">Peñíscola</option>
                        <option value="vinaroz">Vinaròs (Vinaroz)</option>
                        <option value="benicarlo">Benicarló</option>
                        <option value="oropesa">Oropesa del Mar</option>
                        <option value="alcossebre">Alcossebre / Alcalà de Xivert</option>
                        <option value="benicassim">Benicàssim</option>
                        <option value="castellon">Castellón de la Plana / Grao</option>
                        <option value="otro">Otro municipio en Castellón</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Dormitorios
                      </label>
                      <select
                        value={formData.bedrooms}
                        onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
                      >
                        <option value="1">1 dormitorio (Estudio / Apartamento)</option>
                        <option value="2">2 dormitorios</option>
                        <option value="3">3 dormitorios</option>
                        <option value="4">4 o más dormitorios / Villa</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        ¿Dispones de Licencia Turística (VT)? *
                      </label>
                      <select
                        value={formData.hasLicense}
                        onChange={(e) => setFormData({ ...formData, hasLicense: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
                      >
                        <option value="no_need_help">No tengo (Deseo que la tramitéis vosotros)</option>
                        <option value="yes">Sí, ya tengo número de registro VT</option>
                        <option value="in_progress">En trámite / No estoy seguro</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Comentarios o detalles de la vivienda (opcional)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Ej. Urbanización con piscina, primera línea de playa, reformado recientemente..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    ></textarea>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      id="btn-contact-submit"
                      disabled={loading}
                      aria-label="Enviar solicitud de estudio gratuito de rentabilidad y gestión de licencia turística"
                      className="w-full py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs sm:text-sm tracking-wide shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer hover:translate-y-[-1px]"
                    >
                      {loading ? (
                        <span>Enviando solicitud...</span>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Solicitar Estudio de Rentabilidad y Gestión de Licencia</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-center text-[11px] text-slate-500">
                    Tus datos están protegidos conforme al RGPD. No compartimos tu información con terceros.
                  </p>

                </form>
              ) : (
                <div className="text-center py-10 space-y-4">
                  <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">
                    ¡Gracias por contactar con Azahar Rentals!
                  </h3>
                  <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                    Hemos recibido correctamente los datos de tu vivienda en <strong className="text-slate-900">{formData.location}</strong>. Uno de nuestros gestores turísticos se pondrá en contacto contigo hoy mismo para presentarte la auditoría de ingresos y resolver cualquier trámite de tu licencia turística.
                  </p>
                  <div className="pt-4">
                    <button
                      onClick={() => setSubmitted(false)}
                      className="px-6 py-2.5 bg-slate-900 text-white text-xs font-semibold rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      Enviar otra consulta
                    </button>
                  </div>
                </div>
              )}

            </article>
          </div>

        </div>

      </div>
    </section>
  );
};
