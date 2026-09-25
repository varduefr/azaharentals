import React, { useState, useEffect } from 'react';
import { MessageSquare, Phone, Calculator, Award, X } from 'lucide-react';

interface FloatingActionsProps {
  onOpenLicenseModal: () => void;
  onOpenCalculator: () => void;
}

export const FloatingActions: React.FC<FloatingActionsProps> = ({
  onOpenLicenseModal,
  onOpenCalculator
}) => {
  const [showTooltip, setShowTooltip] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(false);
    }, 8000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2.5">
      
      {/* Floating proactive message bubble */}
      {showTooltip && (
        <div className="bg-slate-900 text-white text-xs p-3 rounded-2xl shadow-xl border border-slate-700 max-w-[260px] animate-in fade-in slide-in-from-bottom-2 relative">
          <button 
            onClick={() => setShowTooltip(false)}
            className="absolute top-2 right-2 text-slate-400 hover:text-white"
            aria-label="Cerrar aviso"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          <div className="pr-4 space-y-1">
            <span className="font-bold text-cyan-400 block text-[11px]">
              ¿Dudas sobre tu Licencia Turística?
            </span>
            <p className="text-[11px] text-slate-300">
              Escríbenos por WhatsApp y te decimos en 2 min si tu piso en Castellón es apto.
            </p>
          </div>
        </div>
      )}

      {/* Floating Buttons */}
      <div className="flex items-center gap-2">
        <a
          href="#contacto"
          id="btn-floating-license"
          aria-label="Ir a la sección Estudio de Rentabilidad y Licencia Gratuito"
          className="hidden sm:flex items-center gap-1.5 px-3.5 py-2.5 bg-white text-blue-800 text-xs font-bold rounded-full shadow-lg border border-blue-300 hover:bg-blue-50 transition-all hover:scale-105 cursor-pointer"
        >
          <Award className="w-4 h-4 text-blue-600" />
          <span>Tramitar Licencia</span>
        </a>

        {/* WhatsApp Button */}
        <a
          href="https://wa.me/34637968999?text=Hola,%20quisiera%20información%20sobre%20la%20gestión%20integral%20y%20licencia%20turística%20de%20mi%20apartamento%20en%20Castellón"
          target="_blank"
          rel="noopener noreferrer"
          id="btn-floating-whatsapp"
          className="w-13 h-13 rounded-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-transform cursor-pointer ring-4 ring-green-500/20"
          aria-label="Contactar por WhatsApp"
        >
          <MessageSquare className="w-6 h-6 fill-white" />
        </a>
      </div>

    </div>
  );
};
