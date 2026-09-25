import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Plus, 
  Check, 
  Trash2, 
  Coffee, 
  Car, 
  Wifi, 
  Wind, 
  Waves, 
  Tv, 
  Utensils, 
  Save, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { FeaturedApartment } from '../../data/featuredApartments';
import { updateApartmentApi } from '../../services/apartmentService';

interface AdminAmenitiesModalProps {
  isOpen: boolean;
  apartment: FeaturedApartment | null;
  onClose: () => void;
  onAmenitiesSaved: (updatedApartment: FeaturedApartment) => void;
}

// Predefined catalog of popular hospitality amenities
const SUGGESTED_AMENITIES = [
  'Primera línea de playa (25m)',
  'Parking privado',
  'Cafetera Nespresso',
  'Cafetera italiana',
  'Cafetera Dolce Gusto',
  'Wifi 600Mb',
  'Aire acondicionado',
  'Piscina comunitaria',
  'Vistas al mar',
  'Terraza exterior',
  'Ascensor',
  'Admite mascotas',
  'Cuna de viaje para bebé',
  'Barbacoa',
  'Lavavajillas',
  'Smart TV 55"',
  'Lavadora',
  'Secador de pelo',
  'Calefacción'
];

export const AdminAmenitiesModal: React.FC<AdminAmenitiesModalProps> = ({
  isOpen,
  apartment,
  onClose,
  onAmenitiesSaved
}) => {
  if (!isOpen || !apartment) return null;

  const [amenities, setAmenities] = useState<string[]>(() => {
    const list = [...(apartment.amenities || ['Wifi', 'Aire acondicionado'])];
    // If the apartment is configured as first line beach, make sure the amenity is present
    const hasBeach = list.some(
      (a) => a.toLowerCase().includes('primera línea') || a.toLowerCase().includes('primera linea')
    );
    if (!hasBeach && (apartment.isFirstLineBeach || apartment.distanceToBeach?.toLowerCase().includes('primera'))) {
      list.unshift('Primera línea de playa (25m)');
    }
    return list;
  });
  const [customInput, setCustomInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleToggleSuggested = (item: string) => {
    if (amenities.includes(item)) {
      setAmenities(amenities.filter((a) => a !== item));
    } else {
      setAmenities([...amenities, item]);
    }
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = customInput.trim();
    if (!trimmed) return;
    if (!amenities.includes(trimmed)) {
      setAmenities([...amenities, trimmed]);
    }
    setCustomInput('');
  };

  const handleRemove = (item: string) => {
    setAmenities(amenities.filter((a) => a !== item));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setFeedback(null);
    try {
      const isFirstLine = amenities.some(
        (a) => a.toLowerCase().includes('primera línea') || a.toLowerCase().includes('primera linea')
      );
      const updated = await updateApartmentApi(apartment.id, { 
        amenities,
        isFirstLineBeach: isFirstLine,
        distanceToBeach: isFirstLine 
          ? 'Primera línea (25m)' 
          : (apartment.distanceToBeach?.toLowerCase().includes('primera') ? '50 metros del puerto y playa' : apartment.distanceToBeach)
      });
      setFeedback({
        type: 'success',
        text: '¡Servicios y equipamiento actualizados en la base de datos centralizada!'
      });
      onAmenitiesSaved(updated);
      try {
        window.dispatchEvent(new CustomEvent('azahar_apartments_updated', { detail: updated }));
      } catch {}
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err: any) {
      setFeedback({
        type: 'error',
        text: err.message || 'Error al guardar los servicios.'
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Servicios y Equipamiento (Amenities)</h3>
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

        {feedback && (
          <div className={`mt-4 p-3 rounded-xl text-xs flex items-start gap-2 ${
            feedback.type === 'success' 
              ? 'bg-emerald-950/70 border border-emerald-800 text-emerald-200' 
              : 'bg-rose-950/70 border border-rose-800 text-rose-200'
          }`}>
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            )}
            <span>{feedback.text}</span>
          </div>
        )}

        <div className="my-6 space-y-6">
          
          {/* Current Active Amenities */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Servicios activos en este apartamento ({amenities.length}):
            </label>
            {amenities.length === 0 ? (
              <p className="text-xs text-slate-500 italic p-3 bg-slate-950 rounded-xl border border-slate-800">
                No hay servicios seleccionados. Añade servicios sugeridos abajo o escribe uno nuevo.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2 p-3 bg-slate-950 border border-slate-800 rounded-xl">
                {amenities.map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-950 border border-blue-700/60 text-cyan-200 text-xs font-medium shadow-sm"
                  >
                    <span>{item}</span>
                    <button
                      type="button"
                      onClick={() => handleRemove(item)}
                      className="hover:text-rose-400 p-0.5 rounded cursor-pointer"
                      title="Eliminar servicio"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Add custom amenity */}
          <form onSubmit={handleAddCustom} className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">
              Añadir otro servicio personalizado:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="Ej. Cafetera Nespresso Vertuo, Jacuzzi, Cargador Tesla..."
                className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Añadir</span>
              </button>
            </div>
          </form>

          {/* Suggested Amenities Catalog */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Catálogo de servicios sugeridos (haz clic para activar/desactivar):
            </label>
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTED_AMENITIES.map((sugg) => {
                const isSelected = amenities.includes(sugg);
                return (
                  <button
                    type="button"
                    key={sugg}
                    onClick={() => handleToggleSuggested(sugg)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    {isSelected ? <Check className="w-3.5 h-3.5 text-cyan-400" /> : <Plus className="w-3.5 h-3.5 text-slate-500" />}
                    <span>{sugg}</span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            Aparecerán automáticamente en la ficha del apartamento.
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="button"
              disabled={isSaving}
              onClick={handleSave}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Guardando...' : 'Guardar Servicios'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
