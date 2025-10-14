import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ConversionModal from '../ConversionModal'

describe('ConversionModal Component', () => {
  it('should render link to open modal', () => {
    render(<ConversionModal />)
    
    expect(screen.getByText('Voir le tableau de conversion')).toBeInTheDocument()
  })

  it('should not show modal initially', () => {
    render(<ConversionModal />)
    
    expect(screen.queryByText('Tableau de conversion')).not.toBeInTheDocument()
  })

  it('should open modal when link is clicked', async () => {
    const user = userEvent.setup()
    render(<ConversionModal />)
    
    const link = screen.getByText('Voir le tableau de conversion')
    await user.click(link)
    
    expect(screen.getByText('Tableau de conversion')).toBeInTheDocument()
  })

  it('should display all roman values in the modal', async () => {
    const user = userEvent.setup()
    render(<ConversionModal />)
    
    const link = screen.getByText('Voir le tableau de conversion')
    await user.click(link)
    
    // Check for all roman symbols
    expect(screen.getByText('I')).toBeInTheDocument()
    expect(screen.getByText('V')).toBeInTheDocument()
    expect(screen.getByText('X')).toBeInTheDocument()
    expect(screen.getByText('L')).toBeInTheDocument()
    expect(screen.getByText('C')).toBeInTheDocument()
    expect(screen.getByText('D')).toBeInTheDocument()
    expect(screen.getByText('M')).toBeInTheDocument()
  })

  it('should display correct arabic values in the modal', async () => {
    const user = userEvent.setup()
    render(<ConversionModal />)
    
    const link = screen.getByText('Voir le tableau de conversion')
    await user.click(link)
    
    // Check for correct arabic values
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText('10')).toBeInTheDocument()
    expect(screen.getByText('50')).toBeInTheDocument()
    expect(screen.getByText('100')).toBeInTheDocument()
    expect(screen.getByText('500')).toBeInTheDocument()
    expect(screen.getByText('1,000')).toBeInTheDocument()
  })

  it('should display vinculum multipliers in the modal', async () => {
    const user = userEvent.setup()
    render(<ConversionModal />)
    
    const link = screen.getByText('Voir le tableau de conversion')
    await user.click(link)
    
    expect(screen.getByText('Multiplicateurs :')).toBeInTheDocument()
    expect(screen.getByText('·')).toBeInTheDocument()
    expect(screen.getByText('×1,000')).toBeInTheDocument()
    expect(screen.getByText(':')).toBeInTheDocument()
    expect(screen.getByText('×1,000,000')).toBeInTheDocument()
  })

  it('should close modal when close button is clicked', async () => {
    const user = userEvent.setup()
    render(<ConversionModal />)
    
    // Open modal
    const link = screen.getByText('Voir le tableau de conversion')
    await user.click(link)
    
    expect(screen.getByText('Tableau de conversion')).toBeInTheDocument()
    
    // Close modal
    const closeButton = screen.getByText('×')
    await user.click(closeButton)
    
    expect(screen.queryByText('Tableau de conversion')).not.toBeInTheDocument()
  })

  it('should have correct modal styling', async () => {
    const user = userEvent.setup()
    render(<ConversionModal />)
    
    const link = screen.getByText('Voir le tableau de conversion')
    await user.click(link)
    
    const modal = screen.getByText('Tableau de conversion').closest('.bg-white')
    expect(modal).toBeInTheDocument()
    expect(modal).toHaveClass('rounded-xl')
  })

  it('should have correct backdrop styling', async () => {
    const user = userEvent.setup()
    render(<ConversionModal />)
    
    const link = screen.getByText('Voir le tableau de conversion')
    await user.click(link)
    
    const backdrop = screen.getByText('Tableau de conversion').closest('.fixed')
    expect(backdrop).toBeInTheDocument()
  })

  it('should display roman symbols with correct styling', async () => {
    const user = userEvent.setup()
    render(<ConversionModal />)
    
    const link = screen.getByText('Voir le tableau de conversion')
    await user.click(link)
    
    const romanSymbols = screen.getAllByText(/^[IVXLCDM]$/)
    romanSymbols.forEach(symbol => {
      expect(symbol).toHaveClass('font-bold', 'text-lg')
    })
  })

  it('should display arabic values with correct styling', async () => {
    const user = userEvent.setup()
    render(<ConversionModal />)
    
    const link = screen.getByText('Voir le tableau de conversion')
    await user.click(link)
    
    const arabicValues = screen.getAllByText(/^[0-9,]+$/)
    arabicValues.forEach(value => {
      expect(value).toHaveClass('text-gray-600')
    })
  })

  it('should have proper accessibility attributes', async () => {
    const user = userEvent.setup()
    render(<ConversionModal />)
    
    const link = screen.getByText('Voir le tableau de conversion')
    await user.click(link)
    
    const modal = screen.getByText('Tableau de conversion').closest('div')
    expect(modal).toHaveClass('z-50')
  })

  it('should handle multiple open/close cycles', async () => {
    const user = userEvent.setup()
    render(<ConversionModal />)
    
    const link = screen.getByText('Voir le tableau de conversion')
    
    // Open and close multiple times
    for (let i = 0; i < 3; i++) {
      await user.click(link)
      expect(screen.getByText('Tableau de conversion')).toBeInTheDocument()
      
      const closeButton = screen.getByText('×')
      await user.click(closeButton)
      expect(screen.queryByText('Tableau de conversion')).not.toBeInTheDocument()
    }
  })
})
