import { render, screen, fireEvent } from '@testing-library/react';
import MoneyInput from '@/components/MoneyInput';

describe('MoneyInput Component', () => {
  const mockOnMoneyInsert = jest.fn();

  beforeEach(() => {
    mockOnMoneyInsert.mockClear();
  });

  it('renders correctly', () => {
    render(
      <MoneyInput
        onMoneyInsert={mockOnMoneyInsert}
      />
    );

    expect(screen.getByText('MONEY SLOT')).toBeInTheDocument();
    expect(screen.getByText('COIN SLOT')).toBeInTheDocument();
  });

  it('calls onMoneyInsert when denomination button is clicked', () => {
    render(
      <MoneyInput
        onMoneyInsert={mockOnMoneyInsert}
      />
    );

    const madButton = screen.getByText('1 MAD').closest('button');
    fireEvent.click(madButton!);

    expect(mockOnMoneyInsert).toHaveBeenCalledWith(1);
  });

  it('disables buttons when disabled prop is true', () => {
    render(
      <MoneyInput
        onMoneyInsert={mockOnMoneyInsert}
        disabled={true}
      />
    );

    const madButton = screen.getByText('1 MAD').closest('button');
    expect(madButton).toBeDisabled();
  });

  it('renders all MAD denomination buttons', () => {
    render(
      <MoneyInput
        onMoneyInsert={mockOnMoneyInsert}
      />
    );

    // Check for MAD denominations
    expect(screen.getByText('0.5 MAD')).toBeInTheDocument();
    expect(screen.getByText('1 MAD')).toBeInTheDocument();
    expect(screen.getByText('2 MAD')).toBeInTheDocument();
    expect(screen.getByText('5 MAD')).toBeInTheDocument();
    expect(screen.getByText('10 MAD')).toBeInTheDocument();
  });

  it('shows correct status when disabled', () => {
    render(
      <MoneyInput
        onMoneyInsert={mockOnMoneyInsert}
        disabled={true}
      />
    );

    expect(screen.getByText('DISABLED')).toBeInTheDocument();
  });
});
