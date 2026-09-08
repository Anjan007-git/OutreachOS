import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  X,
  Send,
  RefreshCw,
  Copy,
  Check,
  ArrowRight,
  MessageSquare,
  Bot,
  User as UserIcon,
} from 'lucide-react';
import { api } from '../lib/api';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface AiAssistantDrawerProps {
  onNavigateToComposeWithDraft?: (draft: { subject?: string; body?: string }) => void;
}

const QUICK_PROMPTS = [
  'Draft a high-converting cold email for a Senior Cloud Engineer role.',
  'What are 3 compelling subject lines for outreach to tech recruiters?',
  'Review my current campaign volume and deliverability best practices.',
  'How should I structure a follow-up email 4 days after initial contact?',
];

export const AiAssistantDrawer: React.FC<AiAssistantDrawerProps> = ({
  onNavigateToComposeWithDraft,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        'Hello Anjan! I am your executive OutreachOS AI Assistant. I can help you draft high-impact outreach emails, analyze campaign performance, craft punchy subject lines, and optimize your Gmail dispatch strategy. How can I assist your outreach today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputValue('');
    setIsLoading(true);

    try {
      const historyPayload = newMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await api.aiChat(text, historyPayload);
      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: res.reply || 'I am ready to help with your outreach. Please let me know what you need.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `assistant-err-${Date.now()}`,
        role: 'assistant',
        content: `I encountered an issue connecting to Gemini: ${err.message || 'Please check your connection and try again.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          id="btn-open-ai-assistant"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center space-x-2.5 px-4 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white rounded-full shadow-lg hover:shadow-indigo-500/25 transition-all duration-200 cursor-pointer border border-indigo-400/30 group"
          title="Open AI Outreach Assistant"
        >
          <div className="relative">
            <Sparkles className="w-5 h-5 text-indigo-100 group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-indigo-700 animate-pulse" />
          </div>
          <span className="text-xs font-bold tracking-tight">AI Outreach Assistant</span>
        </button>
      )}

      {/* Slide-out Drawer Panel */}
      {isOpen && (
        <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[440px] bg-white shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-200">
          {/* Drawer Header */}
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-900 to-indigo-950 text-white">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-indigo-300" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center space-x-1.5">
                  <span>OutreachOS Assistant</span>
                  <span className="px-1.5 py-0.5 bg-indigo-500/30 border border-indigo-400/30 text-[9px] font-mono rounded text-indigo-200 uppercase">
                    Gemini 3.5
                  </span>
                </h3>
                <p className="text-[11px] text-slate-300">Live Cold Outreach & Strategy Co-Pilot</p>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <button
                type="button"
                onClick={() =>
                  setMessages([
                    {
                      id: 'welcome',
                      role: 'assistant',
                      content: 'Chat cleared. How can I help you optimize your outreach campaigns today?',
                      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    },
                  ])
                }
                title="Reset Conversation"
                className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                title="Close Drawer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Prompts Bar */}
          <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 overflow-x-auto scrollbar-none flex items-center space-x-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider shrink-0">
              Suggestions:
            </span>
            {QUICK_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                disabled={isLoading}
                onClick={() => handleSendMessage(prompt)}
                className="shrink-0 px-2.5 py-1 rounded-lg bg-white hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 border border-slate-200 text-[11px] font-medium text-slate-700 transition-colors cursor-pointer"
              >
                {prompt.length > 36 ? prompt.slice(0, 36) + '...' : prompt}
              </button>
            ))}
          </div>

          {/* Chat Messages List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/50">
            {messages.map((m) => {
              const isAssistant = m.role === 'assistant';
              return (
                <div
                  key={m.id}
                  className={`flex items-start space-x-2.5 ${isAssistant ? 'justify-start' : 'justify-end'}`}
                >
                  {isAssistant && (
                    <div className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 mt-1">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 text-xs font-sans leading-relaxed shadow-xs ${
                      isAssistant
                        ? 'bg-white border border-slate-200 text-slate-800'
                        : 'bg-indigo-600 text-white ml-auto'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{m.content}</div>

                    <div
                      className={`flex items-center justify-between mt-2 pt-1 text-[10px] ${
                        isAssistant ? 'text-slate-400 border-t border-slate-100' : 'text-indigo-200'
                      }`}
                    >
                      <span>{m.timestamp}</span>

                      {isAssistant && (
                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            onClick={() => handleCopyText(m.id, m.content)}
                            className="flex items-center space-x-1 hover:text-slate-700 cursor-pointer"
                            title="Copy reply text"
                          >
                            {copiedId === m.id ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-600" />
                                <span className="text-emerald-600 font-semibold">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>

                          {onNavigateToComposeWithDraft && m.content.includes('Dear') && (
                            <button
                              type="button"
                              onClick={() => {
                                onNavigateToComposeWithDraft({ body: m.content });
                                setIsOpen(false);
                              }}
                              className="flex items-center space-x-1 text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer"
                            >
                              <span>Use in Compose</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {!isAssistant && (
                    <div className="w-6 h-6 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0 mt-1">
                      <UserIcon className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-center space-x-2.5 text-xs text-indigo-600 font-medium bg-indigo-50/70 p-3 rounded-xl border border-indigo-100">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Gemini is generating executive advice...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Field */}
          <div className="p-4 border-t border-slate-200 bg-white">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center space-x-2"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask advice, draft emails, or analyze strategy..."
                disabled={isLoading}
                className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-slate-50/50 text-slate-800 placeholder:text-slate-400 font-medium"
              />
              <button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className="p-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl shadow-xs transition-colors cursor-pointer shrink-0"
                title="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
