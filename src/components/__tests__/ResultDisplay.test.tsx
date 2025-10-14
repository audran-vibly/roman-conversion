import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ResultDisplay from '../ResultDisplay'
import type { ConversionResult } from '../../utils/romanUtils'

describe('ResultDisplay Component', () => {
  it('should render nothing when result is null', () => {
    const { container } = render(<ResultDisplay result={null} />)
    expect(container.firstChild).toBeNull()
  })

  it('should render nothing when result is undefined', () => {
    const { container } = render(<ResultDisplay result={undefined as any} />)
    expect(container.firstChild).toBeNull()
  })

  describe('Error Display', () => {
    it('should display error message when result has error', () => {
      const errorResult: ConversionResult = {
        value: 0,
        error: 'Format du nombre romain incorrect'
      }

      render(<ResultDisplay result={errorResult} />)

      expect(screen.getByText('Une erreur est survenue')).toBeInTheDocument()
      expect(screen.getByText('Format du nombre romain incorrect')).toBeInTheDocument()
    })

    it('should display error icon when result has error', () => {
      const errorResult: ConversionResult = {
        value: 0,
        error: 'Test error message'
      }

      render(<ResultDisplay result={errorResult} />)

      // Check for AlertCircle icon (from lucide-react)
      const errorIcon = screen.getByRole('img', { hidden: true })
      expect(errorIcon).toBeInTheDocument()
    })

    it('should have correct error styling classes', () => {
      const errorResult: ConversionResult = {
        value: 0,
        error: 'Test error message'
      }

      const { container } = render(<ResultDisplay result={errorResult} />)
      const errorDiv = container.querySelector('.bg-red-50')
      expect(errorDiv).toBeInTheDocument()
    })

    it('should display different error messages correctly', () => {
      const errorMessages = [
        'Veuillez saisir votre nombre',
        'Format du nombre romain incorrect',
        'Un symbole ne peut pas apparaitre 3 fois consecutivement',
        'V, L et D ne peuvent pas être soustraits',
        'I ne peut être soustrait que de V et X',
        'X ne peut être soustrait que de L et C',
        'C ne peut être soustrait que de D et M'
      ]

      errorMessages.forEach(errorMessage => {
        const errorResult: ConversionResult = {
          value: 0,
          error: errorMessage
        }

        const { unmount } = render(<ResultDisplay result={errorResult} />)
        expect(screen.getByText(errorMessage)).toBeInTheDocument()
        unmount()
      })
    })
  })

  describe('Success Display', () => {
    it('should display success result when no error', () => {
      const successResult: ConversionResult = {
        value: 14
      }

      render(<ResultDisplay result={successResult} />)

      expect(screen.getByText('Votre résultat')).toBeInTheDocument()
      expect(screen.getByText('14')).toBeInTheDocument()
    })

    it('should display success icon when no error', () => {
      const successResult: ConversionResult = {
        value: 14
      }

      render(<ResultDisplay result={successResult} />)

      // Check for CircleCheckBig icon (from lucide-react)
      const successIcon = screen.getByRole('img', { hidden: true })
      expect(successIcon).toBeInTheDocument()
    })

    it('should have correct success styling classes', () => {
      const successResult: ConversionResult = {
        value: 14
      }

      const { container } = render(<ResultDisplay result={successResult} />)
      const successDiv = container.querySelector('.bg-green-50')
      expect(successDiv).toBeInTheDocument()
    })

    it('should format large numbers with locale string', () => {
      const largeResult: ConversionResult = {
        value: 1234567
      }

      render(<ResultDisplay result={largeResult} />)

      expect(screen.getByText('1,234,567')).toBeInTheDocument()
    })

    it('should display zero correctly', () => {
      const zeroResult: ConversionResult = {
        value: 0
      }

      render(<ResultDisplay result={zeroResult} />)

      expect(screen.getByText('0')).toBeInTheDocument()
    })

    it('should display negative numbers correctly', () => {
      const negativeResult: ConversionResult = {
        value: -100
      }

      render(<ResultDisplay result={negativeResult} />)

      expect(screen.getByText('-100')).toBeInTheDocument()
    })

    it('should display extended notation results correctly', () => {
      const extendedResults = [
        { value: 1000000, expected: '1,000,000' },
        { value: 5000000, expected: '5,000,000' },
        { value: 1000000000, expected: '1,000,000,000' }
      ]

      extendedResults.forEach(({ value, expected }) => {
        const result: ConversionResult = { value }
        const { unmount } = render(<ResultDisplay result={result} />)
        expect(screen.getByText(expected)).toBeInTheDocument()
        unmount()
      })
    })
  })

  describe('Animation Classes', () => {
    it('should have animation classes for error display', () => {
      const errorResult: ConversionResult = {
        value: 0,
        error: 'Test error'
      }

      const { container } = render(<ResultDisplay result={errorResult} />)
      const errorDiv = container.querySelector('.animate-in')
      expect(errorDiv).toBeInTheDocument()
    })

    it('should have animation classes for success display', () => {
      const successResult: ConversionResult = {
        value: 14
      }

      const { container } = render(<ResultDisplay result={successResult} />)
      const successDiv = container.querySelector('.animate-in')
      expect(successDiv).toBeInTheDocument()
    })
  })
})
