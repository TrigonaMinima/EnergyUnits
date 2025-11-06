// This file defines the "shapes" of the data we use throughout the application.
// Using TypeScript types helps us catch errors early and makes the code easier to understand and maintain.

// A "type alias" for the different categories a unit can belong to.
// Using a union of string literals ('si' | 'electrical' | ...) ensures we can only use these specific values.
export type Category = "si" | "electrical" | "thermal" | "mechanical" | "atomic";

// An "interface" describes the structure of an object.
// This defines what properties a `Unit` object must have.
export interface Unit {
  id: string; // The short identifier, e.g., "kWh"
  name: string; // The full name, e.g., "kilowatt-hour"
  aliases: string[]; // Other common names or spellings.
  category: Category; // The category it belongs to, using our `Category` type.
  factorToJ: string; // The conversion factor to the base unit (Joule), as a string for precision.
  notes?: string; // Optional notes about the unit. The `?` makes it optional.
  regions?: string; // Optional info on where the unit is commonly used.
}

// Type definitions for the settings panel.
export type RoundingMode = "half-up" | "half-even";
export type PrecisionMode = "sigfigs" | "fixed";

// The structure for the Settings object.
export interface Settings {
  precision: number; // The number of significant figures or decimal places.
  mode: PrecisionMode; // Whether to use 'sigfigs' or 'fixed' precision.
  rounding: RoundingMode; // The rounding method to use.
}

// The structure for an entry in the conversion history.
export interface HistoryEntry {
  ts: number; // A timestamp of when the conversion was made (in milliseconds).
  value: string; // The input value that was converted.
  from: string; // The ID of the unit converted from.
  to: string[]; // An array of IDs of the units converted to.
  settings: Settings; // The settings used for this specific conversion.
}

// The structure for a single conversion result.
export interface ConversionResult {
  unit: Unit; // The target unit object.
  value: number; // The calculated numerical result.
  formattedValue: string; // The result formatted as a string according to the user's settings.
  error?: string; // An optional error message if the conversion failed.
}
