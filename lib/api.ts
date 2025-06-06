// API service functions for communicating with the vending machine backend

import { ProductDTO, MoneyDTO, OrderDTO, SelectedProductDTO } from '@/types/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new ApiError(
        `API request failed: ${response.status} ${response.statusText}`,
        response.status
      );
    }

    // Handle empty responses
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    
    return {} as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export const api = {
  // Get all available products
  async getProducts(): Promise<ProductDTO[]> {
    return fetchApi<ProductDTO[]>('/api/products');
  },

  // Select a product
  async selectProduct(productId: string): Promise<void> {
    return fetchApi<void>(`/api/transaction/products/select/${productId}`, {
      method: 'GET',
    });
  },

  async unselectProduct(productId: string): Promise<void> {
    return fetchApi<void>(`/api/transaction/products/unselect/${productId}`, {
      method: 'GET',
    });
  },

  // Insert money
  async insertMoney(money: MoneyDTO): Promise<void> {
    return fetchApi<void>(`/api/transaction/money`, {
      method: 'POST',
      body: JSON.stringify(money),
    });
  },

  async getInsertedMoney(): Promise<MoneyDTO> {
    return fetchApi<MoneyDTO>(`/api/transaction/money/inserted`, {
      method: 'GET',
    });
  },

  async getSelectedProducts(): Promise<Array<SelectedProductDTO>> {
    return fetchApi<Array<SelectedProductDTO>>(`/api/transaction/products/selected`, {
      method: 'GET',
    });
  },

  // Complete transaction
  async completeTransaction(): Promise<OrderDTO> {
    return fetchApi<OrderDTO>(`/api/transaction/complete`, {
      method: 'POST',
    });
  },

  // Cancel transaction
  async cancelTransaction(): Promise<OrderDTO> {
    return fetchApi<OrderDTO>(`/api/transaction/cancel`, {
      method: 'POST',
    });
  },
};

// Utility function to format currency (Moroccan Dirham)
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ar-MA', {
    style: 'currency',
    currency: 'MAD',
  }).format(amount);
}
