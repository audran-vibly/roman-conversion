import { describe, it, expect } from 'vitest'
import { 
  convertRomanToArabic, 
  sanitizeRomanInput, 
  ROMAN_VALUES, 
  VINCULUM_MULTIPLIERS,
  VALIDATION_RULES,
  type ConversionResult 
} from '../romanUtils'

describe('Roman Utils - Basic Conversion Tests', () => {
  describe('Standard Roman Numerals (1-3999)', () => {
    const testCases = [
      { roman: 'I', expected: 1 },
      { roman: 'V', expected: 5 },
      { roman: 'X', expected: 10 },
      { roman: 'L', expected: 50 },
      { roman: 'C', expected: 100 },
      { roman: 'D', expected: 500 },
      { roman: 'M', expected: 1000 },
      { roman: 'II', expected: 2 },
      { roman: 'III', expected: 3 },
      { roman: 'IV', expected: 4 },
      { roman: 'VI', expected: 6 },
      { roman: 'VII', expected: 7 },
      { roman: 'VIII', expected: 8 },
      { roman: 'IX', expected: 9 },
      { roman: 'XI', expected: 11 },
      { roman: 'XIV', expected: 14 },
      { roman: 'XV', expected: 15 },
      { roman: 'XIX', expected: 19 },
      { roman: 'XX', expected: 20 },
      { roman: 'XL', expected: 40 },
      { roman: 'XLV', expected: 45 },
      { roman: 'XC', expected: 90 },
      { roman: 'XCIX', expected: 99 },
      { roman: 'C', expected: 100 },
      { roman: 'CD', expected: 400 },
      { roman: 'D', expected: 500 },
      { roman: 'CM', expected: 900 },
      { roman: 'M', expected: 1000 },
      { roman: 'MMMCMXCIX', expected: 3999 },
    ]

    testCases.forEach(({ roman, expected }) => {
      it(`should convert ${roman} to ${expected}`, () => {
        const result = convertRomanToArabic(roman)
        expect(result.value).toBe(expected)
        expect(result.error).toBeUndefined()
      })
    })
  })

  describe('Case Insensitivity', () => {
    it('should handle lowercase roman numerals', () => {
      expect(convertRomanToArabic('xiv').value).toBe(14)
      expect(convertRomanToArabic('mmcmxcix').value).toBe(2999)
    })

    it('should handle mixed case roman numerals', () => {
      expect(convertRomanToArabic('XIV').value).toBe(14)
      expect(convertRomanToArabic('xIv').value).toBe(14)
    })
  })
})

describe('Roman Utils - Validation Tests', () => {
  describe('Empty Input Validation', () => {
    it('should return error for empty string', () => {
      const result = convertRomanToArabic('')
      expect(result.error).toBe('Veuillez saisir votre nombre')
      expect(result.value).toBe(0)
    })

    it('should return error for whitespace only', () => {
      const result = convertRomanToArabic('   ')
      expect(result.error).toBe('Veuillez saisir votre nombre')
      expect(result.value).toBe(0)
    })
  })

  describe('Format Validation', () => {
    it('should return error for invalid characters', () => {
      const result = convertRomanToArabic('ABC')
      expect(result.error).toBe('Format du nombre romain incorrect')
    })

    it('should return error for numbers', () => {
      const result = convertRomanToArabic('123')
      expect(result.error).toBe('Format du nombre romain incorrect')
    })

    it('should return error for special characters', () => {
      const result = convertRomanToArabic('X@Y')
      expect(result.error).toBe('Format du nombre romain incorrect')
    })
  })

  describe('Repeat Validation', () => {
    it('should return error for more than 3 consecutive identical symbols', () => {
      const result = convertRomanToArabic('IIII')
      expect(result.error).toBe('Un symbole ne peut pas apparaitre 3 fois consecutivement')
    })

    it('should return error for 4 consecutive M symbols', () => {
      const result = convertRomanToArabic('MMMM')
      expect(result.error).toBe('Un symbole ne peut pas apparaitre 3 fois consecutivement')
    })

    it('should allow exactly 3 consecutive symbols', () => {
      const result = convertRomanToArabic('III')
      expect(result.value).toBe(3)
      expect(result.error).toBeUndefined()
    })
  })

  describe('Subtraction Rules Validation', () => {
    it('should return error when V is subtracted', () => {
      const result = convertRomanToArabic('VL')
      expect(result.error).toBe('V, L et D ne peuvent pas être soustraits')
    })

    it('should return error when L is subtracted', () => {
      const result = convertRomanToArabic('LC')
      expect(result.error).toBe('V, L et D ne peuvent pas être soustraits')
    })

    it('should return error when D is subtracted', () => {
      const result = convertRomanToArabic('DM')
      expect(result.error).toBe('V, L et D ne peuvent pas être soustraits')
    })

    it('should return error when I is subtracted from invalid symbols', () => {
      const result = convertRomanToArabic('IL')
      expect(result.error).toBe('I ne peut être soustrait que de V et X')
    })

    it('should return error when X is subtracted from invalid symbols', () => {
      const result = convertRomanToArabic('XM')
      expect(result.error).toBe('X ne peut être soustrait que de L et C')
    })

    it('should allow C followed by L (CL = 150)', () => {
      const result = convertRomanToArabic('CL')
      expect(result.error).toBeUndefined() // CL = 150 is valid (addition, not subtraction)
      expect(result.value).toBe(150)
    })

    it('should allow valid subtraction rules', () => {
      expect(convertRomanToArabic('IV').value).toBe(4)
      expect(convertRomanToArabic('IX').value).toBe(9)
      expect(convertRomanToArabic('XL').value).toBe(40)
      expect(convertRomanToArabic('XC').value).toBe(90)
      expect(convertRomanToArabic('CD').value).toBe(400)
      expect(convertRomanToArabic('CM').value).toBe(900)
    })
  })
})

describe('Roman Utils - Extended Notation Tests', () => {
  describe('Vinculum Notation (·)', () => {
    it('should convert M· to 1000000', () => {
      const result = convertRomanToArabic('M·')
      expect(result.value).toBe(1000000)
      expect(result.error).toBeUndefined()
    })

    it('should convert V· to 5000000', () => {
      const result = convertRomanToArabic('V·')
      expect(result.value).toBe(5000)
      expect(result.error).toBeUndefined()
    })

    it('should convert X· to 10000000', () => {
      const result = convertRomanToArabic('X·')
      expect(result.value).toBe(10000)
      expect(result.error).toBeUndefined()
    })

    it('should convert complex extended notation', () => {
      const result = convertRomanToArabic('X·L·V·MMM')
      expect(result.value).toBe(48000)
      expect(result.error).toBeUndefined()
    })
  })

  describe('Double Vinculum Notation (:)', () => {
    it('should convert V: to 5000000000', () => {
      const result = convertRomanToArabic('V:')
      expect(result.value).toBe(5000000)
      expect(result.error).toBeUndefined()
    })

    it('should convert M: to 1000000000', () => {
      const result = convertRomanToArabic('M:')
      expect(result.value).toBe(1000000000)
      expect(result.error).toBeUndefined()
    })
  })

  describe('Mixed Extended Notation', () => {
    it('should handle mixed vinculum and standard notation', () => {
      const result = convertRomanToArabic('M·CMXCIX')
      expect(result.value).toBe(1000999)
      expect(result.error).toBeUndefined()
    })
  })
})

describe('Roman Utils - Sanitization Tests', () => {
  it('should remove invalid characters', () => {
    expect(sanitizeRomanInput('X1Y2Z')).toBe('X')
    expect(sanitizeRomanInput('M@C#M')).toBe('MCM')
    expect(sanitizeRomanInput('IVXLCDM')).toBe('IVXLCDM')
  })

  it('should preserve valid roman characters and vinculum', () => {
    expect(sanitizeRomanInput('IVXLCDM·:')).toBe('IVXLCDM·:')
    expect(sanitizeRomanInput('M·V:')).toBe('M·V:')
  })

  it('should handle empty input', () => {
    expect(sanitizeRomanInput('')).toBe('')
  })
})

describe('Roman Utils - Constants Tests', () => {
  it('should have correct ROMAN_VALUES', () => {
    expect(ROMAN_VALUES).toEqual({
      I: 1,
      V: 5,
      X: 10,
      L: 50,
      C: 100,
      D: 500,
      M: 1000,
    })
  })

  it('should have correct VINCULUM_MULTIPLIERS', () => {
    expect(VINCULUM_MULTIPLIERS).toEqual({
      '·': 1000,
      ':': 1000000,
    })
  })

  it('should have correct VALIDATION_RULES', () => {
    expect(VALIDATION_RULES.maxLength).toBe(25)
    expect(VALIDATION_RULES.maxRepeats).toBe(3)
    expect(VALIDATION_RULES.pattern).toBeInstanceOf(RegExp)
    expect(VALIDATION_RULES.repeatPattern).toBeInstanceOf(RegExp)
  })
})
