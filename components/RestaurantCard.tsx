'use client';

import React from 'react';
import { RestaurantCard as RestaurantCardType } from '@/lib/types';

interface Props {
  card: RestaurantCardType;
}

export default function RestaurantCard({ card }: Props) {
  const isDineout = card.server === 'dineout';

  return (
    <div className="flex gap-3 animate-fadeSlide">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-700 flex items-center justify-center text-sm flex-shrink-0">
        🌆
      </div>
      <div className="max-w-[86%]">
        <div className="bg-zinc-800/80 border border-white/13 rounded-xl p-4">
          <div className="flex justify-between items-start mb-2">
            <div className="font-semibold text-zinc-100 text-sm">{card.name}</div>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                isDineout
                  ? 'bg-violet-500/20 text-violet-300'
                  : 'bg-orange-500/20 text-orange-300'
              }`}
            >
              {isDineout ? 'DINEOUT' : 'FOOD DELIVERY'}
            </span>
          </div>
          <div className="text-zinc-500 text-xs mb-2">{card.meta}</div>
          <div className={`text-sm font-semibold ${isDineout ? 'text-violet-400' : 'text-orange-400'}`}>
            {card.price}
          </div>
        </div>
      </div>
    </div>
  );
}
