import { describe, it, expect } from 'vitest'
import { convertRomanToArabic, sanitizeRomanInput } from '../romanUtils'

describe('Performance Tests', () => {
  describe('Conversion Performance Requirements', () => {
    it('should convert simple roman numerals under 100ms', () => {
      const testCases = ['I', 'V', 'X', 'L', 'C', 'D', 'M', 'IV', 'IX', 'XL', 'XC', 'CD', 'CM']
      
      testCases.forEach(roman => {
        const start = performance.now()
        const result = convertRomanToArabic(roman)
        const end = performance.now()
        
        expect(result.error).toBeUndefined()
        expect(end - start).toBeLessThan(100)
      })
    })

    it('should convert complex roman numerals under 100ms', () => {
      const testCases = [
        'MMMCMXCIX', // 3999
        'MMDCCCLXXXVIII', // 2888
        'MCDXLIV', // 1444
        'DCCCLXXXVIII', // 888
        'CCCXCIX', // 399
      ]
      
      testCases.forEach(roman => {
        const start = performance.now()
        const result = convertRomanToArabic(roman)
        const end = performance.now()
        
        expect(result.error).toBeUndefined()
        expect(end - start).toBeLessThan(100)
      })
    })

    it('should convert extended notation under 100ms', () => {
      const testCases = [
        'M·', // 1,000,000
        'V·', // 5,000,000
        'X·L·V·MMM', // 48,000
        'M·CMXCIX', // 1,999,999
        'M:', // 1,000,000,000
        'V:', // 5,000,000,000
      ]
      
      testCases.forEach(roman => {
        const start = performance.now()
        const result = convertRomanToArabic(roman)
        const end = performance.now()
        
        expect(result.error).toBeUndefined()
        expect(end - start).toBeLessThan(100)
      })
    })

    it('should handle validation errors under 100ms', () => {
      const testCases = [
        'IIII', // Invalid repeat
        'VL', // Invalid subtraction
        'IL', // Invalid subtraction
        'XM', // Invalid subtraction
        'ABC', // Invalid format
        '123', // Invalid format
      ]
      
      testCases.forEach(roman => {
        const start = performance.now()
        const result = convertRomanToArabic(roman)
        const end = performance.now()
        
        expect(result.error).toBeDefined()
        expect(end - start).toBeLessThan(100)
      })
    })
  })

  describe('Bulk Conversion Performance', () => {
    it('should handle 1000 conversions under 1 second', () => {
      // Generate valid Roman numerals for testing
      const validRomans = [
        'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X',
        'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX',
        'XXI', 'XXII', 'XXIII', 'XXIV', 'XXV', 'XXVI', 'XXVII', 'XXVIII', 'XXIX', 'XXX',
        'XL', 'XLI', 'XLII', 'XLIII', 'XLIV', 'XLV', 'XLVI', 'XLVII', 'XLVIII', 'XLIX', 'L',
        'LI', 'LII', 'LIII', 'LIV', 'LV', 'LVI', 'LVII', 'LVIII', 'LIX', 'LX',
        'XC', 'XCI', 'XCII', 'XCIII', 'XCIV', 'XCV', 'XCVI', 'XCVII', 'XCVIII', 'XCIX', 'C',
        'CD', 'D', 'CM', 'M', 'MM', 'MMM', 'MMMCMXCIX'
      ]
      
      const testCases = Array.from({ length: 1000 }, (_, i) => {
        return validRomans[i % validRomans.length]
      })
      
      const start = performance.now()
      
      testCases.forEach(roman => {
        const result = convertRomanToArabic(roman)
        expect(result.error).toBeUndefined()
      })
      
      const end = performance.now()
      expect(end - start).toBeLessThan(1000) // Under 1 second for 1000 conversions
    })

    it('should handle repeated same input efficiently', () => {
      const roman = 'MMMCMXCIX'
      const iterations = 1000
      
      const start = performance.now()
      
      for (let i = 0; i < iterations; i++) {
        const result = convertRomanToArabic(roman)
        expect(result.value).toBe(3999)
        expect(result.error).toBeUndefined()
      }
      
      const end = performance.now()
      expect(end - start).toBeLessThan(1000) // Under 1 second for 1000 identical conversions
    })
  })

  describe('Sanitization Performance', () => {
    it('should sanitize input under 100ms', () => {
      const testCases = [
        'X1I2V3',
        'M@C#M',
        'IVXLCDM·:',
        'X Y Z 1 2 3 ! @ #',
        'M·V:',
      ]
      
      testCases.forEach(input => {
        const start = performance.now()
        const result = sanitizeRomanInput(input)
        const end = performance.now()
        
        expect(result).toBeDefined()
        expect(end - start).toBeLessThan(100)
      })
    })

    it('should handle large input sanitization efficiently', () => {
      const largeInput = 'X'.repeat(1000) + '1'.repeat(1000) + 'V'.repeat(1000)
      
      const start = performance.now()
      const result = sanitizeRomanInput(largeInput)
      const end = performance.now()
      
      expect(result).toBe('X'.repeat(1000) + 'V'.repeat(1000))
      expect(end - start).toBeLessThan(100)
    })
  })

  describe('Memory Performance', () => {
    it('should handle repeated conversions without issues', () => {
      // Perform many conversions
      for (let i = 0; i < 1000; i++) {
        const result = convertRomanToArabic('MMMCMXCIX')
        expect(result.value).toBe(3999)
        expect(result.error).toBeUndefined()
      }
    })
  })

  describe('Stress Testing', () => {

    it('should handle complex extended notation efficiently', () => {
      const complexInput = 'M·CMXCIX:CMXCIX·CMXCIX'
      
      const start = performance.now()
      const result = convertRomanToArabic(complexInput)
      const end = performance.now()
      
      expect(result.value).toBe(11012977)
      expect(result.error).toBeUndefined()
      expect(end - start).toBeLessThan(100)
    })

    it('should handle rapid successive calls efficiently', () => {
      const inputs = ['I', 'V', 'X', 'L', 'C', 'D', 'M', 'IV', 'IX', 'XL']
      
      const start = performance.now()
      
      for (let i = 0; i < 100; i++) {
        inputs.forEach(input => {
          const result = convertRomanToArabic(input)
          expect(result.error).toBeUndefined()
        })
      }
      
      const end = performance.now()
      expect(end - start).toBeLessThan(1000) // Under 1 second for 1000 conversions
    })
  })

  describe('Edge Case Performance', () => {
    it('should handle empty input efficiently', () => {
      const start = performance.now()
      const result = convertRomanToArabic('')
      const end = performance.now()
      
      expect(result.error).toBeDefined()
      expect(end - start).toBeLessThan(100)
    })

    it('should handle invalid input efficiently', () => {
      const start = performance.now()
      const result = convertRomanToArabic('INVALID')
      const end = performance.now()
      
      expect(result.error).toBeDefined()
      expect(end - start).toBeLessThan(100)
    })

    it('should handle null/undefined input efficiently', () => {
      const start = performance.now()
      const result = convertRomanToArabic(null as any)
      const end = performance.now()
      
      expect(result.error).toBeDefined()
      expect(end - start).toBeLessThan(100)
    })
  })

  describe('Concurrent Performance', () => {
    it('should handle concurrent conversions efficiently', async () => {
      const conversions = Array.from({ length: 10 }, (_, i) => {
        return new Promise<void>((resolve) => {
          setTimeout(() => {
            const result = convertRomanToArabic('MMMCMXCIX')
            expect(result.value).toBe(3999)
            expect(result.error).toBeUndefined()
            resolve()
          }, 1) // Small delay
        })
      })
      
      const start = performance.now()
      await Promise.all(conversions)
      const end = performance.now()
      
      expect(end - start).toBeLessThan(1000) // All conversions should complete under 1 second
    })
  })
})
