
import React, { useState, useEffect, useRef } from 'react';
import { Mic, X, Send, Bot, Sparkles, User, RefreshCw, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { sendMessageToGemini, sendToolResponseToGemini, startNewChat } from '../services/agentService';
import { ChatMessage } from '../types';
import VoiceSearchModal from './VoiceSearchModal';
import { useLanguage } from '../contexts/LanguageContext';


interface AssistantProps {
  mode?: 'modal' | 'embedded';
  onClose?: () => void;
  startVoiceOnMount?: boolean;
  defaultOpen?: boolean;
  showFab?: boolean;
}

const Assistant: React.FC<AssistantProps> = ({ 
  mode = 'modal', 
  onClose, 
  startVoiceOnMount = false,
  defaultOpen = false,
  showFab = true
}) => {
  const navigate = useNavigate();
  const { t, language, speak } = useLanguage();
  const [isOpen, setIsOpen] = useState(defaultOpen || mode === 'embedded'); // Default open if embedded or requested
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [inputValue, setInputValue] = useState('');
  
  // Conversation State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  // Listen for custom event to open assistant (only in modal mode or if we want to trigger it externally)
  useEffect(() => {
    if (mode === 'embedded') return; // Don't listen to global events if embedded (parent controls it)

    const handleOpenAssistant = () => setIsOpen(true);
    const handleOpenAssistantVoice = () => {
        setIsOpen(true);
        setShowVoiceModal(true);
    };

    window.addEventListener('OPEN_ASSISTANT', handleOpenAssistant);
    window.addEventListener('OPEN_ASSISTANT_VOICE', handleOpenAssistantVoice);
    
    return () => {
        window.removeEventListener('OPEN_ASSISTANT', handleOpenAssistant);
        window.removeEventListener('OPEN_ASSISTANT_VOICE', handleOpenAssistantVoice);
    };
  }, [mode]);

  // Handle startVoiceOnMount
  useEffect(() => {
    if (startVoiceOnMount) {
        // Ensure it's open if we're starting voice
        setIsOpen(true);
        setShowVoiceModal(true);
    }
  }, [startVoiceOnMount]);

  // Initialize greeting on mount or language change
  useEffect(() => {
    // If messages are empty, initialize
    if (messages.length === 0) {
        startNewChat(language); // Start a new GenAI session with current language
        setMessages([
        { 
            id: '1', 
            sender: 'assistant', 
            text: t.assist_welcome, 
            timestamp: Date.now() 
        }
        ]);
    } else {
        // If messages exist, update the welcome message (id '1') to new language
        setMessages(prev => prev.map(msg => 
            msg.id === '1' ? { ...msg, text: t.assist_welcome } : msg
        ));
        // Also update the chat session language context if it changed
        startNewChat(language);
    }
  }, [t.assist_welcome, messages.length, language]);

  // Speak welcome when opened
  useEffect(() => {
      if (isOpen) {
          speak(t.assist_welcome);
      }
  }, [isOpen]); // Removed mode dependency to allow speaking in both modes when opened

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

  // Determine Language Code for Speech API
  const getLangCode = () => {
    switch (language) {
      case 'te': return 'te-IN';
      case 'hi': return 'hi-IN';
      default: return 'en-US';
    }
  };

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

    try {
        // 2. Call Gemini
        const response = await sendMessageToGemini(text, language);
        
        setIsTyping(false);

        // 3. Add Bot Message (if text exists or if there are tool calls)
        let botText = response.text;
        if (!botText && response.toolCalls && response.toolCalls.length > 0) {
            const toolName = response.toolCalls[0].name;
            if (toolName === 'navigate') {
                botText = language === 'te' ? "నావిగేట్ చేస్తున్నాను..." : (language === 'hi' ? "नेविगेट कर रहा हूँ..." : "Navigating...");
            } else if (toolName === 'showFees') {
                botText = language === 'te' ? "ఫీజు వివరాలు చూపిస్తున్నాను..." : (language === 'hi' ? "शुल्क विवरण दिखा रहा हूँ..." : "Showing fee details...");
            }
        }

        if (botText) {
            const botMsg: ChatMessage = {
            id: (Date.now() + 1).toString(),
            sender: 'assistant',
            text: botText,
            timestamp: Date.now(),
            };
            setMessages(prev => [...prev, botMsg]);
            speak(botText);
        }

        // 4. Handle Tool Calls
        if (response.toolCalls && response.toolCalls.length > 0) {
            for (const tool of response.toolCalls) {
                if (tool.name === 'navigate') {
                    const locationName = tool.args.locationName;
                    
                    setTimeout(() => {
                        if (mode === 'modal') setIsOpen(false);
                        if (onClose) onClose();
                        navigate('/directions', { state: { initialQuery: locationName } });
                    }, 1500); // Allow user to read message first

                    // Send response back to Gemini
                    await sendToolResponseToGemini('navigate', { success: true, message: `Navigating to ${locationName}` });
                } else if (tool.name === 'showFees') {
                    const { course, branch } = tool.args;
                    
                    setTimeout(() => {
                        if (mode === 'modal') setIsOpen(false);
                        if (onClose) onClose();
                        navigate('/fees', { state: { initialCourse: course, initialBranch: branch } });
                    }, 1500);
                    
                    await sendToolResponseToGemini('showFees', { success: true, message: `Showing fees for ${course} ${branch}` });
                }
            }
        }
    } catch (error) {
        console.error("Error in chat:", error);
        setIsTyping(false);
        const errorMsg: ChatMessage = {
            id: Date.now().toString(),
            sender: 'assistant',
            text: language === 'te' ? "క్షమించండి, లోపం సంభవించింది." : (language === 'hi' ? "क्षमा करें, कोई त्रुटि हुई।" : "Sorry, I encountered an error."),
            timestamp: Date.now()
        };
        setMessages(prev => [...prev, errorMsg]);
        speak(errorMsg.text);
    }
  };

  const handleReset = () => {
    startNewChat(language);
    setMessages([{ 
        id: Date.now().toString(), 
        sender: 'assistant', 
        text: t.assist_welcome, 
        timestamp: Date.now() 
    }]);
  };

  const handleClose = () => {
      if (mode === 'modal') setIsOpen(false);
      if (onClose) onClose();
  };

  // Render Content (The actual chat interface)
  const renderContent = () => (
    <div 
        onClick={(e) => e.stopPropagation()} // Prevent close on inside click
        className={`bg-white flex flex-col relative animate-in zoom-in-95 fade-in duration-300 overflow-hidden ${
            mode === 'modal' 
                ? 'w-full max-w-4xl h-[80vh] rounded-3xl shadow-2xl border border-white/20' 
                : 'w-full h-full rounded-3xl shadow-sm border border-slate-200'
        }`}
    >
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 flex items-center justify-between shrink-0 shadow-md z-10">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white border border-white/30">
                    <Sparkles size={24} />
                </div>
                <div>
                    <h3 className="font-bold text-white text-2xl leading-tight">Campus Assistant</h3>
                    <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse"></span>
                        <p className="text-blue-100 text-sm font-medium">Online</p>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <button 
                    onClick={handleReset}
                    className="p-3 rounded-full text-white/80 hover:bg-white/10 hover:text-white transition-colors"
                    title="Reset Chat"
                >
                    <RefreshCw size={24} />
                </button>
                <button 
                    onClick={handleClose}
                    className="p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                >
                    <ChevronDown size={28} />
                </button>
            </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50 scroll-smooth">
            <div className="text-center py-4">
                <span className="text-sm font-medium text-slate-400 uppercase tracking-widest">Today</span>
            </div>
            
            {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                    <div className={`flex max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'} gap-4 items-end`}>
                        
                        {/* Avatar */}
                        <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-bold shadow-sm ${
                            msg.sender === 'user' ? 'bg-indigo-100 text-indigo-700' : 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
                        }`}>
                            {msg.sender === 'user' ? <User size={18} /> : <Bot size={20} />}
                        </div>
                        
                        {/* Content Container */}
                        <div className={`flex flex-col gap-2 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                            {/* Bubble */}
                            <div className={`px-6 py-4 rounded-3xl text-lg leading-relaxed shadow-sm ${
                                msg.sender === 'user' 
                                    ? 'bg-white text-slate-800 rounded-br-none border border-slate-100' 
                                    : 'bg-blue-600 text-white rounded-bl-none'
                            }`}>
                                {msg.text}
                            </div>

                            {/* Options Chips */}
                            {msg.options && msg.options.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-1 animate-in fade-in slide-in-from-top-2 duration-300">
                                    {msg.options.map((opt, idx) => (
                                        <button 
                                            key={idx}
                                            onClick={() => handleSubmit(undefined, opt)}
                                            className="px-4 py-2 bg-white border border-blue-200 text-blue-600 rounded-full text-sm font-medium hover:bg-blue-50 transition-colors shadow-sm"
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
                <div className="flex justify-start animate-in fade-in duration-300">
                    <div className="flex max-w-[80%] gap-4 items-end">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center shadow-sm">
                            <Bot size={20} />
                        </div>
                        <div className="px-6 py-4 bg-white border border-slate-100 rounded-3xl rounded-bl-none shadow-sm flex items-center gap-1.5">
                            <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                            <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                            <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                        </div>
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 bg-white border-t border-slate-100 shrink-0">
            {/* Suggestion Chips (Context Aware) */}
            {messages.length < 3 && !isTyping && (
                <div className="flex gap-3 mb-4 overflow-x-auto pb-1 no-scrollbar">
                    <button onClick={() => handleSubmit(undefined, t.assist_chip_nav)} className="whitespace-nowrap px-5 py-2.5 bg-slate-100 hover:bg-blue-50 text-slate-600 text-sm font-medium rounded-full border border-slate-200 transition-colors">
                        {t.assist_chip_nav}
                    </button>
                    <button onClick={() => handleSubmit(undefined, t.assist_chip_fees)} className="whitespace-nowrap px-5 py-2.5 bg-slate-100 hover:bg-blue-50 text-slate-600 text-sm font-medium rounded-full border border-slate-200 transition-colors">
                        {t.assist_chip_fees}
                    </button>
                </div>
            )}

            <form 
                onSubmit={(e) => handleSubmit(e)}
                className="relative flex items-center gap-3"
            >
                <div className="relative flex-1 group">
                    <input
                        ref={inputRef}
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder={t.assist_placeholder}
                        className="w-full pl-6 pr-12 py-5 bg-slate-100 border-transparent focus:bg-white border focus:border-blue-500 rounded-full focus:outline-none transition-all text-slate-800 placeholder:text-slate-400 shadow-inner text-lg"
                        disabled={isTyping}
                    />
                    <button
                        type="button"
                        onClick={() => setShowVoiceModal(true)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full transition-all duration-300 text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                    >
                        <Mic size={24} />
                    </button>
                </div>
                <button
                    type="submit"
                    disabled={!inputValue.trim() || isTyping}
                    className="p-5 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-all shadow-md active:scale-95 flex items-center justify-center w-16 h-16"
                >
                    <Send size={24} className={isTyping ? 'opacity-0' : 'opacity-100'} />
                </button>
            </form>
        </div>

    </div>
  );

  return (
    <>
      <VoiceSearchModal 
        isOpen={showVoiceModal} 
        onClose={() => setShowVoiceModal(false)} 
        onResult={handleVoiceResult}
        langCode={getLangCode()}
      />

      {mode === 'modal' && (
        <>
            {/* Floating Action Button */}
            {showFab && (
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
            )}

            {/* Chat Window Modal */}
            {isOpen && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-all duration-300 p-4"
                    onClick={() => setIsOpen(false)} // Close on outside click
                >
                    {renderContent()}
                </div>
            )}
        </>
      )}

      {mode === 'embedded' && (
          <div className="w-full h-full flex flex-col">
              {renderContent()}
          </div>
      )}
    </>
  );
};

export default Assistant;
