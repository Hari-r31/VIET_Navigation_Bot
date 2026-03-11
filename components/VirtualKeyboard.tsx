import React, { useEffect } from 'react';
import { Delete, CornerDownLeft, ChevronDown } from 'lucide-react';

interface VirtualKeyboardProps {
  onKey: (key: string) => void;
  onBackspace: () => void;
  onEnter: () => void;
  onClose: () => void;
  label?: string;
}

const ROWS = [
  ['1','2','3','4','5','6','7','8','9','0'],
  ['Q','W','E','R','T','Y','U','I','O','P'],
  ['A','S','D','F','G','H','J','K','L'],
  ['Z','X','C','V','B','N','M'],
];

const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({
  onKey,
  onBackspace,
  onEnter,
  onClose,
  label = 'Keyboard',
}) => {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[999] bg-black/50 backdrop-blur-[1px]"
        onClick={onClose}
      />

      {/* Keyboard Panel — fixed at bottom, full width */}
      <div
        className="fixed bottom-0 left-0 right-0 z-[1000] animate-in slide-in-from-bottom duration-300"
        onMouseDown={(e) => e.preventDefault()}
      >
        {/* Header */}
        <div className="bg-slate-900 border-b border-slate-700 rounded-t-3xl px-6 py-4 flex items-center justify-between">
          <span className="text-slate-300 text-sm font-bold uppercase tracking-widest flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2"/>
              <path d="M6 8h.01M10 8h.01M14 8h.01M18 8h.01M8 12h.01M12 12h.01M16 12h.01M7 16h10"/>
            </svg>
            {label}
          </span>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-700 hover:bg-red-500 text-slate-300 hover:text-white transition-colors"
          >
            <ChevronDown size={20} />
          </button>
        </div>

        {/* Keys area */}
        <div className="bg-slate-800 px-3 pt-4 pb-6">

          {ROWS.map((row, ri) => (
            <div key={ri} className="flex gap-2 mb-2 w-full">
              {row.map((key) => (
                <button
                  key={key}
                  onClick={() => onKey(key)}
                  className="flex-1 h-16 bg-slate-600 hover:bg-blue-500 active:bg-blue-700 active:scale-95 text-white font-bold text-xl rounded-2xl transition-all shadow-md border border-slate-500 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/20"
                >
                  {key}
                </button>
              ))}
            </div>
          ))}

          {/* Bottom row: Backspace | Space | Enter */}
          <div className="flex gap-2 mt-1 w-full">
            <button
              onClick={onBackspace}
              className="w-20 h-16 bg-slate-600 hover:bg-red-500 active:bg-red-700 active:scale-95 text-white rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md border border-slate-500 hover:border-red-400 font-semibold text-sm"
              title="Backspace"
            >
              <Delete size={22} />
            </button>

            <button
              onClick={() => onKey(' ')}
              className="flex-1 h-16 bg-slate-600 hover:bg-blue-500 active:bg-blue-700 active:scale-95 text-slate-200 hover:text-white font-bold text-base rounded-2xl transition-all shadow-md border border-slate-500 hover:border-blue-400 tracking-[0.4em]"
            >
              SPACE
            </button>

            <button
              onClick={onEnter}
              className="w-32 h-16 bg-blue-600 hover:bg-blue-500 active:bg-blue-800 active:scale-95 text-white font-bold text-base rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md border border-blue-500 hover:shadow-lg hover:shadow-blue-500/30"
            >
              <CornerDownLeft size={20} />
              Search
            </button>
          </div>

        </div>
      </div>
    </>
  );
};

export default VirtualKeyboard;
