'use client';

import React from 'react';

export default function TypingIndicator() {
  return (
    <div className="flex gap-3 animate-fadeSlide">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-700 flex items-center justify-center text-sm flex-shrink-0">
        🌆
      </div>
      <div className="bg-zinc-800/80 border border-white/8 rounded-xl px-4 py-3">
        <div className="flex gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}
