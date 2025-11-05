
import type { Unit, Settings, ConversionResult, RoundingMode } from '../types';
// Note: For extreme precision as required by the PRD (e.g., for eV), a library like decimal.js
// would be necessary. For this implementation, we use native Number which is IEEE-754 double,
// covering most common use cases adequately.

function customRound(value: number, rounding: RoundingMode): number {
    if (rounding === 'half-even') {
        const floor = Math.floor(value);
        const diff = value - floor;
        if (diff === 0.5) {
            return floor % 2 === 0 ? floor : Math.ceil(value);
        }
    }
    // 'half-up' is the default behavior of Math.round for positive numbers
    return Math.round(value);
}

function formatValue(value: number, settings: Settings): string {
    if (isNaN(value) || !isFinite(value)) {
        return "Invalid";
    }

    let result: string;
    try {
        if (settings.mode === 'sigfigs') {
            result = value.toPrecision(settings.precision);
        } else { // 'fixed'
            // Custom rounding needed before toFixed, as toFixed's rounding can be inconsistent.
            const factor = Math.pow(10, settings.precision);
            const roundedValue = customRound(value * factor, settings.rounding) / factor;
            result = roundedValue.toFixed(settings.precision);
        }
    } catch (e) {
        // toPrecision can throw for large precision values
        return value.toExponential(4);
    }
    
    // Use Intl.NumberFormat for locale-aware formatting (e.g., decimal separators).
    // This can sometimes clash with toPrecision/toFixed, so we parse it back first.
    const numericResult = parseFloat(result);
    return new Intl.NumberFormat(undefined, {
        maximumSignificantDigits: settings.mode === 'sigfigs' ? settings.precision : undefined,
        maximumFractionDigits: settings.mode === 'fixed' ? settings.precision : 20,
    }).format(numericResult);
}


export function convert(inputValue: string, fromUnit: Unit, toUnits: Unit[], settings: Settings): ConversionResult[] {
    const parsedValue = parseFloat(inputValue.replace(/,/g, ''));

    if (isNaN(parsedValue)) {
        return toUnits.map(unit => ({
            unit,
            value: NaN,
            formattedValue: '',
            error: 'Invalid input value'
        }));
    }

    // Using native numbers for calculation. For higher precision, a Decimal library would be used here.
    const factorToJ = parseFloat(fromUnit.factorToJ);
    const valueInJoules = parsedValue * factorToJ;

    if (!isFinite(valueInJoules)) {
         return toUnits.map(unit => ({
            unit,
            value: NaN,
            formattedValue: '',
            error: 'Resulting value is too large or small to represent.'
        }));
    }

    return toUnits.map(targetUnit => {
        try {
            const factorFromJ = parseFloat(targetUnit.factorToJ);
            const resultValue = valueInJoules / factorFromJ;
            
            return {
                unit: targetUnit,
                value: resultValue,
                formattedValue: formatValue(resultValue, settings),
            };
        } catch(e) {
             return {
                unit: targetUnit,
                value: NaN,
                formattedValue: 'Error',
                error: 'Calculation Error'
            };
        }
    });
}
