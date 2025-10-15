import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'

describe('App Integration Tests', () => {
  it('should render the complete application', () => {
    render(<App />)
    
    expect(screen.getByText('Convertisseur Romain')).toBeInTheDocument()
    expect(screen.getByText('Transformez les chiffres romains en chiffres arabes !')).toBeInTheDocument()
    expect(screen.getByRole('textbox')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /convertir/i })).toBeInTheDocument()
  })

  it('should perform complete conversion workflow', async () => {
    const user = userEvent.setup()
    render(<App />)
    
    const input = screen.getByRole('textbox')
    const button = screen.getByRole('button', { name: /convertir/i })
    
    // Type roman numeral
    await user.type(input, 'XIV')
    
    // Click convert button
    await user.click(button)
    
    // Check result
    expect(screen.getByText('Votre résultat')).toBeInTheDocument()
    expect(screen.getByText('14')).toBeInTheDocument()
  })

  it('should perform conversion workflow with Enter key', async () => {
    const user = userEvent.setup()
    render(<App />)
    
    const input = screen.getByRole('textbox')
    
    // Type roman numeral and press Enter
    await user.type(input, 'MMCMXCIX{enter}')
    
    // Check result
    expect(screen.getByText('Votre résultat')).toBeInTheDocument()
    expect(screen.getByText('2,999')).toBeInTheDocument()
  })

  it('should handle error workflow', async () => {
    const user = userEvent.setup()
    render(<App />)
    
    const input = screen.getByRole('textbox')
    const button = screen.getByRole('button', { name: /convertir/i })
    
    // Type invalid roman numeral
    await user.type(input, 'IIII')
    
    // Click convert button
    await user.click(button)
    
    // Check error
    expect(screen.getByText('Une erreur est survenue')).toBeInTheDocument()
    expect(screen.getByText('Un symbole ne peut pas apparaitre 3 fois consecutivement')).toBeInTheDocument()
  })

  it('should handle extended notation workflow', async () => {
    const user = userEvent.setup()
    render(<App />)
    
    const input = screen.getByRole('textbox')
    const button = screen.getByRole('button', { name: /convertir/i })
    
    // Type extended notation
    await user.type(input, 'M·')
    
    // Click convert button
    await user.click(button)
    
    // Check result
    expect(screen.getByText('Votre résultat')).toBeInTheDocument()
    expect(screen.getByText('1,000,000')).toBeInTheDocument()
  })

  it('should handle complex extended notation workflow', async () => {
    const user = userEvent.setup()
    render(<App />)
    
    const input = screen.getByRole('textbox')
    const button = screen.getByRole('button', { name: /convertir/i })
    
    // Type complex extended notation
    await user.type(input, 'X·L·V·MMM')
    
    // Click convert button
    await user.click(button)
    
    // Check result
    expect(screen.getByText('Votre résultat')).toBeInTheDocument()
    expect(screen.getByText('48,000')).toBeInTheDocument()
  })

  it('should handle input sanitization during typing', async () => {
    const user = userEvent.setup()
    render(<App />)
    
    const input = screen.getByRole('textbox')
    
    // Type with invalid characters
    await user.type(input, 'X1I2V3')
    
    // Check that only valid characters are in input
    expect(input).toHaveValue('XIV')
  })

  it('should disable convert button for empty input', () => {
    render(<App />)
    
    const button = screen.getByRole('button', { name: /convertir/i })
    expect(button).toBeDisabled()
  })

  it('should enable convert button when input has value', async () => {
    const user = userEvent.setup()
    render(<App />)
    
    const input = screen.getByRole('textbox')
    const button = screen.getByRole('button', { name: /convertir/i })
    
    await user.type(input, 'X')
    expect(button).not.toBeDisabled()
  })

  it('should handle multiple conversions in sequence', async () => {
    const user = userEvent.setup()
    render(<App />)
    
    const input = screen.getByRole('textbox')
    const button = screen.getByRole('button', { name: /convertir/i })
    
    // First conversion
    await user.type(input, 'XIV')
    await user.click(button)
    expect(screen.getByText('14')).toBeInTheDocument()
    
    // Clear and second conversion
    await user.clear(input)
    await user.type(input, 'MMM')
    await user.click(button)
    expect(screen.getByText('3,000')).toBeInTheDocument()
  })

  it('should handle conversion modal workflow', async () => {
    const user = userEvent.setup()
    render(<App />)
    
    // Open modal
    const modalLink = screen.getByText('Voir le tableau de conversion')
    await user.click(modalLink)
    
    // Check modal content
    expect(screen.getByText('Tableau de conversion')).toBeInTheDocument()
    expect(screen.getByText('I')).toBeInTheDocument()
    expect(screen.getByText('1')).toBeInTheDocument()
    
    // Close modal
    const closeButton = screen.getByText('×')
    await user.click(closeButton)
    
    expect(screen.queryByText('Tableau de conversion')).not.toBeInTheDocument()
  })

  it('should maintain state between conversions', async () => {
    const user = userEvent.setup()
    render(<App />)
    
    const input = screen.getByRole('textbox')
    const button = screen.getByRole('button', { name: /convertir/i })
    
    // First conversion
    await user.type(input, 'XIV')
    await user.click(button)
    expect(screen.getByText('14')).toBeInTheDocument()
    
    // Modify input and convert again
    await user.clear(input)
    await user.type(input, 'XV')
    await user.click(button)
    expect(screen.getByText('15')).toBeInTheDocument()
  })

  it('should handle case insensitive input', async () => {
    const user = userEvent.setup()
    render(<App />)
    
    const input = screen.getByRole('textbox')
    const button = screen.getByRole('button', { name: /convertir/i })
    
    // Type lowercase
    await user.type(input, 'xiv')
    await user.click(button)
    expect(screen.getByText('14')).toBeInTheDocument()
    
    // Clear and type mixed case
    await user.clear(input)
    await user.type(input, 'XvI')
    await user.click(button)
    expect(screen.getByText('16')).toBeInTheDocument()
  })

  it('should handle whitespace in input', async () => {
    const user = userEvent.setup()
    render(<App />)
    
    const input = screen.getByRole('textbox')
    const button = screen.getByRole('button', { name: /convertir/i })
    
    // Type with spaces (should be sanitized)
    await user.type(input, ' X I V ')
    await user.click(button)
    expect(screen.getByText('14')).toBeInTheDocument()
  })
})
