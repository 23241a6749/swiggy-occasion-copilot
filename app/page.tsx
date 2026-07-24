'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import ChatMessage from '@/components/ChatMessage';
import ToolCallCard from '@/components/ToolCallCard';
import RestaurantCard from '@/components/RestaurantCard';
import ConfirmBox from '@/components/ConfirmBox';
import TypingIndicator from '@/components/TypingIndicator';
import WarnCard from '@/components/WarnCard';
import { ChatItem } from '@/lib/types';
import { buildScenario, detectScenario } from '@/lib/scenarios';

const QUICK_PROMPTS = [
  'Date night — Italian in Indiranagar, 2 people, 8pm, gelato after',
  'Rooftop for 4 tonight, biryani delivered home around 10',
  'Show me what happens when a slot isn\'t available',
];

export default function HomePage() {
  const [items, setItems] = useState<ChatItem[]>([
    {
      kind: 'message',
      data: {
        id: 'init',
        role: 'assistant',
        content:
          "Hi! Tell me what you're planning tonight — a dinner out, food delivered home, or both. I'll coordinate across Swiggy Food and Dineout, check live availability, and confirm each step separately before acting.",
      },
    },
  ]);

  const [input, setInput] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPrompts, setShowPrompts] = useState(true);
  const [, setConfirmState] = useState<'idle' | 'confirmed' | 'cancelled'>('idle');
  const chatRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  const scrollBottom = useCallback(() => {
    setTimeout(() => {
      if (chatRef.current) {
        chatRef.current.scrollTop = chatRef.current.scrollHeight;
      }
    }, 50);
  }, []);

  useEffect(() => {
    scrollBottom();
  }, [items, scrollBottom]);

  // Play a scenario step by step with delays
  const playScenario = useCallback((scenarioItems: ChatItem[]) => {
    setIsPlaying(true);
    let stepIndex = 0;

    const addItem = (item: ChatItem) => {
      setItems((prev) => [...prev, item]);
    };

    const addTyping = () => {
      setItems((prev) => [...prev, { kind: 'typing', data: null }]);
    };

    const removeTyping = () => {
      setItems((prev) => prev.filter((i) => i.kind !== 'typing'));
    };

    const next = () => {
      if (stepIndex >= scenarioItems.length) {
        setIsPlaying(false);
        return;
      }

      removeTyping();
      const step = scenarioItems[stepIndex++];
      addItem(step);

      if (stepIndex < scenarioItems.length) {
        addTyping();
        const delay = step.kind === 'tool-call' ? 800 : 1200;
        setTimeout(next, delay);
      } else {
        setIsPlaying(false);
      }
    };

    // Start after initial delay
    addTyping();
    setTimeout(next, 900);
  }, []);

  const handleUserMessage = useCallback(
    (text: string) => {
      if (isPlaying) return;
      const trimmed = text.trim();
      if (!trimmed) return;

      // Add user message
      setItems((prev) => [
        ...prev,
        {
          kind: 'message',
          data: { id: Math.random().toString(36).slice(2), role: 'user', content: trimmed },
        },
      ]);

      setShowPrompts(false);
      setConfirmState('idle');

      // Detect and play scenario
      const key = detectScenario(trimmed);
      const scenarioItems = buildScenario(key);
      playScenario(scenarioItems);
    },
    [isPlaying, playScenario]
  );

  const handleQuickPrompt = (text: string) => {
    handleUserMessage(text);
  };

  const handleSend = () => {
    if (!input.trim() || isPlaying) return;
    const text = input;
    setInput('');
    handleUserMessage(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };



  const handleCancel = () => {
    setConfirmState('cancelled');
  };

  const handleWarnOption = (option: string) => {
    handleUserMessage('Book ' + option.toLowerCase());
  };

  const handleConfirmBoxConfirm = () => {
    // Trigger the confirm animation in ConfirmBox via state
    setConfirmState('confirmed');
  };

  return (
    <div className="relative min-h-screen">
      {/* Background glows */}
      <div className="glow-top" />
      <div className="glow-bottom" />

      <div className="relative z-10 max-w-[900px] mx-auto px-6">
        {/* Header */}
        <header className="flex items-center justify-between py-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-base">
              🌆
            </div>
            <div>
              <div className="text-sm font-semibold tracking-tight">Occasion Copilot</div>
              <div className="text-[11px] text-zinc-500 font-mono">swiggy builders club · 2026</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] text-zinc-500 border border-white/7 px-2.5 py-1 rounded-full tracking-wide">
              MCP v1.0
            </span>
            <span className="flex items-center gap-1.5 font-mono text-[11px] text-emerald-400">
              <span className="pulse-dot w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
              prototype demo
            </span>
          </div>
        </header>

        {/* Hero */}
        <div className="text-center pb-10">
          <span className="inline-block font-mono text-[11px] text-orange-400 border border-orange-500/30 px-3 py-1 rounded-full mb-5 tracking-widest">
            SWIGGY MCP · FOOD + DINEOUT
          </span>
          <h1 className="text-4xl font-bold tracking-tight leading-tight mb-4">
            Your evening, planned<br />
            in <span className="text-orange-500">one conversation</span>
          </h1>
          <p className="text-zinc-400 max-w-xl mx-auto leading-relaxed text-sm">
            An AI agent that coordinates dining-out and food delivery across Swiggy&apos;s MCP stack —
            with live availability checks, staged confirmations, and graceful fallbacks.
          </p>
        </div>

        {/* API badges */}
        <div className="flex gap-3 justify-center mb-6 flex-wrap">
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-orange-500/40 text-orange-300 text-xs bg-orange-500/8">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
            Food MCP
          </div>
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/40 text-violet-300 text-xs bg-violet-500/8">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
            Dineout MCP
          </div>
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 text-zinc-400 text-xs">
            14 + 8 tools · OAuth 2.1 PKCE
          </div>
        </div>

        {/* Demo window */}
        <div className="bg-zinc-900/80 border border-white/7 rounded-2xl overflow-hidden mb-12 shadow-2xl shadow-orange-500/5">
          {/* Title bar */}
          <div className="bg-zinc-800/80 border-b border-white/7 px-4 py-3 flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
            <div className="flex-1 text-center font-mono text-[11px] text-zinc-500">
              occasion-copilot — interactive prototype
            </div>
          </div>

          {/* Chat area */}
          <div
            ref={chatRef}
            className="chat-scroll p-5 min-h-[380px] max-h-[520px] overflow-y-auto flex flex-col gap-3"
          >
            {items.map((item, i) => {
              if (item.kind === 'message') {
                return <ChatMessage key={item.data.id} message={item.data} />;
              }
              if (item.kind === 'tool-call') {
                return <ToolCallCard key={item.data.id} tool={item.data} />;
              }
              if (item.kind === 'restaurant-card') {
                return <RestaurantCard key={item.data.id} card={item.data} />;
              }
              if (item.kind === 'typing') {
                return <TypingIndicator key={`typing-${i}`} />;
              }
              if (item.kind === 'confirm-box') {
                return (
                  <ConfirmBox
                    key={item.data.id}
                    box={item.data}
                    onConfirm={handleConfirmBoxConfirm}
                    onCancel={handleCancel}
                  />
                );
              }
              if (item.kind === 'warn-card') {
                return <WarnCard key={item.data.id} card={item.data} onOption={handleWarnOption} />;
              }
              return null;
            })}
          </div>

          {/* Quick prompts */}
          {showPrompts && (
            <div className="px-5 pb-4 flex flex-wrap gap-2">
              {QUICK_PROMPTS.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleQuickPrompt(prompt)}
                  disabled={isPlaying}
                  className="text-xs text-zinc-400 border border-white/7 rounded-lg px-3 py-1.5 cursor-pointer hover:border-orange-500/40 hover:text-orange-400 transition-all disabled:opacity-40 qp"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {/* Input area */}
          <div className="border-t border-white/7 px-5 py-4 flex gap-3">
            <input
              className="chat-input flex-1 bg-zinc-800/80 border border-white/13 rounded-xl px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 transition-colors"
              placeholder="What are you planning tonight?"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isPlaying}
            />
            <button
              onClick={handleSend}
              disabled={isPlaying || !input.trim()}
              className="bg-orange-500 hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed border-none rounded-xl w-10 h-10 flex items-center justify-center cursor-pointer transition-colors flex-shrink-0 send-btn"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M2 21l21-9L2 3v7l15 2-15 2z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Agent Flow section */}
        <div className="mb-14">
          <SectionTitle>Agent flow</SectionTitle>
          <div className="flex items-start gap-0 overflow-x-auto pb-3">
            {[
              { icon: '💬', name: 'Parse intent', tools: ['LLM extracts', 'constraints &', 'occasion type'] },
              { icon: '🔍', name: 'Find table', tools: ['search_restaurants', '_dineout', 'get_slots'], dineout: true },
              { icon: '📋', name: 'Confirm · book', tools: ['book_table', 'get_booking', '_status ✓'], dineout: true },
              { icon: '🛵', name: 'Build cart', tools: ['search_restaurants', 'get_menu', 'update_cart'], food: true },
              { icon: '✅', name: 'Confirm · order', tools: ['get_food_cart', 'place_food_order', 'track_order'], food: true },
            ].map((step, i) => (
              <React.Fragment key={i}>
                <div
                  className={`flex-shrink-0 w-[150px] bg-zinc-900/80 border rounded-xl p-3.5 text-center ${
                    step.dineout
                      ? 'border-violet-500/20'
                      : step.food
                      ? 'border-orange-500/20'
                      : 'border-white/7'
                  }`}
                >
                  <div className="text-xl mb-2">{step.icon}</div>
                  <div className="text-xs font-semibold text-zinc-200 mb-1">{step.name}</div>
                  <div className="font-mono text-[10px] text-zinc-500 leading-5">{step.tools.join('\n')}</div>
                </div>
                {i < 4 && (
                  <div className="flex-shrink-0 w-7 text-center text-white/10 text-base self-center flex-shrink-0">
                    →
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
          <p className="text-[12px] text-zinc-500 font-mono mt-4 leading-relaxed">
            Each server confirmation is independent. Partial success is surfaced explicitly — a failed food
            order never silently cancels a Dineout booking.
          </p>
        </div>

        {/* Edge cases */}
        <div className="mb-14">
          <SectionTitle>Edge case handling</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { tag: 'graceful', tagColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', title: 'Slot unavailable at chosen time', body: 'Agent re-fetches 7-day availability window, surfaces 3 closest alternatives with times. Never dead-ends.' },
              { tag: 'safe retry', tagColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20', title: 'book_table returns 5xx', body: 'Calls get_booking_status before retrying — non-idempotent endpoint, so check-then-retry prevents double bookings.' },
              { tag: 'staged confirm', tagColor: 'bg-violet-500/10 text-violet-400 border-violet-500/20', title: 'Dineout books, food order fails', body: 'Each action confirms separately. Booking stays intact. Agent offers: retry delivery, prepare for later, or skip.' },
              { tag: 'cart safety', tagColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', title: 'User edits cart mid-chat', body: 'get_food_cart called right before every place_food_order — never trusts what was added earlier in the conversation.' },
              { tag: 'auth recovery', tagColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20', title: '401 mid-session on either server', body: 'Re-runs OAuth 2.1 PKCE flow once, updates shared bearer token across both MCP clients, then retries.' },
              { tag: 'coupon safety', tagColor: 'bg-violet-500/10 text-violet-400 border-violet-500/20', title: 'Coupon requires online payment', body: 'v1 is COD-only. fetch_food_coupons filtered at agent layer — requiresOnlinePayment coupons never shown.' },
            ].map((edge, i) => (
              <div key={i} className="bg-zinc-900/80 border border-white/7 rounded-xl p-4">
                <span className={`inline-block text-[10px] font-mono px-2 py-0.5 rounded-full border mb-2 ${edge.tagColor}`}>
                  {edge.tag}
                </span>
                <div className="text-xs font-medium text-zinc-200 mb-1.5">{edge.title}</div>
                <div className="text-[12px] text-zinc-500 leading-relaxed">{edge.body}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tech stack */}
        <div className="mb-14">
          <SectionTitle>Technical implementation</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { layer: 'LLM', name: 'Claude Sonnet', why: 'Multi-tool orchestration, constraint extraction, occasion-type classification' },
              { layer: 'FRAMEWORK', name: 'Next.js 14', why: 'Server-side MCP calls via API routes, streaming responses, Vercel deploy' },
              { layer: 'MCP CLIENT', name: 'Streamable HTTP', why: 'Parallel clients to /food and /dineout — single OAuth 2.1 PKCE token across both' },
              { layer: 'RESILIENCE', name: 'Retry + fallback', why: 'Exponential backoff (500ms→8s), check-then-retry on placement, 30s wall-clock cap' },
              { layer: 'STATE', name: 'Server-authoritative', why: 'No client-side cart caching — always re-fetches before mutations or confirmations' },
              { layer: 'OBSERVABILITY', name: 'Session ID logging', why: 'Every tool call logs session ID for Swiggy-side trace correlation on failures' },
            ].map((tech, i) => (
              <div key={i} className="bg-zinc-900/80 border border-white/7 rounded-xl p-4">
                <div className="text-[10px] font-mono text-zinc-500 mb-1.5 tracking-wide">{tech.layer}</div>
                <div className="text-sm font-semibold text-zinc-200 mb-1">{tech.name}</div>
                <div className="text-[11px] text-zinc-500 leading-relaxed">{tech.why}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Claude Desktop setup guide */}
        <div className="mb-14">
          <SectionTitle>Live demo setup — Claude Desktop</SectionTitle>
          <div className="bg-zinc-900/80 border border-white/7 rounded-xl p-5">
            <p className="text-xs text-zinc-400 mb-4 leading-relaxed">
              Connect Claude Desktop to both Swiggy MCP servers for real live API calls.
              Add this to your Claude Desktop config:
            </p>
            <pre className="bg-zinc-950 border border-white/8 rounded-lg p-4 font-mono text-[11px] text-zinc-300 overflow-x-auto leading-relaxed">
{`{
  "mcpServers": {
    "swiggy-food": {
      "command": "npx",
      "args": ["mcp-remote", "https://mcp.swiggy.com/food"]
    },
    "swiggy-dineout": {
      "command": "npx",
      "args": ["mcp-remote", "https://mcp.swiggy.com/dineout"]
    }
  }
}`}
            </pre>
            <p className="text-[11px] text-zinc-500 mt-4 font-mono leading-relaxed">
              Config file: <span className="text-zinc-400">~/Library/Application Support/Claude/claude_desktop_config.json</span> (macOS)
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {[
                'Search Italian restaurants near Indiranagar, Bengaluru',
                'Show available Dineout slots for tonight, 2 people',
                'Search gelato near my home address',
              ].map((test, i) => (
                <span key={i} className="text-[11px] text-zinc-500 font-mono bg-zinc-950 border border-white/8 px-2 py-1 rounded">
                  → {test}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-white/7 py-8 text-center">
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <span className="font-mono text-[11px] text-zinc-500">Swiggy Builders Club — 2026</span>
            <span className="text-zinc-700">·</span>
            <span className="font-mono text-[11px] text-zinc-500">Food MCP + Dineout MCP</span>
            <span className="text-zinc-700">·</span>
            <span className="font-mono text-[11px] text-zinc-500">Prototype — staging access pending</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[12px] font-mono text-zinc-500 tracking-widest uppercase mb-5 flex items-center gap-3">
      {children}
      <div className="flex-1 h-px bg-white/7" />
    </div>
  );
}
