import React from 'react';
import { InfoIcon } from './icons';

interface HeaderProps {
    onShowInfo: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onShowInfo }) => {
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