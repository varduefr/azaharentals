import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { 
  CheckCircle2, 
  Award, 
  AlertCircle, 
  Info, 
  X, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export type ToastType = 'success' | 'license' | 'info' | 'error';

export interface ToastOptions {
  title: string;
  description?: string;
  type?: ToastType;
  duration?: number; // ms, default 5500
  badge?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface ToastItem extends ToastOptions {
  id: string;
  createdAt: number;
}

interface ToastContextType {
  toasts: ToastItem[];
  showToast: (options: ToastOptions) => string;
  showSuccess: (title: string, description?: string, options?: Partial<ToastOptions>) => string;
  showLicenseToast: (title: string, description?: string, options?: Partial<ToastOptions>) => string;
  showInfo: (title: string, description?: string, options?: Partial<ToastOptions>) => string;
  showError: (title: string, description?: string, options?: Partial<ToastOptions>) => string;
  dismissToast: (id: string) => void;
  clearAllToasts: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timersRef = useRef<Map<string, { timeoutId: NodeJS.Timeout; remaining: number; startedAt: number }>>(new Map());

  const dismissToast = useCallback((id: string) => {
    const timerData = timersRef.current.get(id);
    if (timerData) {
      clearTimeout(timerData.timeoutId);
      timersRef.current.delete(id);
    }
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clearAllToasts = useCallback(() => {
    timersRef.current.forEach(({ timeoutId }) => clearTimeout(timeoutId));
    timersRef.current.clear();
    setToasts([]);
  }, []);

  const showToast = useCallback(
    ({
      title,
      description,
      type = 'success',
      duration = 5500,
      badge,
      action
    }: ToastOptions): string => {
      const id = 'toast-' + Math.random().toString(36).substring(2, 9) + '-' + Date.now();

      const newToast: ToastItem = {
        id,
        title,
        description,
        type,
        duration,
        badge,
        action,
        createdAt: Date.now()
      };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        const timeoutId = setTimeout(() => {
          dismissToast(id);
        }, duration);

        timersRef.current.set(id, {
          timeoutId,
          remaining: duration,
          startedAt: Date.now()
        });
      }

      return id;
    },
    [dismissToast]
  );

  const showSuccess = useCallback(
    (title: string, description?: string, options?: Partial<ToastOptions>) => {
      return showToast({
        title,
        description,
        type: 'success',
        badge: options?.badge || 'Confirmación Exitosa',
        ...options
      });
    },
    [showToast]
  );

  const showLicenseToast = useCallback(
    (title: string, description?: string, options?: Partial<ToastOptions>) => {
      return showToast({
        title,
        description,
        type: 'license',
        badge: options?.badge || 'GVA Decreto 9/2024 · Licencia Turística (VT)',
        duration: options?.duration || 6500,
        ...options
      });
    },
    [showToast]
  );

  const showInfo = useCallback(
    (title: string, description?: string, options?: Partial<ToastOptions>) => {
      return showToast({
        title,
        description,
        type: 'info',
        ...options
      });
    },
    [showToast]
  );

  const showError = useCallback(
    (title: string, description?: string, options?: Partial<ToastOptions>) => {
      return showToast({
        title,
        description,
        type: 'error',
        ...options
      });
    },
    [showToast]
  );

  return (
    <ToastContext.Provider
      value={{
        toasts,
        showToast,
        showSuccess,
        showLicenseToast,
        showInfo,
        showError,
        dismissToast,
        clearAllToasts
      }}
    >
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast debe ser utilizado dentro de un ToastProvider');
  }
  return context;
};

// Component for rendering toast list with animations and accessible markup
interface ToastContainerProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  return (
    <aside
      id="azahar-toast-notifications"
      aria-live="polite"
      aria-atomic="true"
      aria-label="Notificaciones del sistema"
      className="fixed bottom-4 sm:bottom-6 right-0 sm:right-6 z-[99999] flex flex-col gap-3 w-full sm:max-w-md px-4 sm:px-0 pointer-events-none"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastCard key={toast.id} toast={toast} onDismiss={() => onDismiss(toast.id)} />
        ))}
      </AnimatePresence>
    </aside>
  );
};

interface ToastCardProps {
  toast: ToastItem;
  onDismiss: () => void;
}

const ToastCard: React.FC<ToastCardProps> = ({ toast, onDismiss }) => {
  const duration = toast.duration || 5500;

  // Icon, color accents and style by toast type
  const getThemeConfig = () => {
    switch (toast.type) {
      case 'license':
        return {
          icon: <Award className="w-5 h-5 text-cyan-400" />,
          iconBg: 'bg-cyan-950/80 border-cyan-700/50 text-cyan-300',
          accentBorder: 'border-cyan-500/40',
          badgeBg: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
          progressBarBg: 'bg-cyan-400',
          defaultBadge: 'Licencia Turística (VT)'
        };
      case 'info':
        return {
          icon: <Sparkles className="w-5 h-5 text-blue-400" />,
          iconBg: 'bg-blue-950/80 border-blue-700/50 text-blue-300',
          accentBorder: 'border-blue-500/40',
          badgeBg: 'bg-blue-500/10 text-blue-300 border-blue-500/30',
          progressBarBg: 'bg-blue-400',
          defaultBadge: 'Información'
        };
      case 'error':
        return {
          icon: <AlertCircle className="w-5 h-5 text-rose-400" />,
          iconBg: 'bg-rose-950/80 border-rose-700/50 text-rose-300',
          accentBorder: 'border-rose-500/40',
          badgeBg: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
          progressBarBg: 'bg-rose-500',
          defaultBadge: 'Atención'
        };
      case 'success':
      default:
        return {
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
          iconBg: 'bg-emerald-950/80 border-emerald-700/50 text-emerald-300',
          accentBorder: 'border-emerald-500/40',
          badgeBg: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
          progressBarBg: 'bg-emerald-400',
          defaultBadge: 'Solicitud Recibida'
        };
    }
  };

  const config = getThemeConfig();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92, y: 15, transition: { duration: 0.2 } }}
      transition={{ type: 'spring', stiffness: 380, damping: 28 }}
      role="status"
      className={`pointer-events-auto relative w-full overflow-hidden rounded-2xl bg-slate-950/95 backdrop-blur-xl border ${config.accentBorder} text-white shadow-2xl p-4 sm:p-5`}
      style={{
        boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.05)'
      }}
    >
      {/* Subtle background glow */}
      <div 
        className="absolute -top-12 -right-12 w-28 h-28 rounded-full blur-2xl opacity-20 pointer-events-none"
        style={{
          backgroundColor: toast.type === 'license' ? '#06b6d4' : toast.type === 'error' ? '#f43f5e' : '#10b981'
        }}
      />

      <div className="flex items-start gap-3.5 relative z-10">
        {/* Icon with circular stylized badge */}
        <div className={`p-2.5 rounded-xl border shrink-0 flex items-center justify-center ${config.iconBg}`}>
          {config.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pr-6">
          {/* Badge & Meta */}
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${config.badgeBg}`}>
              {toast.badge || config.defaultBadge}
            </span>
            <span className="text-[10px] text-slate-400">Hace unos segundos</span>
          </div>

          {/* Title */}
          <h4 className="text-sm font-bold text-white tracking-tight leading-snug">
            {toast.title}
          </h4>

          {/* Description */}
          {toast.description && (
            <p className="mt-1 text-xs text-slate-300 leading-relaxed">
              {toast.description}
            </p>
          )}

          {/* Interactive Action if supplied */}
          {toast.action && (
            <div className="mt-2.5">
              <button
                type="button"
                onClick={toast.action.onClick}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-300 hover:text-cyan-200 transition-colors underline underline-offset-2 cursor-pointer"
              >
                <span>{toast.action.label}</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Cerrar notificación"
          className="absolute top-0 right-0 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Auto-dismiss progress bar */}
      {duration > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-800/80 overflow-hidden">
          <motion.div
            initial={{ width: '100%' }}
            animate={{ width: '0%' }}
            transition={{ duration: duration / 1000, ease: 'linear' }}
            className={`h-full ${config.progressBarBg}`}
          />
        </div>
      )}
    </motion.div>
  );
};
