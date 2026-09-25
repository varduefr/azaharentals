import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  AlertCircle, 
  FileCheck, 
  ShieldCheck, 
  ArrowRight, 
  Building2, 
  MapPin, 
  Check, 
  Send,
  Sparkles
} from 'lucide-react';
import { sendEmailNotification } from '../services/emailService';
import { useToast } from '../context/ToastContext';

interface LicenseEligibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessSubmit: (data: any) => void;
}

export const LicenseEligibilityModal: React.FC<LicenseEligibilityModalProps> = ({
  isOpen,
  onClose,
  onSuccessSubmit
}) => {
  const { showLicenseToast } = useToast();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [formData, setFormData] = useState({
    location: 'peniscola',
    communityProhibition: 'no', // no prohibition in bylaws
    hasCertificateHabitability: 'yes',
    hasACorHeating: 'yes',
    ownerName: '',
    phone: '',
    email: '',
    address: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const getLocationLabel = (loc: string) => {
    const map: Record<string, string> = {
      peniscola: 'Peñíscola',
      vinaroz: 'Vinaròs',
      benicarlo: 'Benicarló',
      oropesa: 'Oropesa del Mar',
      alcossebre: 'Alcossebre',
      benicassim: 'Benicàssim',
      moncofa: 'Moncofa / Burriana'
    };
    return map[loc] || loc || 'Costa de Castellón';
  };

  const handleNext = () => {
    if (step < 3) {
      setStep((step + 1) as any);
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep((step - 1) as any);
    }
  };

  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    const locationName = getLocationLabel(formData.location);

    await sendEmailNotification(
      `Nueva Solicitud de Licencia Turística: ${formData.ownerName} (${locationName.toUpperCase()})`,
      {
        formType: 'licencia_turistica',
        nombrePropietario: formData.ownerName,
        telefono: formData.phone,
        email: formData.email,
        municipio: locationName,
        direccionVivienda: formData.address || 'No especificada',
        prohibicionComunidadEstatutos: formData.communityProhibition === 'yes' ? 'Sí prohibido' : 'No hay prohibición',
        cedulaHabitabilidad: formData.hasCertificateHabitability === 'yes' ? 'Sí disponible' : 'No dispone / Desconoce',
        climatizacionAireCalefaccion: formData.hasACorHeating === 'yes' ? 'Sí dispone' : 'No dispone'
      }
    );

    setIsSending(false);
    setIsSubmitted(true);

    showLicenseToast(
      '¡Solicitud de Licencia Turística registrada!',
      `Hemos recibido los datos de tu vivienda en ${locationName}. Nuestro departamento técnico y legal evaluará el informe de compatibilidad municipal (Decreto 9/2024).`,
      {
        badge: 'Licencia Turística (VT) · GVA',
        duration: 7000
      }
    );

    onSuccessSubmit({
      ...formData,
      type: 'license_inquiry'
    });
  };

  const resetModal = () => {
    setIsSubmitted(false);
    setStep(1);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={resetModal}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSubmitted ? (
          <div>
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                <FileCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 leading-tight">
                  Comprobador de Licencia Turística (VT)
                </h3>
                <p className="text-xs text-slate-500">
                  Costa de Castellón · Generalitat Valenciana (Decreto 9/2024)
                </p>
              </div>
            </div>

            {/* Step Indicators */}
            <div className="flex items-center gap-2 mb-6">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex-1">
                  <div 
                    className={`h-1.5 rounded-full transition-all ${
                      s <= step ? 'bg-blue-600' : 'bg-slate-200'
                    }`}
                  />
                </div>
              ))}
            </div>

            {/* Step 1: Ubicación y Comunidad */}
            {step === 1 && (
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-800">
                  Paso 1: ¿Dónde está ubicado tu inmueble?
                </h4>
                
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Municipio de la Costa de Castellón
                  </label>
                  <select
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="peniscola">Peñíscola (Playa Norte / Sur / Casco)</option>
                    <option value="vinaroz">Vinaròs (Playa Fortí / Costa Norte / Centro)</option>
                    <option value="benicarlo">Benicarló (Morrongo / Puerto / Caracola)</option>
                    <option value="oropesa">Oropesa del Mar (La Concha / Marina d'Or / Morro de Gos)</option>
                    <option value="alcossebre">Alcossebre / Alcalà de Xivert (Romana / Las Fuentes)</option>
                    <option value="benicassim">Benicàssim (Voramar / Torre Sant Vicent / Heliópolis)</option>
                    <option value="moncofa">Moncofa / Burriana / Almassora</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    ¿Los estatutos de tu comunidad de propietarios prohíben el alquiler turístico?
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { val: 'no', label: 'No lo prohíben (Permitido)' },
                      { val: 'unknown', label: 'No lo sé / Hay que mirarlo' },
                      { val: 'yes', label: 'Creo que sí' }
                    ].map((opt) => (
                      <button
                        type="button"
                        key={opt.val}
                        onClick={() => setFormData({ ...formData, communityProhibition: opt.val })}
                        className={`p-2.5 text-xs font-medium rounded-lg border text-left transition-all ${
                          formData.communityProhibition === opt.val
                            ? 'bg-blue-50 border-blue-600 text-blue-900 font-bold'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5"
                  >
                    <span>Siguiente</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Cédula y Requisitos Técnicos */}
            {step === 2 && (
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-800">
                  Paso 2: Estado del inmueble y equipamiento
                </h4>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    ¿Dispones de Cédula de Habitabilidad / Licencia de Ocupación vigente?
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { val: 'yes', label: 'Sí, vigente' },
                      { val: 'caducada', label: 'Caducada (Renovar)' },
                      { val: 'unknown', label: 'No estoy seguro' }
                    ].map((opt) => (
                      <button
                        type="button"
                        key={opt.val}
                        onClick={() => setFormData({ ...formData, hasCertificateHabitability: opt.val })}
                        className={`p-2.5 text-xs font-medium rounded-lg border text-left transition-all ${
                          formData.hasCertificateHabitability === opt.val
                            ? 'bg-blue-50 border-blue-600 text-blue-900 font-bold'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    * Si está caducada, nuestros arquitectos técnicos pueden renovarla simultáneamente.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    ¿Cuenta con climatización (Aire Acondicionado / Calefacción)?
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { val: 'yes', label: 'Sí, tiene aire acondicionado' },
                      { val: 'no', label: 'No tiene / Solo ventiladores' }
                    ].map((opt) => (
                      <button
                        type="button"
                        key={opt.val}
                        onClick={() => setFormData({ ...formData, hasACorHeating: opt.val })}
                        className={`p-2.5 text-xs font-medium rounded-lg border text-left transition-all ${
                          formData.hasACorHeating === opt.val
                            ? 'bg-blue-50 border-blue-600 text-blue-900 font-bold'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex justify-between">
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
                  >
                    Atrás
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5"
                  >
                    <span>Ver Diagnóstico y Solicitar</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Diagnóstico Favorable y Datos de Contacto */}
            {step === 3 && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-blue-600 text-white shrink-0 mt-0.5">
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-blue-950">
                      ¡Tu inmueble es 100% elegible para Licencia Turística!
                    </h5>
                    <p className="text-[11px] text-blue-800 mt-0.5">
                      Podemos iniciar el expediente de compatibilidad urbanística con el ayuntamiento y registrarte en Turisme Comunitat Valenciana de inmediato.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nombre y Apellidos *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Carmen García"
                      value={formData.ownerName}
                      onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Teléfono de contacto *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="Ej. 654 00 11 22"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Correo Electrónico *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="carmen@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Dirección aproximada del piso
                    </label>
                    <input
                      type="text"
                      placeholder="Ej. Av. Papa Luna, Peñíscola"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
                  >
                    Atrás
                  </button>

                  <button
                    type="submit"
                    id="btn-modal-submit-license"
                    disabled={isSending}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-75"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSending ? 'Enviando solicitud...' : 'Recibir Propuesta de Tramitación Gratuita'}</span>
                  </button>
                </div>
              </form>
            )}

          </div>
        ) : (
          /* Success Screen */
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              ¡Solicitud de Licencia Recibida con Éxito!
            </h3>
            <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
              Un asesor experto de nuestro equipo en la Costa de Castellón revisará la ficha catastral de tu inmueble y te contactará en menos de 24 horas laborables para iniciar los trámites ante el ayuntamiento y Turisme CV.
            </p>
            <div className="pt-2">
              <button
                onClick={resetModal}
                className="px-6 py-2.5 bg-blue-600 text-white text-xs font-bold rounded-xl shadow hover:bg-blue-700 transition-colors"
              >
                Cerrar y Continuar Navegando
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
