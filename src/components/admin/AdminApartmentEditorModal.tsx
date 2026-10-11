import React, { useState } from 'react';
import { 
  X, 
  Building2, 
  Save, 
  MapPin, 
  Euro, 
  Users, 
  BedDouble, 
  Bath, 
  FileText, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2,
  Plus
} from 'lucide-react';
import { FeaturedApartment } from '../../data/featuredApartments';
import { createApartmentApi, updateApartmentApi } from '../../services/apartmentService';

interface AdminApartmentEditorModalProps {
  isOpen: boolean;
  apartmentToEdit: FeaturedApartment | null; // null means create new (+)
  onClose: () => void;
  onSaved: (apartment: FeaturedApartment) => void;
}

const CASTELLON_TOWNS = [
  'Peñíscola',
  'Benicarló',
  'Vinaròs',
  'Oropesa del Mar',
  'Alcossebre',
  'Benicàssim',
  'Castellón de la Plana',
  'Moncofa'
];

export const AdminApartmentEditorModal: React.FC<AdminApartmentEditorModalProps> = ({
  isOpen,
  apartmentToEdit,
  onClose,
  onSaved
}) => {
  if (!isOpen) return null;

  const isEditing = !!apartmentToEdit;

  const [formData, setFormData] = useState({
    name: apartmentToEdit?.name || '',
    town: apartmentToEdit?.town || 'Peñíscola',
    zone: apartmentToEdit?.zone || 'Playa / Centro',
    licenseNumber: apartmentToEdit?.licenseNumber || 'VT-42000-CS',
    basePricePerNight: apartmentToEdit?.basePricePerNight || 75,
    maxGuests: apartmentToEdit?.maxGuests || 4,
    bedrooms: apartmentToEdit?.bedrooms || 2,
    bathrooms: apartmentToEdit?.bathrooms || 1,
    squareMeters: apartmentToEdit?.squareMeters || 80,
    description: apartmentToEdit?.description || '',
    bookingIcalUrl: apartmentToEdit?.bookingIcalUrl || '',
    active: apartmentToEdit?.active ?? true
  });

  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.name.trim()) {
      setErrorMsg('El nombre del apartamento es obligatorio.');
      return;
    }

    setIsSaving(true);
    try {
      const payload: Partial<FeaturedApartment> = {
        name: formData.name.trim(),
        town: formData.town,
        zone: formData.zone.trim(),
        licenseNumber: formData.licenseNumber.trim(),
        basePricePerNight: Number(formData.basePricePerNight) || 50,
        maxGuests: Number(formData.maxGuests) || 1,
        bedrooms: Number(formData.bedrooms) || 1,
        bathrooms: Number(formData.bathrooms) || 1,
        squareMeters: Number(formData.squareMeters) || 60,
        description: formData.description,
        bookingIcalUrl: formData.bookingIcalUrl,
        rates: apartmentToEdit?.rates,
        active: formData.active
      };

      let savedResult: FeaturedApartment;
      if (isEditing && apartmentToEdit) {
        savedResult = await updateApartmentApi(apartmentToEdit.id, payload);
      } else {
        savedResult = await createApartmentApi({
          ...payload,
          rating: 5.0,
          reviewsCount: 1,
          amenities: ['Parking privado', 'Cafetera Nespresso', 'Wifi 600Mb', 'Aire acondicionado'],
          highlights: [
            'Alojamiento con Licencia Turística Oficial homologada por GVA',
            'Completamente equipado y listo para huéspedes vacacionales'
          ],
          photos: [
            {
              url: '/images/peniscola_balcon_terraza_1788561222890.jpg',
              caption: 'Foto de Portada'
            }
          ]
        });
      }
      onSaved(savedResult);
      try {
        window.dispatchEvent(new CustomEvent('azahar_apartments_updated', { detail: savedResult }));
      } catch {}
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al guardar el apartamento.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative text-slate-100 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
              {isEditing ? <Building2 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {isEditing ? 'Editar Datos del Apartamento' : 'Agregar Nuevo Apartamento Turístico'}
              </h3>
              <p className="text-xs text-slate-400">
                {isEditing ? `ID: ${apartmentToEdit.id}` : 'Se publicará en el catálogo web en tiempo real'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="mt-4 p-3 rounded-xl bg-rose-950/70 border border-rose-800 text-rose-200 text-xs flex items-start gap-2 shrink-0">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form Body - Scrollable */}
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 my-4 pr-1 space-y-4">
          
          {/* Name & Town */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Nombre Comercial del Apartamento *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ej. Ático Mirador del Castillo"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Municipio (Costa de Castellón)
              </label>
              <select
                value={formData.town}
                onChange={(e) => setFormData({ ...formData, town: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {CASTELLON_TOWNS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Zone & Official Tourist License VT */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Zona / Barrio
              </label>
              <input
                type="text"
                required
                value={formData.zone}
                onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
                placeholder="Ej. Playa Norte / Primera Línea"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                <span>Nº Licencia Turística (GVA) *</span>
                <span className="text-[10px] text-cyan-400">Decreto Ley 9/2024</span>
              </label>
              <input
                type="text"
                required
                value={formData.licenseNumber}
                onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                placeholder="VT-42819-CS"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-cyan-300 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Tarifa Base y Superficie */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                <Euro className="w-3.5 h-3.5 text-emerald-400" />
                <span>Tarifa Base / Noche (€) *</span>
              </label>
              <input
                type="number"
                min="20"
                max="2000"
                required
                value={formData.basePricePerNight}
                onChange={(e) => setFormData({ ...formData, basePricePerNight: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Superficie Total (m²)
              </label>
              <input
                type="number"
                min="20"
                max="1000"
                value={formData.squareMeters}
                onChange={(e) => setFormData({ ...formData, squareMeters: Number(e.target.value) })}
                placeholder="85"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono"
              />
            </div>
          </div>

          {/* Bloque: Capacidad y Distribución Oficial */}
          <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-4 h-4 text-cyan-400" />
                Capacidad y Distribución (Visible en Ficha y Modal de Reserva)
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 border border-cyan-700/60 text-cyan-300 font-semibold">
                Sincronización en tiempo real
              </span>
            </div>

            {/* Número de Personas Máximo, Habitaciones y Baños */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Nº Personas Máx. *</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max="25"
                  required
                  value={formData.maxGuests}
                  onChange={(e) => setFormData({ ...formData, maxGuests: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white font-mono font-bold focus:ring-2 focus:ring-cyan-500"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">Huéspedes permitidos</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                  <BedDouble className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Nº Habitaciones *</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max="15"
                  required
                  value={formData.bedrooms}
                  onChange={(e) => setFormData({ ...formData, bedrooms: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white font-mono font-bold focus:ring-2 focus:ring-cyan-500"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">Dormitorios</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                  <Bath className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Nº Baños *</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  required
                  value={formData.bathrooms}
                  onChange={(e) => setFormData({ ...formData, bathrooms: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white font-mono font-bold focus:ring-2 focus:ring-cyan-500"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">Cuartos de baño</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Descripción para Huéspedes
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe los puntos fuertes del alojamiento, vistas, entorno y comodidades..."
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Booking iCal feed url */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              URL Sincronización iCal Booking.com (Opcional)
            </label>
            <input
              type="url"
              value={formData.bookingIcalUrl}
              onChange={(e) => setFormData({ ...formData, bookingIcalUrl: e.target.value })}
              placeholder="https://ical.booking.com/v1/export?t=..."
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white placeholder-slate-600"
            />
          </div>

        </form>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between shrink-0">
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
            onClick={handleSubmit}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Guardando...' : isEditing ? 'Guardar Cambios' : 'Crear y Publicar Apartamento'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
