// CO₂ prevented per kg of food rescued
export const CO2_PER_KG = 2.5;
// Meals served per kg of food
export const MEALS_PER_KG = 4;
// VGC floor price in INR
export const VGC_FLOOR_PRICE_INR = 800;

export function calculateMeals(quantityKg: number): number {
  return Math.round(quantityKg * MEALS_PER_KG);
}

export function calculateCO2(quantityKg: number): number {
  return parseFloat((quantityKg * CO2_PER_KG).toFixed(3));
}

export function calculateVGC(quantityKg: number): number {
  // 1 VGC per tonne of CO₂ prevented
  const co2Tonnes = calculateCO2(quantityKg) / 1000;
  return parseFloat(co2Tonnes.toFixed(4));
}

export function vgcToINR(vgc: number): number {
  return Math.round(vgc * VGC_FLOOR_PRICE_INR);
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatCO2(tonnes: number): string {
  if (tonnes >= 1) {
    return `${tonnes.toFixed(2)}t`;
  }
  return `${(tonnes * 1000).toFixed(0)}kg`;
}
