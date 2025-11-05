import type { Unit, Category } from '../types';

export const CATEGORY_NAMES: Record<Category, string> = {
    si: "SI & Metric",
    electrical: "Electrical",
    thermal: "Chemical / Thermal",
    mechanical: "Mechanical",
    atomic: "Atomic"
};

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

const unitMap = new Map<string, Unit>(UNITS.map(unit => [unit.id.toLowerCase(), unit]));
UNITS.forEach(unit => {
    unit.aliases.forEach(alias => {
        if (!unitMap.has(alias.toLowerCase())) {
            unitMap.set(alias.toLowerCase(), unit);
        }
    });
});

export const getUnitById = (id: string | null): Unit | null => {
    if (!id) return null;
    return UNITS.find(u => u.id === id) || null;
};

export const findUnit = (searchTerm: string): Unit | null => {
    return unitMap.get(searchTerm.toLowerCase()) || null;
};