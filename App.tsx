// This is the main component of our application. It acts as the central hub,
// managing the overall state and bringing all other components together.

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Header } from './components/Header';
import { UnitSelector } from './components/UnitSelector';
import { ResultsDisplay } from './components/ResultsDisplay';
import { SettingsPanel } from './components/SettingsPanel';
import { BatchConverter } from './components/BatchConverter';
import { HistoryPanel } from './components/HistoryPanel';
import { UnitInfoPanel } from './components/UnitInfoPanel';
import { useLocalStorage } from './hooks/useLocalStorage';
import { UNITS, getUnitById } from './constants/units';
import { convert } from './services/conversion';
import type { Unit, Settings, HistoryEntry, ConversionResult } from './types';

// The main App component is defined as a React Functional Component (React.FC).
const App: React.FC = () => {
  // --- STATE MANAGEMENT ---
  // State is data that can change over time and affects what is rendered on the screen.
  // We use React's `useState` hook to manage component-level state.

  // `mode` determines whether we show the 'single' or 'batch' conversion UI.
  const [mode, setMode] = useState<'single' | 'batch'>('single');
  
  // State for the single conversion mode.
  const [inputValue, setInputValue] = useState<string>('12.5'); // The value to be converted.
  const [fromUnit, setFromUnit] = useState<Unit | null>(getUnitById('kWh')); // The unit to convert from.
  const [toUnits, setToUnits] = useState<Unit[]>([getUnitById('MJ'), getUnitById('BTU')].filter(Boolean) as Unit[]); // A list of units to convert to.

  // `useLocalStorage` is a custom hook that works like `useState` but also saves the data
  // to the browser's local storage. This makes the data persist even after a page refresh.
  const [settings, setSettings] = useLocalStorage<Settings>('settings', {
    precision: 4,
    mode: 'sigfigs',
    rounding: 'half-up',
  });

  const [history, setHistory] = useLocalStorage<HistoryEntry[]>('history', []);

  // State to control the visibility of the side panels (History and Unit Info).
  const [showHistory, setShowHistory] = useState(false);
  const [showUnitInfo, setShowUnitInfo] = useState(false);

  // --- LOGIC AND EVENT HANDLERS ---
  
  // `useCallback` is a hook that memoizes a function. This means the function is not recreated
  // on every render, which can improve performance, especially when passed as a prop to child components.
  const addHistoryEntry = useCallback((entry: Omit<HistoryEntry, 'ts'>) => {
    // Add a new entry to the history, with a timestamp. Limit history to the last 25 entries.
    setHistory(prev => [{ ...entry, ts: Date.now() }, ...prev.slice(0, 24)]);
  }, [setHistory]); // The dependency array means this function is only recreated if `setHistory` changes (which it won't).

  // This function is called when a conversion should be logged to history (e.g., when the input field loses focus).
  const handleConversion = useCallback(() => {
    if (fromUnit && toUnits.length > 0 && inputValue) {
        addHistoryEntry({
            value: inputValue,
            from: fromUnit.id,
            to: toUnits.map(u => u.id),
            settings,
        });
    }
  }, [inputValue, fromUnit, toUnits, settings, addHistoryEntry]);
  
  // `useMemo` is a hook that memoizes a value. The conversion calculation will only run again
  // if one of the dependencies (inputValue, fromUnit, toUnits, settings) changes. This prevents
  // unnecessary recalculations on every render, boosting performance.
  const conversionResults: ConversionResult[] = useMemo(() => {
    if (!fromUnit || toUnits.length === 0 || !inputValue) {
      return []; // Return empty if we don't have enough info to convert.
    }
    // Call the main conversion function from our services.
    return convert(inputValue, fromUnit, toUnits, settings);
  }, [inputValue, fromUnit, toUnits, settings]);

  // Handler for when a user clicks on an item in the history panel.
  const handleHistorySelect = (entry: HistoryEntry) => {
    setInputValue(entry.value);
    setFromUnit(getUnitById(entry.from));
    setToUnits(entry.to.map(id => getUnitById(id)).filter(Boolean) as Unit[]);
    setSettings(entry.settings);
    setShowHistory(false); // Close the history panel after selection.
  };

  // Function to copy all conversion results to the clipboard.
  const copyResultsToClipboard = () => {
    const text = conversionResults.map(r => `${inputValue} ${fromUnit?.id} = ${r.formattedValue} ${r.unit.id}`).join('\n');
    navigator.clipboard.writeText(text);
  };

  // --- JSX RENDER ---
  // This is what the component will render as HTML.
  return (
    <div className="min-h-screen flex flex-col">
      {/* The Header component. We pass the `setShowUnitInfo` function as a prop so it can open the panel. */}
      <Header onShowInfo={() => setShowUnitInfo(true)} />
      <main className="flex-grow w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
        {/* Mode selection buttons */}
        <div className="flex items-center justify-center space-x-4 mb-6 md:mb-8">
          <button onClick={() => setMode('single')} className={`px-4 py-2 text-lg font-semibold rounded-md transition-colors ${mode === 'single' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700'}`}>
            Single Conversion
          </button>
          <button onClick={() => setMode('batch')} className={`px-4 py-2 text-lg font-semibold rounded-md transition-colors ${mode === 'batch' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700'}`}>
            Batch Converter
          </button>
        </div>

        {/* Conditional rendering: Show either the Single or Batch converter UI based on the `mode` state. */}
        {mode === 'single' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 flex flex-col space-y-6">
              {/* Input Section */}
              <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-4">Input</h2>
                <div className="flex items-start space-x-2">
                    <div className="w-32">
                        <label htmlFor="input-value" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Value
                        </label>
                        <input
                            id="input-value"
                            type="text"
                            value={inputValue} // The input's value is controlled by our state.
                            onChange={e => setInputValue(e.target.value)} // Update state on change.
                            onBlur={handleConversion} // Log to history when focus is lost.
                            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500 text-lg"
                            placeholder="e.g., 12.5"
                        />
                    </div>
                    <div className="flex-grow">
                         <label htmlFor="from-unit" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            From
                        </label>
                        {/* UnitSelector for the 'from' unit. We pass it the available units, the currently selected unit, and a function to update the state. */}
                        <UnitSelector
                            id="from-unit"
                            units={UNITS}
                            selectedUnit={fromUnit}
                            onSelectUnit={u => setFromUnit(u)}
                            placeholder="Select unit"
                        />
                    </div>
                </div>
              </div>
              
              {/* Target Units Section */}
              <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-4">Target Units</h2>
                {/* UnitSelector for the 'to' units (multi-select mode). */}
                <UnitSelector
                    units={UNITS}
                    selectedUnits={toUnits}
                    onSelectUnit={(unit) => {
                        // Logic to add or remove a unit from the `toUnits` array.
                        setToUnits(prev => 
                            prev.find(u => u.id === unit.id) 
                            ? prev.filter(u => u.id !== unit.id)
                            : [...prev, unit]
                        );
                    }}
                    isMulti={true}
                    placeholder="Select target units"
                />
              </div>

              {/* Settings Panel. We pass the current settings and the function to update them. */}
              <SettingsPanel settings={settings} onSettingsChange={setSettings} />

              <button
                  onClick={() => setShowHistory(true)} // Button to open the history panel.
                  className="w-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold py-2 px-4 rounded-md transition"
              >
                  History
              </button>
            </div>
            
            {/* Results Display Area */}
            <div className="lg:col-span-2">
              <ResultsDisplay results={conversionResults} fromValue={inputValue} fromUnit={fromUnit} onCopyAll={copyResultsToClipboard} />
            </div>
          </div>
        ) : (
          // If mode is 'batch', show the BatchConverter component.
          <BatchConverter units={UNITS} settings={settings} />
        )}

        {/* Conditionally render the side panels. They only appear if their `show` state is true. */}
        {showHistory && <HistoryPanel history={history} onSelect={handleHistorySelect} onClose={() => setShowHistory(false)} />}
        {showUnitInfo && <UnitInfoPanel onClose={() => setShowUnitInfo(false)} />}
      </main>

      {/* Application Footer */}
      <footer className="text-center p-4 text-sm text-gray-500 dark:text-gray-400">
        <p>All conversions performed locally in your browser for privacy and speed.</p>
        <p>&copy; {new Date().getFullYear()} Energy Unit Converter. Built with React & Tailwind CSS.</p>
      </footer>
    </div>
  );
};

export default App;
