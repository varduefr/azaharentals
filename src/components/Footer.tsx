import React from 'react';
import { 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  Heart,
  FileCheck
} from 'lucide-react';

interface FooterProps {
  onOpenLicenseModal: () => void;
  onOpenSimulator?: () => void;
  onNavigateToLaundry?: () => void;
  onNavigateToApartments?: (apartmentId?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ 
  onOpenLicenseModal, 
  onOpenSimulator,
  onNavigateToLaundry,
  onNavigateToApartments
}) => {
  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Col 1: Brand & Bio */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-lg font-extrabold tracking-tight text-white">
                AZAHAR <span className="text-blue-400">RENTALS</span>
              </span>
            </div>

            <p className="text-slate-400 leading-relaxed text-xs max-w-sm">
              Empresa líder especializada en la gestión integral de apartamentos turísticos y vacacionales en la Costa de Castellón. Tramitamos y entregamos tu Licencia Turística (VT) ante la Generalitat Valenciana y maximizamos tus ingresos con tecnología y servicio hotelero 360°.
            </p>

            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-cyan-400 font-bold text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Empresa Gestora Homologada de Viviendas Turísticas</span>
              </div>
              <p className="text-[10px] text-slate-500">
                Inscrita en el Registro de Turismo de la Comunitat Valenciana conforme al Decreto 9/2024.
              </p>
            </div>
          </div>

          {/* Col 2: Destinos */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Destinos en Castellón
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#destinos" className="hover:text-cyan-400 transition-colors">
                  Gestión Alquiler Peñíscola
                </a>
              </li>
              <li>
                <a href="#destinos" className="hover:text-cyan-400 transition-colors">
                  Gestión Alquiler Vinaròs
                </a>
              </li>
              <li>
                <a href="#destinos" className="hover:text-cyan-400 transition-colors">
                  Gestión Alquiler Benicarló
                </a>
              </li>
              <li>
                <a href="#destinos" className="hover:text-cyan-400 transition-colors">
                  Gestión Alquiler Oropesa del Mar
                </a>
              </li>
              <li>
                <a href="#destinos" className="hover:text-cyan-400 transition-colors">
                  Gestión Alquiler Alcossebre
                </a>
              </li>
              <li>
                <a href="#destinos" className="hover:text-cyan-400 transition-colors">
                  Gestión Alquiler Benicàssim
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Servicios */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Servicios Destacados
            </h4>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={onOpenLicenseModal}
                  className="hover:text-cyan-400 transition-colors text-left text-cyan-400 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <FileCheck className="w-3 h-3" />
                  <span>Tramitación Licencia Turística (VT)</span>
                </button>
              </li>
              <li>
                <a href="#servicios" className="hover:text-cyan-400 transition-colors">
                  Revenue Management & Precios IA
                </a>
              </li>
              <li>
                <a href="#servicios" className="hover:text-cyan-400 transition-colors">
                  Check-in 24/7 y Cerraduras Digitales
                </a>
              </li>
              <li>
                <a 
                  href="/apartamentos-turisticos-castellon" 
                  onClick={(e) => {
                    if (onNavigateToApartments) {
                      e.preventDefault();
                      onNavigateToApartments();
                    }
                  }}
                  className="hover:text-cyan-400 transition-colors cursor-pointer text-cyan-300 font-medium"
                >
                  Apartamentos Turísticos Castellón
                </a>
              </li>
              <li>
                <a 
                  href="/lavanderia-industrial" 
                  onClick={(e) => {
                    if (onNavigateToLaundry) {
                      e.preventDefault();
                      onNavigateToLaundry();
                    }
                  }}
                  className="hover:text-cyan-400 transition-colors cursor-pointer text-cyan-300 font-medium"
                >
                  Lavanderia Industrial B2B
                </a>
              </li>
              <li>
                <a href="#servicios" className="hover:text-cyan-400 transition-colors">
                  Limpieza y Lavandería Hotelera
                </a>
              </li>
              <li>
                <a href="#servicios" className="hover:text-cyan-400 transition-colors">
                  Mantenimiento y Control de Averías
                </a>
              </li>
              <li>
                <a 
                  href="#calculadora" 
                  onClick={(e) => {
                    if (onOpenSimulator) {
                      e.preventDefault();
                      onOpenSimulator();
                    }
                  }}
                  className="hover:text-cyan-400 transition-colors cursor-pointer"
                >
                  Simulador de Ingresos y Rentabilidad (Nueva página)
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Contacto */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Contacto y Atención
            </h4>
            <div className="space-y-2.5">
              <a 
                href="tel:+34637968999" 
                className="flex items-center gap-2 text-slate-300 hover:text-cyan-400 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="font-semibold">+34 637 96 89 99</span>
              </a>

              <a 
                href="mailto:info@azaharrentals.com" 
                className="flex items-center gap-2 text-slate-300 hover:text-cyan-400 transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>info@azaharrentals.com</span>
              </a>

              <div className="flex items-start gap-2 text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                <span>Costa de Azahar, Castellón, España</span>
              </div>

              <div className="pt-2 text-[11px] text-slate-500">
                Atención a propietarios: L-V 09:00 - 20:00 <br />
                Atención a huéspedes: 24 horas / 365 días
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright & legal */}
        <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <div>
            © {new Date().getFullYear()} Azahar Rentals S.L. Todos los derechos reservados.
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <a href="#" className="hover:text-slate-400">Aviso Legal</a>
            <a href="#" className="hover:text-slate-400">Política de Privacidad</a>
            <a href="#" className="hover:text-slate-400">Política de Cookies</a>
            <a href="#" className="hover:text-slate-400">Normativa GVA</a>
            <a 
              href="/azahar-rentals-logo.svg" 
              download="azahar-rentals-logo.svg" 
              className="text-cyan-400/90 hover:text-cyan-300 transition-colors font-medium"
              title="Descargar logotipo oficial en formato vectorial SVG de alta calidad"
            >
              Logo Oficial (SVG)
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};
