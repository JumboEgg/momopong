import { useState, useEffect, useRef } from 'react';

type Props = {
  isActive: boolean;
  duration: number;
  onComplete: () => void;
  onTick?: (timeLeft: number) => void;
  onClick?: () => void;
};

const TOTAL_TIME = 20;

function CircularTimer({
  isActive,
  duration = TOTAL_TIME,
  onComplete,
  onTick,
  onClick,
}: Props): JSX.Element {
  const [timeLeft, setTimeLeft] = useState<number>(duration);
  const [offset, setOffset] = useState<number>(0);
  const animationFrameRef = useRef<number>();
  const startTimeRef = useRef<number>();

  const config = {
    viewBox: '0 0 160 160',
    radius: 80,
    strokeWidth: 8,
    fontSize: 'text-4xl sm:text-5xl',
    containerClass: 'w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28',
  };
  const center = 90;

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      let lastTickTime = Date.now();

      const animate = (currentTime: number) => {
        if (!startTimeRef.current) {
          startTimeRef.current = currentTime;
        }

        const elapsed = currentTime - startTimeRef.current;
        const currentSecond = Math.floor(elapsed / 1000);

        // 초 단위로 타이머 업데이트
        if (Date.now() - lastTickTime >= 1000) {
          const newTimeLeft = duration - currentSecond;
          if (newTimeLeft <= 0) {
            setTimeLeft(0);
            setOffset(2 * Math.PI * config.radius);
            if (onComplete) {
              onComplete();
            }
            return;
          }

          setTimeLeft(newTimeLeft);
          if (onTick) {
            onTick(newTimeLeft);
          }
          lastTickTime = Date.now();
        }

        // 시간에 따라 원형 범위 조절되는 부분
        const progress = Math.min(elapsed / (duration * 1000), 1);
        setOffset(2 * Math.PI * config.radius * progress);

        // 브라우저 렌더링 사이클에 맞춰 실행되도록 설정
        animationFrameRef.current = requestAnimationFrame(animate);
      };

      animationFrameRef.current = requestAnimationFrame(animate);

      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }

    return undefined;
  }, [isActive, duration, onComplete, onTick]);

  useEffect(() => {
    if (isActive) {
      setTimeLeft(duration);
      setOffset(0);
      startTimeRef.current = undefined;
    }
  }, [isActive, duration]);

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full h-full flex flex-col items-center justify-center"
    >
      <div className={`relative ${config.containerClass}`}>
        {/* 지나간 시간 표시하는 영역 */}
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 180 180">
          <circle
            cx={center}
            cy={center}
            r={config.radius}
            stroke="#D6D3D3"
            strokeWidth={config.strokeWidth}
            fill="#fff01a"
          />
          {/* 남은 시간 표시하는 영역 */}
          <circle
            cx={center}
            cy={center}
            r={config.radius}
            stroke="#ffc757"
            strokeWidth={config.strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * config.radius}
            strokeDashoffset={offset}
          />
        </svg>
        <div className={`absolute font-[BMJUA] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
            ${config.fontSize} font-bold text-gray-700`}
        >
          {timeLeft}
        </div>
      </div>
    </button>
  );
}

export default CircularTimer;
