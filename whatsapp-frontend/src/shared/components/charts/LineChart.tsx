import React from 'react';

interface LineChartProps {
  data: { label: string; valor: number }[];
  height?: number;
  lineColor?: string;
  fillColor?: string;
  title?: string;
}

export const LineChart: React.FC<LineChartProps> = ({
  data,
  height = 180,
  lineColor = '#2563EB',
  fillColor = '#DBEAFE',
  title,
}) => {
  if (!data || data.length === 0) return null;

  const width = 500;
  const paddingY = 20;
  const paddingX = 20;
  const chartHeight = height - paddingY * 2;
  const chartWidth = width - paddingX * 2;

  const maxVal = Math.max(...data.map((d) => d.valor), 1);
  const minVal = 0;

  const points = data.map((d, i) => {
    const x = paddingX + (i / (data.length - 1)) * chartWidth;
    const y = height - paddingY - ((d.valor - minVal) / (maxVal - minVal)) * chartHeight;
    return { x, y, valor: d.valor, label: d.label };
  });

  const pathD = points.reduce(
    (acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`,
    ''
  );

  const areaD = `${pathD} L ${points[points.length - 1].x},${height - paddingY} L ${points[0].x},${height - paddingY} Z`;

  return (
    <div className="w-full">
      {title && <div className="text-xs font-semibold text-slate-700 mb-2">{title}</div>}
      <div className="w-full overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
          {/* Subtle grid lines */}
          <line
            x1={paddingX}
            y1={paddingY}
            x2={width - paddingX}
            y2={paddingY}
            stroke="#E2E8F0"
            strokeDasharray="3 3"
          />
          <line
            x1={paddingX}
            y1={height / 2}
            x2={width - paddingX}
            y2={height / 2}
            stroke="#E2E8F0"
            strokeDasharray="3 3"
          />
          <line
            x1={paddingX}
            y1={height - paddingY}
            x2={width - paddingX}
            y2={height - paddingY}
            stroke="#CBD5E1"
          />

          {/* Area fill */}
          <path d={areaD} fill={fillColor} opacity={0.35} />

          {/* Stroke line */}
          <path
            d={pathD}
            fill="none"
            stroke={lineColor}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Points */}
          {points.map((p, i) => (
            <g key={i}>
              <circle
                cx={p.x}
                cy={p.y}
                r="3.5"
                fill="#ffffff"
                stroke={lineColor}
                strokeWidth="2"
              />
              <text
                x={p.x}
                y={height - 4}
                textAnchor="middle"
                fontSize="10"
                fill="#64748B"
                fontWeight="500"
              >
                {p.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
};

