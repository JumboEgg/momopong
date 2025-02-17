import TempTimeFormatter from '@/utils/format/timeFormatter';

export interface DonutChartProps {
  singleTime: number;
  multiTime: number;
}

function DonutChart({ singleTime, multiTime }: DonutChartProps) {
  // 음수 처리
  const single = singleTime < 0 ? 0 : singleTime;
  const multi = multiTime < 0 ? 0 : multiTime;

  const total = single + multi;

  const radius = 60;
  const strokeWidth = 10;
  const centerX = radius + strokeWidth;
  const centerY = radius + strokeWidth;
  const innerRadius = radius - strokeWidth / 2;

  // total이 0일 경우 기본값 설정
  if (total === 0) {
    return (
      <div className="flex items-center">
        <div className="relative">
          <svg width={2 * (radius + strokeWidth)} height={2 * (radius + strokeWidth)}>
            {/* First segment */}
            <path
              fill="none"
              stroke="gray"
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
              className="text-lg font-bold"
            >
              {TempTimeFormatter(total)}
            </text>
          </svg>
        </div>
      </div>
    );
  }

  // Calculate SVG arc paths
  const getArcPath = (startAngle: number, endAngle: number) => {
    const x1 = centerX + innerRadius * Math.cos(startAngle);
    const y1 = centerY + innerRadius * Math.sin(startAngle);
    const x2 = centerX + innerRadius * Math.cos(endAngle);
    const y2 = centerY + innerRadius * Math.sin(endAngle);

    const largeArcFlag = endAngle - startAngle <= Math.PI ? '0' : '1';

    return `M ${x1} ${y1} A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 1 ${x2} ${y2}`;
  };

  // Start at -90 degrees (top of the circle)
  const startAngle1 = -Math.PI / 2;

  // End angle for the first segment (based on the ratio of singleTime)
  const endAngle1 = startAngle1 + ((2 * Math.PI * single) / total);

  // End angle for the second segment, which is 360 degrees (2 * Math.PI)
  const endAngle2 = startAngle1 + (2 * Math.PI);

  return (
    <div className="flex items-center">
      <div className="relative">
        <svg width={2 * (radius + strokeWidth)} height={2 * (radius + strokeWidth)}>
          {/* First segment */}
          {
            multi > 0
            ? (
              <path
                d={getArcPath(startAngle1, endAngle1)}
                fill="none"
                stroke="#87CEEB"
                strokeWidth={strokeWidth}
              />
            ) : (
              <circle
                r={radius}
                cx={centerX}
                cy={centerY}
                style={{ fill: '#87CEEB' }}
              />
            )
          }

          {/* Second segment */}
          {
            single > 0
            ? (
              <path
                d={getArcPath(endAngle1, endAngle2)}
                fill="none"
                stroke="#FFB6C1"
                strokeWidth={strokeWidth}
              />
            ) : (
              <circle
                r={radius}
                cx={centerX}
                cy={centerY}
                style={{ fill: '#FFB6C1' }}
              />
            )
          }
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
            className="text-lg font-bold"
          >
            {TempTimeFormatter(total)}
          </text>
        </svg>
      </div>
    </div>
  );
}

export default DonutChart;
