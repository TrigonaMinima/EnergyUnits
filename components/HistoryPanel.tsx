// This component is a side panel (often called an "off-canvas" menu or "drawer")
// that displays the user's conversion history.

import React from 'react';
import type { HistoryEntry } from '../types';
import { XIcon } from './icons';

// Define the props the component expects.
interface HistoryPanelProps {
    history: HistoryEntry[]; // The array of history items.
    onSelect: (entry: HistoryEntry) => void; // A function to call when the user clicks an entry.
    onClose: () => void; // A function to call to close the panel.
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onSelect, onClose }) => {
    return (
        // The overlay: a semi-transparent background that covers the main content.
        // Clicking it will call the `onClose` function.
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose}>
            <div 
                // The panel itself.
                className="fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-gray-900 shadow-xl transform transition-transform translate-x-0"
                // `e.stopPropagation()` prevents a click inside the panel from also triggering the
                // overlay's `onClick`, which would incorrectly close the panel.
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-800">
                    <h2 className="text-xl font-bold">Conversion History</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                        <XIcon />
                    </button>
                </div>
                
                {/* Conditionally render a message if history is empty, or the list of history items. */}
                {history.length === 0 ? (
                    <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                        No history yet. Perform a conversion to see it here.
                    </div>
                ) : (
                    <ul className="divide-y divide-gray-200 dark:divide-gray-700 overflow-y-auto h-[calc(100vh-65px)]">
                        {/* Map over the history array to create a list item for each entry. */}
                        {history.map(entry => (
                            <li 
                                key={entry.ts} // The timestamp is a unique key for each item.
                                className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer" 
                                // When a list item is clicked, call the `onSelect` function passed from the parent.
                                onClick={() => onSelect(entry)}
                            >
                                <div className="flex items-center space-x-2">
                                    <p className="font-bold text-lg text-blue-600 dark:text-blue-400">{entry.value}</p>
                                    <p className="text-lg">{entry.from}</p>
                                    <p className="text-lg">→</p>
                                    <p className="text-lg">{entry.to.join(', ')}</p>
                                </div>
                                <p className="text-xs text-gray-400 mt-1">
                                    {/* Display the timestamp in a human-readable format. */}
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
