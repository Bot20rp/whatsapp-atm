import React from 'react';

interface BarChartProps {
  data: { label: string; valor: number }[];
  height?: number;
  barColor?: string;
  title?: string;
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  height = 180,
  barColor = '#008069',
  title,
}) => {
  if (!data || data.length === 0) return null;

  const maxVal = Math.max(...data.map((d) => d.valor), 1);
  const chartHeight = height - 40;

  return (
    <div className="w-full">
      {title && <div className="text-xs font-semibold text-slate-700 mb-3">{title}</div>}
      <div className="flex items-end gap-2 sm:gap-4 w-full pt-4" style={{ height: `${height}px` }}>
        {data.map((item, idx) => {
          const barH = Math.round((item.valor / maxVal) * chartHeight);
          return (
            <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
              <div className="text-[10px] text-slate-500 mb-1 opacity-0 group-hover:opacity-100 transition-opacity font-mono">
                {item.valor}
              </div>
              <div
                className="w-full rounded-t transition-all duration-300 group-hover:brightness-90"
                style={{
                  height: `${Math.max(barH, 4)}px`,
                  backgroundColor: barColor,
                }}
              />
              <div className="text-[11px] text-slate-500 mt-2 font-medium truncate w-full text-center">
                {item.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

