import React, {
  createContext,
  useState,
  useContext,
  useMemo,
} from 'react';
import { StoryMode, StoryContextType, RecordingData } from '../types/story';

const StoryContext = createContext<StoryContextType | undefined>(undefined);

function StoryProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const [mode, setMode] = useState<StoryMode>('reading');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [recordings, setRecordings] = useState<Map<number, RecordingData>>(new Map());
  const [audioEnabled, setAudioEnabled] = useState(true);

  const addRecording = React.useCallback((index: number, data: RecordingData) => {
    setRecordings((prev) => {
      const newMap = new Map(prev);
      newMap.set(index, data);
      return newMap;
    });
  }, []);

  const toggleAudio = React.useCallback(() => {
    setAudioEnabled((prev) => !prev);
  }, []);

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

  return (
    <StoryContext.Provider value={contextValue}>
      {children}
    </StoryContext.Provider>
  );
}

export const useStory = (): StoryContextType => {
  const context = useContext(StoryContext);
  if (context === undefined) {
    throw new Error('useStory must be used within a StoryProvider');
  }
  return context;
};

export { StoryProvider };
