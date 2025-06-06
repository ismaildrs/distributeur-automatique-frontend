'use client';

import { SelectedProductDTO } from '@/types/api';
import { formatCurrency } from '@/lib/api';
import MoneyInput from './MoneyInput';

interface TransactionPanelProps {
  selectedProducts: SelectedProductDTO[];
  insertedMoney: number;
  totalCost: number;
  onMoneyInsert: (amount: number) => void;
  onComplete: () => void;
  onCancel: () => void;
  onClearSelection: () => void;
  onUnselectProduct?: (productId: string) => void;
  loading?: boolean;
  canComplete: boolean;
  hasActiveTransaction?: boolean;
}

export default function TransactionPanel({
  selectedProducts,
  insertedMoney,
  totalCost,
  onMoneyInsert,
  onComplete,
  onCancel,
  onClearSelection,
  onUnselectProduct,
  loading = false,
  canComplete,
  hasActiveTransaction = false,
}: TransactionPanelProps) {
  const change = insertedMoney - totalCost;
  const needsMoreMoney = insertedMoney < totalCost;

  return (
    <div className="space-y-4">

      {/* Digital Display */}
      <div className="bg-gradient-to-b from-[#023020] to-[#012018] rounded-2xl border-4 border-gray-700 p-2 shadow-2xl">
        <div className="bg-black rounded-xl border-2 border-green-500 p-6 font-mono text-green-400 shadow-inner relative overflow-hidden">
          {/* Screen effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-500/5 to-transparent pointer-events-none"></div>

          <div className="text-center relative z-10">
            <div className="text-xl font-bold mb-3 tracking-wider">CREDIT BALANCE</div>
            <div className="text-xl font-bold text-yellow-400 mb-6 tracking-wider drop-shadow-lg">
              {formatCurrency(insertedMoney)}
            </div>

            {totalCost > 0 && (
              <div className="border-t border-green-600 pt-4 space-y-2">
                <div className="flex justify-between text-lg">
                  <span>TOTAL:</span>
                  <span className="text-red-400 font-bold">{formatCurrency(totalCost)}</span>
                </div>
                <div className="flex justify-between text-lg">
                  <span>{needsMoreMoney ? 'NEED:' : 'CHANGE:'}</span>
                  <span className={`font-bold ${needsMoreMoney ? 'text-red-400' : 'text-green-400'}`}>
                    {formatCurrency(Math.abs(change))}
                  </span>
                </div>
              </div>
            )}
            {!hasActiveTransaction && (
              <div className="text-center text-red-400 animate-pulse text-lg font-bold">
                INSERT MONEY TO START
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Selected Products */}
      {selectedProducts.length > 0 && (
        <div className="bg-gray-800 rounded-lg border-2 border-gray-600 p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-green-400">
              SELECTED ITEMS ({selectedProducts.length})
            </h3>
            <button
              onClick={onClearSelection}
              disabled={loading}
              className="text-sm text-red-400 hover:text-red-300 disabled:text-gray-500 font-mono"
            >
              CLEAR
            </button>
          </div>

          <div className="space-y-2">
            {selectedProducts.map((product, index) => (
              <div key={`${product.id}-${index}`} className="flex justify-between items-center py-1 border-b border-gray-700 last:border-b-0">
                <div className="text-green-300 font-mono text-sm flex-1">
                  <span>{product.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-yellow-400 font-mono text-sm">
                    {formatCurrency(product.price)}
                  </span>
                  {onUnselectProduct && (
                    <button
                      onClick={() => onUnselectProduct(product.id)}
                      disabled={loading}
                      className="text-red-400 hover:text-red-300 disabled:text-gray-500 text-xs font-mono"
                      title={`Remove ${product.name}`}
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Money Input - Always visible */}
      <MoneyInput
        onMoneyInsert={onMoneyInsert}
        disabled={loading}
      />

      {/* Action Buttons - Always visible */}
      <div className="flex gap-4">
        <button
          onClick={onCancel}
          disabled={loading || !hasActiveTransaction}
          className="flex-1 py-4 px-6 bg-gradient-to-b from-red-600 to-red-700 text-white rounded-xl font-bold font-mono text-lg hover:from-red-700 hover:to-red-800 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transition-all border-4 border-red-800 shadow-2xl transform hover:scale-105 disabled:transform-none"
        >
          {loading ? 'PROCESSING...' : 'CANCEL'}
        </button>

        <button
          onClick={onComplete}
          disabled={loading || !canComplete || selectedProducts.length === 0}
          className="flex-1 py-4 px-6 bg-gradient-to-b from-green-600 to-green-700 text-white rounded-xl font-bold font-mono text-lg hover:from-green-700 hover:to-green-800 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transition-all border-4 border-green-800 shadow-2xl transform hover:scale-105 disabled:transform-none"
        >
          {loading ? 'PROCESSING...' : 'COMPLETE'}
        </button>
      </div>
    </div>
  );
}
