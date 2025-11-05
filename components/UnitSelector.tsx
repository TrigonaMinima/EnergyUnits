import React, { useState, useMemo, useRef, useEffect } from 'react';
import type { Unit } from '../types';
import { CATEGORY_NAMES } from '../constants/units';
import { ChevronDownIcon, XIcon } from './icons';

interface UnitSelectorProps {
    id?: string;
    units: Unit[];
    selectedUnit?: Unit | null;
    selectedUnits?: Unit[];
    onSelectUnit: (unit: Unit) => void;
    placeholder: string;
    isMulti?: boolean;
}

export const UnitSelector: React.FC<UnitSelectorProps> = ({ id, units, selectedUnit, selectedUnits, onSelectUnit, placeholder, isMulti = false }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const wrapperRef = useRef<HTMLDivElement>(null);

    const filteredUnits = useMemo(() => {
        if (!searchTerm) {
            return units;
        }
        const lowercasedTerm = searchTerm.toLowerCase();
        return units.filter(
            unit =>
                unit.name.toLowerCase().includes(lowercasedTerm) ||
                unit.id.toLowerCase().includes(lowercasedTerm) ||
                unit.aliases.some(alias => alias.toLowerCase().includes(lowercasedTerm))
        );
    }, [units, searchTerm]);

    const groupedUnits = useMemo(() => {
        return filteredUnits.reduce((acc, unit) => {
            (acc[unit.category] = acc[unit.category] || []).push(unit);
            return acc;
        }, {} as Record<string, Unit[]>);
    }, [filteredUnits]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);
    
    const handleSelect = (unit: Unit) => {
        onSelectUnit(unit);
        if (!isMulti) {
            setSearchTerm('');
            setIsOpen(false);
        }
    };

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


                    //     className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500"
                    // >



    return (
        <div className="relative" ref={wrapperRef} id={id}>
            <div className="w-full">
                <div 
                    className="flex items-center justify-between w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md cursor-pointer focus-within:ring-2 focus-within:ring-blue-500"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isMulti && selectedUnits?.length === 0 && !searchTerm ? <span className="text-gray-500 dark:text-gray-400">{placeholder}</span> : null}

                    <div className="flex-grow">
                        {isMulti ? displayValue : (
                           <input
                            type="text"
                            className="w-full bg-transparent outline-none text-lg"
                            placeholder={!selectedUnit && !isOpen ? placeholder : ''}
                            value={isOpen ? searchTerm : (selectedUnit ? `${selectedUnit.name} (${selectedUnit.id})` : '')}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onFocus={(e) => { 
                                e.stopPropagation();
                                setSearchTerm('');
                                setIsOpen(true);
                            }}
                           />
                        )}
                    </div>

                    <ChevronDownIcon className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
                </div>
            </div>

            {isOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-800 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {isMulti && (
                        <input
                            type="text"
                            className="w-full p-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700 outline-none"
                            placeholder="Search units..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            autoFocus
                        />
                    )}
                    {Object.entries(groupedUnits).map(([category, unitsInCategory]) => (
                        <div key={category}>
                            <h3 className="px-3 py-2 text-xs font-bold text-gray-500 uppercase">{CATEGORY_NAMES[category as keyof typeof CATEGORY_NAMES]}</h3>
                            <ul>
                                {unitsInCategory.map(unit => (
                                    <li
                                        key={unit.id}
                                        className={`px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 ${isMulti && selectedUnits?.some(u => u.id === unit.id) ? 'font-bold bg-blue-50 dark:bg-blue-900/60' : ''}`}
                                        onClick={() => handleSelect(unit)}
                                    >
                                        {unit.name} ({unit.id})
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                    {filteredUnits.length === 0 && <div className="p-3 text-sm text-gray-500">No units found.</div>}
                </div>
            )}
        </div>
    );
};