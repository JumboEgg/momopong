import { useState, useEffect, useRef } from 'react';

type Props = {
  isActive: boolean;
  duration: number;
  onComplete: () => void;
  onTick: (timeLeft: number) => void;
};

const TOTAL_TIME = 20;
const RADIUS = 60;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function CircularTimer({
  isActive,
  duration = TOTAL_TIME,
  onComplete,
  onTick,
}: Props): JSX.Element {
  const [timeLeft, setTimeLeft] = useState<number>(duration);
  const [offset, setOffset] = useState<number>(0);
  const animationFrameRef = useRef<number>();
  const startTimeRef = useRef<number>();

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
            setOffset(CIRCUMFERENCE);
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
        setOffset(CIRCUMFERENCE * progress);

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
    <div className="flex flex-col items-center">
      <div className="relative w-48 h-48">
        {/* 지나간 시간 표시하는 영역 */}
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 180 180">
          <circle
            cx="90"
            cy="90"
            r={RADIUS}
            stroke="#D6D3D3"
            strokeWidth="12"
            fill="#fff01a"
          />
          {/* 남은 시간 표시하는 영역 */}
          <circle
            cx="90"
            cy="90"
            r={RADIUS}
            stroke="#ffc757"
            strokeWidth="12"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="absolute font-[BMJUA] text-6xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-5xl font-bold text-gray-700">
          {timeLeft}
        </div>
      </div>
    </div>
  );
}

export default CircularTimer;
