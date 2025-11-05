export type Category = "si" | "electrical" | "thermal" | "mechanical" | "atomic";

export interface Unit {
  id: string;
  name: string;
  aliases: string[];
  category: Category;
  factorToJ: string;
  notes?: string;
  regions?: string;
}

export type RoundingMode = "half-up" | "half-even";
export type PrecisionMode = "sigfigs" | "fixed";

export interface Settings {
  precision: number;
  mode: PrecisionMode;
  rounding: RoundingMode;
}

export interface HistoryEntry {
  ts: number;
  value: string;
  from: string;
  to: string[];
  settings: Settings;
}

export interface ConversionResult {
  unit: Unit;
  value: number;
  formattedValue: string;
  error?: string;
}