import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Phone, 
  ShieldCheck, 
  Menu, 
  X, 
  Calculator, 
  Sparkles, 
  Award, 
  ChevronRight, 
  Globe,
  Lock
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
  onOpenLicenseModal: () => void;
  onOpenCalculator: () => void;
  onOpenContact: () => void;
  onNavigateToSimulator?: () => void;
  onNavigateToLaundry?: () => void;
  onNavigateToHome?: (sectionId?: string) => void;
  onNavigateToAdmin?: () => void;
  currentPage?: 'home' | 'simulator' | 'admin' | 'laundry';
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onOpenLicenseModal, 
  onOpenCalculator, 
  onOpenContact,
  onNavigateToSimulator,
  onNavigateToLaundry,
  onNavigateToHome,
  onNavigateToAdmin,
  currentPage = 'home'
}) => {
  const { currentTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lang, setLang] = useState<'ES' | 'EN' | 'VA' | 'FR'>('ES');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleGoToLicenseSection = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (currentPage === 'simulator' || currentPage === 'laundry') {
      if (onNavigateToHome) {
        onNavigateToHome('licencia-turistica');
      }
    } else {
      const element = document.getElementById('licencia-turistica') || document.getElementById('servicio-llave-en-mano');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.location.hash = '#licencia-turistica';
      }
    }
  };

  const handleLinkClick = (href: string, e: React.MouseEvent) => {
    if (href === '/laundry') {
      e.preventDefault();
      if (currentPage === 'laundry') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      if (onNavigateToLaundry) {
        onNavigateToLaundry();
      }
      return;
    }

    if (href === '#calculadora' || href === '/simulador') {
      e.preventDefault();
      if (currentPage === 'simulator') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      if (onNavigateToSimulator) {
        onNavigateToSimulator();
      } else {
        onOpenCalculator();
      }
      return;
    }

    if (currentPage === 'simulator' || currentPage === 'laundry') {
      e.preventDefault();
      const sectionId = href.replace('#', '');
      if (onNavigateToHome) {
        onNavigateToHome(sectionId);
      }
    }
  };

  const navLinks: { label: string; href: string; badge?: string }[] = [
    { label: 'Apartamentos', href: '#apartamentos' },
    { label: 'Servicios 360°', href: '#servicios' },
    { label: 'Lavandería B2B', href: '/laundry' },
    { label: 'Licencia Turística', href: '#licencia-turistica' },
    { label: 'Destinos Castellón', href: '#destinos' },
    { label: 'Simulador', href: '/simulador' },
    { label: 'Comparativa', href: '#comparativa' },
    { label: 'Opiniones', href: '#opiniones' },
    { label: 'FAQ', href: '#faq' }
  ];

  return (
    <>
      {/* Top emergency / trust announcement bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <span 
              className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border"
              style={{
                backgroundColor: `${currentTheme.colors.primary}20`,
                borderColor: `${currentTheme.colors.primary}40`,
                color: currentTheme.colors.primaryLight
              }}
            >
              <ShieldCheck className="w-3 h-3 mr-1" />
              Normativa GVA 2024/2025
            </span>
            <span>
              ¿Tu piso no tiene Licencia Turística? <strong className="text-white font-medium">Nosotros la tramitamos y te la entregamos lista</strong> en Peñíscola, Vinaròs, Benicarló y Oropesa.
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <a 
              href="tel:+34637968999" 
              className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5" style={{ color: currentTheme.colors.primary }} />
              <span className="font-semibold">+34 637 96 89 99</span>
            </a>

            <div className="h-3 w-px bg-slate-700 hidden sm:block"></div>

            <div className="flex items-center gap-1 text-slate-400">
              <Globe className="w-3 h-3 text-slate-400" />
              <select 
                value={lang} 
                onChange={(e) => setLang(e.target.value as any)}
                className="bg-transparent text-xs text-slate-300 cursor-pointer focus:outline-none"
                aria-label="Seleccionar idioma"
              >
                <option value="ES" className="bg-slate-900 text-white">ES (Español)</option>
                <option value="EN" className="bg-slate-900 text-white">EN (English)</option>
                <option value="VA" className="bg-slate-900 text-white">VA (Valencià)</option>
                <option value="FR" className="bg-slate-900 text-white">FR (Français)</option>
              </select>
            </div>

            <div className="h-3 w-px bg-slate-700 hidden sm:block"></div>

            {/* Acceso admin button in top right corner */}
            <button
              type="button"
              onClick={onNavigateToAdmin}
              id="btn-nav-top-admin"
              aria-label="Acceso al panel de administración de apartamentos"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-white text-[11px] font-semibold transition-all border border-slate-700 cursor-pointer shadow-xs"
            >
              <Lock className="w-3 h-3 text-cyan-400" />
              <span>Acceso admin</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main sticky navigation */}
      <header 
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/80 py-3' 
            : 'bg-white border-b border-slate-100 py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <a 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              if (onNavigateToHome) onNavigateToHome();
            }}
            className="flex items-center gap-3 group cursor-pointer"
          >
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform"
              style={{
                background: `linear-gradient(135deg, ${currentTheme.colors.gradientFrom}, ${currentTheme.colors.gradientTo})`
              }}
            >
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <span className={`text-xl font-extrabold tracking-tight text-slate-900 flex items-center gap-1.5 ${currentTheme.typography.headingFontClass}`}>
                AZAHAR <span style={{ color: currentTheme.colors.primary }}>RENTALS</span>
              </span>
              <span className="block text-[10px] uppercase tracking-widest font-semibold text-slate-500">
                Costa de Castellón · Gestión Turística
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleLinkClick(link.href, e)}
                className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1.5 py-1 hover:font-semibold cursor-pointer"
              >
                {link.label}
                {link.badge && (
                  <span 
                    className="px-1.5 py-0.5 text-[10px] font-bold rounded-md"
                    style={{
                      backgroundColor: currentTheme.colors.primaryLight,
                      color: currentTheme.colors.primary,
                      border: `1px solid ${currentTheme.colors.primaryBorder}`
                    }}
                  >
                    {link.badge}
                  </span>
                )}
              </a>
            ))}
          </nav>

          {/* Actions CTA */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              type="button"
              onClick={handleGoToLicenseSection}
              id="btn-nav-license"
              aria-label="Ir a la sección Servicio Exclusivo Llave en Mano para pedir Licencia Turística"
              className={`text-xs font-semibold px-3.5 py-2.5 ${currentTheme.buttonRadius} border transition-all flex items-center gap-1.5 cursor-pointer hover:shadow-xs`}
              style={{
                backgroundColor: currentTheme.colors.primaryLight,
                borderColor: currentTheme.colors.primaryBorder,
                color: currentTheme.colors.primary
              }}
            >
              <Award className="w-4 h-4" />
              <span>Pedir Licencia Turística</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (currentPage === 'simulator') {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  return;
                }
                if (onNavigateToSimulator) {
                  onNavigateToSimulator();
                } else {
                  onOpenCalculator();
                }
              }}
              id="btn-nav-calculator"
              aria-label="Abrir Simulador de Rentabilidad e Ingresos"
              className={`text-xs font-bold px-4 py-2.5 ${currentTheme.buttonRadius} text-white shadow-sm transition-all flex items-center gap-2 hover:translate-y-[-1px] cursor-pointer`}
              style={{
                backgroundColor: currentTheme.colors.primary
              }}
            >
              <Calculator className="w-4 h-4" />
              <span>Calcular Ingresos</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3 animate-in fade-in slide-from-top-2">
            <div className="grid gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => {
                    setMobileMenuOpen(false);
                    handleLinkClick(link.href, e);
                  }}
                  className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center justify-between cursor-pointer"
                >
                  <span>{link.label}</span>
                  {link.badge ? (
                    <span 
                      className="px-2 py-0.5 text-xs font-semibold rounded"
                      style={{
                        backgroundColor: currentTheme.colors.primaryLight,
                        color: currentTheme.colors.primary
                      }}
                    >
                      {link.badge}
                    </span>
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  )}
                </a>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <button
                type="button"
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  handleGoToLicenseSection(e);
                }}
                id="btn-nav-license-mobile"
                aria-label="Ir a la sección Servicio Exclusivo Llave en Mano para pedir Licencia Turística"
                className="w-full text-center text-sm font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 cursor-pointer"
                style={{
                  backgroundColor: currentTheme.colors.primaryLight,
                  color: currentTheme.colors.primary,
                  border: `1px solid ${currentTheme.colors.primaryBorder}`
                }}
              >
                <Award className="w-4 h-4" />
                <span>Pedir Licencia Turística</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onNavigateToSimulator) {
                    onNavigateToSimulator();
                  } else {
                    onOpenCalculator();
                  }
                }}
                className="w-full text-center text-sm font-bold py-2.5 px-4 rounded-lg text-white shadow-md flex items-center justify-center gap-2 cursor-pointer"
                style={{
                  backgroundColor: currentTheme.colors.primary
                }}
              >
                <Calculator className="w-4 h-4" />
                <span>Calcular Ingresos</span>
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

