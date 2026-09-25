export interface LocationData {
  id: string;
  name: string;
  subtitle: string;
  badge: string;
  description: string;
  highlightBeaches: string[];
  averageAnnualYield: string;
  averageOccupancy: string;
  highSeasonADR: string;
  image: string;
  popularPropertyTypes: string;
  tags: string[];
}

export interface ServiceItem {
  id: string;
  iconName: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  bulletPoints: string[];
  badge?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  propertyType: string;
  previousIncome: string;
  currentIncome: string;
  increasePercentage: string;
  quote: string;
  rating: number;
  avatar: string;
  hasLicenseHelp: boolean;
}

export interface FaqItem {
  question: string;
  answer: string;
  category: 'licencias' | 'ingresos' | 'gestion' | 'seguridad';
}

export interface SimulationParams {
  location: string;
  bedrooms: number;
  bathrooms: number;
  capacity: number;
  hasPool: boolean;
  hasSeaView: boolean;
  hasTerrace: boolean;
  hasAirConditioning: boolean;
  qualityLevel: 'standard' | 'superior' | 'luxury';
  hasLicense: 'yes' | 'no' | 'in_progress' | 'unknown';
}

export interface SimulationResult {
  estimatedAnnualGross: number;
  marketAverageGross: number;
  optimizationUplift: number;
  estimatedNetProfit: number;
  highSeasonDailyRate: number;
  lowSeasonDailyRate: number;
  estimatedOccupancyPercent: number;
  occupiedNights: number;
  guestCapacity: string;
  isRealBase: boolean;
  extrapolationNote: string;
  traditionalRentalComparison?: number;
  surplusEarningsPercent?: number;
  estimatedMonthlyBreakdown: { month: string; amount: number; occupancy: number }[];
}

export interface ContactFormData {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  propertyAddress?: string;
  bedrooms: string;
  hasLicense: string;
  message?: string;
  preferredContact: 'phone' | 'whatsapp' | 'email';
}

export type { BedroomMarketData, MunicipalityMarketData } from './data/marketStats';
