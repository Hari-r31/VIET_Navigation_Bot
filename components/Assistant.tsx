
import React, { useState, useEffect, useRef } from 'react';
import { Mic, X, Send, Bot, Sparkles, User, RefreshCw, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { processUserMessage } from '../services/agentService';
import { ChatMessage, AgentContext } from '../types';
import VoiceSearchModal from './VoiceSearchModal';

const Assistant: React.FC = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [inputValue, setInputValue] = useState('');
  
  // Conversation State
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      id: '1', 
      sender: 'assistant', 
      text: "Welcome to VIET! 🎓 I am your AI Campus Assistant. I can guide you to any location or provide fee details. How may I help you?", 
      timestamp: Date.now() 
    }
  ]);
  const [agentContext, setAgentContext] = useState<AgentContext>({});
  const [isTyping, setIsTyping] = useState(false);

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Handle Voice Result from Modal
  const handleVoiceResult = (text: string) => {
    setInputValue(text);
    handleSubmit(undefined, text);
  };

  // Handle Submit
  const handleSubmit = async (e?: React.FormEvent, overrideText?: string) => {
    e?.preventDefault();
    const text = overrideText || inputValue;
    if (!text.trim()) return;

    // 1. Add User Message
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: text,
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // 2. Simulate AI Delay (600ms - 1200ms)
    const delay = Math.floor(Math.random() * 600) + 600;
    
    setTimeout(() => {
       // 3. Process via Agent Service
       const response = processUserMessage(text, agentContext);
       
       setIsTyping(false);
       setAgentContext(response.updatedContext);

       const botMsg: ChatMessage = {
         id: (Date.now() + 1).toString(),
         sender: 'assistant',
         text: response.message,
         timestamp: Date.now()
       };
       setMessages(prev => [...prev, botMsg]);

       // 4. Perform Action if any
       if (response.action.type === 'NAVIGATE') {
         setTimeout(() => {
            setIsOpen(false);
            navigate('/directions', { state: response.action.payload });
         }, 1500); // Allow user to read message first
       } else if (response.action.type === 'SHOW_FEES') {
         setTimeout(() => {
            setIsOpen(false);
            navigate('/fees', { state: response.action.payload });
         }, 1500);
       }

    }, delay);
  };

  const handleReset = () => {
    setMessages([{ 
        id: Date.now().toString(), 
        sender: 'assistant', 
        text: "Conversation cleared. I can help with Navigation or Course Details.", 
        timestamp: Date.now() 
    }]);
    setAgentContext({});
  };

  return (
    <>
      <VoiceSearchModal 
        isOpen={showVoiceModal} 
        onClose={() => setShowVoiceModal(false)} 
        onResult={handleVoiceResult} 
      />

      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-16 h-16 rounded-full shadow-2xl transition-all duration-300 z-50 flex items-center justify-center group ${
          isOpen ? 'scale-0 opacity-0' : 'bg-gradient-to-tr from-blue-600 to-indigo-600 scale-100 opacity-100 hover:scale-110'
        }`}
      >
        <div className="absolute inset-0 bg-white rounded-full opacity-20 animate-ping"></div>
        <Bot size={32} className="text-white relative z-10" />
        <span className="absolute right-full mr-4 bg-white px-3 py-1 rounded-lg shadow-md text-sm font-bold text-slate-700 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            VIET AI Assistant
        </span>
      </button>

      {/* Chat Window Modal */}
      {isOpen && (
        <div 
            className="fixed inset-0 z-50 flex items-end sm:items-end sm:justify-end bg-black/20 backdrop-blur-[2px] transition-all duration-300"
            onClick={() => setIsOpen(false)} // Close on outside click
        >
          <div 
            onClick={(e) => e.stopPropagation()} // Prevent close on inside click
            className="bg-white w-full sm:w-[400px] h-[85vh] sm:h-[600px] rounded-t-3xl sm:rounded-2xl sm:mb-6 sm:mr-6 shadow-2xl overflow-hidden flex flex-col relative animate-in slide-in-from-bottom-10 fade-in duration-300 origin-bottom-right border border-white/20"
          >
            
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 flex items-center justify-between shrink-0 shadow-md z-10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white border border-white/30">
                        <Sparkles size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-white text-lg leading-tight">Campus Assistant</h3>
                        <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                            <p className="text-blue-100 text-xs font-medium">Online</p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={handleReset}
                        className="p-2 rounded-full text-white/80 hover:bg-white/10 hover:text-white transition-colors"
                        title="Reset Chat"
                    >
                        <RefreshCw size={18} />
                    </button>
                    <button 
                        onClick={() => setIsOpen(false)}
                        className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                    >
                        <ChevronDown size={20} />
                    </button>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 scroll-smooth">
                <div className="text-center py-4">
                    <span className="text-xs font-medium text-slate-400 uppercase tracking-widest">Today</span>
                </div>
                
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                        <div className={`flex max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'} gap-2 items-end`}>
                            
                            {/* Avatar */}
                            <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold shadow-sm ${
                                msg.sender === 'user' ? 'bg-indigo-100 text-indigo-700' : 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
                            }`}>
                                {msg.sender === 'user' ? <User size={14} /> : <Bot size={16} />}
                            </div>
                            
                            {/* Bubble */}
                            <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                                msg.sender === 'user' 
                                    ? 'bg-white text-slate-800 rounded-br-none border border-slate-100' 
                                    : 'bg-blue-600 text-white rounded-bl-none'
                            }`}>
                                {msg.text}
                            </div>
                        </div>
                    </div>
                ))}
                
                {/* Typing Indicator */}
                {isTyping && (
                    <div className="flex justify-start animate-in fade-in duration-300">
                        <div className="flex max-w-[85%] gap-2 items-end">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center shadow-sm">
                                <Bot size={16} />
                            </div>
                            <div className="px-4 py-3 bg-white border border-slate-100 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-slate-100 shrink-0">
                {/* Suggestion Chips (Context Aware) */}
                {messages.length < 3 && !isTyping && (
                    <div className="flex gap-2 mb-3 overflow-x-auto pb-1 no-scrollbar">
                        <button onClick={() => handleSubmit(undefined, "I need navigation help")} className="whitespace-nowrap px-3 py-1.5 bg-slate-100 hover:bg-blue-50 text-slate-600 text-xs font-medium rounded-full border border-slate-200 transition-colors">
                            📍 Navigation
                        </button>
                        <button onClick={() => handleSubmit(undefined, "Tell me about course fees")} className="whitespace-nowrap px-3 py-1.5 bg-slate-100 hover:bg-blue-50 text-slate-600 text-xs font-medium rounded-full border border-slate-200 transition-colors">
                            💰 Course Details
                        </button>
                    </div>
                )}

                <form 
                    onSubmit={(e) => handleSubmit(e)}
                    className="relative flex items-center gap-2"
                >
                    <div className="relative flex-1 group">
                        <input
                            ref={inputRef}
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Type your question..."
                            className="w-full pl-4 pr-10 py-3.5 bg-slate-100 border-transparent focus:bg-white border focus:border-blue-500 rounded-2xl focus:outline-none transition-all text-slate-800 placeholder:text-slate-400 shadow-inner"
                            disabled={isTyping}
                        />
                        <button
                            type="button"
                            onClick={() => setShowVoiceModal(true)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-all duration-300 text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                        >
                            <Mic size={20} />
                        </button>
                    </div>
                    <button
                        type="submit"
                        disabled={!inputValue.trim() || isTyping}
                        className="p-3.5 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-all shadow-md active:scale-95 flex items-center justify-center w-12 h-12"
                    >
                        <Send size={20} className={isTyping ? 'opacity-0' : 'opacity-100'} />
                    </button>
                </form>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default Assistant;
