import React, { createContext, useContext, useState, useEffect } from 'react';

export interface ThemeConfig {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  vibe: string;
  colors: {
    primary: string;         // e.g. #059669
    primaryHover: string;    // e.g. #047857
    primaryLight: string;    // e.g. #ecfdf5
    primaryBorder: string;   // e.g. #a7f3d0
    secondary: string;       // e.g. #0f172a
    accent: string;          // e.g. #f59e0b
    accentLight: string;     // e.g. #fef3c7
    gradientFrom: string;    // CSS class or hex
    gradientTo: string;      // CSS class or hex
    badgeBg: string;
    badgeText: string;
    heroBadgeBg: string;
    heroBadgeText: string;
  };
  typography: {
    headingFont: 'outfit' | 'serif' | 'sans' | 'space';
    headingFontClass: string;
    bodyFontClass: string;
  };
  cardRadius: 'rounded-xl' | 'rounded-2xl' | 'rounded-3xl';
  buttonRadius: 'rounded-lg' | 'rounded-xl' | 'rounded-full';
  colorKey: 'cobalt';
}

export const DEFINITIVE_THEME: ThemeConfig = {
  id: 'cobalt-proptech',
  name: 'PropTech Azul Cobalto & Océano',
  subtitle: 'Azul Eléctrico & Alta Tecnología',
  description: 'Estilo tecnológico de vanguardia (inspirado en líderes proptech europeos). Maximiza la precisión, algoritmos de precios y gestión profesional.',
  vibe: 'Tecnológico & Ejecutivo',
  colorKey: 'cobalt',
  colors: {
    primary: '#2563eb',
    primaryHover: '#1d4ed8',
    primaryLight: '#eff6ff',
    primaryBorder: '#bfdbfe',
    secondary: '#0f172a',
    accent: '#06b6d4',
    accentLight: '#cffafe',
    gradientFrom: '#2563eb',
    gradientTo: '#0284c7',
    badgeBg: 'bg-blue-100',
    badgeText: 'text-blue-900',
    heroBadgeBg: 'bg-blue-500/20 text-blue-200 border-blue-500/30',
    heroBadgeText: 'text-blue-200'
  },
  typography: {
    headingFont: 'sans',
    headingFontClass: 'font-sans',
    bodyFontClass: 'font-sans'
  },
  cardRadius: 'rounded-3xl',
  buttonRadius: 'rounded-xl'
};

export const THEME_PRESETS: ThemeConfig[] = [
  DEFINITIVE_THEME
];

interface ThemeContextType {
  currentTheme: ThemeConfig;
  setTheme: (themeId: string) => void;
  setFontFamily: (font: 'outfit' | 'serif' | 'sans' | 'space') => void;
  setCardRadius: (radius: 'rounded-xl' | 'rounded-2xl' | 'rounded-3xl') => void;
  setButtonRadius: (radius: 'rounded-lg' | 'rounded-xl' | 'rounded-full') => void;
  isDesignModalOpen: boolean;
  setIsDesignModalOpen: (isOpen: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<ThemeConfig>(DEFINITIVE_THEME);

  const [isDesignModalOpen, setIsDesignModalOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('azahar_theme_preset', DEFINITIVE_THEME.id);
    } catch {
      // Ignore storage restrictions in iframes
    }
    
    // Inject CSS variables to document root
    const root = document.documentElement;
    root.style.setProperty('--color-primary', currentTheme.colors.primary);
    root.style.setProperty('--color-primary-hover', currentTheme.colors.primaryHover);
    root.style.setProperty('--color-primary-light', currentTheme.colors.primaryLight);
    root.style.setProperty('--color-primary-border', currentTheme.colors.primaryBorder);
    root.style.setProperty('--color-secondary', currentTheme.colors.secondary);
    root.style.setProperty('--color-accent', currentTheme.colors.accent);
    root.style.setProperty('--color-accent-light', currentTheme.colors.accentLight);

    // Apply color key class to body
    document.body.dataset.theme = currentTheme.id;
  }, [currentTheme]);

  const setTheme = (themeId: string) => {
    const found = THEME_PRESETS.find(p => p.id === themeId);
    if (found) {
      setCurrentTheme(found);
    }
  };

  const setFontFamily = (font: 'outfit' | 'serif' | 'sans' | 'space') => {
    let fontClass = 'font-outfit';
    if (font === 'serif') fontClass = 'font-serif';
    if (font === 'sans') fontClass = 'font-sans';
    if (font === 'space') fontClass = 'font-space';

    setCurrentTheme(prev => ({
      ...prev,
      typography: {
        ...prev.typography,
        headingFont: font,
        headingFontClass: fontClass
      }
    }));
  };

  const setCardRadius = (radius: 'rounded-xl' | 'rounded-2xl' | 'rounded-3xl') => {
    setCurrentTheme(prev => ({
      ...prev,
      cardRadius: radius
    }));
  };

  const setButtonRadius = (radius: 'rounded-lg' | 'rounded-xl' | 'rounded-full') => {
    setCurrentTheme(prev => ({
      ...prev,
      buttonRadius: radius
    }));
  };

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        setTheme,
        setFontFamily,
        setCardRadius,
        setButtonRadius,
        isDesignModalOpen,
        setIsDesignModalOpen
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    console.warn('useTheme called outside ThemeProvider. Falling back to default preset.');
    return {
      currentTheme: THEME_PRESETS[0],
      setTheme: () => {},
      setFontFamily: () => {},
      setCardRadius: () => {},
      setButtonRadius: () => {},
      isDesignModalOpen: false,
      setIsDesignModalOpen: () => {},
    };
  }
  return context;
};
