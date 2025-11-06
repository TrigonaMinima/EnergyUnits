// This component is another side panel, responsible for showing detailed information
// about all the available units, grouped by category.

import React from 'react';
import { UNITS, CATEGORY_NAMES } from '../constants/units';
import type { Unit, Category } from '../types';
import { XIcon, LinkIcon } from './icons';

// Pre-process the units list into a grouped object for easier rendering.
// This is done once when the module is loaded.
const groupedUnits = UNITS.reduce((acc, unit) => {
    (acc[unit.category] = acc[unit.category] || []).push(unit);
    return acc;
}, {} as Record<Category, Unit[]>);

// Define the order in which to display the categories.
const categoryOrder: Category[] = ["si", "electrical", "thermal", "mechanical", "atomic"];


/**
 * A helper function to generate a Wikipedia URL for a given unit.
 * This is a simple implementation and might need to be more robust for a production app.
 * @param unit The unit to get the URL for.
 * @returns A string containing the full URL to the Wikipedia page.
 */
const getWikipediaUrl = (unit: Unit): string => {
    const base = 'https://en.wikipedia.org/wiki/';
    // Handle special cases where the unit name doesn't map directly to a Wikipedia title.
    switch (unit.id) {
        case 'ft-lbf': return `${base}Foot-pound_(energy)`;
        case 'kcal': return `${base}Calorie`;
        case 'cal': return `${base}Calorie`;
        case 'BTU': return `${base}British_thermal_unit`;
        case 'Wh': return `${base}Watt-hour`;
        case 'kWh': return `${base}Kilowatt-hour`;
        case 'eV': return `${base}Electronvolt`;
        default:
            // For other units, create a best-guess URL from the unit's name.
            const name = unit.name.split('(')[0].trim().replace(/ /g, '_');
            const capitalized = name.charAt(0).toUpperCase() + name.slice(1);
            return `${base}${capitalized}`;
    }
};

// A small component to render a single "card" with a unit's information.
const UnitCard: React.FC<{ unit: Unit }> = ({ unit }) => {
    return (
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <div className="flex justify-between items-start">
                <h4 className="font-bold text-lg">{unit.name} <span className="font-mono text-base text-gray-500 dark:text-gray-400">({unit.id})</span></h4>
                <a
                    href={getWikipediaUrl(unit)}
                    target="_blank" // Opens the link in a new tab.
                    rel="noopener noreferrer" // Security best practice for external links.
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

// The main panel component.
export const UnitInfoPanel: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    return (
        // The semi-transparent overlay.
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose}>
            <div 
                // The panel container.
                className="fixed top-0 right-0 h-full w-full max-w-lg bg-white dark:bg-gray-900 shadow-xl transform transition-transform translate-x-0 flex flex-col"
                onClick={e => e.stopPropagation()} // Prevents clicks inside from closing the panel.
            >
                <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
                    <h2 className="text-xl font-bold">Unit Information</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                        <XIcon />
                    </button>
                </div>
                {/* The main scrollable content area. */}
                <div className="overflow-y-auto p-4 md:p-6 space-y-6">
                    {/* Map over the ordered categories. */}
                    {categoryOrder.map(category => (
                        // Only render the category if it has units.
                        groupedUnits[category] && (
                            <div key={category}>
                                <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                                    {CATEGORY_NAMES[category]}
                                </h3>
                                <div className="space-y-3">
                                    {/* Map over the units within this category and render a UnitCard for each one. */}
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
