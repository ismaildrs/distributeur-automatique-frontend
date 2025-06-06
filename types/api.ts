// API Type definitions based on the OpenAPI specification

export interface ProductDTO {
  id: string; // UUID format
  name: string;
  price: number;
  quantity: number;
}

export interface MoneyDTO {
  value: number;
}

export interface SelectedProductDTO {
  id: string; // UUID format
  name: string;
  price: number;
}

export interface OrderDTO {
  selectedProducts: SelectedProductDTO[];
  returnedMoney: MoneyDTO[];
}

// Frontend-specific types
export interface TransactionState {
  selectedProducts: SelectedProductDTO[];
  insertedMoney: number;
  status: 'idle' | 'active' | 'completing' | 'completed' | 'cancelled';
}

export interface VendingMachineState {
  products: ProductDTO[];
  transaction: TransactionState | null;
  loading: boolean;
  error: string | null;
}

// Valid money denominations for the vending machine (Moroccan Dirham)
export const MONEY_DENOMINATIONS = [
  { value: 0.5, label: '0.5 MAD' },
  { value: 1, label: '1 MAD' },
  { value: 2, label: '2 MAD' },
  { value: 5, label: '5 MAD' },
  { value: 10, label: '10 MAD' },
] as const;
