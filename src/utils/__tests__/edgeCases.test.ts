import { describe, it, expect } from 'vitest'
import { convertRomanToArabic, sanitizeRomanInput } from '../romanUtils'

describe('Edge Cases and Error Handling', () => {
  describe('Boundary Values', () => {
    it('should handle minimum valid roman numeral (I)', () => {
      const result = convertRomanToArabic('I')
      expect(result.value).toBe(1)
      expect(result.error).toBeUndefined()
    })

    it('should handle maximum standard roman numeral (MMMCMXCIX)', () => {
      const result = convertRomanToArabic('MMMCMXCIX')
      expect(result.value).toBe(3999)
      expect(result.error).toBeUndefined()
    })

    it('should handle maximum extended notation (M:)', () => {
      const result = convertRomanToArabic('M:')
      expect(result.value).toBe(1000000000)
      expect(result.error).toBeUndefined()
    })
  })

  describe('Invalid Input Types', () => {
    it('should handle null input gracefully', () => {
      const result = convertRomanToArabic(null as any)
      expect(result.error).toBe('Veuillez saisir votre nombre')
      expect(result.value).toBe(0)
    })

    it('should handle undefined input gracefully', () => {
      const result = convertRomanToArabic(undefined as any)
      expect(result.error).toBe('Veuillez saisir votre nombre')
      expect(result.value).toBe(0)
    })
  })

  describe('Special Characters and Unicode', () => {
    it('should handle unicode roman numerals', () => {
      // These should be treated as invalid since they're not in our character set
      const result = convertRomanToArabic('ⅠⅡⅢ') // Unicode roman numerals
      expect(result.error).toBe('Format du nombre romain incorrect')
    })

    it('should handle emojis and special symbols', () => {
      const result = convertRomanToArabic('X😀I🎉V')
      expect(result.error).toBe('Format du nombre romain incorrect')
    })

    it('should handle newlines and tabs', () => {
      const result = convertRomanToArabic('X\nI\tV')
      expect(result.error).toBe('Format du nombre romain incorrect')
    })

    it('should handle control characters', () => {
      const result = convertRomanToArabic('X\u0000I\u0001V')
      expect(result.error).toBe('Format du nombre romain incorrect')
    })
  })


  describe('Complex Invalid Patterns', () => {
    it('should handle multiple consecutive invalid subtractions', () => {
      const result = convertRomanToArabic('ILCD')
      expect(result.error).toBe('I ne peut être soustrait que de V et X')
    })

    it('should handle mixed valid and invalid patterns', () => {
      const result = convertRomanToArabic('IVIL')
      expect(result.error).toBe('I ne peut être soustrait que de V et X')
    })


  })

  describe('Vinculum Edge Cases', () => {
    it('should handle vinculum without roman symbol', () => {
      const result = convertRomanToArabic('·')
      expect(result.error).toBe('Format du nombre romain incorrect')
    })

    it('should handle double vinculum', () => {
      const result = convertRomanToArabic('M··')
      expect(result.error).toBe('Format du nombre romain incorrect')
    })

    it('should handle vinculum in wrong position', () => {
      const result = convertRomanToArabic('·M')
      expect(result.error).toBe('Format du nombre romain incorrect')
    })

    it('should handle mixed vinculum types', () => {
      const result = convertRomanToArabic('M·:')
      expect(result.error).toBe('Format du nombre romain incorrect')
    })

    it('should handle vinculum with invalid roman symbol', () => {
      const result = convertRomanToArabic('Z·')
      expect(result.error).toBe('Format du nombre romain incorrect')
    })
  })

  describe('Sanitization Edge Cases', () => {
    it('should handle empty string sanitization', () => {
      expect(sanitizeRomanInput('')).toBe('')
    })


    it('should handle string with only invalid characters', () => {
      expect(sanitizeRomanInput('123!@#$%^&*()')).toBe('')
    })

    it('should handle string with only valid characters', () => {
      expect(sanitizeRomanInput('IVXLCDM·:')).toBe('IVXLCDM·:')
    })

    it('should handle mixed valid and invalid characters', () => {
      expect(sanitizeRomanInput('X1I2V3!@#')).toBe('XIV')
    })

    it('should handle whitespace characters', () => {
      expect(sanitizeRomanInput('X I V ')).toBe('XIV')
    })

    it('should handle newlines and tabs', () => {
      expect(sanitizeRomanInput('X\nI\tV')).toBe('XIV')
    })
  })

  describe('Mathematical Edge Cases', () => {
    it('should handle zero result from complex subtraction', () => {
      // This would be an invalid roman numeral, but tests the math
      const result = convertRomanToArabic('MM')
      expect(result.value).toBe(2000)
    })

    it('should handle large numbers that might cause overflow', () => {
      const result = convertRomanToArabic('M:M:')
      expect(result.value).toBe(2000000000)
      expect(result.error).toBeUndefined()
    })

    it('should handle very small valid numbers', () => {
      const result = convertRomanToArabic('I')
      expect(result.value).toBe(1)
      expect(result.error).toBeUndefined()
    })
  })

  describe('Performance Edge Cases', () => {
    it('should handle rapid successive calls', () => {
      const inputs = ['I', 'V', 'X', 'L', 'C', 'D', 'M']
      
      inputs.forEach(input => {
        const result = convertRomanToArabic(input)
        expect(result.error).toBeUndefined()
        expect(result.value).toBeGreaterThan(0)
      })
    })

    it('should handle same input multiple times', () => {
      const input = 'MMMCMXCIX'
      
      for (let i = 0; i < 100; i++) {
        const result = convertRomanToArabic(input)
        expect(result.value).toBe(3999)
        expect(result.error).toBeUndefined()
      }
    })
  })

  describe('Internationalization Edge Cases', () => {
    it('should handle accented characters', () => {
      const result = convertRomanToArabic('XÍV')
      expect(result.error).toBe('Format du nombre romain incorrect')
    })

    it('should handle non-Latin characters', () => {
      const result = convertRomanToArabic('X中文V')
      expect(result.error).toBe('Format du nombre romain incorrect')
    })

    it('should handle Arabic numerals mixed with roman', () => {
      const result = convertRomanToArabic('X١V')
      expect(result.error).toBe('Format du nombre romain incorrect')
    })
  })
})
