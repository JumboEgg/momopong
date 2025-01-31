import React, {
  createContext,
  useState,
  useContext,
  useMemo,
} from 'react';
import { StoryMode, StoryContextType, RecordingData } from '../types/story';

// 컴포넌트 전체에 걸쳐 상태를 공유하기 위한 컨텍스트 생성
const StoryContext = createContext<StoryContextType | undefined>(undefined);

// 스토리 관련 상태를 관리하고 제공하는 StoryProvider 컴포넌트
function StoryProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const [mode, setMode] = useState<StoryMode>('reading');
  // 현재 스토리의 인덱스(현재 활성화된 부분/페이지)
  const [currentIndex, setCurrentIndex] = useState(0);
  // 인덱스별로 오디오 녹음을 저장하는 Map
  const [recordings, setRecordings] = useState<Map<number, RecordingData>>(new Map());
  // 오디오 기능 토글
  const [audioEnabled, setAudioEnabled] = useState(true);

  // 녹음을 맵에 추가하는 메모이즈된 콜백
  const addRecording = React.useCallback((index: number, data: RecordingData) => {
    setRecordings((prev) => {
      const newMap = new Map(prev);
      newMap.set(index, data);
      return newMap;
    });
  }, []);

  // 오디오 켜기/끄기 콜백
  const toggleAudio = React.useCallback(() => {
    setAudioEnabled((prev) => !prev);
  }, []);

  // useMemo를 사용해 컨텍스트 값 생성
  const contextValue = useMemo(
    () => ({
      mode,
      setMode,
      currentIndex,
      setCurrentIndex,
      recordings,
      addRecording,
      audioEnabled,
      toggleAudio,
    }),
    [mode, currentIndex, recordings, audioEnabled, addRecording, toggleAudio],
  );

  // 모든 자식 컴포넌트에 컨텍스트 값 제공
  return (
    <StoryContext.Provider value={contextValue}>
      {children}
    </StoryContext.Provider>
  );
}

// StoryContext를 사용하기 위한 커스텀 훅
export const useStory = (): StoryContextType => {
  const context = useContext(StoryContext);

  // 컨텍스트가 undefined면 에러 발생 (프로바이더 외부에서 사용 방지)
  if (context === undefined) {
    throw new Error('useStory must be used within a StoryProvider');
  }
  return context;
};

export { StoryProvider };
