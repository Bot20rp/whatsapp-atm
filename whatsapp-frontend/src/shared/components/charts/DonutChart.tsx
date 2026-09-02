import React from 'react';

interface Segment {
  label: string;
  porcentaje: number;
  color: string;
}

interface DonutChartProps {
  segments: Segment[];
  size?: number;
  centerText?: string;
  centerSubtext?: string;
}

export const DonutChart: React.FC<DonutChartProps> = ({
  segments,
  size = 140,
  centerText,
  centerSubtext,
}) => {
  const strokeWidth = 16;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#E2E8F0"
            strokeWidth={strokeWidth}
            fill="none"
          />
          {segments.map((seg, idx) => {
            const strokeDasharray = `${(seg.porcentaje / 100) * circumference} ${circumference}`;
            const strokeDashoffset = -((accumulatedPercent / 100) * circumference);
            accumulatedPercent += seg.porcentaje;

            return (
              <circle
                key={idx}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={seg.color}
                strokeWidth={strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                fill="none"
              />
            );
          })}
        </svg>

        {(centerText || centerSubtext) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            {centerText && <span className="text-base font-bold text-slate-800">{centerText}</span>}
            {centerSubtext && (
              <span className="text-[10px] text-slate-500 uppercase tracking-wider">
                {centerSubtext}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-wrap justify-center gap-3 mt-3">
        {segments.map((s, idx) => (
          <div key={idx} className="flex items-center gap-1.5 text-xs text-slate-600">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
            <span>
              {s.label} ({s.porcentaje}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

