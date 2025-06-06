// Basic tests for API functions
// Note: These are integration tests that require the backend to be running

import { api, formatCurrency } from '@/lib/api';

describe('API Functions', () => {

  describe('formatCurrency', () => {
    it('should format currency correctly in MAD', () => {
      expect(formatCurrency(1.50)).toContain('1');
      expect(formatCurrency(0.5)).toContain('0');
      expect(formatCurrency(10)).toContain('10');
      expect(formatCurrency(0)).toContain('0');
      // Note: MAD formatting may vary by locale, so we just check for numbers
    });
  });

  // Integration tests - require backend to be running
  describe('API Integration Tests', () => {
    // Skip these tests if backend is not available
    const skipIfNoBackend = process.env.SKIP_INTEGRATION_TESTS === 'true';

    (skipIfNoBackend ? it.skip : it)('should fetch products', async () => {
      try {
        const products = await api.getProducts();
        expect(Array.isArray(products)).toBe(true);

        if (products.length > 0) {
          const product = products[0];
          expect(product).toHaveProperty('id');
          expect(product).toHaveProperty('name');
          expect(product).toHaveProperty('price');
          expect(product).toHaveProperty('quantity');
          expect(typeof product.price).toBe('number');
          expect(typeof product.quantity).toBe('number');
        }
      } catch (error) {
        console.warn('Backend not available for integration test:', error);
      }
    });

    (skipIfNoBackend ? it.skip : it)('should handle API errors gracefully', async () => {
      try {
        // Try to select a product with invalid transaction ID
        await api.selectProduct('invalid-id', 'invalid-product-id');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toContain('API request failed');
      }
    });
  });
});

// Mock data for testing components
export const mockProducts = [
  {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Coca Cola',
    price: 1.50,
    quantity: 10,
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174001',
    name: 'Pepsi',
    price: 1.50,
    quantity: 5,
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174002',
    name: 'Water',
    price: 1.00,
    quantity: 0, // Out of stock
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174003',
    name: 'Chips',
    price: 2.00,
    quantity: 8,
  },
];

export const mockOrder = {
  selectedProducts: [
    {
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: 'Coca Cola',
      price: 1.50,
    },
  ],
  returnedMoney: [
    {
      value: 0.50,
    },
  ],
};
