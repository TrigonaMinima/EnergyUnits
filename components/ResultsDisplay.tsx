// This component is responsible for displaying the conversion results.
// It is composed of a main container and multiple `ResultRow` child components.

import React, { useState } from 'react';
import type { ConversionResult, Unit } from '../types';
import { ClipboardIcon, CheckIcon } from './icons';

// Props for the main ResultsDisplay component.
interface ResultsDisplayProps {
    results: ConversionResult[]; // The array of conversion results to display.
    fromValue: string;
    fromUnit: Unit | null;
    onCopyAll: () => void; // A function passed from the parent to handle copying all results.
}

// A smaller, self-contained component for rendering a single result row.
// Breaking down complex UIs into smaller components is a core concept in React.
const ResultRow: React.FC<{ result: ConversionResult, fromValue: string, fromUnit: Unit }> = ({ result, fromValue, fromUnit }) => {
    // This component has its own state to track if its value has been copied.
    const [isCopied, setIsCopied] = useState(false);

    // Function to copy this row's result to the clipboard.
    const copyToClipboard = () => {
        // `navigator.clipboard` is a browser API for interacting with the clipboard.
        navigator.clipboard.writeText(result.formattedValue);
        setIsCopied(true); // Set state to true to show the checkmark icon.
        // After 2 seconds, reset the state to show the copy icon again.
        setTimeout(() => setIsCopied(false), 2000);
    };

    // For display purposes, create a simple formula string.
    const fromFactor = parseFloat(fromUnit.factorToJ);
    const toFactor = parseFloat(result.unit.factorToJ);
    const formattedFromFactor = new Intl.NumberFormat('en-US').format(fromFactor);
    const formattedToFactor = new Intl.NumberFormat('en-US').format(toFactor);
    const formula = `(${fromValue} ${fromUnit.id} × ${formattedFromFactor}) ÷ ${formattedToFactor}`;

    return (
        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{result.unit.name} ({result.unit.id})</p>
                    <p className="text-2xl md:text-3xl font-mono tracking-tight text-blue-600 dark:text-blue-400">
                        {result.error || result.formattedValue}
                    </p>
                </div>
                <button 
                    onClick={copyToClipboard} 
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition flex-shrink-0" 
                    aria-label={`Copy ${result.formattedValue}`}
                    disabled={isCopied}
                >
                    {/* Conditionally render the check icon or the clipboard icon based on the `isCopied` state. */}
                    {isCopied ? <CheckIcon className="h-5 w-5 text-green-500" /> : <ClipboardIcon />}
                </button>
            </div>
             {!result.error && (
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 font-mono break-all">
                    Formula: {formula}
                </p>
            )}
        </div>
    );
};


// The main component for the results area.
export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results, fromValue, fromUnit, onCopyAll }) => {
    const [isCopiedAll, setIsCopiedAll] = useState(false);

    const handleCopyAll = () => {
        onCopyAll(); // Call the function passed from the parent.
        setIsCopiedAll(true);
        setTimeout(() => setIsCopiedAll(false), 2000);
    };

    // --- Conditional Rendering ---
    // The component renders different UI based on the state of the props.

    // Case 1: No 'from' unit has been selected yet.
    if (!fromUnit) {
        return (
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md h-full flex items-center justify-center">
                <p className="text-gray-500 dark:text-gray-400">Select a 'From' unit to see results.</p>
            </div>
        );
    }

    // Case 2: No 'to' units have been selected, so there are no results to display.
    if (results.length === 0) {
        return (
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md h-full flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-bold mb-2">Results</h2>
                    <p className="text-gray-500 dark:text-gray-400">Select one or more target units to see the conversion.</p>
                    <p className="mt-4 text-sm text-gray-400">Example: Convert <span className="font-mono text-gray-600 dark:text-gray-300">10 kWh</span> to <span className="font-mono text-gray-600 dark:text-gray-300">MJ</span> and <span className="font-mono text-gray-600 dark:text-gray-300">BTU</span>.</p>
                </div>
            </div>
        );
    }

    // Case 3: We have results to display.
    return (
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">
                    Results for <span className="text-blue-600 dark:text-blue-400">{fromValue} {fromUnit.id}</span>
                </h2>
                <button 
                    onClick={handleCopyAll} 
                    className={`flex items-center space-x-2 px-3 py-2 text-sm text-white rounded-md transition-colors duration-200 ${isCopiedAll ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'}`} 
                    aria-label="Copy All Results"
                    disabled={isCopiedAll}
                >
                    {isCopiedAll ? (
                        <>
                            <CheckIcon />
                            <span>Copied!</span>
                        </>
                    ) : (
                        <>
                            <ClipboardIcon />
                            <span>Copy All</span>
                        </>
                    )}
                </button>
            </div>
            <div className="space-y-3">
                {/* Map over the `results` array and render a `ResultRow` for each item. */}
                {/* `key` is a special prop in React that helps it efficiently update lists. */}
                {results.map(result => <ResultRow key={result.unit.id} result={result} fromValue={fromValue} fromUnit={fromUnit} />)}
            </div>
        </div>
    );
};
