export interface ConversionResult {
    value: number;
    error?: string;
}


// Standard roman notation
export const ROMAN_VALUES: Record<string, number> = {
    I: 1,
    V: 5,
    X: 10,
    L: 50,
    C: 100,
    D: 500,
    M: 1000,
};

// Multipliers for extended notation (vinculum)
export const VINCULUM_MULTIPLIERS = {
    "·": 1000,       // multiplier x 1000
    ":": 1000000,   // multiplier x1 000 000
} as const;

// Validation rules
export const VALIDATION_RULES = {
    maxLength: 25,                                       // max length alowed
    maxRepeats: 3,                                       // max number of repeats allowed
    pattern: /^[IVXLCDM][·:]?(?:[IVXLCDM][·:]?)*$/i,     // general pattern
    repeatPattern: /([IVXLCDM])[·:]?(\1[·:]?){3,}/i,     // repeats pattern
};



// ========== VALIDATION FUNCTIONS ==========

/**
 * Get validation error if roman number is empty
 * @param roman (String)
 */
const validateNotEmpty = (roman: string): string | null => {
    return !roman || !roman.trim() ? "Veuillez saisir votre nombre" : null;
};

/**
 * Get validation error if roman number is not in the correct format
 * @param roman (String)
 */
const validateFormat = (roman: string): string | null => {
    return !VALIDATION_RULES.pattern.test(roman.toUpperCase())
        ? "Format du nombre romain incorrect"
        : null;
};

/**
 * Get validation error if a symbol is repeated more than allowed (3 times)
 * @param roman (String)
 */
const validateRepeats = (roman: string): string | null => {
    return VALIDATION_RULES.repeatPattern.test(roman)
        ? "Un symbole ne peut pas apparaitre 3 fois consecutivement"
        : null;
};

/**
 * Get validation error if a symbol cannot be subtracted from another
 * @param roman (String)
 */
const validateSubtractionRules = (roman: string): string | null => {
    const upperRoman = roman.toUpperCase();

    // Check each pair of consecutive characters for invalid subtractions
    for (let i = 0; i < upperRoman.length - 1; i++) {
        const current = upperRoman[i];
        const next = upperRoman[i + 1];
        
        // Skip if next character is a vinculum
        if (next === '·' || next === ':') {
            continue;
        }
        
        // Get values for comparison
        const currentValue = ROMAN_VALUES[current];
        const nextValue = ROMAN_VALUES[next];
        
        // If current value is less than next value, it's a subtraction
        if (currentValue && nextValue && currentValue < nextValue) {
            // V, L, D cannot be used for subtraction
            if (current === 'V' || current === 'L' || current === 'D') {
                return "V, L et D ne peuvent pas être soustraits";
            }
            
            // I can only be subtracted from V and X
            if (current === 'I' && next !== 'V' && next !== 'X') {
                return "I ne peut être soustrait que de V et X";
            }
            
            // X can only be subtracted from L and C
            if (current === 'X' && next !== 'L' && next !== 'C') {
                return "X ne peut être soustrait que de L et C";
            }
            
            // C can only be subtracted from D and M
            if (current === 'C' && next !== 'D' && next !== 'M') {
                return "C ne peut être soustrait que de D et M";
            }
        }
    }

    return null;
};

/**
 * Get validation error if roman number is not valid
 * @param roman (String)
 */
const validateRomanNumber = (roman: string): string | null => {
    return (
        validateNotEmpty(roman) ||
        validateRepeats(roman) ||
        validateFormat(roman) ||
        validateSubtractionRules(roman)
    );
};

/**
 * Get the value of a roman symbol with his optional multiplicator
 * @param symbol (String) - Roman symbol
 * @param multiplicator (String | undefined) - Optional multiplicator (· or :)
 */
const getSymbolValue = (symbol: string, multiplicator?: string): number => {
    const baseValue = ROMAN_VALUES[symbol.toUpperCase()];

    if (!baseValue) return 0;

    if (multiplicator && multiplicator in VINCULUM_MULTIPLIERS) {
        return baseValue * VINCULUM_MULTIPLIERS[multiplicator as keyof typeof VINCULUM_MULTIPLIERS];
    }

    return baseValue;
};

/**
 * Decompose a roman number into its symbols and multiplicators
 * @param roman (String) - Roman number
 * @returns Array<{ symbol: string; multiplicator?: string; value: number }>
 */
const parseRomanSymbols = (roman: string): Array<{ symbol: string; multiplicator?: string; value: number }> => {
    const symbols: Array<{ symbol: string; multiplicator?: string; value: number }> = [];
    const upperRoman = roman.toUpperCase();
    let i = upperRoman.length - 1;

    while (i >= 0) {
        const currentChar = upperRoman[i];
        let multiplicator: string | undefined;

        // Check if the next character is a multiplier
        if (i < upperRoman.length - 1) {
            const nextChar = upperRoman[i + 1];
            if (nextChar in VINCULUM_MULTIPLIERS) {
                multiplicator = nextChar;
            }
        }

        const value = getSymbolValue(currentChar, multiplicator);
        if (value > 0) {
            symbols.push({ symbol: currentChar, multiplicator, value });
        }

        i--;
    }

    return symbols;
};



// ========== CONVERSION FUNCTION ==========

/**
 * Convert a roman number to its arabic value
 * @param roman
 * @returns ConversionResult
 */
export const convertRomanToArabic = (roman: string): ConversionResult => {
    const validationError = validateRomanNumber(roman);
    if (validationError) {
        return { value: 0, error: validationError };
    }

    const symbols = parseRomanSymbols(roman);
    let total = 0;
    let prevValue = 0;

    // Add or substract based on the roman rules
    for (const { value: currentValue } of symbols) {
        if (currentValue < prevValue) {
            total -= currentValue;
        } else {
            total += currentValue;
        }
        prevValue = currentValue;
    }

    return { value: total };
};

/**
 * Sanitize the input to remove invalid characters
 * @param input (String)
 * @returns String
 */
export const sanitizeRomanInput = (input: string): string => {
    return input.replace(/[^IVXLCDMivxlcdm·:]/g, "");
};