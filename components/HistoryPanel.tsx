
import React from 'react';
import type { HistoryEntry } from '../types';
import { XIcon } from './icons';

interface HistoryPanelProps {
    history: HistoryEntry[];
    onSelect: (entry: HistoryEntry) => void;
    onClose: () => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onSelect, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose}>
            <div 
                className="fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-gray-900 shadow-xl transform transition-transform translate-x-0"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-800">
                    <h2 className="text-xl font-bold">Conversion History</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                        <XIcon />
                    </button>
                </div>
                {history.length === 0 ? (
                    <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                        No history yet. Perform a conversion to see it here.
                    </div>
                ) : (
                    <ul className="divide-y divide-gray-200 dark:divide-gray-700 overflow-y-auto h-[calc(100vh-65px)]">
                        {history.map(entry => (
                            <li key={entry.ts} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer" onClick={() => onSelect(entry)}>
                                <div className="flex items-center space-x-2">
                                    <p className="font-bold text-lg text-blue-600 dark:text-blue-400">{entry.value}</p>
                                    <p className="text-lg">{entry.from}</p>
                                    <p className="text-lg">→</p>
                                    <p className="text-lg">{entry.to.join(', ')}</p>
                                </div>
                                <p className="text-xs text-gray-400 mt-1">
                                    {new Date(entry.ts).toLocaleString()} - {entry.settings.mode}: {entry.settings.precision}
                                </p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};