import { SimulationParams, SimulationResult } from '../types';
import { MUNICIPALITIES_MARKET_DATA } from '../data/marketStats';

export function calculateEstimatedRevenue(params: SimulationParams): SimulationResult {
  const locKey = params.location.toLowerCase();
  const muni = MUNICIPALITIES_MARKET_DATA[locKey] || MUNICIPALITIES_MARKET_DATA['peniscola'];
  
  const bedroomCount = Math.min(4, Math.max(1, params.bedrooms));
  const baseStats = muni.bedroomsData[bedroomCount] || muni.bedroomsData[2];

  // Specific amenities modifiers applied on top of the verified real baseline
  // (Base baseline in market data assumes a standard apartment with balcony/terrace)
  let amenityModifier = 1.0;
  if (params.hasPool) amenityModifier += 0.07;
  if (params.hasSeaView) amenityModifier += 0.12;
  if (params.hasTerrace && !params.hasSeaView) amenityModifier += 0.04;
  if (params.hasAirConditioning) amenityModifier += 0.06;

  // Quality level modifier
  let qualityModifier = 1.0;
  if (params.qualityLevel === 'standard') qualityModifier = 0.94;
  if (params.qualityLevel === 'superior') qualityModifier = 1.04;
  if (params.qualityLevel === 'luxury') qualityModifier = 1.18;

  const finalMultiplier = amenityModifier * qualityModifier;

  // Optimized gross based on Azahar Rentals management with dynamic pricing
  const estimatedAnnualGross = Math.round(baseStats.optimizedGrossAnnual * finalMultiplier);
  const highSeasonDailyRate = Math.round(baseStats.highSeasonADR * finalMultiplier);
  const lowSeasonDailyRate = Math.round(baseStats.lowSeasonADR * finalMultiplier);

  // Month-by-month occupancy curves tailored to Costa de Castellón
  // High in Jul-Aug (90-98%), solid in Jun & Sep (80-84%), Easter/May/Oct (58-72%), winter (35-45%)
  const monthlyWeights = [
    { month: 'Ene', factor: 0.30, occupancy: Math.round(baseStats.annualOccupancy * 0.60) },
    { month: 'Feb', factor: 0.35, occupancy: Math.round(baseStats.annualOccupancy * 0.68) }, // Carnavales
    { month: 'Mar', factor: 0.45, occupancy: Math.round(baseStats.annualOccupancy * 0.82) }, // Fallas / Primavera
    { month: 'Abr', factor: 0.70, occupancy: Math.round(baseStats.annualOccupancy * 1.15) }, // Semana Santa
    { month: 'May', factor: 0.65, occupancy: Math.round(baseStats.annualOccupancy * 1.10) },
    { month: 'Jun', factor: 0.86, occupancy: Math.round(baseStats.annualOccupancy * 1.40) },
    { month: 'Jul', factor: 1.00, occupancy: 96 },
    { month: 'Ago', factor: 1.00, occupancy: 98 },
    { month: 'Sep', factor: 0.84, occupancy: Math.round(baseStats.annualOccupancy * 1.38) },
    { month: 'Oct', factor: 0.60, occupancy: Math.round(baseStats.annualOccupancy * 1.05) },
    { month: 'Nov', factor: 0.28, occupancy: Math.round(baseStats.annualOccupancy * 0.55) },
    { month: 'Dic', factor: 0.38, occupancy: Math.round(baseStats.annualOccupancy * 0.70) }
  ];

  // Distribute estimated annual gross along the seasonal curve
  const totalWeight = monthlyWeights.reduce((sum, m) => sum + (m.occupancy * (m.factor ** 1.2)), 0);

  const estimatedMonthlyBreakdown = monthlyWeights.map(m => {
    const monthWeight = m.occupancy * (m.factor ** 1.2);
    const monthAmount = Math.round((monthWeight / totalWeight) * estimatedAnnualGross);

    return {
      month: m.month,
      amount: monthAmount,
      occupancy: m.occupancy
    };
  });

  // Net calculations for tourist vacation rental
  const estimatedNetProfit = Math.round(estimatedAnnualGross * 0.78);
  const marketAverageGross = Math.round(baseStats.averageGrossAnnual * finalMultiplier);
  const optimizationUplift = Math.max(0, estimatedAnnualGross - marketAverageGross);

  return {
    estimatedAnnualGross,
    marketAverageGross,
    optimizationUplift,
    estimatedNetProfit,
    highSeasonDailyRate,
    lowSeasonDailyRate,
    estimatedOccupancyPercent: baseStats.annualOccupancy,
    occupiedNights: baseStats.occupiedNights,
    guestCapacity: baseStats.guestCapacity,
    isRealBase: baseStats.isRealBase,
    extrapolationNote: baseStats.extrapolationNote,
    estimatedMonthlyBreakdown
  };
}

