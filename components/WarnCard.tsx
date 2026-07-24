'use client';

import React from 'react';
import { WarnCard as WarnCardType } from '@/lib/types';

interface Props {
  card: WarnCardType;
  onOption: (option: string) => void;
}

export default function WarnCard({ card, onOption }: Props) {
  return (
    <div className="flex gap-3 animate-fadeSlide">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-700 flex items-center justify-center text-sm flex-shrink-0">
        🌆
      </div>
      <div className="max-w-[88%]">
        <div className="bg-amber-500/5 border border-amber-500/25 rounded-xl p-4">
          <div className="text-sm font-medium text-amber-400 mb-2">⚠ {card.title}</div>
          <div className="text-xs text-zinc-400 leading-relaxed mb-3">{card.body}</div>
          <div className="flex flex-wrap gap-2">
            {card.options.map((opt) => (
              <button
                key={opt}
                onClick={() => onOption(opt)}
                className="text-[11px] px-3 py-1.5 rounded-md border border-amber-500/30 text-amber-400 bg-transparent cursor-pointer hover:bg-amber-500/10 transition-colors font-sans"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
