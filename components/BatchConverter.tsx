
import React, { useState, useMemo, useCallback } from 'react';
import type { Unit, Settings, ConversionResult } from '../types';
import { UnitSelector } from './UnitSelector';
import { convert } from '../services/conversion';

interface BatchConverterProps {
    units: Unit[];
    settings: Settings;
}

interface BatchResultRow {
    input: string;
    results: ConversionResult[];
}

export const BatchConverter: React.FC<BatchConverterProps> = ({ units, settings }) => {
    const [fromUnit, setFromUnit] = useState<Unit | null>(units.find(u => u.id === 'kcal') || null);
    const [toUnits, setToUnits] = useState<Unit[]>([units.find(u => u.id === 'kJ')].filter(Boolean) as Unit[]);
    const [inputText, setInputText] = useState('1\n2.5\n3e3');
    const [batchResults, setBatchResults] = useState<BatchResultRow[]>([]);

    const handleConvert = useCallback(() => {
        if (!fromUnit || toUnits.length === 0 || !inputText) {
            setBatchResults([]);
            return;
        }
        const lines = inputText.split('\n').filter(line => line.trim() !== '');
        const results = lines.map(line => {
            const conversion = convert(line.trim(), fromUnit, toUnits, settings);
            return {
                input: line.trim(),
                results: conversion,
            };
        });
        setBatchResults(results);
    }, [fromUnit, toUnits, inputText, settings]);

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const text = await file.text();
            setInputText(text);
        }
    };
    
    const downloadCSV = () => {
        if (batchResults.length === 0 || !fromUnit) return;
        const headers = ['Input Value', `From (${fromUnit.id})`, ...toUnits.map(u => `To (${u.id})`)];
        const rows = batchResults.map(row => {
            const resultValues = toUnits.map(toUnit => {
                const res = row.results.find(r => r.unit.id === toUnit.id);
                return res ? res.formattedValue : 'N/A';
            });
            return [row.input, fromUnit.id, ...resultValues].join(',');
        });
        const csvContent = [headers.join(','), ...rows].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'conversion_results.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        <label htmlFor="file-upload" className="ml-1 font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                            Upload a CSV/TSV file
                        </label>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" accept=".csv,.tsv,.txt" onChange={handleFileUpload} />
                    </div>
                </div>
            </div>
            <div className="text-center">
                <button
                    onClick={handleConvert}
                    className="px-8 py-3 bg-blue-600 text-white font-bold text-lg rounded-md hover:bg-blue-700 transition disabled:bg-blue-300 dark:disabled:bg-blue-800 disabled:cursor-not-allowed"
                    disabled={!fromUnit || toUnits.length === 0 || !inputText}
                >
                    Convert Batch
                </button>
            </div>
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