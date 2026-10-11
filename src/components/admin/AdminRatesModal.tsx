import React, { useState } from 'react';
import { 
  X, 
  DollarSign, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  Sliders, 
  Plus, 
  Trash2, 
  Info, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { FeaturedApartment } from '../../data/featuredApartments';
import { 
  BookingSeasonRateConfig, 
  getApartmentBookingRates, 
  getDefaultRatesForApartment, 
  saveStoredBookingRates,
  calculateBookingStayRate
} from '../../utils/bookingRates';
import { updateApartmentApi } from '../../services/apartmentService';
import { DatePickerInput, formatToDDMMAAAA } from '../DatePickerInput';

interface AdminRatesModalProps {
  isOpen: boolean;
  apartment: FeaturedApartment | null;
  onClose: () => void;
  onRatesSaved: (updatedApartment: FeaturedApartment) => void;
}

export const AdminRatesModal: React.FC<AdminRatesModalProps> = ({
  isOpen,
  apartment,
  onClose,
  onRatesSaved
}) => {
  if (!isOpen || !apartment) return null;

  const [rates, setRates] = useState<BookingSeasonRateConfig>(() => 
    getApartmentBookingRates(apartment)
  );

  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Simulator test inside modal
  const today = new Date().toISOString().split('T')[0];
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 3);
  const nextWeekStr = nextWeek.toISOString().split('T')[0];

  const [testCheckIn, setTestCheckIn] = useState<string>(today);
  const [testCheckOut, setTestCheckOut] = useState<string>(nextWeekStr);

  // Custom period form
  const [customLabel, setCustomLabel] = useState('');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const [customPrice, setCustomPrice] = useState<number>(apartment.basePricePerNight || 80);

  const testCalculation = calculateBookingStayRate(testCheckIn, testCheckOut, rates);

  const handleAddCustomPeriod = () => {
    if (!customStart || !customEnd || !customPrice) return;
    const newRange = {
      id: 'rng-' + Date.now(),
      label: customLabel.trim() || 'Período Especial Booking',
      startDate: customStart,
      endDate: customEnd,
      pricePerNight: Number(customPrice)
    };
    setRates((prev) => ({
      ...prev,
      customDateRanges: [...(prev.customDateRanges || []), newRange]
    }));
    setCustomLabel('');
    setCustomStart('');
    setCustomEnd('');
  };

  const handleRemoveCustomPeriod = (id: string) => {
    setRates((prev) => ({
      ...prev,
      customDateRanges: (prev.customDateRanges || []).filter((r) => r.id !== id)
    }));
  };

  const handleResetToDefaults = () => {
    const defaults = getDefaultRatesForApartment(apartment.basePricePerNight);
    setRates(defaults);
    setSuccessMsg('Valores reajustados según el precio base del apartamento.');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMsg('');

    try {
      // 1. Guardar en localStorage con evento reactivo inmediato
      saveStoredBookingRates(apartment.id, rates);

      // 2. Persistir en Firestore para todos los visitantes y dispositivos
      const updated = await updateApartmentApi(apartment.id, { rates });

      setSuccessMsg('¡Tarifas guardadas y sincronizadas con éxito!');
      onRatesSaved(updated);
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err: any) {
      console.error('Error guardando tarifas:', err);
      setErrorMsg(err.message || 'Error al persistir las tarifas.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative text-slate-100 max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Configurar Tarifas y Precios de Booking</h3>
              <p className="text-xs text-slate-400">{apartment.name} · {apartment.town} (Base: {apartment.basePricePerNight} €/noche)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Informative Clarification Note */}
        <div className="mt-4 p-3.5 rounded-2xl bg-blue-950/40 border border-blue-800/60 text-xs text-blue-200/90 flex items-start gap-3">
          <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-white">
              Sincronización de Precios vs. Calendario iCal de Booking.com:
            </p>
            <p className="text-[11px] leading-relaxed text-blue-200/80">
              El feed iCal oficial de Booking.com (<code className="text-cyan-300 font-mono">.ics</code>) transmite exclusivamente las <strong>fechas reservadas</strong> para bloquear el calendario. Las plataformas OTA no exportan los precios en iCal.
              Configura aquí tus tarifas por temporada para que coincidan al céntimo con tu cuenta de Booking.com o con tu oferta directa.
            </p>
          </div>
        </div>

        {/* Feedback messages */}
        {successMsg && (
          <div className="mt-3 p-3 rounded-xl bg-emerald-950/70 border border-emerald-800 text-emerald-200 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}
        {errorMsg && (
          <div className="mt-3 p-3 rounded-xl bg-rose-950/70 border border-rose-800 text-rose-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="my-5 space-y-5">
          
          {/* Grid de Temporadas */}
          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              <span>Tarifas por Temporada (€ / noche):</span>
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {/* Temporada Baja */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[11px] font-bold text-blue-400 block">1. Temporada Baja</span>
                <span className="text-[10px] text-slate-500 block">Ene, Feb, Mar, Nov, Dic</span>
                <div className="relative mt-1">
                  <input
                    type="number"
                    min="30"
                    max="600"
                    required
                    value={rates.lowSeason}
                    onChange={(e) => setRates({ ...rates, lowSeason: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono text-sm font-bold focus:border-cyan-400 focus:outline-none pr-6"
                  />
                  <span className="absolute right-2 top-2 text-xs text-slate-400 font-mono">€</span>
                </div>
              </div>

              {/* Temporada Media */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[11px] font-bold text-emerald-400 block">2. Temporada Media</span>
                <span className="text-[10px] text-slate-500 block">Abr, May, Jun, Sep, Oct</span>
                <div className="relative mt-1">
                  <input
                    type="number"
                    min="30"
                    max="600"
                    required
                    value={rates.midSeason}
                    onChange={(e) => setRates({ ...rates, midSeason: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono text-sm font-bold focus:border-cyan-400 focus:outline-none pr-6"
                  />
                  <span className="absolute right-2 top-2 text-xs text-slate-400 font-mono">€</span>
                </div>
              </div>

              {/* Temporada Alta (Julio) */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[11px] font-bold text-amber-400 block">3. Temporada Alta</span>
                <span className="text-[10px] text-slate-500 block">Mes completo de Julio</span>
                <div className="relative mt-1">
                  <input
                    type="number"
                    min="30"
                    max="800"
                    required
                    value={rates.highSeasonJuly}
                    onChange={(e) => setRates({ ...rates, highSeasonJuly: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono text-sm font-bold focus:border-cyan-400 focus:outline-none pr-6"
                  />
                  <span className="absolute right-2 top-2 text-xs text-slate-400 font-mono">€</span>
                </div>
              </div>

              {/* Temporada Punta (Agosto) */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[11px] font-bold text-rose-400 block">4. Temporada Punta</span>
                <span className="text-[10px] text-slate-500 block">Mes completo de Agosto</span>
                <div className="relative mt-1">
                  <input
                    type="number"
                    min="30"
                    max="900"
                    required
                    value={rates.peakSeasonAugust}
                    onChange={(e) => setRates({ ...rates, peakSeasonAugust: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono text-sm font-bold focus:border-cyan-400 focus:outline-none pr-6"
                  />
                  <span className="absolute right-2 top-2 text-xs text-slate-400 font-mono">€</span>
                </div>
              </div>

              {/* Semana Santa / Puentes */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[11px] font-bold text-purple-400 block">5. Semana Santa & Puentes</span>
                <span className="text-[10px] text-slate-500 block">Pascua y Fin de Año</span>
                <div className="relative mt-1">
                  <input
                    type="number"
                    min="30"
                    max="800"
                    required
                    value={rates.easterHoliday}
                    onChange={(e) => setRates({ ...rates, easterHoliday: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono text-sm font-bold focus:border-cyan-400 focus:outline-none pr-6"
                  />
                  <span className="absolute right-2 top-2 text-xs text-slate-400 font-mono">€</span>
                </div>
              </div>

              {/* Suplemento Fin de Semana */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[11px] font-bold text-teal-400 block">6. Extra Fin de Semana</span>
                <span className="text-[10px] text-slate-500 block">Noches de viernes y sábado</span>
                <div className="relative mt-1">
                  <input
                    type="number"
                    min="0"
                    max="200"
                    value={rates.weekendSupplement}
                    onChange={(e) => setRates({ ...rates, weekendSupplement: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono text-sm font-bold focus:border-cyan-400 focus:outline-none pr-6"
                  />
                  <span className="absolute right-2 top-2 text-xs text-slate-400 font-mono">€</span>
                </div>
              </div>
            </div>
          </div>

          {/* Períodos de fechas específicos o promociones */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                <span>Períodos Específicos o Promociones Especiales:</span>
              </span>
              <span className="text-[10px] text-slate-400">Opcional para fechas concretas</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
              <div>
                <label className="block text-[10px] text-slate-400 mb-1">Nombre / Motivo</label>
                <input
                  type="text"
                  placeholder="Ej. Festival FIB"
                  value={customLabel}
                  onChange={(e) => setCustomLabel(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 mb-1">Fecha Inicio</label>
                <DatePickerInput
                  value={customStart}
                  onChange={(val) => setCustomStart(val)}
                  min="2025-01-01"
                  bgClass="bg-slate-900 text-xs py-1.5"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 mb-1">Fecha Fin</label>
                <DatePickerInput
                  value={customEnd}
                  onChange={(val) => setCustomEnd(val)}
                  min={customStart || '2025-01-01'}
                  bgClass="bg-slate-900 text-xs py-1.5"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 mb-1">Tarifa €/noche</label>
                <div className="flex gap-1.5">
                  <div className="relative flex-1">
                    <input
                      type="number"
                      min="30"
                      max="1000"
                      value={customPrice}
                      onChange={(e) => setCustomPrice(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-white font-mono focus:border-cyan-400 focus:outline-none pr-5"
                    />
                    <span className="absolute right-1.5 top-1.5 text-[10px] text-slate-400">€</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddCustomPeriod}
                    disabled={!customStart || !customEnd || !customPrice}
                    className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Añadir</span>
                  </button>
                </div>
              </div>
            </div>

            {/* List of custom ranges */}
            {rates.customDateRanges && rates.customDateRanges.length > 0 && (
              <div className="space-y-1.5 pt-1">
                {rates.customDateRanges.map((rng) => (
                  <div
                    key={rng.id}
                    className="flex items-center justify-between px-3 py-2 bg-slate-900 rounded-lg border border-slate-800 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white">{rng.label}</span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        ({formatToDDMMAAAA(rng.startDate)} - {formatToDDMMAAAA(rng.endDate)})
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-cyan-300">{rng.pricePerNight} €/noche</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveCustomPeriod(rng.id)}
                        className="text-slate-500 hover:text-rose-400 p-1 cursor-pointer"
                        title="Eliminar período"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Simulador Interactivo en Vivo */}
          <div className="p-3.5 rounded-2xl bg-cyan-950/30 border border-cyan-800/40 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Simulador de Precios en Vivo:</span>
              </span>
              <span className="text-[10px] text-slate-400">Comprueba cómo calculará el cliente</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="block text-[10px] text-slate-400 mb-1">Check-in de prueba</label>
                <DatePickerInput
                  value={testCheckIn}
                  onChange={(val) => setTestCheckIn(val)}
                  bgClass="bg-slate-900 text-xs py-1.5"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 mb-1">Check-out de prueba</label>
                <DatePickerInput
                  value={testCheckOut}
                  onChange={(val) => setTestCheckOut(val)}
                  min={testCheckIn}
                  bgClass="bg-slate-900 text-xs py-1.5"
                />
              </div>
            </div>

            <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">
                  Resultado: {testCalculation.nightsCount} noches ({testCalculation.dominantSeason})
                </span>
                <span className="text-cyan-300 font-bold text-xs">
                  Media: {testCalculation.averagePricePerNight} € / noche
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block uppercase">Total estancia</span>
                <span className="text-lg font-black text-white font-mono">{testCalculation.totalPrice} €</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-between">
            <button
              type="button"
              onClick={handleResetToDefaults}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium cursor-pointer transition-colors"
            >
              Restablecer valores según precio base
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-lg transition-all"
              >
                {isSaving ? 'Guardando...' : 'Guardar y Publicar Tarifas'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
};
