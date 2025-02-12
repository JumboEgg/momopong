import TempTimeFormatter from '@/utils/format/timeFormatter';
import React from 'react';

export interface DonutChartProps {
  singleTime: number;
  multiTime: number;
}

function DonutChart({ singleTime = 60, multiTime = 40 }: DonutChartProps) {
  const total = singleTime + multiTime;
  const radius = 60;
  const strokeWidth = 10;
  const centerX = radius + strokeWidth;
  const centerY = radius + strokeWidth;
  const innerRadius = radius - strokeWidth / 2;

  // Calculate SVG arc paths
  const getArcPath = (startAngle: number, endAngle: number) => {
    const x1 = centerX + innerRadius * Math.cos(startAngle);
    const y1 = centerY + innerRadius * Math.sin(startAngle);
    const x2 = centerX + innerRadius * Math.cos(endAngle);
    const y2 = centerY + innerRadius * Math.sin(endAngle);

    const largeArcFlag = endAngle - startAngle <= Math.PI ? '0' : '1';

    return `M ${x1} ${y1} A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 1 ${x2} ${y2}`;
  };

  const startAngle1 = -Math.PI / 2;
  const endAngle1 = startAngle1 + ((2 * Math.PI * singleTime) / total);
  const endAngle2 = startAngle1 + (2 * Math.PI);

  return (
    <div className="flex items-center">
      <div className="relative">
        <svg width={2 * (radius + strokeWidth)} height={2 * (radius + strokeWidth)}>
          {/* First segment */}
          <path
            d={getArcPath(startAngle1, endAngle1)}
            fill="none"
            stroke="#87CEEB"
            strokeWidth={strokeWidth}
          />
          {/* Second segment */}
          <path
            d={getArcPath(endAngle1, endAngle2)}
            fill="none"
            stroke="#FFB6C1"
            strokeWidth={strokeWidth}
          />
          {/* Center white circle */}
          <circle
            cx={centerX}
            cy={centerY}
            r={radius - strokeWidth}
            fill="white"
          />
          {/* Total value text */}
          <text
            x={centerX}
            y={centerY}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-xl font-bold"
          >
            {TempTimeFormatter(total)}
          </text>
        </svg>
      </div>
    </div>
  );
}

export default DonutChart;
