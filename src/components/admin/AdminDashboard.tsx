import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Plus, 
  Search, 
  Filter, 
  Camera, 
  Calendar, 
  Sparkles, 
  Edit, 
  Trash2, 
  ExternalLink, 
  LogOut, 
  KeyRound, 
  Database, 
  Users, 
  BedDouble, 
  Bath, 
  Euro, 
  CheckCircle2, 
  AlertCircle,
  MapPin,
  RefreshCw,
  Eye
} from 'lucide-react';
import { FeaturedApartment } from '../../data/featuredApartments';
import { 
  fetchApartments, 
  deleteApartmentApi, 
  clearStoredAdminSession,
  getStoredAdminUser 
} from '../../services/apartmentService';
import { AdminApartmentEditorModal } from './AdminApartmentEditorModal';
import { AdminPhotoManagerModal } from './AdminPhotoManagerModal';
import { AdminAmenitiesModal } from './AdminAmenitiesModal';
import { AdminIcalModal } from './AdminIcalModal';
import { AdminChangePasswordModal } from './AdminChangePasswordModal';

interface AdminDashboardProps {
  onBackToPublic: () => void;
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToPublic, onLogout }) => {
  const [apartments, setApartments] = useState<FeaturedApartment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTown, setSelectedTown] = useState('all');

  // Modals state
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [apartmentToEdit, setApartmentToEdit] = useState<FeaturedApartment | null>(null);

  const [isPhotoManagerOpen, setIsPhotoManagerOpen] = useState(false);
  const [apartmentForPhotos, setApartmentForPhotos] = useState<FeaturedApartment | null>(null);

  const [isAmenitiesOpen, setIsAmenitiesOpen] = useState(false);
  const [apartmentForAmenities, setApartmentForAmenities] = useState<FeaturedApartment | null>(null);

  const [isIcalOpen, setIsIcalOpen] = useState(false);
  const [apartmentForIcal, setApartmentForIcal] = useState<FeaturedApartment | null>(null);

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  // Global notification banner inside admin
  const [alertNotice, setAlertNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const adminUser = getStoredAdminUser() || { username: 'admin', email: 'admin@azaharrentals.com' };

  const loadData = async () => {
    setIsLoading(true);
    try {
      const list = await fetchApartments();
      setApartments(list);
    } catch (e) {
      console.error('Error loading apartments:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApartmentSaved = (saved: FeaturedApartment) => {
    setApartments((prev) => {
      const idx = prev.findIndex((a) => a.id === saved.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = saved;
        return next;
      }
      return [saved, ...prev];
    });
    setAlertNotice({
      type: 'success',
      text: `Apartamento "${saved.name}" actualizado y sincronizado en tiempo real.`
    });
    setTimeout(() => setAlertNotice(null), 4000);
  };

  const handleDeleteApartment = async (apt: FeaturedApartment) => {
    const confirm = window.confirm(
      `¿Estás seguro de que deseas eliminar permanentemente el apartamento "${apt.name}" de la base de datos?`
    );
    if (!confirm) return;

    try {
      await deleteApartmentApi(apt.id);
      setApartments((prev) => prev.filter((a) => a.id !== apt.id));
      setAlertNotice({
        type: 'success',
        text: `Apartamento "${apt.name}" eliminado correctamente.`
      });
      setTimeout(() => setAlertNotice(null), 4000);
    } catch (err: any) {
      setAlertNotice({
        type: 'error',
        text: err.message || 'Error al eliminar el apartamento.'
      });
    }
  };

  // Filter apartments
  const filteredApartments = apartments.filter((apt) => {
    const matchesSearch = 
      apt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.town.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.licenseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.zone.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTown = selectedTown === 'all' || apt.town.toLowerCase() === selectedTown.toLowerCase();

    return matchesSearch && matchesTown;
  });

  // Calculate stats
  const totalPhotosCount = apartments.reduce((acc, a) => acc + (a.photos?.length || 0), 0);
  const syncedIcalCount = apartments.filter((a) => !!a.bookingIcalUrl).length;
  const uniqueTowns = Array.from(new Set(apartments.map((a) => a.town)));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      
      {/* Top Admin Navbar */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        
        {/* Left: Branding & DB status */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center shadow-md shadow-blue-500/20 text-white">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-white tracking-tight">Azahar Rentals</h1>
              <span className="px-2 py-0.5 rounded-md bg-blue-950 border border-blue-800 text-cyan-300 font-mono text-[10px] font-semibold">
                ADMIN CONSOLE
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Base de Datos Cloud Firestore · Sincronización en Vivo</span>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2.5">
          
          {/* Public web link */}
          <button
            onClick={onBackToPublic}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Ver Web Pública</span>
          </button>

          {/* New Apartment Button (+) */}
          <button
            id="btn-admin-add-apartment"
            onClick={() => {
              setApartmentToEdit(null);
              setIsEditorOpen(true);
            }}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-blue-600/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Agregar Apartamento</span>
          </button>

          {/* Change Password */}
          <button
            onClick={() => setIsPasswordModalOpen(true)}
            title="Cambiar contraseña de administrador"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <KeyRound className="w-4 h-4" />
          </button>

          {/* Logout */}
          <button
            onClick={() => {
              clearStoredAdminSession();
              onLogout();
            }}
            title="Cerrar sesión"
            className="p-2 rounded-xl bg-slate-800 hover:bg-rose-950/80 text-slate-400 hover:text-rose-300 transition-colors cursor-pointer border border-transparent hover:border-rose-800/60"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Notice alert */}
        {alertNotice && (
          <div className={`p-4 rounded-2xl text-xs flex items-center justify-between gap-3 animate-in fade-in duration-200 ${
            alertNotice.type === 'success'
              ? 'bg-emerald-950/80 border border-emerald-800 text-emerald-200'
              : 'bg-rose-950/80 border border-rose-800 text-rose-200'
          }`}>
            <div className="flex items-center gap-2">
              {alertNotice.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              )}
              <span className="font-medium">{alertNotice.text}</span>
            </div>
            <button
              onClick={() => setAlertNotice(null)}
              className="text-slate-400 hover:text-white text-xs cursor-pointer font-bold px-2 py-1"
            >
              ✕
            </button>
          </div>
        )}

        {/* Metrics KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400">Total Alojamientos</span>
              <Building2 className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-white font-mono">{apartments.length}</div>
            <p className="text-[11px] text-slate-500 mt-1">Activos en la plataforma</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400">Fotos en Catálogo</span>
              <Camera className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-bold text-white font-mono">{totalPhotosCount}</div>
            <p className="text-[11px] text-slate-500 mt-1">Fotografías de alta resolución</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400">iCal Booking Conectados</span>
              <Calendar className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-white font-mono">{syncedIcalCount} / {apartments.length}</div>
            <p className="text-[11px] text-slate-500 mt-1">Sincronización en tiempo real</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400">Municipios Cubiertos</span>
              <MapPin className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-white font-mono">{uniqueTowns.length}</div>
            <p className="text-[11px] text-slate-500 mt-1">Peñíscola, Benicarló, Vinaròs...</p>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Search input */}
          <div className="relative w-full sm:w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nombre, municipio o licencia VT..."
              className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Town Filter */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="text-xs text-slate-400 shrink-0">Municipio:</span>
            <select
              value={selectedTown}
              onChange={(e) => setSelectedTown(e.target.value)}
              className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos los municipios ({apartments.length})</option>
              {uniqueTowns.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

        </div>

        {/* Apartments Catalog Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Building2 className="w-4 h-4 text-cyan-400" />
              <span>Catálogo de Apartamentos ({filteredApartments.length})</span>
            </h2>

            <button
              onClick={() => {
                setApartmentToEdit(null);
                setIsEditorOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 text-xs font-bold border border-blue-500/30 cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Añadir Apartamento</span>
            </button>
          </div>

          {isLoading ? (
            <div className="text-center py-16 text-slate-500 text-xs flex flex-col items-center justify-center gap-2">
              <RefreshCw className="w-6 h-6 animate-spin text-blue-500" />
              <span>Cargando datos desde la base de datos central...</span>
            </div>
          ) : filteredApartments.length === 0 ? (
            <div className="text-center py-16 p-8 rounded-3xl bg-slate-900 border border-slate-800 text-slate-400">
              <Building2 className="w-10 h-10 mx-auto text-slate-600 mb-2" />
              <p className="text-sm font-bold text-white mb-1">No se han encontrado apartamentos</p>
              <p className="text-xs text-slate-400 mb-4">Prueba a limpiar los filtros de búsqueda o agrega uno nuevo.</p>
              <button
                onClick={() => {
                  setApartmentToEdit(null);
                  setIsEditorOpen(true);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl"
              >
                + Agregar Nuevo Apartamento
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {filteredApartments.map((apt) => {
                const rawPhoto = apt.photos?.[0]?.url || '/images/peniscola_coast_1788275771316.jpg';
                const coverPhoto = rawPhoto.replace(/^\/src\/assets\/images\//, '/images/');
                const hasIcal = !!apt.bookingIcalUrl;
                const amenitiesList = apt.amenities || ['Wifi', 'Aire acondicionado'];

                return (
                  <div
                    key={apt.id}
                    className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl hover:border-slate-700 transition-all flex flex-col"
                  >
                    {/* Apartment Card Top Image Banner */}
                    <div className="relative aspect-video bg-slate-950 overflow-hidden">
                      <img
                        src={coverPhoto}
                        alt={apt.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.currentTarget;
                          if (!target.dataset.fallbackTried) {
                            target.dataset.fallbackTried = 'true';
                            target.src = '/images/peniscola_coast_1788275771316.jpg';
                          } else {
                            target.src = 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80';
                          }
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                        <span className="px-2.5 py-1 rounded-full bg-slate-900/90 backdrop-blur-md border border-slate-700 text-white text-[11px] font-bold">
                          {apt.town}
                        </span>
                        <span className="px-2.5 py-1 rounded-full bg-blue-950/90 backdrop-blur-md border border-blue-700 text-cyan-300 font-mono text-[11px] font-semibold">
                          {apt.licenseNumber}
                        </span>
                      </div>

                      {/* Quick Photo Count Badge / Action */}
                      <button
                        type="button"
                        onClick={() => {
                          setApartmentForPhotos(apt);
                          setIsPhotoManagerOpen(true);
                        }}
                        className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-slate-950/80 hover:bg-cyan-600 backdrop-blur-md border border-slate-700 hover:border-cyan-500 text-white text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>{apt.photos?.length || 0} fotos</span>
                      </button>

                      {/* Price Tag */}
                      <div className="absolute bottom-3 left-3">
                        <span className="text-xl font-black text-white font-mono">{apt.basePricePerNight} €</span>
                        <span className="text-xs text-slate-300"> / noche</span>
                      </div>
                    </div>

                    {/* Apartment Body Info */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="text-base font-bold text-white tracking-tight">{apt.name}</h3>
                        </div>
                        <p className="text-xs text-slate-400 mb-3 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                          <span>{apt.zone}</span>
                          <span className="text-slate-600">•</span>
                          <span>{apt.distanceToBeach}</span>
                        </p>

                        {/* Specs Grid */}
                        <div className="grid grid-cols-4 gap-2 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 text-center text-[11px] text-slate-300 mb-3">
                          <div>
                            <span className="text-slate-500 block text-[10px]">Huéspedes</span>
                            <span className="font-bold text-white">{apt.maxGuests}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[10px]">Dorms.</span>
                            <span className="font-bold text-white">{apt.bedrooms}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[10px]">Baños</span>
                            <span className="font-bold text-white">{apt.bathrooms}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[10px]">Superficie</span>
                            <span className="font-bold text-white">{apt.squareMeters || '--'} m²</span>
                          </div>
                        </div>

                        {/* Services / Amenities chips */}
                        <div className="mb-3">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-amber-400" />
                              <span>Servicios y Equipamiento ({amenitiesList.length})</span>
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setApartmentForAmenities(apt);
                                setIsAmenitiesOpen(true);
                              }}
                              className="text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer hover:underline"
                            >
                              + Gestionar
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {amenitiesList.slice(0, 5).map((amenity, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-[11px] text-slate-300"
                              >
                                {amenity}
                              </span>
                            ))}
                            {amenitiesList.length > 5 && (
                              <span className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-[11px] text-slate-500">
                                +{amenitiesList.length - 5} más
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Booking iCal Status Box */}
                        <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-blue-400" />
                            <div>
                              <span className="text-[11px] text-slate-400 block">Sincronización Booking.com:</span>
                              <span className={`text-xs font-semibold ${hasIcal ? 'text-emerald-400' : 'text-amber-400'}`}>
                                {hasIcal ? 'Conectado (iCal activo)' : 'Sin vincular'}
                              </span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setApartmentForIcal(apt);
                              setIsIcalOpen(true);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[11px] font-semibold cursor-pointer border border-slate-700"
                          >
                            {hasIcal ? 'Ajustar iCal' : 'Conectar'}
                          </button>
                        </div>
                      </div>

                      {/* Card Bottom Management Toolbar */}
                      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                        
                        {/* Subir/Sustituir Fotos button */}
                        <button
                          type="button"
                          onClick={() => {
                            setApartmentForPhotos(apt);
                            setIsPhotoManagerOpen(true);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-cyan-950/70 hover:bg-cyan-900 border border-cyan-800/60 text-cyan-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Camera className="w-3.5 h-3.5" />
                          <span>Subir Fotos</span>
                        </button>

                        <div className="flex items-center gap-1.5">
                          {/* Edit data */}
                          <button
                            type="button"
                            onClick={() => {
                              setApartmentToEdit(apt);
                              setIsEditorOpen(true);
                            }}
                            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                            title="Editar datos del apartamento"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          {/* Delete apartment */}
                          <button
                            type="button"
                            onClick={() => handleDeleteApartment(apt)}
                            className="p-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-900/40 text-rose-400 hover:text-rose-200 transition-colors cursor-pointer"
                            title="Eliminar apartamento"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </main>

      {/* Admin Modals */}
      {isEditorOpen && (
        <AdminApartmentEditorModal
          isOpen={isEditorOpen}
          apartmentToEdit={apartmentToEdit}
          onClose={() => setIsEditorOpen(false)}
          onSaved={handleApartmentSaved}
        />
      )}

      {isPhotoManagerOpen && (
        <AdminPhotoManagerModal
          isOpen={isPhotoManagerOpen}
          apartment={apartmentForPhotos}
          onClose={() => {
            setIsPhotoManagerOpen(false);
            setApartmentForPhotos(null);
          }}
          onPhotosSaved={handleApartmentSaved}
        />
      )}

      {isAmenitiesOpen && (
        <AdminAmenitiesModal
          isOpen={isAmenitiesOpen}
          apartment={apartmentForAmenities}
          onClose={() => {
            setIsAmenitiesOpen(false);
            setApartmentForAmenities(null);
          }}
          onAmenitiesSaved={handleApartmentSaved}
        />
      )}

      {isIcalOpen && (
        <AdminIcalModal
          isOpen={isIcalOpen}
          apartment={apartmentForIcal}
          onClose={() => {
            setIsIcalOpen(false);
            setApartmentForIcal(null);
          }}
          onIcalSaved={handleApartmentSaved}
        />
      )}

      {isPasswordModalOpen && (
        <AdminChangePasswordModal
          isOpen={isPasswordModalOpen}
          username={adminUser.username || 'admin'}
          onClose={() => setIsPasswordModalOpen(false)}
          onSuccess={() => {
            setAlertNotice({
              type: 'success',
              text: 'Contraseña de administrador cambiada con éxito.'
            });
            setTimeout(() => setAlertNotice(null), 4000);
          }}
        />
      )}

    </div>
  );
};
