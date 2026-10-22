import React from 'react';
import { 
  X, 
  Download, 
  FileCode, 
  Image as ImageIcon, 
  Sparkles, 
  CheckCircle2, 
  Layers,
  Palette
} from 'lucide-react';

interface AdminBrandKitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AssetCard {
  title: string;
  category: string;
  description: string;
  previewUrl: string;
  previewDark?: boolean;
  svgUrl?: string;
  pngUrl?: string;
  jpgUrl?: string;
  dimensions: string;
}

export const AdminBrandKitModal: React.FC<AdminBrandKitModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const assets: AssetCard[] = [
    {
      title: 'Logotipo Horizontal Oficial',
      category: 'Versión Principal',
      description: 'Logotipo maestro para documentos, web, facturas, membretes y soportes de fondo claro.',
      previewUrl: '/azahar-rentals-logo.png',
      previewDark: false,
      svgUrl: '/azahar-rentals-logo.svg',
      pngUrl: '/azahar-rentals-logo.png',
      dimensions: 'Vectorial SVG + PNG 3040 x 560 px (Ultra HD)'
    },
    {
      title: 'Logotipo Horizontal Negativo (White)',
      category: 'Para Fondos Oscuros',
      description: 'Variante con tipografía blanca y cyan brillante para fondos oscuros, fotografía y vídeos.',
      previewUrl: '/azahar-rentals-logo-white.png',
      previewDark: true,
      svgUrl: '/azahar-rentals-logo-white.svg',
      pngUrl: '/azahar-rentals-logo-white.png',
      dimensions: 'Vectorial SVG + PNG 3040 x 560 px (Ultra HD)'
    },
    {
      title: 'Isotipo Oficial / Símbolo Cuadrado',
      category: 'Icono & Avatar',
      description: 'Símbolo icónico de la marca para foto de perfil de WhatsApp, Instagram, favicons y apps.',
      previewUrl: '/azahar-rentals-isotipo.png',
      previewDark: false,
      svgUrl: '/azahar-rentals-isotipo.svg',
      pngUrl: '/azahar-rentals-isotipo.png',
      dimensions: 'Vectorial SVG + PNG 1024 x 1024 px'
    },
    {
      title: 'Logotipo Vertical / Centrado',
      category: 'Versión Apilada',
      description: 'Composición centrada ideal para cartelería, bolsas de bienvenida, placas y rótulos verticales.',
      previewUrl: '/azahar-rentals-logo-vertical.png',
      previewDark: false,
      svgUrl: '/azahar-rentals-logo-vertical.svg',
      pngUrl: '/azahar-rentals-logo-vertical.png',
      dimensions: 'Vectorial SVG + PNG 2160 x 2160 px'
    },
    {
      title: 'Póster de Presentación de Marca',
      category: 'Showcase 16:9',
      description: 'Lámina de alta definición con fondo de gradiente premium para presentaciones corporativas.',
      previewUrl: '/azahar-rentals-brand-presentation.jpg',
      previewDark: true,
      jpgUrl: '/azahar-rentals-brand-presentation.jpg',
      dimensions: 'JPEG Full HD 1920 x 1080 px (300 DPI)'
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
                Descarga de Logos Oficiales
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-blue-900/60 text-cyan-300 border border-blue-700/60">
                  Calidad Máxima 300 DPI
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Formatos vectoriales escalables (SVG) y rasterizados en ultra alta resolución (PNG transparente y JPG).
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
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
                  Tipografía Oficial: Plus Jakarta Sans ExtraBold + Bold
                </p>
                <p className="text-[11px] text-slate-400">
                  Los archivos SVG vectoriales tienen tipografía incrustada para editarse e imprimirse sin perder calidad a cualquier escala.
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
                className="bg-slate-950 border border-slate-800/90 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition-all shadow-md group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                      {asset.category}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {asset.dimensions}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white mb-1">
                    {asset.title}
                  </h3>
                  <p className="text-xs text-slate-400 mb-3">
                    {asset.description}
                  </p>

                  {/* Visual Preview Box */}
                  <div 
                    className={`rounded-lg p-4 flex items-center justify-center min-h-[120px] max-h-[140px] mb-4 overflow-hidden border ${
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
                <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800/80">
                  {asset.svgUrl && (
                    <a
                      href={asset.svgUrl}
                      download={asset.svgUrl.replace('/', '')}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors shadow-xs"
                    >
                      <FileCode className="w-3.5 h-3.5" />
                      <span>Descargar SVG</span>
                    </a>
                  )}

                  {asset.pngUrl && (
                    <a
                      href={asset.pngUrl}
                      download={asset.pngUrl.replace('/', '')}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold text-xs transition-colors border border-slate-700"
                    >
                      <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Descargar PNG</span>
                    </a>
                  )}

                  {asset.jpgUrl && (
                    <a
                      href={asset.jpgUrl}
                      download={asset.jpgUrl.replace('/', '')}
                      className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold text-xs transition-colors shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Descargar Lámina JPG (1920x1080)</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Technical Specifications */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              Especificaciones de Aplicación de Marca
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px] text-slate-400">
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="font-semibold text-slate-300 block mb-0.5">Rotulación & Gran Formato</span>
                Usa siempre el archivo <strong>.SVG</strong>. No se pixela a ningún tamaño (vallas publicitarias, vinilos, toldos).
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="font-semibold text-slate-300 block mb-0.5">Redes Sociales & Apps</span>
                Usa el <strong>Isotipo PNG (1024x1024)</strong> para avatares redondos o cuadrados de WhatsApp Business, Instagram o Google Maps.
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="font-semibold text-slate-300 block mb-0.5">Papelería & Facturas</span>
                Usa el <strong>Logotipo Horizontal PNG</strong> sobre fondo blanco o el SVG importado directamente en Office/Google Docs.
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 flex items-center justify-between bg-slate-950/90 text-xs">
          <span className="text-slate-500">
            Azahar Rentals S.L. · Identidad Corporativa Oficial
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
