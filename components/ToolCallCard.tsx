'use client';

import React from 'react';
import { ToolCall } from '@/lib/types';

interface Props {
  tool: ToolCall;
}

export default function ToolCallCard({ tool }: Props) {
  const isDineout = tool.server === 'dineout';
  const isError = tool.status === 'error';

  const borderColor = isDineout
    ? 'border-violet-500/30 bg-violet-500/5'
    : isError
    ? 'border-amber-500/30 bg-amber-500/5'
    : 'border-orange-500/30 bg-orange-500/5';

  const nameColor = isDineout ? 'text-violet-400' : isError ? 'text-amber-400' : 'text-orange-400';
  const resultColor = isError ? 'text-amber-400' : 'text-emerald-400';
  const serverLabel = isDineout ? 'DINEOUT MCP' : 'FOOD MCP';
  const serverBg = isDineout ? 'bg-violet-500/20 text-violet-300' : 'bg-orange-500/20 text-orange-300';

  const argsStr =
    Object.keys(tool.args).length > 0
      ? JSON.stringify(tool.args, null, 0)
      : '{}';

  return (
    <div className={`flex gap-3 animate-fadeSlide`}>
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-700 flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
        🌆
      </div>
      <div className={`border ${borderColor} rounded-lg px-3 py-2 font-mono text-xs max-w-[85%]`}>
        <div className="flex items-center gap-2 flex-wrap">
          <span className={nameColor}>{tool.name}</span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${serverBg}`}>
            {serverLabel}
          </span>
          {tool.status === 'pending' && (
            <span className="text-zinc-500 animate-pulse">calling...</span>
          )}
        </div>
        <div className="text-zinc-500 mt-1 whitespace-pre-wrap break-all">{argsStr}</div>
        {tool.result && (
          <div className={`${resultColor} mt-1 text-[10px]`}>{tool.result}</div>
        )}
      </div>
    </div>
  );
}
