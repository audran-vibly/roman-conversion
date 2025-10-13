export interface ConversionResult {
    value: number;
    error?: string;
}

export const ROMAN_VALUES: Record<string, number> = {
    I: 1,
    V: 5,
    X: 10,
    L: 50,
    C: 100,
    D: 500,
    M: 1000,
};

export const VALIDATION_RULES = {
    maxLength: 15,
    maxRepeats: 3,
    pattern: /^M{0,4}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/i,
    repeatPattern: /([IVXLCDM])\1{3,}/i,
};

const validateNotEmpty = (roman: string): string | null => {
    return !roman.trim() ? "Veuillez saisir votre nombre" : null;
};

const validateFormat = (roman: string): string | null => {
    return !VALIDATION_RULES.pattern.test(roman.toUpperCase())
        ? "Format du nombre romain incorrect"
        : null;
};

const validateRepeats = (roman: string): string | null => {
    return VALIDATION_RULES.repeatPattern.test(roman)
        ? "Un symbole ne peut pas apparaitre 3 fois consecutivement"
        : null;
};

const validateRomanNumber = (roman: string): string | null => {
    return (
        validateNotEmpty(roman) ||
        validateRepeats(roman) ||
        validateFormat(roman)
    );
};

export const convertRomanToArabic = (roman: string): ConversionResult => {
    const validationError = validateRomanNumber(roman);
    if (validationError) {
        return { value: 0, error: validationError };
    }

    let total = 0;
    let prevValue = 0;

    for (let i = roman.length - 1; i >= 0; i--) {
        const currentValue = ROMAN_VALUES[roman[i].toUpperCase()];

        if (currentValue < prevValue) {
            total -= currentValue;
        } else {
            total += currentValue;
        }

        prevValue = currentValue;
    }

    return { value: total };
};

export const sanitizeRomanInput = (input: string): string => {
    return input.replace(/[^IVXLCDMivxlcdm]/g, "");
};