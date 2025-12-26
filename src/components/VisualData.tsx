import React, { useState } from 'react';
import { BarChart3, TrendingUp, Info, ChevronRight } from 'lucide-react';

interface GraphConfig {
  type: 'bar' | 'line';
  title: string;
  labels: string[];
  data: number[];
  unit?: string;
}

export const DataVisualizer: React.FC<{ config: GraphConfig }> = ({ config }) => {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const maxVal = Math.max(...config.data, 1);
  const height = 120;
  const width = 400;
  const padding = 30;

  return (
    <div className="w-full bg-white dark:bg-[#141414] rounded-2xl border border-gray-100 dark:border-white/5 shadow-xl overflow-hidden animate-entrance transition-all hover:shadow-2xl hover:shadow-yellow-500/5">
      <div className="p-5 space-y-4">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#EAB308]" />
              <div className="flex flex-col">
                <h3 className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">{config.title}</h3>
                <span className="text-[8px] font-bold text-gray-300">DATA SOURCE: PDF CONTEXT</span>
              </div>
            </div>
            <div className="flex items-center gap-1 px-2 py-0.5 bg-yellow-50 dark:bg-yellow-900/10 rounded border border-yellow-100 dark:border-yellow-900/20">
              <TrendingUp className="w-3 h-3 text-[#EAB308]" />
              <span className="text-[8px] font-black text-[#EAB308]">ANALYTIC MODE</span>
            </div>
        </div>

        <div className="relative pt-4">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible cursor-crosshair">
            {config.data.map((val, i) => {
                const availableWidth = width - padding * 2;
                const gap = 14;
                const barWidth = (availableWidth / config.data.length) - gap;
                const barHeight = (val / maxVal) * (height - padding * 2);
                const x = padding + i * (availableWidth / config.data.length) + gap/2;
                const y = height - padding - barHeight;
                const isHovered = hoverIdx === i;

                return (
                  <g key={i} onMouseEnter={() => setHoverIdx(i)} onMouseLeave={() => setHoverIdx(null)} className="transition-all duration-300">
                    <rect
                      x={x}
                      y={y}
                      width={barWidth}
                      height={barHeight}
                      rx="3"
                      className={`transition-all duration-500 ${isHovered ? 'fill-[#EAB308]' : 'fill-[#EAB308]/60'} hover:opacity-100`}
                    >
                      <animate attributeName="height" from="0" to={barHeight} dur="1.2s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1" />
                      <animate attributeName="y" from={height - padding} to={y} dur="1.2s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1" />
                    </rect>
                    
                    <text 
                      x={x + barWidth/2} 
                      y={height - 12} 
                      fontSize="7" 
                      textAnchor="middle" 
                      className={`font-black uppercase tracking-tighter transition-colors ${isHovered ? 'fill-gray-900 dark:fill-white' : 'fill-gray-400'}`}
                    >
                      {config.labels[i].length > 10 ? config.labels[i].slice(0, 10) + '..' : config.labels[i]}
                    </text>

                    {isHovered && (
                      <g className="animate-in fade-in zoom-in duration-200">
                        <rect x={x - 10} y={y - 22} width={barWidth + 20} height={16} rx="4" className="fill-gray-800 dark:fill-white shadow-xl" />
                        <text x={x + barWidth/2} y={y - 10} fontSize="8" textAnchor="middle" fontWeight="bold" className="fill-white dark:fill-gray-900">
                          {val}{config.unit || ''}
                        </text>
                      </g>
                    )}
                  </g>
                );
            })}
          </svg>
        </div>

        <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10 group">
          <Info className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#EAB308] transition-colors" />
          <p className="text-[10px] text-gray-500 font-medium leading-relaxed italic pr-4">Hover for metric specifics. This visualization assists in pattern-recognition for Mains GS papers.</p>
          <ChevronRight className="w-3 h-3 text-gray-300 ml-auto" />
        </div>
      </div>
    </div>
  );
};