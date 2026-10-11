import React, { useState, useRef } from 'react';
import { 
  X, 
  Camera, 
  Upload, 
  Trash2, 
  Star, 
  ArrowUp, 
  ArrowDown, 
  Image as ImageIcon, 
  CheckCircle2, 
  AlertCircle,
  Save
} from 'lucide-react';
import { FeaturedApartment, ApartmentPhoto } from '../../data/featuredApartments';
import { updateApartmentApi } from '../../services/apartmentService';
import { compressImageToDataUrl } from '../../utils/imageCompression';

interface AdminPhotoManagerModalProps {
  isOpen: boolean;
  apartment: FeaturedApartment | null;
  onClose: () => void;
  onPhotosSaved: (updatedApartment: FeaturedApartment) => void;
}

export const AdminPhotoManagerModal: React.FC<AdminPhotoManagerModalProps> = ({
  isOpen,
  apartment,
  onClose,
  onPhotosSaved
}) => {
  if (!isOpen || !apartment) return null;

  const [photos, setPhotos] = useState<ApartmentPhoto[]>(() => [...apartment.photos]);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Handle local image file selections with automatic browser compression
  const handleFilesSelected = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    const readPromises = fileArray.map(async (file, i) => {
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      const optimizedUrl = await compressImageToDataUrl(file, 1200, 0.82);
      return {
        url: optimizedUrl,
        caption: cleanName || `Foto ${photos.length + i + 1}`
      };
    });

    const newPhotos = await Promise.all(readPromises);
    setPhotos((prev) => [...prev, ...newPhotos]);
    setMessage({
      type: 'success',
      text: `¡${newPhotos.length} foto(s) optimizada(s) y añadida(s)! Recuerda hacer clic en "Guardar Fotos" para persistir en la nube.`
    });
  };

  // Set as cover photo (index 0)
  const handleSetCover = (index: number) => {
    if (index === 0) return;
    const item = photos[index];
    const rest = photos.filter((_, i) => i !== index);
    const updated = [item, ...rest];
    setPhotos(updated);
    setMessage({
      type: 'success',
      text: `"${item.caption}" seleccionada como foto de portada.`
    });
  };

  // Move photo up in sequence
  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...photos];
    const temp = updated[index - 1];
    updated[index - 1] = updated[index];
    updated[index] = temp;
    setPhotos(updated);
  };

  // Move photo down in sequence
  const handleMoveDown = (index: number) => {
    if (index === photos.length - 1) return;
    const updated = [...photos];
    const temp = updated[index + 1];
    updated[index + 1] = updated[index];
    updated[index] = temp;
    setPhotos(updated);
  };

  // Delete photo
  const handleDeletePhoto = (index: number) => {
    if (photos.length <= 1) {
      setMessage({
        type: 'error',
        text: 'El apartamento debe conservar al menos 1 fotografía de portada.'
      });
      return;
    }
    const updated = photos.filter((_, i) => i !== index);
    setPhotos(updated);
  };

  // Update caption
  const handleCaptionChange = (index: number, newCaption: string) => {
    const updated = [...photos];
    updated[index] = { ...updated[index], caption: newCaption };
    setPhotos(updated);
  };

  // Save changes to backend database
  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);
    try {
      const updated = await updateApartmentApi(apartment.id, { photos });
      setMessage({
        type: 'success',
        text: '¡Fotografías y portada guardadas correctamente en la base de datos!'
      });
      onPhotosSaved(updated);
      setTimeout(() => {
        onClose();
      }, 1400);
    } catch (err: any) {
      setMessage({
        type: 'error',
        text: err.message || 'Error al guardar las fotografías en el servidor.'
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl relative text-slate-100 max-h-[90vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Gestor de Fotos: {apartment.name}</span>
                <span className="text-xs font-mono font-normal text-cyan-400 bg-cyan-950/60 border border-cyan-800 px-2 py-0.5 rounded-full">
                  {photos.length} fotos
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                {apartment.town} ({apartment.zone}) · Licencia: {apartment.licenseNumber}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback Alert */}
        {message && (
          <div className={`mt-4 p-3 rounded-xl text-xs flex items-start gap-2 shrink-0 ${
            message.type === 'success' 
              ? 'bg-emerald-950/70 border border-emerald-800 text-emerald-200'
              : 'bg-rose-950/70 border border-rose-800 text-rose-200'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        {/* Modal Content - Scrollable */}
        <div className="overflow-y-auto flex-1 my-4 pr-1 space-y-6">
          
          {/* Upload Drop Area */}
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); }}
            onDrop={(e) => {
              e.preventDefault();
              handleFilesSelected(e.dataTransfer.files);
            }}
            className="border-2 border-dashed border-cyan-500/40 hover:border-cyan-400 bg-cyan-950/20 hover:bg-cyan-950/30 rounded-2xl p-6 text-center cursor-pointer transition-all group"
          >
            <input
              type="file"
              ref={fileInputRef}
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFilesSelected(e.target.files)}
            />
            <div className="w-12 h-12 rounded-xl bg-cyan-500/20 text-cyan-300 mx-auto flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Upload className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-white mb-1">
              Haz clic para seleccionar fotos de tu equipo o arrástralas aquí
            </h4>
            <p className="text-xs text-slate-400">
              Formatos recomendados: JPG, PNG, WebP. Puedes subir varias fotos a la vez.
            </p>
          </div>

          {/* Photo Gallery Grid */}
          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-cyan-400" />
              <span>Fotos del Apartamento ({photos.length})</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {photos.map((photo, idx) => {
                const isCover = idx === 0;
                return (
                  <div
                    key={idx}
                    className={`rounded-2xl border p-3 bg-slate-950/80 transition-all ${
                      isCover 
                        ? 'border-cyan-500 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-500' 
                        : 'border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {/* Thumbnail Image */}
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 mb-2">
                      <img
                        src={photo.url.replace(/^\/src\/assets\/images\//, '/images/')}
                        alt={photo.caption}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.currentTarget;
                          target.src = 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80';
                        }}
                      />
                      {isCover && (
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-cyan-500 text-slate-950 font-black text-[10px] uppercase tracking-wider shadow">
                          ★ Portada
                        </span>
                      )}
                      <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-slate-900/80 text-slate-300 font-mono text-[10px]">
                        #{idx + 1}
                      </span>
                    </div>

                    {/* Caption input */}
                    <div className="mb-2">
                      <label className="text-[10px] text-slate-400 font-medium block mb-1">
                        Pie de foto:
                      </label>
                      <input
                        type="text"
                        value={photo.caption}
                        onChange={(e) => handleCaptionChange(idx, e.target.value)}
                        placeholder="Descripción de la foto"
                        className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                      />
                    </div>

                    {/* Actions Bar */}
                    <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMoveUp(idx)}
                          title="Mover arriba"
                          className="p-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === photos.length - 1}
                          onClick={() => handleMoveDown(idx)}
                          title="Mover abajo"
                          className="p-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        {!isCover && (
                          <button
                            type="button"
                            onClick={() => handleSetCover(idx)}
                            title="Establecer como Portada"
                            className="px-2 py-1 rounded bg-cyan-950 hover:bg-cyan-900 border border-cyan-800 text-cyan-300 text-[10px] font-semibold flex items-center gap-1 cursor-pointer"
                          >
                            <Star className="w-3 h-3" />
                            <span>Portada</span>
                          </button>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeletePhoto(idx)}
                        title="Eliminar foto"
                        className="p-1.5 rounded bg-rose-950/60 hover:bg-rose-900 border border-rose-800/60 text-rose-300 hover:text-rose-100 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between shrink-0">
          <p className="text-xs text-slate-400">
            Los cambios se reflejarán en tiempo real en la web pública de huéspedes.
          </p>
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
              className="px-5 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-bold rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Guardando...' : 'Guardar Fotos en Base de Datos'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
