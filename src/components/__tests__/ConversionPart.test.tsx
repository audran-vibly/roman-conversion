import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ConversionPart from '../ConversionPart'

describe('ConversionPart Component', () => {
  const mockOnChange = vi.fn()
  const mockOnConvert = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render input field and convert button', () => {
    render(
      <ConversionPart
        value=""
        onChange={mockOnChange}
        onConvert={mockOnConvert}
      />
    )

    expect(screen.getByRole('textbox')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /convertir/i })).toBeInTheDocument()
  })

  it('should display placeholder text', () => {
    render(
      <ConversionPart
        value=""
        onChange={mockOnChange}
        onConvert={mockOnConvert}
      />
    )

    expect(screen.getByPlaceholderText('Ex: X·L·V·MMM')).toBeInTheDocument()
  })

  it('should display valid symbols info', () => {
    render(
      <ConversionPart
        value=""
        onChange={mockOnChange}
        onConvert={mockOnConvert}
      />
    )

    expect(screen.getByText(/Symboles valides : I, V, X, L, C, D, M/)).toBeInTheDocument()
  })

  it('should call onChange when input value changes', async () => {
    const user = userEvent.setup()
    render(
      <ConversionPart
        value=""
        onChange={mockOnChange}
        onConvert={mockOnConvert}
      />
    )

    const input = screen.getByRole('textbox')
    await user.type(input, 'XIV')

    expect(mockOnChange).toHaveBeenCalledWith('X')
    expect(mockOnChange).toHaveBeenCalledWith('XI')
    expect(mockOnChange).toHaveBeenCalledWith('XIV')
  })

  it('should sanitize input and remove invalid characters', async () => {
    const user = userEvent.setup()
    render(
      <ConversionPart
        value=""
        onChange={mockOnChange}
        onConvert={mockOnConvert}
      />
    )

    const input = screen.getByRole('textbox')
    await user.type(input, 'X1I2V3')

    // Should only call onChange with valid characters
    expect(mockOnChange).toHaveBeenCalledWith('X')
    expect(mockOnChange).toHaveBeenCalledWith('XI')
    expect(mockOnChange).toHaveBeenCalledWith('XIV')
    expect(mockOnChange).not.toHaveBeenCalledWith('X1')
    expect(mockOnChange).not.toHaveBeenCalledWith('XI2')
  })

  it('should call onConvert when convert button is clicked', async () => {
    const user = userEvent.setup()
    render(
      <ConversionPart
        value="XIV"
        onChange={mockOnChange}
        onConvert={mockOnConvert}
      />
    )

    const button = screen.getByRole('button', { name: /convertir/i })
    await user.click(button)

    expect(mockOnConvert).toHaveBeenCalledTimes(1)
  })

  it('should call onConvert when Enter key is pressed', async () => {
    const user = userEvent.setup()
    render(
      <ConversionPart
        value="XIV"
        onChange={mockOnChange}
        onConvert={mockOnConvert}
      />
    )

    const input = screen.getByRole('textbox')
    await user.type(input, '{enter}')

    expect(mockOnConvert).toHaveBeenCalledTimes(1)
  })

  it('should not call onConvert when Enter is pressed with empty input', async () => {
    const user = userEvent.setup()
    render(
      <ConversionPart
        value=""
        onChange={mockOnChange}
        onConvert={mockOnConvert}
      />
    )

    const input = screen.getByRole('textbox')
    await user.type(input, '{enter}')

    expect(mockOnConvert).not.toHaveBeenCalled()
  })

  it('should disable convert button when input is empty', () => {
    render(
      <ConversionPart
        value=""
        onChange={mockOnChange}
        onConvert={mockOnConvert}
      />
    )

    const button = screen.getByRole('button', { name: /convertir/i })
    expect(button).toBeDisabled()
  })

  it('should enable convert button when input has value', () => {
    render(
      <ConversionPart
        value="XIV"
        onChange={mockOnChange}
        onConvert={mockOnConvert}
      />
    )

    const button = screen.getByRole('button', { name: /convertir/i })
    expect(button).not.toBeDisabled()
  })

  it('should have correct input attributes', () => {
    render(
      <ConversionPart
        value=""
        onChange={mockOnChange}
        onConvert={mockOnConvert}
      />
    )

    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('id', 'roman-input')
    expect(input).toHaveAttribute('type', 'text')
    expect(input).toHaveAttribute('maxLength', '25')
    expect(input).toHaveAttribute('autoComplete', 'off')
    expect(input).toHaveAttribute('autoFocus')
  })

  it('should display current value in input', () => {
    render(
      <ConversionPart
        value="MMCMXCIX"
        onChange={mockOnChange}
        onConvert={mockOnConvert}
      />
    )

    const input = screen.getByRole('textbox')
    expect(input).toHaveValue('MMCMXCIX')
  })

  it('should handle vinculum characters correctly', async () => {
    const user = userEvent.setup()
    render(
      <ConversionPart
        value=""
        onChange={mockOnChange}
        onConvert={mockOnConvert}
      />
    )

    const input = screen.getByRole('textbox')
    await user.type(input, 'M·V:')

    expect(mockOnChange).toHaveBeenCalledWith('M')
    expect(mockOnChange).toHaveBeenCalledWith('M·')
    expect(mockOnChange).toHaveBeenCalledWith('M·V')
    expect(mockOnChange).toHaveBeenCalledWith('M·V:')
  })
})
