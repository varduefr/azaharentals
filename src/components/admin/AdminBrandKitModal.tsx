import React from 'react';
import { 
  X, 
  Download, 
  FileCode, 
  Image as ImageIcon, 
  Sparkles, 
  CheckCircle2, 
  Layers,
  Palette,
  Check
} from 'lucide-react';

interface AdminBrandKitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DownloadOption {
  label: string;
  url: string;
  format: 'svg' | 'png' | 'jpg';
  variant?: 'primary' | 'secondary' | 'accent';
}

interface AssetCard {
  title: string;
  category: string;
  description: string;
  previewUrl: string;
  previewDark?: boolean;
  dimensions: string;
  badge?: string;
  isFeatured?: boolean;
  downloads: DownloadOption[];
}

export const AdminBrandKitModal: React.FC<AdminBrandKitModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const assets: AssetCard[] = [
    {
      title: 'Logotipo sobre Fondo Blanco (Como en la Web)',
      category: 'Fondo Blanco Sólido (#FFFFFF)',
      description: 'Versión idéntica a la barra de navegación de la web principal sobre fondo blanco puro. Listo para pegar en documentos Word, facturas, presupuestos, PDFs e imprenta sin transparencias inesperadas.',
      previewUrl: '/azahar-rentals-logo-fondo-blanco.png',
      previewDark: false,
      dimensions: 'Ultra HD 3040 × 560 px (PNG/JPG) + Vectorial SVG',
      badge: 'FORMATO OFICIAL WEB',
      isFeatured: true,
      downloads: [
        { label: 'Descargar PNG Fondo Blanco (3040px)', url: '/azahar-rentals-logo-fondo-blanco.png', format: 'png', variant: 'primary' },
        { label: 'Descargar JPG Fondo Blanco', url: '/azahar-rentals-logo-fondo-blanco.jpg', format: 'jpg', variant: 'secondary' },
        { label: 'Descargar SVG Fondo Blanco', url: '/azahar-rentals-logo-fondo-blanco.svg', format: 'svg', variant: 'secondary' }
      ]
    },
    {
      title: 'Logotipo Horizontal (Fondo Transparente)',
      category: 'Canal Alfa Transparente',
      description: 'Logotipo maestro con fondo transparente. Diseñado para superponer con precisión sobre cualquier fondo de color, cabeceras, diseños gráficos o soportes textiles.',
      previewUrl: '/azahar-rentals-logo.png',
      previewDark: false,
      dimensions: 'Ultra HD 3040 × 560 px (PNG) + Vectorial SVG',
      downloads: [
        { label: 'Descargar SVG Vectorial', url: '/azahar-rentals-logo.svg', format: 'svg', variant: 'primary' },
        { label: 'Descargar PNG Transparente', url: '/azahar-rentals-logo.png', format: 'png', variant: 'secondary' }
      ]
    },
    {
      title: 'Isotipo Cuadrado sobre Fondo Blanco',
      category: 'Icono & Avatar (Fondo Blanco)',
      description: 'Símbolo del edificio sobre lienzo cuadrado blanco puro. Formato estándar para fotos de perfil de WhatsApp Business, Instagram, ficha de Google Maps y aplicaciones móviles.',
      previewUrl: '/azahar-rentals-isotipo-fondo-blanco.png',
      previewDark: false,
      dimensions: 'Cuadrado 1024 × 1024 px (PNG/JPG/SVG)',
      downloads: [
        { label: 'Descargar PNG (1024x1024)', url: '/azahar-rentals-isotipo-fondo-blanco.png', format: 'png', variant: 'primary' },
        { label: 'Descargar JPG (1024x1024)', url: '/azahar-rentals-isotipo-fondo-blanco.jpg', format: 'jpg', variant: 'secondary' },
        { label: 'Descargar SVG Vectorial', url: '/azahar-rentals-isotipo-fondo-blanco.svg', format: 'svg', variant: 'secondary' }
      ]
    },
    {
      title: 'Logotipo Negativo / Modo Oscuro (White)',
      category: 'Para Fondos Oscuros',
      description: 'Variante con tipografía blanca y cyan brillante sobre fondo transparente para fondos oscuros, fotografía y vídeos corporativos.',
      previewUrl: '/azahar-rentals-logo-white.png',
      previewDark: true,
      dimensions: 'Ultra HD 3040 × 560 px (PNG) + SVG',
      downloads: [
        { label: 'Descargar SVG (Modo Oscuro)', url: '/azahar-rentals-logo-white.svg', format: 'svg', variant: 'primary' },
        { label: 'Descargar PNG Transparente', url: '/azahar-rentals-logo-white.png', format: 'png', variant: 'secondary' }
      ]
    },
    {
      title: 'Isotipo Cuadrado (Fondo Transparente)',
      category: 'Icono & Avatar (Transparente)',
      description: 'Símbolo del edificio con sombra suave integrada y fondo transparente para marcas de agua o sellos.',
      previewUrl: '/azahar-rentals-isotipo.png',
      previewDark: false,
      dimensions: 'Cuadrado 1024 × 1024 px (PNG) + SVG',
      downloads: [
        { label: 'Descargar SVG Vectorial', url: '/azahar-rentals-isotipo.svg', format: 'svg', variant: 'primary' },
        { label: 'Descargar PNG Transparente', url: '/azahar-rentals-isotipo.png', format: 'png', variant: 'secondary' }
      ]
    },
    {
      title: 'Logotipo Vertical / Centrado',
      category: 'Versión Apilada',
      description: 'Composición vertical centrada ideal para cartelería, placas de apartamentos turísticos, rótulos de fachada y bolsas de bienvenida.',
      previewUrl: '/azahar-rentals-logo-vertical-fondo-blanco.png',
      previewDark: false,
      dimensions: 'Cuadrado 2160 × 2160 px (PNG) + SVG',
      downloads: [
        { label: 'Descargar PNG Fondo Blanco', url: '/azahar-rentals-logo-vertical-fondo-blanco.png', format: 'png', variant: 'primary' },
        { label: 'Descargar PNG Transparente', url: '/azahar-rentals-logo-vertical.png', format: 'png', variant: 'secondary' },
        { label: 'Descargar SVG Vectorial', url: '/azahar-rentals-logo-vertical-fondo-blanco.svg', format: 'svg', variant: 'secondary' }
      ]
    },
    {
      title: 'Póster de Presentación Corporativa',
      category: 'Showcase 16:9',
      description: 'Lámina de alta definición con fondo de gradiente premium para presentaciones a propietarios e inversores inmobiliarios.',
      previewUrl: '/azahar-rentals-brand-presentation.jpg',
      previewDark: true,
      dimensions: 'JPEG Full HD 1920 × 1080 px (300 DPI)',
      downloads: [
        { label: 'Descargar Lámina JPG (1920x1080)', url: '/azahar-rentals-brand-presentation.jpg', format: 'jpg', variant: 'accent' }
      ]
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Descarga de Logos Oficiales de Azahar Rentals
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-blue-900/60 text-cyan-300 border border-blue-700/60">
                  Calidad Máxima 300 DPI
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Disponibles en fondo blanco sólido (como en la web), transparentes, vectoriales (SVG) y rasterizados en Ultra HD.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-300 text-sm">
          
          {/* Quick Notice */}
          <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-800/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-white">
                  Colores y Tipografía Oficial de Azahar Rentals
                </p>
                <p className="text-[11px] text-slate-400">
                  Tipografía oficial <strong>Plus Jakarta Sans</strong> (ExtraBold 800 y Bold 700). Los archivos con fondo blanco (#FFFFFF) reproducen exactamente el encabezado del sitio web.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-300 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-700">
              <Palette className="w-3.5 h-3.5 text-cyan-400" />
              <span>#1D4ED8 · #2563EB · #06B6D4</span>
            </div>
          </div>

          {/* Asset Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {assets.map((asset, idx) => (
              <div 
                key={idx}
                className={`border rounded-xl p-4 flex flex-col justify-between hover:border-cyan-500/50 transition-all shadow-md group ${
                  asset.isFeatured 
                    ? 'bg-gradient-to-b from-blue-950/30 to-slate-950 border-blue-700/70 ring-1 ring-blue-500/30' 
                    : 'bg-slate-950 border-slate-800/90'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                        {asset.category}
                      </span>
                      {asset.badge && (
                        <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-md bg-blue-600 text-white shadow-xs">
                          {asset.badge}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {asset.dimensions}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-1.5">
                    {asset.title}
                  </h3>
                  <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                    {asset.description}
                  </p>

                  {/* Visual Preview Box */}
                  <div 
                    className={`rounded-lg p-4 flex items-center justify-center min-h-[120px] max-h-[140px] mb-4 overflow-hidden border shadow-inner ${
                      asset.previewDark 
                        ? 'bg-slate-900 border-slate-800' 
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <img 
                      src={asset.previewUrl} 
                      alt={asset.title}
                      className="max-h-24 w-auto object-contain transition-transform group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                </div>

                {/* Download Actions */}
                <div className="flex flex-col gap-2 pt-2 border-t border-slate-800/80">
                  {asset.downloads.map((dl, dlIdx) => (
                    <a
                      key={dlIdx}
                      href={dl.url}
                      download={dl.url.replace('/', '')}
                      className={`inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all shadow-xs cursor-pointer ${
                        dl.variant === 'primary'
                          ? 'bg-blue-600 hover:bg-blue-500 text-white'
                          : dl.variant === 'accent'
                          ? 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700'
                      }`}
                    >
                      {dl.format === 'svg' ? (
                        <FileCode className="w-3.5 h-3.5 text-cyan-400" />
                      ) : dl.format === 'jpg' ? (
                        <Download className="w-3.5 h-3.5 text-cyan-400" />
                      ) : (
                        <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
                      )}
                      <span>{dl.label}</span>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Technical Specifications */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              Guía de Aplicación de Formatos
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px] text-slate-400">
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="font-semibold text-white block mb-0.5">Fondo Blanco Sólido</span>
                Ideal para documentos impresos, Word, presupuestos, facturas y firmas de email para evitar que se vea gris o negro en visores oscuros.
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="font-semibold text-white block mb-0.5">Fondo Transparente</span>
                Ideal para montajes de diseño, superposición en vídeos, fotografías de apartamentos y creatividades publicitarias.
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="font-semibold text-white block mb-0.5">Formato Vectorial (SVG)</span>
                Escalabilidad infinita para rotulación de coches, carteles de fachada, toldos, roll-ups y material de gran formato.
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 flex items-center justify-between bg-slate-950/90 text-xs">
          <span className="text-slate-500">
            Azahar Rentals S.L. · Identidad Corporativa Oficial · Costa de Castellón
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
