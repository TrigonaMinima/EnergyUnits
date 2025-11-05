import React from 'react';
import { UNITS, CATEGORY_NAMES } from '../constants/units';
import type { Unit, Category } from '../types';
import { XIcon, LinkIcon } from './icons';

const groupedUnits = UNITS.reduce((acc, unit) => {
    (acc[unit.category] = acc[unit.category] || []).push(unit);
    return acc;
}, {} as Record<Category, Unit[]>);

const categoryOrder: Category[] = ["si", "electrical", "thermal", "mechanical", "atomic"];


const getWikipediaUrl = (unit: Unit): string => {
    const base = 'https://en.wikipedia.org/wiki/';
    // Special cases from observation
    switch (unit.id) {
        case 'ft-lbf': return `${base}Foot-pound_(energy)`;
        case 'kcal': return `${base}Calorie`;
        case 'cal': return `${base}Calorie`;
        case 'BTU': return `${base}British_thermal_unit`;
        case 'Wh': return `${base}Watt-hour`;
        case 'kWh': return `${base}Kilowatt-hour`;
        case 'eV': return `${base}Electronvolt`;
        default:
            const name = unit.name.split('(')[0].trim().replace(/ /g, '_');
            const capitalized = name.charAt(0).toUpperCase() + name.slice(1);
            return `${base}${capitalized}`;
    }
};

const UnitCard: React.FC<{ unit: Unit }> = ({ unit }) => {
    return (
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <div className="flex justify-between items-start">
                <h4 className="font-bold text-lg">{unit.name} <span className="font-mono text-base text-gray-500 dark:text-gray-400">({unit.id})</span></h4>
                <a
                    href={getWikipediaUrl(unit)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 text-sm text-blue-600 dark:text-blue-400 hover:underline flex-shrink-0 ml-4"
                >
                    <span>Wikipedia</span>
                    <LinkIcon />
                </a>
            </div>
            {unit.aliases.length > 0 && (
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    <span className="font-semibold">Aliases:</span> {unit.aliases.join(', ')}
                </p>
            )}
            {unit.notes && (
                 <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    <span className="font-semibold">Note:</span> {unit.notes}
                </p>
            )}
             {unit.regions && (
                 <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    <span className="font-semibold">Common Regions:</span> {unit.regions}
                </p>
            )}
             <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 font-mono break-all">
                <span className="font-semibold">Factor to Joules:</span> {unit.factorToJ}
            </p>
        </div>
    );
};


export const UnitInfoPanel: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose}>
            <div 
                className="fixed top-0 right-0 h-full w-full max-w-lg bg-white dark:bg-gray-900 shadow-xl transform transition-transform translate-x-0 flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
                    <h2 className="text-xl font-bold">Unit Information</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                        <XIcon />
                    </button>
                </div>
                <div className="overflow-y-auto p-4 md:p-6 space-y-6">
                    {categoryOrder.map(category => (
                        groupedUnits[category] && (
                            <div key={category}>
                                <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                                    {CATEGORY_NAMES[category]}
                                </h3>
                                <div className="space-y-3">
                                    {groupedUnits[category]?.map(unit => (
                                        <UnitCard key={unit.id} unit={unit} />
                                    ))}
                                </div>
                            </div>
                        )
                    ))}
                </div>
            </div>
        </div>
    );
};