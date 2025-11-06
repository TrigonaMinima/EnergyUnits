// This is a complex, reusable component for selecting one or more units from a searchable,
// categorized dropdown list.

import React, { useState, useMemo, useRef, useEffect } from 'react';
import type { Unit } from '../types';
import { CATEGORY_NAMES } from '../constants/units';
import { ChevronDownIcon, XIcon } from './icons';

// Define the props this component accepts.
interface UnitSelectorProps {
    id?: string;
    units: Unit[]; // The full list of units to display.
    selectedUnit?: Unit | null; // The currently selected unit (in single-select mode).
    selectedUnits?: Unit[]; // The array of selected units (in multi-select mode).
    onSelectUnit: (unit: Unit) => void; // A callback function to notify the parent when a unit is selected/deselected.
    placeholder: string;
    isMulti?: boolean; // A flag to enable multi-select mode.
}

export const UnitSelector: React.FC<UnitSelectorProps> = ({ id, units, selectedUnit, selectedUnits, onSelectUnit, placeholder, isMulti = false }) => {
    // --- STATE ---
    const [isOpen, setIsOpen] = useState(false); // Is the dropdown currently open?
    const [searchTerm, setSearchTerm] = useState(''); // What is the user currently typing in the search box?
    const wrapperRef = useRef<HTMLDivElement>(null); // A reference to the main div element of the component.

    // --- COMPUTED VALUES ---
    // `useMemo` is used to optimize performance. These calculations will only re-run when their dependencies change.

    // Filter the list of units based on the current search term.
    const filteredUnits = useMemo(() => {
        if (!searchTerm) {
            return units; // If no search term, show all units.
        }
        const lowercasedTerm = searchTerm.toLowerCase();
        return units.filter(
            unit =>
                unit.name.toLowerCase().includes(lowercasedTerm) ||
                unit.id.toLowerCase().includes(lowercasedTerm) ||
                unit.aliases.some(alias => alias.toLowerCase().includes(lowercasedTerm))
        );
    }, [units, searchTerm]); // Recalculate only if `units` or `searchTerm` changes.

    // Group the filtered units by their category for display.
    const groupedUnits = useMemo(() => {
        return filteredUnits.reduce((acc, unit) => {
            (acc[unit.category] = acc[unit.category] || []).push(unit);
            return acc;
        }, {} as Record<string, Unit[]>);
    }, [filteredUnits]); // Recalculate only if `filteredUnits` changes.

    // --- SIDE EFFECTS ---
    // `useEffect` is used for side effects, like interacting with the DOM.

    // This effect adds a global event listener to detect clicks outside the component,
    // which is used to close the dropdown.
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            // If the click is outside the component's wrapper `div`, set `isOpen` to false.
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        // "Cleanup" function: This is important to remove the event listener when the component is unmounted
        // to prevent memory leaks.
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]); // The effect's dependency is the wrapper ref.
    
    // --- EVENT HANDLERS ---
    const handleSelect = (unit: Unit) => {
        onSelectUnit(unit); // Call the parent's handler function.
        if (!isMulti) {
            // In single-select mode, clear the search and close the dropdown after selection.
            setSearchTerm('');
            setIsOpen(false);
        }
    };

    // --- RENDER LOGIC ---
    // A function component's return value is what gets rendered.

    // The display value inside the input box for multi-select mode (shows little pills for each selected unit).
    const displayValue = isMulti ? (
        <div className="flex flex-wrap gap-1">
            {selectedUnits?.map(unit => (
                <span key={unit.id} className="flex items-center bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-300 text-xs font-semibold px-2 py-0.5 rounded-full">
                    {unit.id}
                    <button onClick={(e) => {e.stopPropagation(); handleSelect(unit);}} className="ml-1 text-blue-500 hover:text-blue-700 dark:hover:text-blue-300">
                        <XIcon className="h-3 w-3"/>
                    </button>
                </span>
            ))}
        </div>
    ) : (
        selectedUnit?.name || ''
    );

    return (
        // The main container `div`, with the `ref` attached for the outside click detection.
        <div className="relative" ref={wrapperRef} id={id}>
            <div className="w-full">
                {/* The main input-like box that the user clicks to open the dropdown */}
                <div 
                    className="flex items-center justify-between w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md cursor-pointer focus-within:ring-2 focus-within:ring-blue-500"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {/* Show placeholder text only in multi-select mode when nothing is selected */}
                    {isMulti && selectedUnits?.length === 0 && !searchTerm ? <span className="text-gray-500 dark:text-gray-400">{placeholder}</span> : null}

                    <div className="flex-grow">
                        {/* Conditionally render either the multi-select pills or the single-select input field */}
                        {isMulti ? displayValue : (
                           <input
                            type="text"
                            className="w-full bg-transparent outline-none text-lg"
                            placeholder={!selectedUnit && !isOpen ? placeholder : ''}
                            // The value of the input changes depending on whether the dropdown is open or not.
                            value={isOpen ? searchTerm : (selectedUnit ? `${selectedUnit.name} (${selectedUnit.id})` : '')}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onFocus={(e) => { // When the user focuses the input...
                                e.stopPropagation(); // prevent the parent div's onClick from firing.
                                setSearchTerm(''); // clear the search term.
                                setIsOpen(true); // open the dropdown.
                            }}
                           />
                        )}
                    </div>
                    {/* The down-arrow icon, which rotates when the dropdown is open */}
                    <ChevronDownIcon className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
                </div>
            </div>

            {/* The dropdown list itself. It's only rendered if `isOpen` is true. */}
            {isOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-800 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {/* In multi-select mode, there is a dedicated search input inside the dropdown */}
                    {isMulti && (
                        <input
                            type="text"
                            className="w-full p-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700 outline-none"
                            placeholder="Search units..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            autoFocus // Automatically focus this input when it appears.
                        />
                    )}
                    {/* Map over the grouped units to display them by category */}
                    {Object.entries(groupedUnits).map(([category, unitsInCategory]) => (
                        <div key={category}>
                            <h3 className="px-3 py-2 text-xs font-bold text-gray-500 uppercase">{CATEGORY_NAMES[category as keyof typeof CATEGORY_NAMES]}</h3>
                            <ul>
                                {unitsInCategory.map(unit => (
                                    <li
                                        key={unit.id}
                                        // Apply different styles if the unit is already selected in multi-mode
                                        className={`px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 ${isMulti && selectedUnits?.some(u => u.id === unit.id) ? 'font-bold bg-blue-50 dark:bg-blue-900/60' : ''}`}
                                        onClick={() => handleSelect(unit)}
                                    >
                                        {unit.name} ({unit.id})
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                    {/* Show a message if the search yields no results */}
                    {filteredUnits.length === 0 && <div className="p-3 text-sm text-gray-500">No units found.</div>}
                </div>
            )}
        </div>
    );
};
