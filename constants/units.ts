// This file contains all the constant data related to the energy units.
// Keeping this data separate makes the app easier to manage and update.

import type { Unit, Category } from '../types';

// A mapping from the short category ID (e.g., 'si') to a more user-friendly name (e.g., "SI & Metric").
// `Record<Category, string>` is a TypeScript utility that ensures every key is one of our defined `Category` types.
export const CATEGORY_NAMES: Record<Category, string> = {
    si: "SI & Metric",
    electrical: "Electrical",
    thermal: "Chemical / Thermal",
    mechanical: "Mechanical",
    atomic: "Atomic"
};

// The master list of all available energy units.
// It's an array of `Unit` objects, conforming to the structure we defined in `types.ts`.
export const UNITS: Unit[] = [
    // SI & Metric
    { id: 'J', name: 'joule', aliases: ['joules'], category: 'si', factorToJ: '1', regions: 'Global (SI standard)' },
    { id: 'kJ', name: 'kilojoule', aliases: ['kilojoules'], category: 'si', factorToJ: '1000', regions: 'Global (SI standard)' },
    { id: 'MJ', name: 'megajoule', aliases: ['megajoules'], category: 'si', factorToJ: '1000000', regions: 'Global (SI standard)' },
    { id: 'GJ', name: 'gigajoule', aliases: ['gigajoules'], category: 'si', factorToJ: '1000000000', regions: 'Global (SI standard)' },

    // Electrical
    { id: 'Wh', name: 'watt-hour', aliases: ['watthour'], category: 'electrical', factorToJ: '3600', regions: 'Global, especially for battery capacity.' },
    { id: 'kWh', name: 'kilowatt-hour', aliases: ['kilowatthour', 'board of trade unit', 'unit of electricity'], category: 'electrical', factorToJ: '3600000', regions: 'Global standard for residential and commercial electricity billing.' },

    // Chemical/Thermal
    { id: 'cal', name: 'calorie (thermochemical)', aliases: ['gram calorie', 'small calorie'], category: 'thermal', factorToJ: '4.184', regions: 'Global in specific scientific contexts (chemistry, biology).' },
    { id: 'kcal', name: 'kilocalorie (food calorie)', aliases: ['Cal', 'food calorie', 'large calorie', 'dietary calorie'], category: 'thermal', factorToJ: '4184', regions: 'Global standard for food energy and nutrition labeling.' },
    { id: 'BTU', name: 'British thermal unit (IT)', aliases: ['btu', 'British Thermal Unit'], category: 'thermal', factorToJ: '1055.05585262', notes: 'International Table definition', regions: 'Primarily used in the United States, and to a lesser extent in the UK and Canada, for heating and cooling systems.' },
    { id: 'therm', name: 'therm (US)', aliases: ['therms'], category: 'thermal', factorToJ: '105480400', regions: 'Primarily used in the United States and the UK for natural gas billing.' },

    // Mechanical
    { id: 'ft-lbf', name: 'foot-pound', aliases: ['ftlbf', 'foot pound force', 'foot pound of energy'], category: 'mechanical', factorToJ: '1.3558179483314004', regions: 'Primarily used in the United States and other countries that retain some imperial units.' },

    // Atomic
    { id: 'eV', name: 'electronvolt', aliases: ['electron volt'], category: 'atomic', factorToJ: '1.602176634e-19', regions: 'Global standard in particle physics and related scientific fields.' },
];

// --- HELPER FUNCTIONS ---
// We create a Map data structure for very fast lookups. A Map is generally faster
// than searching through an array with `.find()` for finding items by a key.
const unitMap = new Map<string, Unit>(UNITS.map(unit => [unit.id.toLowerCase(), unit]));
// We also add all the aliases to the map so we can find a unit by its alias too.
UNITS.forEach(unit => {
    unit.aliases.forEach(alias => {
        if (!unitMap.has(alias.toLowerCase())) {
            unitMap.set(alias.toLowerCase(), unit);
        }
    });
});

/**
 * A utility function to get a full unit object by its ID.
 * @param id - The ID of the unit to find (e.g., 'kWh').
 * @returns The matching Unit object or null if not found.
 */
export const getUnitById = (id: string | null): Unit | null => {
    if (!id) return null;
    // Uses the fast array `.find()` method, suitable for this specific ID lookup.
    return UNITS.find(u => u.id === id) || null;
};

/**
 * A utility function to find a unit by its ID, name, or alias from a search term.
 * @param searchTerm - The term to search for.
 * @returns The matching Unit object or null if not found.
 */
export const findUnit = (searchTerm: string): Unit | null => {
    // Uses our pre-built Map for very efficient lookups.
    return unitMap.get(searchTerm.toLowerCase()) || null;
};
