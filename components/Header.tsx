// This is a "presentational" or "dumb" component. Its main job is to display the
// header UI. It doesn't have its own state; it just receives data and functions as props.

import React from 'react';
import { InfoIcon } from './icons';

// Define the shape of the props that this component expects to receive.
interface HeaderProps {
    onShowInfo: () => void; // It expects a function called `onShowInfo` that returns nothing.
}

// Define the Header component.
export const Header: React.FC<HeaderProps> = ({ onShowInfo }) => {
    // The component's output is JSX, which looks like HTML but is actually JavaScript.
    return (
        <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex-shrink-0">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                            ⚡️ Energy Unit Converter
                        </h1>
                    </div>
                    <div className="flex items-center space-x-2">
                        {/* This button, when clicked, calls the `onShowInfo` function that was passed down from the parent (App.tsx). */}
                        {/* This is a common pattern for child components to communicate events back up to their parents. */}
                        <button 
                            onClick={onShowInfo}
                            className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                            aria-label="Show unit information"
                        >
                            <InfoIcon />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};
