
import React, { useState, useEffect, useRef } from 'react';
import { Mic, X, Send, Bot, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { startListening } from '../services/speechService';
import { IntentType } from '../types';
import toast from 'react-hot-toast';

const Assistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [query, setQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleVoiceInput = () => {
    if (isListening) return;
    setIsListening(true);
    setQuery(''); // Clear existing query
    startListening(
      (text) => {
        setQuery(text);
        processQuery(text);
      },
      () => setIsListening(false),
      (err) => {
        setIsListening(false);
        toast.error(err); // Show specific error message
      },
      (interimText) => {
        // Show text as user speaks
        setQuery(interimText);
      }
    );
  };

  const processQuery = async (text: string) => {
    setIsProcessing(true);
    const lowerText = text.toLowerCase();

    // Simple Intent Detection Logic
    let intent = IntentType.UNKNOWN;
    
    // Check for fee related keywords
    if (lowerText.includes('fee') || lowerText.includes('cost') || lowerText.includes('tuition') || lowerText.includes('price')) {
      intent = IntentType.FEE;
    }
    // Check for navigation related keywords
    else if (
      lowerText.includes('where') || 
      lowerText.includes('go to') || 
      lowerText.includes('direction') || 
      lowerText.includes('route') ||
      lowerText.includes('find')
    ) {
      intent = IntentType.NAVIGATE;
    }

    // Artificial delay to simulate "AI" thinking
    setTimeout(() => {
      setIsProcessing(false);
      setIsOpen(false);
      setQuery('');

      if (intent === IntentType.FEE) {
        toast.success("Opening Course Fees...");
        navigate('/fees');
        // Advanced: Could parse course name from query here and pass as state
      } else if (intent === IntentType.NAVIGATE) {
        toast.success("Opening Directions...");
        // Extract potential location
        const locationKeyword = text.replace(/go to|where is|find|direction to|directions for/gi, '').trim();
        navigate('/directions', { state: { initialQuery: locationKeyword } });
      } else {
        toast('I didn\'t quite catch that. Try asking for "Directions" or "Fees".', {
          icon: '🤖',
          duration: 4000
        });
      }
    }, 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) processQuery(query);
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-8 right-8 p-4 rounded-full shadow-2xl transition-all duration-300 z-50 flex items-center gap-2 ${
          isOpen ? 'scale-0 opacity-0' : 'bg-blue-600 text-white hover:bg-blue-700 scale-100 opacity-100'
        }`}
      >
        <Bot size={32} />
        <span className="font-semibold pr-2">May I help you?</span>
      </button>

      {/* Modal/Popup */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end justify-end sm:items-center sm:justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-6 flex justify-between items-center text-white">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-full">
                  <Bot size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Virtual Assistant</h3>
                  <p className="text-blue-100 text-sm">Ask about fees or directions</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-2 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              <div className="mb-6 space-y-2">
                <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">Try asking</p>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => processQuery("What is the fee for CSE?")} className="px-4 py-2 bg-slate-100 hover:bg-blue-50 text-slate-700 rounded-lg text-sm transition-colors text-left">
                    "What is the fee for CSE?"
                  </button>
                  <button onClick={() => processQuery("Directions to Library")} className="px-4 py-2 bg-slate-100 hover:bg-blue-50 text-slate-700 rounded-lg text-sm transition-colors text-left">
                    "Directions to Library"
                  </button>
                  <button onClick={() => processQuery("Where is the Canteen?")} className="px-4 py-2 bg-slate-100 hover:bg-blue-50 text-slate-700 rounded-lg text-sm transition-colors text-left">
                    "Where is the Canteen?"
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={isListening ? "Listening..." : "Type or speak your request..."}
                  className={`w-full pl-4 pr-24 py-4 bg-slate-50 border-2 rounded-xl focus:outline-none text-lg transition-colors ${
                    isListening ? 'border-blue-500 bg-blue-50' : 'border-slate-200 focus:border-blue-500'
                  }`}
                />
                <div className="absolute right-2 top-2 bottom-2 flex gap-1">
                  <button
                    type="button"
                    onClick={handleVoiceInput}
                    className={`p-3 rounded-lg transition-colors ${
                      isListening ? 'bg-red-100 text-red-600 animate-pulse' : 'hover:bg-slate-200 text-slate-500'
                    }`}
                  >
                    <Mic size={24} />
                  </button>
                  <button
                    type="submit"
                    disabled={!query.trim() || isProcessing}
                    className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? <Loader2 size={24} className="animate-spin" /> : <Send size={24} />}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Assistant;
