import { describe, it, expect } from 'vitest'
import { convertRomanToArabic } from '../romanUtils'

describe('Extended Notation Tests', () => {
  describe('Single Vinculum (·) - Multiplication by 1000', () => {
    const singleVinculumTests = [
      { roman: 'I·', expected: 1000 },
      { roman: 'V·', expected: 5000 },
      { roman: 'X·', expected: 10000 },
      { roman: 'L·', expected: 50000 },
      { roman: 'C·', expected: 100000 },
      { roman: 'D·', expected: 500000 },
      { roman: 'M·', expected: 1000000 },
    ]

    singleVinculumTests.forEach(({ roman, expected }) => {
      it(`should convert ${roman} to ${expected.toLocaleString()}`, () => {
        const result = convertRomanToArabic(roman)
        expect(result.value).toBe(expected)
        expect(result.error).toBeUndefined()
      })
    })
  })

  describe('Double Vinculum (:) - Multiplication by 1,000,000', () => {
    const doubleVinculumTests = [
      { roman: 'I:', expected: 1000000 },
      { roman: 'V:', expected: 5000000 },
      { roman: 'X:', expected: 10000000 },
      { roman: 'L:', expected: 50000000 },
      { roman: 'C:', expected: 100000000 },
      { roman: 'D:', expected: 500000000 },
      { roman: 'M:', expected: 1000000000 },
    ]

    doubleVinculumTests.forEach(({ roman, expected }) => {
      it(`should convert ${roman} to ${expected.toLocaleString()}`, () => {
        const result = convertRomanToArabic(roman)
        expect(result.value).toBe(expected)
        expect(result.error).toBeUndefined()
      })
    })
  })

  describe('Complex Extended Notation Combinations', () => {
    const complexTests = [
      { roman: 'I·V·', expected: 4000 },
      { roman: 'I·X·', expected: 9000 },
      { roman: 'X·L·', expected: 40000 },
      { roman: 'X·C·', expected: 90000 },
      { roman: 'C·D·', expected: 400000 },
      { roman: 'C·M·', expected: 900000 },
      { roman: 'I:V:', expected: 4000000 },
      { roman: 'I:X:', expected: 9000000 },
      { roman: 'X:L:', expected: 40000000 },
      { roman: 'X:C:', expected: 90000000 },
      { roman: 'C:D:', expected: 400000000 },
      { roman: 'C:M:', expected: 900000000 },
    ]

    complexTests.forEach(({ roman, expected }) => {
      it(`should convert ${roman} to ${expected.toLocaleString()}`, () => {
        const result = convertRomanToArabic(roman)
        expect(result.value).toBe(expected)
        expect(result.error).toBeUndefined()
      })
    })
  })

  describe('Mixed Standard and Extended Notation', () => {
    const mixedTests = [
      { roman: 'M·C·M·X·C·I·X·CMXCIX', expected: 1999999 },
      { roman: 'X·L·V·MMM', expected: 48000 },
      { roman: 'M·DCCCLXXXVIII', expected: 1000888 },
      { roman: 'V:MMMCMXCIX', expected: 5003999 },
      { roman: 'X:CMXCIX', expected: 10000999 },
      { roman: 'M·M·M·', expected: 3000000 },
      { roman: 'C·C·C·', expected: 300000 },
      { roman: 'X·X·X·', expected: 30000 },
    ]

    mixedTests.forEach(({ roman, expected }) => {
      it(`should convert ${roman} to ${expected.toLocaleString()}`, () => {
        const result = convertRomanToArabic(roman)
        expect(result.value).toBe(expected)
        expect(result.error).toBeUndefined()
      })
    })
  })

  describe('Extended Notation with Multiple Symbols', () => {
    const multipleSymbolTests = [
      { roman: 'M·M·', expected: 2000000 },
      { roman: 'M·M·M·', expected: 3000000 },
      { roman: 'C·C·', expected: 200000 },
      { roman: 'C·C·C·', expected: 300000 },
      { roman: 'X·X·', expected: 20000 },
      { roman: 'X·X·X·', expected: 30000 },
      { roman: 'I·I·', expected: 2000 },
      { roman: 'I·I·I·', expected: 3000 },
    ]

    multipleSymbolTests.forEach(({ roman, expected }) => {
      it(`should convert ${roman} to ${expected.toLocaleString()}`, () => {
        const result = convertRomanToArabic(roman)
        expect(result.value).toBe(expected)
        expect(result.error).toBeUndefined()
      })
    })
  })

  describe('Extended Notation Subtraction Rules', () => {
    it('should allow valid subtractions in extended notation', () => {
      const result = convertRomanToArabic('I·V·')
      expect(result.value).toBe(4000)
      expect(result.error).toBeUndefined()
    })

    it('should allow valid subtractions in double vinculum', () => {
      const result = convertRomanToArabic('I:V:')
      expect(result.value).toBe(4000000)
      expect(result.error).toBeUndefined()
    })

    it('should enforce subtraction rules in extended notation', () => {
      const result = convertRomanToArabic('IL·')
      expect(result.error).toBe('I ne peut être soustrait que de V et X')
    })

    it('should enforce subtraction rules in double vinculum', () => {
      const result = convertRomanToArabic('XM:')
      expect(result.error).toBe('X ne peut être soustrait que de L et C')
    })
  })

  describe('Extended Notation Repeat Rules', () => {
    it('should allow up to 3 repeats in extended notation', () => {
      const result = convertRomanToArabic('M·M·M·')
      expect(result.value).toBe(3000000)
      expect(result.error).toBeUndefined()
    })

    it('should enforce repeat rules in extended notation', () => {
      const result = convertRomanToArabic('MMMM·')
      expect(result.error).toBe('Un symbole ne peut pas apparaitre 3 fois consecutivement')
    })

    it('should allow up to 3 repeats in double vinculum', () => {
      const result = convertRomanToArabic('M:M:M:')
      expect(result.value).toBe(3000000000)
      expect(result.error).toBeUndefined()
    })
  })

  describe('Case Sensitivity in Extended Notation', () => {
    it('should handle lowercase extended notation', () => {
      const result = convertRomanToArabic('m·')
      expect(result.value).toBe(1000000)
      expect(result.error).toBeUndefined()
    })

    it('should handle mixed case extended notation', () => {
      const result = convertRomanToArabic('M·v:')
      expect(result.value).toBe(4000000)
      expect(result.error).toBeUndefined()
    })

    it('should handle lowercase vinculum symbols', () => {
      const result = convertRomanToArabic('M·')
      expect(result.value).toBe(1000000)
      expect(result.error).toBeUndefined()
    })
  })

  describe('Maximum Extended Notation Values', () => {
    it('should handle maximum single vinculum value', () => {
      const result = convertRomanToArabic('M·M·M·C·M·X·C·I·X·')
      expect(result.value).toBe(3999000)
      expect(result.error).toBeUndefined()
    })


    it('should handle maximum possible value', () => {
      const result = convertRomanToArabic('M:')
      expect(result.value).toBe(1000000000)
      expect(result.error).toBeUndefined()
    })
  })

  describe('Extended Notation Edge Cases', () => {
    it('should handle vinculum without roman symbol', () => {
      const result = convertRomanToArabic('·')
      expect(result.error).toBe('Format du nombre romain incorrect')
    })

    it('should handle double vinculum on same symbol', () => {
      const result = convertRomanToArabic('M·:')
      expect(result.error).toBe('Format du nombre romain incorrect')
    })

    it('should handle vinculum in wrong position', () => {
      const result = convertRomanToArabic('·M')
      expect(result.error).toBe('Format du nombre romain incorrect')
    })

    it('should handle multiple vinculum types mixed', () => {
      const result = convertRomanToArabic('M·V:')
      expect(result.value).toBe(4000000)
      expect(result.error).toBeUndefined()
    })

    it('should handle vinculum with invalid roman symbol', () => {
      const result = convertRomanToArabic('Z·')
      expect(result.error).toBe('Format du nombre romain incorrect')
    })
  })

  describe('Extended Notation Performance', () => {
    it('should handle large extended notation efficiently', () => {
      const start = performance.now()
      const result = convertRomanToArabic('M:M:M:')
      const end = performance.now()
      
      expect(result.value).toBe(3000000000)
      expect(result.error).toBeUndefined()
      expect(end - start).toBeLessThan(100) // Should be under 100ms
    })


  describe('Extended Notation Validation', () => {
    it('should validate extended notation format', () => {
      const result = convertRomanToArabic('M·')
      expect(result.error).toBeUndefined()
    })

    it('should reject invalid extended notation format', () => {
      const result = convertRomanToArabic('M··')
      expect(result.error).toBe('Format du nombre romain incorrect')
    })

    it('should validate double vinculum format', () => {
      const result = convertRomanToArabic('M:')
      expect(result.error).toBeUndefined()
    })

    it('should reject invalid double vinculum format', () => {
      const result = convertRomanToArabic('M::')
      expect(result.error).toBe('Format du nombre romain incorrect')
    })
  })
  })
})
