// This component provides the UI and logic for converting a list of values at once.
// It manages its own state for inputs and results, separate from the single conversion mode.

import React, { useState, useMemo, useCallback } from 'react';
import type { Unit, Settings, ConversionResult } from '../types';
import { UnitSelector } from './UnitSelector';
import { convert } from '../services/conversion';

// Define the props this component expects from its parent (`App.tsx`).
interface BatchConverterProps {
    units: Unit[];
    settings: Settings;
}

// Define a type for the structure of a single row in our batch results.
interface BatchResultRow {
    input: string; // The original input value from a line.
    results: ConversionResult[]; // The array of conversion results for that input.
}

export const BatchConverter: React.FC<BatchConverterProps> = ({ units, settings }) => {
    // --- STATE MANAGEMENT ---
    // This component manages its own state for the batch conversion process.
    const [fromUnit, setFromUnit] = useState<Unit | null>(units.find(u => u.id === 'kcal') || null);
    const [toUnits, setToUnits] = useState<Unit[]>([units.find(u => u.id === 'kJ')].filter(Boolean) as Unit[]);
    const [inputText, setInputText] = useState('1\n2.5\n3e3'); // The text area content, with default examples.
    const [batchResults, setBatchResults] = useState<BatchResultRow[]>([]); // The results of the last batch conversion.

    // --- EVENT HANDLERS & LOGIC ---

    // `useCallback` memoizes the function to prevent it from being recreated on every render.
    const handleConvert = useCallback(() => {
        if (!fromUnit || toUnits.length === 0 || !inputText) {
            setBatchResults([]);
            return;
        }
        // Split the input text into lines, and filter out any empty lines.
        const lines = inputText.split('\n').filter(line => line.trim() !== '');
        // For each line, call the `convert` service function.
        const results = lines.map(line => {
            const conversion = convert(line.trim(), fromUnit, toUnits, settings);
            return {
                input: line.trim(),
                results: conversion,
            };
        });
        // Update the state with the new results, triggering a re-render to display the results table.
        setBatchResults(results);
    }, [fromUnit, toUnits, inputText, settings]); // This function depends on these values.

    // Handles the file upload input.
    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]; // Get the first file from the input.
        if (file) {
            // `file.text()` is a modern browser API to read a file's content as a string.
            const text = await file.text();
            setInputText(text); // Set the textarea's content to the file's content.
        }
    };
    
    // Generates and triggers a download for a CSV file of the results.
    const downloadCSV = () => {
        if (batchResults.length === 0 || !fromUnit) return;
        // Define the headers for the CSV file.
        const headers = ['Input Value', `From (${fromUnit.id})`, ...toUnits.map(u => `To (${u.id})`)];
        // Create a row for each result.
        const rows = batchResults.map(row => {
            const resultValues = toUnits.map(toUnit => {
                const res = row.results.find(r => r.unit.id === toUnit.id);
                return res ? res.formattedValue : 'N/A';
            });
            // Note: This basic CSV generation doesn't handle values with commas correctly.
            // A more robust solution would use a dedicated CSV library.
            return [row.input, fromUnit.id, ...resultValues].join(',');
        });
        const csvContent = [headers.join(','), ...rows].join('\n');
        // Create a "Blob" (a file-like object) from the CSV content.
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        // Create a temporary link element to trigger the download.
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'conversion_results.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click(); // Programmatically click the link.
        document.body.removeChild(link); // Clean up the temporary link.
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Panel for selecting units */}
                <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-4">1. Select Units</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">From Unit</label>
                            <UnitSelector units={units} selectedUnit={fromUnit} onSelectUnit={setFromUnit} placeholder="Select source unit" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">To Units</label>
                            <UnitSelector units={units} selectedUnits={toUnits} onSelectUnit={(unit) => {
                                setToUnits(prev => prev.find(u => u.id === unit.id) ? prev.filter(u => u.id !== unit.id) : [...prev, unit]);
                            }} placeholder="Select target units" isMulti={true} />
                        </div>
                    </div>
                </div>
                {/* Panel for providing input values */}
                <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-4">2. Provide Input Values</h2>
                     <textarea
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        className="w-full h-32 p-2 font-mono text-sm bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Paste values here, one per line..."
                    />
                    <div className="mt-2 text-center text-sm text-gray-500">
                        or
                        {/* A styled label linked to a hidden file input for a better UX. */}
                        <label htmlFor="file-upload" className="ml-1 font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                            Upload a CSV/TSV file
                        </label>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" accept=".csv,.tsv,.txt" onChange={handleFileUpload} />
                    </div>
                </div>
            </div>
            {/* The main convert button */}
            <div className="text-center">
                <button
                    onClick={handleConvert}
                    className="px-8 py-3 bg-blue-600 text-white font-bold text-lg rounded-md hover:bg-blue-700 transition disabled:bg-blue-300 dark:disabled:bg-blue-800 disabled:cursor-not-allowed"
                    disabled={!fromUnit || toUnits.length === 0 || !inputText}
                >
                    Convert Batch
                </button>
            </div>
            {/* The results table, which is only rendered if there are results. */}
            {batchResults.length > 0 && (
                <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">Results</h2>
                        <button onClick={downloadCSV} className="px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition">
                            Download CSV
                        </button>
                    </div>
                    <div className="max-h-96 overflow-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Input</th>
                                    {toUnits.map(unit => (
                                        <th key={unit.id} className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{unit.id}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                                {batchResults.map((row, index) => (
                                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{row.input}</td>
                                        {toUnits.map(unit => {
                                            const result = row.results.find(r => r.unit.id === unit.id);
                                            return <td key={unit.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 font-mono">{result?.error || result?.formattedValue || 'N/A'}</td>;
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};
