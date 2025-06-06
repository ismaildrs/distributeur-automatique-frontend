'use client';

import { useState, useEffect } from 'react';
import { ProductDTO, OrderDTO, VendingMachineState } from '@/types/api';
import { api } from '@/lib/api';
import ProductGrid from './ProductGrid';
import TransactionPanel from './TransactionPanel';
import Receipt from './Receipt';

export default function VendingMachine() {
  const [state, setState] = useState<VendingMachineState>({
    products: [],
    transaction: null,
    loading: false,
    error: null,
  });
  
  const [completedOrder, setCompletedOrder] = useState<OrderDTO | null>(null);

  // Load products on component mount
  useEffect(() => {
    loadProducts();
    refreshInsertedMoney();
    refreshSelectedProducts();
  }, []);

  // Periodically refresh transaction data when there's an active transaction
  useEffect(() => {
    if (!state.transaction) return;

    const interval = setInterval(() => {
      refreshInsertedMoney();
      refreshSelectedProducts();
    }, 2000); // Refresh every 2 seconds

    return () => clearInterval(interval);
  }, [state.transaction]);

  const refreshInsertedMoney = async () => {
    try {
      const insertedMoneyResponse = await api.getInsertedMoney();
      setState(prev => ({
        ...prev,
        transaction: prev.transaction ? {
          ...prev.transaction,
          insertedMoney: insertedMoneyResponse.value,
        } : {
          selectedProducts: [],
          insertedMoney: insertedMoneyResponse.value,
          status: insertedMoneyResponse.value > 0 ? 'active' : 'idle',
        },
      }));
    } catch (error) {
      // If there's no active transaction, this might fail - that's okay
      console.log('No active transaction or error fetching inserted money:', error);
    }
  };

  const refreshSelectedProducts = async () => {
    try {
      const selectedProducts = await api.getSelectedProducts();

      setState(prev => ({
        ...prev,
        transaction: prev.transaction ? {
          ...prev.transaction,
          selectedProducts: selectedProducts,
        } : selectedProducts.length > 0 ? {
          selectedProducts: selectedProducts,
          insertedMoney: 0,
          status: 'active' as const,
        } : prev.transaction,
      }));
    } catch (error) {
      // If there's no active transaction, this might fail - that's okay
      console.log('No active transaction or error fetching selected products:', error);
    }
  };

  const loadProducts = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const products = await api.getProducts();
      setState(prev => ({ ...prev, products, loading: false }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Failed to load products' 
      }));
    }
  };

  const insertMoney = async (amount: number) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // Call backend to insert money - backend handles transaction creation
      await api.insertMoney({ value: amount });

      // Fetch the actual transaction state from backend
      await refreshInsertedMoney();
      await refreshSelectedProducts();

      setState(prev => ({
        ...prev,
        loading: false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to insert money'
      }));
    }
  };

  const selectProduct = async (product: ProductDTO) => {
    if (!state.transaction) {
      setState(prev => ({
        ...prev,
        error: 'Please insert money first to start a transaction'
      }));
      return;
    }

    // Check if product is already selected by fetching current selections
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // First, get current selected products to check if this product is already selected
      const currentSelectedProducts = await api.getSelectedProducts();
      const isAlreadySelected = currentSelectedProducts.some(selectedProduct => selectedProduct.id === product.id);

      if (isAlreadySelected) {
        // Product is already selected, unselect it
        await api.unselectProduct(product.id);
      } else {
        // Product not selected yet, proceed with selection
        await api.selectProduct(product.id);
      }

      // Fetch the updated selected products from backend
      await refreshSelectedProducts();

      setState(prev => ({
        ...prev,
        loading: false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to select/unselect product'
      }));
    }
  };

  const completeTransaction = async () => {
    if (!state.transaction) return;

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const order = await api.completeTransaction();
      setCompletedOrder(order);

      setState(prev => ({
        ...prev,
        loading: false,
        transaction: null,
      }));

      // Reload products to update quantities
      loadProducts();
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to complete transaction'
      }));
    }
  };

  const cancelTransaction = async () => {
    if (!state.transaction) return;

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      await api.cancelTransaction();

      setState(prev => ({
        ...prev,
        loading: false,
        transaction: null,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to cancel transaction'
      }));
    }
  };

  const unselectProduct = async (productId: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // Unselect the specific product
      await api.unselectProduct(productId);

      // Refresh the selected products from backend
      await refreshSelectedProducts();

      setState(prev => ({ ...prev, loading: false }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to unselect product'
      }));
    }
  };

  const clearSelection = async () => {
    if (!state.transaction?.selectedProducts.length) return;

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // Unselect all selected products
      for (const product of state.transaction.selectedProducts) {
        await api.unselectProduct(product.id);
      }

      // Refresh the selected products from backend
      await refreshSelectedProducts();

      setState(prev => ({ ...prev, loading: false }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to clear selection'
      }));
    }
  };

  const closeReceipt = () => {
    setCompletedOrder(null);
  };

  const totalCost = state.transaction?.selectedProducts.reduce((sum, product) => sum + product.price, 0) || 0;

  const canComplete = state.transaction
    ? state.transaction.selectedProducts.length > 0 &&
      state.transaction.insertedMoney >= totalCost
    : false;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-700 to-gray-900 flex items-center justify-center p-4">
      {/* Vending Machine Container */}
      <div className="bg-gradient-to-b from-[#023020] to-[#012018] rounded-2xl shadow-2xl border-8 border-gray-800 max-w-6xl w-full overflow-hidden relative">

        {/* Machine Top Bezel */}
        <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-gray-600 to-gray-700 rounded-t-2xl border-b-2 border-gray-800"></div>

        {/* Machine Header */}
        <div className="bg-gradient-to-r from-[#023020] to-[#034030] text-white p-6 text-center border-b-4 border-gray-800 mt-4">
          <div className="bg-black rounded-lg p-4 border-2 border-gray-700 shadow-inner">
            <h1 className="text-4xl font-bold tracking-wider text-green-400 font-mono">VENDING MACHINE</h1>
            <div className="flex justify-center items-center mt-2 space-x-4">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
              <p className="text-green-300 text-sm font-mono">READY FOR SERVICE</p>
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {state.error && (
          <div className="mx-6 mt-4">
            <div className="bg-black border-2 border-red-500 rounded-lg p-4 shadow-inner">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="font-mono text-red-400 font-semibold">ERROR: {state.error}</span>
                </div>
                <button
                  onClick={() => setState(prev => ({ ...prev, error: null }))}
                  className="text-red-400 hover:text-red-300 text-xl font-bold font-mono bg-gray-800 w-8 h-8 rounded border border-red-500 hover:bg-gray-700 transition-colors"
                >
                  ×
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8 h-full">

          {/* Products Display Window */}
          <div className="lg:col-span-2 min-h-full flex flex-col">
            {/* Glass Window Frame */}
            <div className="bg-gradient-to-b min-h-full  from-gray-600 to-gray-800 rounded-3xl p-4 shadow-2xl border-4 border-gray-700">
              {/* Inner Glass */}
              <div className="bg-black rounded-2xl min-h-full border-4 border-gray-900 shadow-inner overflow-hidden relative">
                {/* Screen Bezel */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-gray-900/20 pointer-events-none rounded-2xl"></div>

                {/* Display Header */}
                <div className="bg-gradient-to-r from-gray-900 to-black text-green-400 p-4 border-b-2 border-gray-700 relative">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold font-mono tracking-wider">PRODUCT SELECTION</h2>
                  </div>
                </div>

              {/* Products Grid */}
              <div className="bg-gradient-to-b from-gray-900 to-black min-h-[500px] h-full relative">
                {/* Screen scanlines effect */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-500/5 to-transparent pointer-events-none"></div>

                {state.loading && !state.products.length ? (
                  <div className="flex items-center justify-center h-96 text-green-400">
                    <div className="text-center">
                      <div className="animate-spin text-4xl mb-4">⟳</div>
                      <div className="text-xl font-mono tracking-wider">LOADING PRODUCTS...</div>
                      <div className="text-sm font-mono mt-2 opacity-75">Please wait...</div>
                    </div>
                  </div>
                ) : (
                  <ProductGrid
                    products={state.products}
                    onProductSelect={selectProduct}
                    selectedProducts={state.transaction?.selectedProducts || []}
                    insertedMoney={state.transaction?.insertedMoney || 0}
                    disabled={state.loading || !state.transaction}
                    hasActiveTransaction={!!state.transaction}
                  />
                )}
              </div>
            </div>
            </div>
          </div>

          {/* Control Panel */}
          <div className="lg:col-span-1">
            <TransactionPanel
              selectedProducts={state.transaction?.selectedProducts || []}
              insertedMoney={state.transaction?.insertedMoney || 0}
              totalCost={totalCost}
              onMoneyInsert={insertMoney}
              onComplete={completeTransaction}
              onCancel={cancelTransaction}
              onClearSelection={clearSelection}
              onUnselectProduct={unselectProduct}
              loading={state.loading}
              canComplete={canComplete}
              hasActiveTransaction={!!state.transaction}
            />
          </div>
        </div>

        {/* Machine Footer - Dispensing Area */}
        <div className="bg-gradient-to-b from-[#023020] to-[#012018] p-6 border-t-4 border-gray-800">
          <div className="text-center">
            <div className="text-green-400 font-mono text-sm mb-3 tracking-wider">DISPENSING AREA</div>

            {/* Dispensing Slot */}
            <div className="bg-gradient-to-b from-gray-900 to-black rounded-2xl p-6 border-4 border-gray-700 shadow-inner relative overflow-hidden">
              {/* Slot opening effect */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-800/20 to-transparent"></div>

              <div className="relative z-10">
                <div className="text-green-400 font-mono text-lg font-bold mb-2">
                  {completedOrder ? "🎁 COLLECT YOUR ITEMS AND CHANGE" : "ITEMS WILL BE DISPENSED HERE"}
                </div>

                {completedOrder && (
                  <div className="flex justify-center space-x-2 mt-4">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full animate-bounce"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                )}

                {!completedOrder && (
                  <div className="text-gray-500 font-mono text-xs mt-2">
                    Complete your purchase to receive items
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Machine Bottom Bezel */}
        <div className="h-4 bg-gradient-to-b from-gray-700 to-gray-600 rounded-b-2xl border-t-2 border-gray-800"></div>
      </div>

      {/* Receipt Modal */}
      {completedOrder && (
        <Receipt order={completedOrder} onClose={closeReceipt} />
      )}
    </div>
  );
}
