'use client';

import React, { useState } from 'react';
import { ConfirmBox as ConfirmBoxType } from '@/lib/types';

interface Props {
  box: ConfirmBoxType;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmBox({ box, onConfirm, onCancel }: Props) {
  const [confirmed, setConfirmed] = useState(false);

  if (confirmed) {
    return (
      <div className="flex gap-3 animate-fadeSlide">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-700 flex items-center justify-center text-sm flex-shrink-0">
          🌆
        </div>
        <div className="max-w-[92%]">
          <div className="bg-gradient-to-br from-orange-500/10 to-violet-500/8 border border-orange-500/25 rounded-xl p-4">
            <div className="text-sm font-semibold text-zinc-100 mb-3">Booking table first...</div>
            <div className="font-mono text-xs text-zinc-400 leading-7 space-y-1">
              <div>✓ book_table → confirmed <span className="text-violet-400">[DINEOUT MCP]</span></div>
              <div>✓ get_food_cart → re-verified before placement</div>
              <div>✓ place_food_order → cart ready, awaiting your go</div>
              <div className="pt-2 text-zinc-600">Both actions confirmed with independent order IDs.</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3 animate-fadeSlide">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-700 flex items-center justify-center text-sm flex-shrink-0">
        🌆
      </div>
      <div className="max-w-[92%]">
        <div className="bg-gradient-to-br from-orange-500/10 to-violet-500/8 border border-orange-500/25 rounded-xl p-4">
          <div className="text-sm font-semibold text-zinc-100 mb-3">
            Here&apos;s your evening &mdash; confirm each step separately
          </div>

          <div className="flex gap-2 mb-3">
            <div className="text-lg">🍷</div>
            <div className="text-xs text-zinc-400 leading-snug">
              <strong className="text-zinc-200 block">Dineout booking</strong>
              {box.dineoutText}
            </div>
          </div>

          <div className="flex gap-2 mb-3">
            <div className="text-lg">🛵</div>
            <div className="text-xs text-zinc-400 leading-snug">
              <strong className="text-zinc-200 block">Food delivery</strong>
              {box.foodText}
            </div>
          </div>

          <div className="text-[11px] text-zinc-600 font-mono pt-3 border-t border-white/8">
            Two independent actions · partial failure handled · cart re-verified before placement
          </div>

          <div className="flex gap-2 mt-4">
            <button
              onClick={() => { setConfirmed(true); onConfirm(); }}
              className="bg-orange-500 hover:bg-orange-600 text-white border-none rounded-lg px-5 py-2 text-sm font-medium cursor-pointer transition-colors"
            >
              Confirm table first →
            </button>
            <button
              onClick={onCancel}
              className="bg-transparent text-zinc-400 border border-white/13 rounded-lg px-5 py-2 text-sm cursor-pointer hover:text-zinc-200 transition-colors font-sans"
            >
              Change something
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
