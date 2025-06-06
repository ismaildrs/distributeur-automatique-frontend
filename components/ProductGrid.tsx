'use client';

import { ProductDTO, SelectedProductDTO } from '@/types/api';
import { formatCurrency } from '@/lib/api';

interface ProductGridProps {
  products: ProductDTO[];
  onProductSelect: (product: ProductDTO) => void;
  selectedProducts: SelectedProductDTO[];
  insertedMoney: number;
  disabled?: boolean;
  hasActiveTransaction?: boolean;
}

export default function ProductGrid({
  products,
  onProductSelect,
  selectedProducts,
  insertedMoney,
  disabled = false,
  hasActiveTransaction = false
}: ProductGridProps) {
  const isProductSelected = (productId: string) => {
    return selectedProducts.some(product => product.id === productId);
  };

  // Calculate total cost of currently selected products
  const totalSelectedCost = selectedProducts.reduce((sum, product) => sum + product.price, 0);

  // Calculate remaining balance after current selections
  const remainingBalance = insertedMoney - totalSelectedCost;

  const canAffordProduct = (product: ProductDTO) => {
    // Check if remaining balance is enough for this product
    return remainingBalance >= product.price;
  };

  // Product slot labels (like real vending machines)
  const getSlotLabel = (index: number) => {
    const row = String.fromCharCode(65 + Math.floor(index / 4)); // A, B, C, etc.
    const col = (index % 4) + 1; // 1, 2, 3, 4
    return `${row}${col}`;
  };

  return (
    <div className="grid grid-cols-4 gap-4 p-6 h-full bg-gradient-to-b from-black to-gray-900">
      {products.map((product, index) => {
        const isOutOfStock = product.quantity === 0;
        const isSelected = isProductSelected(product.id);
        const canAfford = isSelected || canAffordProduct(product); // If selected, always allow interaction
        const canInteract = hasActiveTransaction && !isOutOfStock && !disabled && canAfford;
        const slotLabel = getSlotLabel(index);

        const getTooltipText = () => {
          if (!hasActiveTransaction) return 'Insert money first';
          if (isOutOfStock) return 'Out of stock';
          if (isSelected) return `Click to unselect ${product.name}`;
          if (!canAffordProduct(product)) {
            const shortfall = product.price - remainingBalance;
            return `Need ${formatCurrency(shortfall)} more (remaining balance: ${formatCurrency(remainingBalance)})`;
          }
          return `Click to select ${product.name} (remaining: ${formatCurrency(remainingBalance - product.price)})`;
        };

        return (
          <div
            key={product.id}
            className={`
              relative rounded-xl p-4 transition-all duration-300
              min-h-[200px] flex flex-col
              bg-gradient-to-b from-gray-800 to-gray-900
              border-4 shadow-2xl
              ${canInteract
                ? isSelected
                  ? 'border-yellow-400 shadow-yellow-400/30 hover:shadow-yellow-400/50 cursor-pointer transform hover:scale-105'
                  : 'border-green-400 shadow-green-400/20 hover:border-green-300 hover:shadow-green-400/40 cursor-pointer transform hover:scale-105'
                : !canAffordProduct(product) && hasActiveTransaction && !isOutOfStock && !isSelected
                  ? 'border-orange-500 shadow-orange-500/20 cursor-not-allowed opacity-70'
                  : 'border-gray-600 shadow-gray-600/20 cursor-not-allowed opacity-50'
              }
            `}
            onClick={() => canInteract && onProductSelect(product)}
            title={getTooltipText()}
          >
            {/* Slot Label */}
            <div className="absolute top-2 left-2 bg-black text-green-400 text-sm font-bold font-mono px-3 py-1 rounded border border-green-500 shadow-lg">
              {slotLabel}
            </div>

            {/* Product Image Placeholder */}
            <div className="w-full h-16 bg-gradient-to-br from-gray-700 to-gray-600 rounded-md mb-2 flex items-center justify-center border border-gray-500">
              <div className="text-2xl">
                {product.name.toLowerCase().includes('cola') ? '🥤' :
                 product.name.toLowerCase().includes('water') ? '💧' :
                 product.name.toLowerCase().includes('chips') ? '🍟' :
                 product.name.toLowerCase().includes('coffee') ? '☕' :
                 product.name.toLowerCase().includes('juice') ? '🧃' : '🥤'}
              </div>
            </div>

            {/* Product Name */}
            <h3 className={`font-semibold text-xs mb-1 truncate ${
              isSelected ? 'text-yellow-300' :
              canInteract ? 'text-green-300' :
              !canAffordProduct(product) && hasActiveTransaction && !isOutOfStock && !isSelected ? 'text-orange-400' :
              'text-gray-500'
            }`}>
              {product.name}
            </h3>

            {/* Price */}
            <p className={`text-sm font-bold mb-1 ${
              isSelected ? 'text-yellow-400' :
              canInteract ? 'text-yellow-400' :
              !canAffordProduct(product) && hasActiveTransaction && !isOutOfStock && !isSelected ? 'text-orange-400' :
              'text-gray-500'
            }`}>
              {formatCurrency(product.price)}
            </p>

            {/* Stock Info */}
            <div className="flex justify-between items-center text-xs mt-auto">
              <span className={`${
                isOutOfStock ? 'text-red-500' :
                canInteract ? 'text-gray-300' :
                !canAffordProduct(product) && hasActiveTransaction && !isOutOfStock && !isSelected ? 'text-orange-400' :
                'text-gray-600'
              }`}>
                Stock: {product.quantity}
                {isOutOfStock && ' (SOLD OUT)'}
                {!canAffordProduct(product) && hasActiveTransaction && !isOutOfStock && !isSelected && ' (INSUFFICIENT BALANCE)'}
              </span>
            </div>

            {/* Status indicator for non-interactive items */}
            {!canInteract && (
              <div className="absolute top-2 right-2">
                <div className={`w-2 h-2 rounded-full ${
                  isOutOfStock ? 'bg-red-500' :
                  !canAffordProduct(product) && hasActiveTransaction && !isSelected ? 'bg-orange-500' :
                  'bg-gray-500'
                }`}></div>
              </div>
            )}

            {/* Selection indicator */}
            {isSelected && (
              <div className="absolute top-2 left-2">
                <div className="bg-yellow-500 text-black text-xs font-bold px-1 rounded">
                  ✓
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
