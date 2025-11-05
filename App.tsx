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

const App: React.FC = () => {
  const [mode, setMode] = useState<'single' | 'batch'>('single');
  
  const [inputValue, setInputValue] = useState<string>('12.5');
  const [fromUnit, setFromUnit] = useState<Unit | null>(getUnitById('kWh'));
  const [toUnits, setToUnits] = useState<Unit[]>([getUnitById('MJ'), getUnitById('BTU')].filter(Boolean) as Unit[]);

  const [settings, setSettings] = useLocalStorage<Settings>('settings', {
    precision: 4,
    mode: 'sigfigs',
    rounding: 'half-up',
  });

  const [history, setHistory] = useLocalStorage<HistoryEntry[]>('history', []);

  const [showHistory, setShowHistory] = useState(false);
  const [showUnitInfo, setShowUnitInfo] = useState(false);

  const addHistoryEntry = useCallback((entry: Omit<HistoryEntry, 'ts'>) => {
    setHistory(prev => [{ ...entry, ts: Date.now() }, ...prev.slice(0, 24)]);
  }, [setHistory]);

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
  
  const conversionResults: ConversionResult[] = useMemo(() => {
    if (!fromUnit || toUnits.length === 0 || !inputValue) {
      return [];
    }
    return convert(inputValue, fromUnit, toUnits, settings);
  }, [inputValue, fromUnit, toUnits, settings]);

  const handleHistorySelect = (entry: HistoryEntry) => {
    setInputValue(entry.value);
    setFromUnit(getUnitById(entry.from));
    setToUnits(entry.to.map(id => getUnitById(id)).filter(Boolean) as Unit[]);
    setSettings(entry.settings);
    setShowHistory(false);
  };

  const copyResultsToClipboard = () => {
    const text = conversionResults.map(r => `${inputValue} ${fromUnit?.id} = ${r.formattedValue} ${r.unit.id}`).join('\n');
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header onShowInfo={() => setShowUnitInfo(true)} />
      <main className="flex-grow w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
        <div className="flex items-center justify-center space-x-4 mb-6 md:mb-8">
          <button onClick={() => setMode('single')} className={`px-4 py-2 text-lg font-semibold rounded-md transition-colors ${mode === 'single' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700'}`}>
            Single Conversion
          </button>
          <button onClick={() => setMode('batch')} className={`px-4 py-2 text-lg font-semibold rounded-md transition-colors ${mode === 'batch' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700'}`}>
            Batch Converter
          </button>
        </div>

        {mode === 'single' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 flex flex-col space-y-6">
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
                            value={inputValue}
                            onChange={e => setInputValue(e.target.value)}
                            onBlur={handleConversion}
                            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500 text-lg"
                            placeholder="e.g., 12.5"
                        />
                    </div>
                    <div className="flex-grow">
                         <label htmlFor="from-unit" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            From
                        </label>
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
              
              <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-4">Target Units</h2>
                <UnitSelector
                    units={UNITS}
                    selectedUnits={toUnits}
                    onSelectUnit={(unit) => {
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

              <SettingsPanel settings={settings} onSettingsChange={setSettings} />

              <button
                  onClick={() => setShowHistory(true)}
                  className="w-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold py-2 px-4 rounded-md transition"
              >
                  History
              </button>
            </div>
            
            <div className="lg:col-span-2">
              <ResultsDisplay results={conversionResults} fromValue={inputValue} fromUnit={fromUnit} onCopyAll={copyResultsToClipboard} />
            </div>
          </div>
        ) : (
          <BatchConverter units={UNITS} settings={settings} />
        )}
        {showHistory && <HistoryPanel history={history} onSelect={handleHistorySelect} onClose={() => setShowHistory(false)} />}
        {showUnitInfo && <UnitInfoPanel onClose={() => setShowUnitInfo(false)} />}
      </main>
      <footer className="text-center p-4 text-sm text-gray-500 dark:text-gray-400">
        <p>All conversions performed locally in your browser for privacy and speed.</p>
        <p>&copy; {new Date().getFullYear()} Energy Unit Converter. Built with React & Tailwind CSS.</p>
      </footer>
    </div>
  );
};

export default App;