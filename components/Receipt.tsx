'use client';

import { OrderDTO } from '@/types/api';
import { formatCurrency } from '@/lib/api';

interface ReceiptProps {
  order: OrderDTO;
  onClose: () => void;
}

export default function Receipt({ order, onClose }: ReceiptProps) {
  const totalCost = order.selectedProducts.reduce((sum, product) => sum + product.price, 0);
  const totalChange = order.returnedMoney.reduce((sum, money) => sum + money.value, 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto border-4 border-green-500 shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 rounded-t-lg border-b-2 border-green-500">
          <h2 className="text-xl font-bold text-center font-mono">ORDER COMPLETE!</h2>
          <div className="text-center text-green-200 text-sm mt-1">✓ SUCCESS</div>
        </div>

        {/* Receipt Content */}
        <div className="p-6 bg-black text-green-400 font-mono">
          {/* Transaction Info */}
          <div className="text-center mb-6 border-b border-green-600 pb-4">
            <div className="text-4xl mb-2">🧾</div>
            <p className="text-green-300">THANK YOU FOR YOUR PURCHASE</p>
            <p className="text-xs text-gray-400 mt-2">
              {new Date().toLocaleString('en-GB', {
                timeZone: 'Africa/Casablanca',
                dateStyle: 'short',
                timeStyle: 'medium'
              })}
            </p>
          </div>

          {/* Purchased Items */}
          <div className="mb-6">
            <h3 className="font-bold text-yellow-400 mb-3 border-b border-yellow-600 pb-2">
              ITEMS PURCHASED
            </h3>
            <div className="space-y-2">
              {order.selectedProducts.map((product, index) => (
                <div key={`${product.id}-${index}`} className="flex justify-between items-center text-sm">
                  <span className="text-green-300">{product.name}</span>
                  <span className="font-bold text-yellow-400">
                    {formatCurrency(product.price)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-green-600 mt-3 pt-3">
              <div className="flex justify-between items-center font-bold text-lg">
                <span className="text-green-400">TOTAL PAID:</span>
                <span className="text-yellow-400">{formatCurrency(totalCost)}</span>
              </div>
            </div>
          </div>

          {/* Change Returned */}
          {totalChange > 0 && (
            <div className="mb-6">
              <h3 className="font-bold text-yellow-400 mb-3 border-b border-yellow-600 pb-2">
                CHANGE RETURNED
              </h3>
              <div className="space-y-2">
                {order.returnedMoney.map((money, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <span className="text-green-300">CHANGE</span>
                    <span className="font-bold text-cyan-400">
                      {formatCurrency(money.value)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-green-600 mt-3 pt-3">
                <div className="flex justify-between items-center font-bold text-lg">
                  <span className="text-green-400">TOTAL CHANGE:</span>
                  <span className="text-cyan-400">{formatCurrency(totalChange)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="bg-yellow-900 border-2 border-yellow-500 rounded-lg p-3 mb-6">
            <p className="text-sm text-yellow-300 text-center font-bold">
              ⚠️ COLLECT YOUR ITEMS AND CHANGE FROM THE DISPENSING AREA BELOW ⚠️
            </p>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-bold hover:from-blue-700 hover:to-blue-800 transition-all border-2 border-blue-500 shadow-lg"
          >
            ORDER COMPLETE
          </button>
        </div>
      </div>
    </div>
  );
}
