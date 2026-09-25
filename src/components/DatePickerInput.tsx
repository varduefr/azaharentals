import React, { useRef, useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react';

/**
 * Formats an ISO date string (YYYY-MM-DD) to Spanish format (DD/MM/AAAA)
 */
export function formatToDDMMAAAA(isoString: string): string {
  if (!isoString) return '';
  const clean = isoString.split('T')[0];
  const parts = clean.split('-');
  if (parts.length === 3 && parts[0].length === 4) {
    const [year, month, day] = parts;
    return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
  }
  return isoString;
}

/**
 * Parses a DD/MM/AAAA string to ISO format (YYYY-MM-DD)
 */
export function parseDDMMAAAAToISO(dmy: string): string {
  if (!dmy) return '';
  const clean = dmy.trim();
  const match = clean.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (match) {
    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10);
    const year = parseInt(match[3], 10);

    if (month >= 1 && month <= 12 && day >= 1 && day <= 31 && year >= 2020 && year <= 2099) {
      const d = new Date(year, month - 1, day);
      if (d.getFullYear() === year && d.getMonth() === month - 1 && d.getDate() === day) {
        const dd = String(day).padStart(2, '0');
        const mm = String(month).padStart(2, '0');
        return `${year}-${mm}-${dd}`;
      }
    }
  }
  return '';
}

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const WEEKDAYS = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do'];

interface DatePickerInputProps {
  id?: string;
  name?: string;
  value: string; // ISO date: YYYY-MM-DD
  onChange: (isoDate: string) => void;
  min?: string; // ISO date: YYYY-MM-DD
  max?: string; // ISO date: YYYY-MM-DD
  required?: boolean;
  className?: string;
  bgClass?: string;
  placeholder?: string;
  hideRightIndicator?: boolean;
}

export const DatePickerInput: React.FC<DatePickerInputProps> = ({
  id,
  name,
  value,
  onChange,
  min,
  max,
  required = false,
  className = '',
  bgClass = 'bg-slate-900',
  placeholder = '',
  hideRightIndicator = false
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const textInputRef = useRef<HTMLInputElement>(null);

  const [textValue, setTextValue] = useState<string>(formatToDDMMAAAA(value));
  const [isFocused, setIsFocused] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Compute initial year and month from value or today
  const getInitialYearMonth = (val: string) => {
    if (val && val.includes('-')) {
      const parts = val.split('-');
      if (parts.length >= 2) {
        const y = parseInt(parts[0], 10);
        const m = parseInt(parts[1], 10) - 1;
        if (!isNaN(y) && !isNaN(m) && m >= 0 && m <= 11) {
          return { year: y, month: m };
        }
      }
    }
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  };

  const initialYM = getInitialYearMonth(value);
  const [viewYear, setViewYear] = useState<number>(initialYM.year);
  const [viewMonth, setViewMonth] = useState<number>(initialYM.month);

  // Sync internal text state and calendar view when value changes externally
  useEffect(() => {
    setTextValue(formatToDDMMAAAA(value));
    if (value && value.includes('-')) {
      const ym = getInitialYearMonth(value);
      setViewYear(ym.year);
      setViewMonth(ym.month);
    }
  }, [value]);

  // Close calendar popover on outside click or Escape
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (
        isOpen &&
        containerRef.current &&
        !containerRef.current.contains(target) &&
        popoverRef.current &&
        !popoverRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('touchstart', handleOutsideClick);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSelectDate = (dateStr: string) => {
    onChange(dateStr);
    setTextValue(formatToDDMMAAAA(dateStr));
    setIsOpen(false);
  };

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value;
    input = input.replace(/[^\d/]/g, '');

    const digitsOnly = input.replace(/\D/g, '');
    if (digitsOnly.length <= 8 && !input.includes('/')) {
      if (digitsOnly.length > 4) {
        input = `${digitsOnly.slice(0, 2)}/${digitsOnly.slice(2, 4)}/${digitsOnly.slice(4)}`;
      } else if (digitsOnly.length > 2) {
        input = `${digitsOnly.slice(0, 2)}/${digitsOnly.slice(2)}`;
      }
    }

    setTextValue(input);

    const iso = parseDDMMAAAAToISO(input);
    if (iso) {
      onChange(iso);
      const ym = getInitialYearMonth(iso);
      setViewYear(ym.year);
      setViewMonth(ym.month);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    const iso = parseDDMMAAAAToISO(textValue);
    if (iso) {
      onChange(iso);
      setTextValue(formatToDDMMAAAA(iso));
    } else if (value) {
      setTextValue(formatToDDMMAAAA(value));
    }
  };

  // Build grid of days for current viewed month
  const getDaysForMonth = () => {
    const firstDay = new Date(viewYear, viewMonth, 1);
    const startOffset = (firstDay.getDay() + 6) % 7; // Monday = 0
    const daysInCurrentMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

    const todayStr = new Date().toISOString().split('T')[0];

    const items: Array<{
      dateStr: string;
      dayNumber: number;
      isCurrentMonth: boolean;
      isDisabled: boolean;
      isSelected: boolean;
      isToday: boolean;
    }> = [];

    // Trailing days from previous month
    for (let i = startOffset - 1; i >= 0; i--) {
      const d = daysInPrevMonth - i;
      const prevM = viewMonth === 0 ? 11 : viewMonth - 1;
      const prevY = viewMonth === 0 ? viewYear - 1 : viewYear;
      const dateStr = `${prevY}-${String(prevM + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      items.push({
        dateStr,
        dayNumber: d,
        isCurrentMonth: false,
        isDisabled: true,
        isSelected: dateStr === value,
        isToday: dateStr === todayStr
      });
    }

    // Days in current month
    for (let d = 1; d <= daysInCurrentMonth; d++) {
      const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const isDisabled = Boolean((min && dateStr < min) || (max && dateStr > max));
      items.push({
        dateStr,
        dayNumber: d,
        isCurrentMonth: true,
        isDisabled,
        isSelected: dateStr === value,
        isToday: dateStr === todayStr
      });
    }

    // Leading days from next month to complete rows of 7
    const totalCells = Math.ceil(items.length / 7) * 7;
    const remaining = totalCells - items.length;
    for (let i = 1; i <= remaining; i++) {
      const nextM = viewMonth === 11 ? 0 : viewMonth + 1;
      const nextY = viewMonth === 11 ? viewYear + 1 : viewYear;
      const dateStr = `${nextY}-${String(nextM + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      items.push({
        dateStr,
        dayNumber: i,
        isCurrentMonth: false,
        isDisabled: true,
        isSelected: dateStr === value,
        isToday: dateStr === todayStr
      });
    }

    return items;
  };

  const days = getDaysForMonth();
  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div
      ref={containerRef}
      className={`relative ${isOpen ? 'z-40' : 'z-10'}`}
    >
      {/* Input Box: Clicking anywhere opens the calendar popup */}
      <div
        onClick={() => {
          setIsOpen((prev) => !prev);
          if (!isOpen && value) {
            const ym = getInitialYearMonth(value);
            setViewYear(ym.year);
            setViewMonth(ym.month);
          }
        }}
        className={`relative flex items-center group border rounded-xl transition-all duration-200 cursor-pointer ${
          isFocused || isOpen
            ? 'border-cyan-400 ring-2 ring-cyan-500/20 shadow-sm shadow-cyan-500/10'
            : 'border-slate-700 hover:border-slate-600'
        } ${bgClass} ${className}`}
      >
        {/* Left Calendar Icon */}
        <div
          className="flex items-center justify-center pl-3 pr-1 text-cyan-400 group-hover:text-cyan-300 transition-colors pointer-events-none"
        >
          <Calendar className="w-4 h-4 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
        </div>

        {/* Text Input (keyboard editing) */}
        <input
          ref={textInputRef}
          id={id}
          name={name}
          type="text"
          inputMode="numeric"
          required={required}
          placeholder={placeholder}
          value={textValue}
          maxLength={10}
          onChange={handleTextChange}
          onFocus={() => {
            setIsFocused(true);
            setIsOpen(true);
          }}
          onBlur={handleBlur}
          onClick={(e) => {
            // Clicking inside the input opens/keeps open the calendar
            setIsOpen(true);
          }}
          className="w-[96px] sm:w-[102px] bg-transparent pl-1.5 py-2 text-sm text-white font-medium placeholder:text-slate-500 focus:outline-none cursor-pointer sm:cursor-text shrink-0"
        />

        {/* Empty clickable area inside combo box */}
        <div
          className="flex-1 h-full min-h-[38px] cursor-pointer flex items-center justify-end pr-2"
          title="Clic para abrir calendario"
        >
          {!hideRightIndicator && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen((prev) => !prev);
              }}
              className="px-1.5 py-0.5 rounded text-[11px] font-mono text-cyan-400/90 hover:text-cyan-300 hover:bg-cyan-500/10 transition-colors flex items-center gap-1 cursor-pointer"
              title="Formato día/mes/año - Clic para abrir calendario"
            >
              <span className="text-[10px] text-slate-400 font-sans hidden sm:inline">dd/mm/aaaa</span>
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
            </button>
          )}
        </div>
      </div>

      {/* Interactive Calendar Pop-up */}
      {isOpen && (
        <div
          ref={popoverRef}
          onClick={(e) => e.stopPropagation()}
          className="absolute top-full left-0 mt-2 z-50 w-72 sm:w-80 p-3 sm:p-4 bg-slate-900 border border-slate-700/90 rounded-2xl shadow-2xl backdrop-blur-md animate-fadeIn"
        >
          {/* Calendar Header with Month/Year and Navigation */}
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
            <button
              type="button"
              onClick={handlePrevMonth}
              aria-label="Mes anterior"
              className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="font-bold text-sm text-white capitalize select-none">
              {MONTH_NAMES[viewMonth]} <span className="font-mono text-cyan-300">{viewYear}</span>
            </div>
            <button
              type="button"
              onClick={handleNextMonth}
              aria-label="Mes siguiente"
              className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Weekday Labels (Lu, Ma, Mi, Ju, Vi, Sá, Do) */}
          <div className="grid grid-cols-7 gap-1 text-center mb-1 text-[11px] font-semibold text-slate-400 select-none">
            {WEEKDAYS.map((wd) => (
              <div key={wd}>{wd}</div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {days.map((item, idx) => {
              if (!item.isCurrentMonth) {
                return (
                  <div
                    key={idx}
                    className="h-8 w-8 sm:h-9 sm:w-9 mx-auto rounded-lg flex items-center justify-center text-xs text-slate-600 opacity-30 select-none"
                  >
                    {item.dayNumber}
                  </div>
                );
              }

              if (item.isDisabled) {
                return (
                  <div
                    key={idx}
                    className="h-8 w-8 sm:h-9 sm:w-9 mx-auto rounded-lg flex items-center justify-center text-xs text-slate-600 opacity-40 cursor-not-allowed select-none line-through"
                    title="Fecha no disponible"
                  >
                    {item.dayNumber}
                  </div>
                );
              }

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectDate(item.dateStr)}
                  className={`h-8 w-8 sm:h-9 sm:w-9 mx-auto rounded-lg flex items-center justify-center text-xs font-semibold transition-all cursor-pointer ${
                    item.isSelected
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold shadow-md shadow-cyan-500/30 ring-2 ring-cyan-400/50 scale-105'
                      : item.isToday
                      ? 'border border-cyan-400 text-cyan-300 bg-cyan-950/40 hover:bg-cyan-900/60'
                      : 'text-slate-200 hover:bg-cyan-950/80 hover:text-cyan-300 hover:border hover:border-cyan-700/50'
                  }`}
                  title={`Seleccionar ${formatToDDMMAAAA(item.dateStr)}`}
                >
                  {item.dayNumber}
                </button>
              );
            })}
          </div>

          {/* Quick Actions Footer */}
          <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => {
                if (!min || todayStr >= min) {
                  handleSelectDate(todayStr);
                }
              }}
              disabled={Boolean(min && todayStr < min)}
              className="text-cyan-400 hover:text-cyan-300 font-medium cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Hoy ({formatToDDMMAAAA(todayStr)})
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>Cerrar</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
