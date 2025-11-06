// This component displays the settings panel for controlling conversion precision and rounding.
// It's a "controlled component," which means its state (the settings values) is not held internally.
// Instead, the parent component (`App.tsx`) holds the state and passes it down as props.
// When the user makes a change, this component calls a function passed from the parent to update the state.

import React from 'react';
import type { Settings } from '../types';
import { ChevronDownIcon } from './icons';

// Define the props the component expects.
interface SettingsPanelProps {
    settings: Settings; // The current settings object.
    onSettingsChange: React.Dispatch<React.SetStateAction<Settings>>; // The function to call to update the settings.
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, onSettingsChange }) => {
    
    // --- Event Handlers ---
    
    // This function is called when the precision slider or number input changes.
    const handlePrecisionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // We call the parent's state update function, providing a new settings object.
        // The `s => ({ ...s, ... })` pattern is a safe way to update state that depends on the previous state.
        // We also clamp the value between 1 and 20 to ensure it's within a valid range.
        onSettingsChange(s => ({ ...s, precision: Math.max(1, Math.min(20, parseInt(e.target.value, 10) || 1)) }));
    };

    // Called when the "Precision Mode" dropdown changes.
    const handleModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onSettingsChange(s => ({ ...s, mode: e.target.value as Settings['mode'] }));
    };

    // Called when the "Rounding Mode" dropdown changes.
    const handleRoundingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onSettingsChange(s => ({ ...s, rounding: e.target.value as Settings['rounding'] }));
    };
    
    return (
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Settings</h2>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Precision</label>
                    <div className="flex items-center space-x-2">
                        {/* The range slider's value is controlled by the `settings` prop. */}
                        <input
                            type="range"
                            min="1"
                            max="16"
                            value={settings.precision}
                            onChange={handlePrecisionChange}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-800"
                        />
                        {/* The number input is also controlled and synced with the slider. */}
                        <input
                            type="number"
                            min="1"
                            max="16"
                            value={settings.precision}
                            onChange={handlePrecisionChange}
                            className="w-16 px-2 py-1 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md text-center"
                        />
                    </div>
                </div>
                <div>
                    <label htmlFor="precision-mode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Precision Mode
                    </label>
                    <div className="relative">
                        {/* The select dropdown's value is controlled by the `settings` prop. */}
                        <select
                            id="precision-mode"
                            value={settings.mode}
                            onChange={handleModeChange}
                            className="w-full px-3 py-2 pr-8 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:text-gray-100 appearance-none"
                        >
                            <option value="sigfigs">Significant Figures</option>
                            <option value="fixed">Decimal Places</option>
                        </select>
                        {/* A custom dropdown arrow for consistent styling. */}
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                           <ChevronDownIcon className="h-5 w-5" />
                        </div>
                    </div>
                </div>
                <div>
                    <label htmlFor="rounding-mode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Rounding Mode
                    </label>
                    <div className="relative">
                        <select
                            id="rounding-mode"
                            value={settings.rounding}
                            onChange={handleRoundingChange}
                            className="w-full px-3 py-2 pr-8 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:text-gray-100 appearance-none"
                        >
                            <option value="half-up">Half Up (Standard)</option>
                            <option value="half-even">Half to Even (Bankers')</option>
                        </select>
                         <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                           <ChevronDownIcon className="h-5 w-5" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
