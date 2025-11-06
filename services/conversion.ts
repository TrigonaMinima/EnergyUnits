// This file contains the core logic for performing the unit conversions.
// Keeping it separate from the UI components makes the code cleaner and easier to test.

import type { Unit, Settings, ConversionResult, RoundingMode } from '../types';

// Note: For extreme precision as required by the PRD (e.g., for eV), a library like decimal.js
// would be necessary. For this implementation, we use native Number which is IEEE-754 double,
// covering most common use cases adequately.

/**
 * A custom rounding function to support different rounding modes.
 * @param value The number to round.
 * @param rounding The rounding mode ('half-up' or 'half-even').
 * @returns The rounded number.
 */
function customRound(value: number, rounding: RoundingMode): number {
    // 'half-even' is also known as "Banker's Rounding". It rounds .5 to the nearest even integer.
    if (rounding === 'half-even') {
        const floor = Math.floor(value);
        const diff = value - floor;
        if (diff === 0.5) {
            return floor % 2 === 0 ? floor : Math.ceil(value);
        }
    }
    // 'half-up' is the standard rounding behavior of Math.round for positive numbers.
    return Math.round(value);
}

/**
 * Formats a numeric value into a string based on the user's precision and rounding settings.
 * @param value The number to format.
 * @param settings The user's current settings object.
 * @returns A formatted string representation of the value.
 */
function formatValue(value: number, settings: Settings): string {
    if (isNaN(value) || !isFinite(value)) {
        return "Invalid";
    }

    let result: string;
    try {
        if (settings.mode === 'sigfigs') {
            // `toPrecision` formats a number to a specified number of significant figures.
            result = value.toPrecision(settings.precision);
        } else { // 'fixed' mode
            // `toFixed` formats a number to a specified number of decimal places.
            // However, its rounding can be inconsistent across browsers, so we apply our custom round first.
            const factor = Math.pow(10, settings.precision);
            const roundedValue = customRound(value * factor, settings.rounding) / factor;
            result = roundedValue.toFixed(settings.precision);
        }
    } catch (e) {
        // `toPrecision` can throw an error for very high precision values.
        return value.toExponential(4); // Fallback to exponential notation.
    }
    
    // `Intl.NumberFormat` is a powerful browser API for formatting numbers according to
    // language-sensitive conventions (e.g., using a comma or a period for the decimal separator).
    const numericResult = parseFloat(result); // Convert back to a number before formatting.
    return new Intl.NumberFormat(undefined, { // `undefined` uses the user's locale.
        maximumSignificantDigits: settings.mode === 'sigfigs' ? settings.precision : undefined,
        maximumFractionDigits: settings.mode === 'fixed' ? settings.precision : 20,
    }).format(numericResult);
}

/**
 * The main conversion function.
 * @param inputValue The string value entered by the user.
 * @param fromUnit The unit to convert from.
 * @param toUnits An array of units to convert to.
 * @param settings The current conversion settings.
 * @returns An array of ConversionResult objects.
 */
export function convert(inputValue: string, fromUnit: Unit, toUnits: Unit[], settings: Settings): ConversionResult[] {
    // First, parse the user's input string into a number. Remove commas to handle inputs like "1,000".
    const parsedValue = parseFloat(inputValue.replace(/,/g, ''));

    // If the input is not a valid number, return an error for all target units.
    if (isNaN(parsedValue)) {
        return toUnits.map(unit => ({
            unit,
            value: NaN,
            formattedValue: '',
            error: 'Invalid input value'
        }));
    }

    // --- CORE CONVERSION LOGIC ---
    // 1. Convert the input value to the base unit (Joules).
    // We use native JavaScript numbers for calculations. For higher precision, a library like `decimal.js` would be needed.
    const factorToJ = parseFloat(fromUnit.factorToJ);
    const valueInJoules = parsedValue * factorToJ;

    // Check if the result is a number that can be represented (not Infinity).
    if (!isFinite(valueInJoules)) {
         return toUnits.map(unit => ({
            unit,
            value: NaN,
            formattedValue: '',
            error: 'Resulting value is too large or small to represent.'
        }));
    }

    // 2. For each target unit, convert the value from Joules to that unit.
    return toUnits.map(targetUnit => {
        try {
            const factorFromJ = parseFloat(targetUnit.factorToJ);
            const resultValue = valueInJoules / factorFromJ;
            
            // Return a successful conversion result object.
            return {
                unit: targetUnit,
                value: resultValue,
                formattedValue: formatValue(resultValue, settings), // Format the result according to settings.
            };
        } catch(e) {
            // In case of any unexpected calculation error.
             return {
                unit: targetUnit,
                value: NaN,
                formattedValue: 'Error',
                error: 'Calculation Error'
            };
        }
    });
}
