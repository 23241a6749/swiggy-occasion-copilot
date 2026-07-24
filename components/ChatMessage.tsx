'use client';

import React from 'react';
import { Message } from '@/lib/types';

interface Props {
  message: Message;
}

export default function ChatMessage({ message }: Props) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''} animate-fadeSlide`}>
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 mt-0.5 ${
          isUser
            ? 'bg-zinc-800 border border-white/10'
            : 'bg-gradient-to-br from-orange-500 to-red-700'
        }`}
      >
        {isUser ? '👤' : '🌆'}
      </div>
      <div
        className={`max-w-[72%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
          isUser
            ? 'bg-orange-500/12 border border-orange-500/20 rounded-tr-sm text-zinc-100'
            : 'bg-zinc-800/80 border border-white/8 rounded-tl-sm text-zinc-400'
        }`}
      >
        <span dangerouslySetInnerHTML={{ __html: formatContent(message.content) }} />
      </div>
    </div>
  );
}

function formatContent(text: string): string {
  // Bold for **text**
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Line breaks
    .replace(/\n/g, '<br>');
}
