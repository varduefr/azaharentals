import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Link as LinkIcon, 
  ExternalLink,
  ShieldCheck,
  Info
} from 'lucide-react';
import { FeaturedApartment } from '../../data/featuredApartments';
import { syncBookingIcalApi, updateApartmentApi } from '../../services/apartmentService';

interface AdminIcalModalProps {
  isOpen: boolean;
  apartment: FeaturedApartment | null;
  onClose: () => void;
  onIcalSaved: (updatedApartment: FeaturedApartment) => void;
}

export const AdminIcalModal: React.FC<AdminIcalModalProps> = ({
  isOpen,
  apartment,
  onClose,
  onIcalSaved
}) => {
  if (!isOpen || !apartment) return null;

  const [icalUrl, setIcalUrl] = useState(apartment.bookingIcalUrl || '');
  const [isSyncing, setIsSyncing] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string; eventsCount?: number } | null>(null);

  const handleSyncAndSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setResult(null);

    const cleanUrl = icalUrl.trim();
    if (!cleanUrl) {
      setResult({
        success: false,
        message: 'Por favor introduce la URL de exportación de iCal de Booking.com'
      });
      return;
    }

    setIsSyncing(true);
    try {
      // Call server proxy sync which also tests and stores the feed
      const res = await syncBookingIcalApi(apartment.id, cleanUrl);
      const updatedApt = await updateApartmentApi(apartment.id, { bookingIcalUrl: cleanUrl });
      
      setResult({
        success: true,
        message: res.message || 'Sincronización completada con éxito.',
        eventsCount: res.eventsCount
      });
      onIcalSaved(updatedApt);
    } catch (err: any) {
      setResult({
        success: false,
        message: err.message || 'Error al conectar con Booking.com. Comprueba la URL facilitada.'
      });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Sincronización iCal Booking.com</h3>
              <p className="text-xs text-slate-400">{apartment.name} · {apartment.town}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback notification */}
        {result && (
          <div className={`mt-4 p-3 rounded-xl text-xs flex items-start gap-2.5 ${
            result.success 
              ? 'bg-emerald-950/70 border border-emerald-800 text-emerald-200' 
              : 'bg-rose-950/70 border border-rose-800 text-rose-200'
          }`}>
            {result.success ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            )}
            <div>
              <p className="font-semibold">{result.message}</p>
              {result.eventsCount !== undefined && (
                <p className="text-[11px] text-emerald-300/80 mt-0.5">
                  Las fechas reservadas en Booking se bloquearán automáticamente en el calendario público para evitar sobreventas (*overbooking*).
                </p>
              )}
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSyncAndSave} className="my-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
              <span>URL iCal de Exportación (Booking.com)</span>
              <span className="text-[10px] text-cyan-400">https://ical.booking.com/...</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <LinkIcon className="w-4 h-4" />
              </div>
              <input
                type="url"
                required
                value={icalUrl}
                onChange={(e) => setIcalUrl(e.target.value)}
                placeholder="https://ical.booking.com/v1/export?t=..."
                className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Helper box: How to find in Booking */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 text-xs text-slate-300 space-y-2">
            <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
              <Info className="w-4 h-4" />
              <span>¿Cómo obtener este enlace en Booking.com?</span>
            </div>
            <ol className="list-decimal list-inside space-y-1 text-slate-400 text-[11px] pl-1">
              <li>Entra en tu <strong>Extranet de Booking.com</strong>.</li>
              <li>Ve a <strong>Tarifas y Disponibilidad</strong> &gt; <strong>Sincronizar calendarios</strong>.</li>
              <li>Pulsa en <strong>Añadir conexión de calendario</strong> &gt; <strong>Exportar calendario</strong>.</li>
              <li>Copia el enlace que empieza por <code className="text-cyan-300 font-mono">https://ical.booking.com/v1/export?...</code> y pégalo aquí.</li>
            </ol>
          </div>

          {/* Note about rates vs availability */}
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
            <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
            <span>
              <strong>Nota sobre precios:</strong> El protocolo iCal de Booking.com sincroniza exclusivamente la disponibilidad de fechas para evitar reservas duplicadas. Las tarifas nocturnas no viajan dentro del feed iCal; puedes fijar las tarifas por temporada de este apartamento desde el botón <em>Gestionar Tarifas</em> en el panel.
            </span>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl cursor-pointer"
            >
              Cerrar
            </button>
            <button
              type="submit"
              disabled={isSyncing}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Sincronizando...' : 'Sincronizar y Guardar'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
