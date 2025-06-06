'use client';

import { MONEY_DENOMINATIONS } from '@/types/api';

interface MoneyInputProps {
  onMoneyInsert: (amount: number) => void;
  disabled?: boolean;
}

export default function MoneyInput({
  onMoneyInsert,
  disabled = false
}: MoneyInputProps) {
  return (
    <div className="bg-gradient-to-b from-[#023020] to-[#012018] rounded-2xl border-4 border-gray-700 p-6 shadow-2xl">
      <h3 className="text-xl font-bold mb-6 text-yellow-400 text-center font-mono tracking-wider">MONEY SLOT</h3>

      {/* Money Denomination Buttons */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {MONEY_DENOMINATIONS.map((denomination) => (
          <button
            key={denomination.value}
            onClick={() => onMoneyInsert(denomination.value)}
            disabled={disabled}
            className={`
              p-4 rounded-xl border-4 font-bold transition-all duration-300 text-lg font-mono
              ${disabled
                ? 'border-gray-500 bg-gray-700 text-gray-400 cursor-not-allowed opacity-50'
                : 'border-yellow-500 bg-gradient-to-b from-yellow-400 to-yellow-600 text-black hover:from-yellow-300 hover:to-yellow-500 active:scale-95 shadow-2xl'
              }
              transform hover:scale-110 active:scale-95
            `}
          >
            <div className="text-center">
              <div className="text-xl font-black">{denomination.label}</div>
              <div className="text-sm opacity-80 font-bold">INSERT</div>
            </div>
          </button>
        ))}
      </div>

      {/* Coin Slot Visual */}
      <div className="bg-black rounded-xl p-4 border-4 border-gray-600 mb-4 shadow-inner">
        <div className="text-center">
          <div className="text-green-400 font-mono text-lg font-bold">COIN SLOT</div>
          <div className={`font-mono text-sm mt-2 font-bold ${disabled ? 'text-red-400' : 'text-green-400'}`}>
            {disabled ? 'DISABLED' : 'READY'}
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="text-sm text-green-400 text-center font-mono font-bold tracking-wider">
        INSERT VALID MOROCCAN DIRHAM COINS
      </div>
    </div>
  );
}
