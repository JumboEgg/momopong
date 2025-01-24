import React, { createContext, useState, useContext } from "react"
import { StoryMode, StoryContextType, RecordingData } from "../types/story"

const StoryContext = createContext<StoryContextType | undefined>(undefined)

export const StoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<StoryMode>("reading")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [recordings, setRecordings] = useState<Map<number, RecordingData>>(new Map())
  const [audioEnabled, setAudioEnabled] = useState(true)

  const addRecording = (index: number, data: RecordingData) => {
    setRecordings((prev) => {
      const newMap = new Map(prev)
      newMap.set(index, data)
      return newMap
    })
  }

  const toggleAudio = () => setAudioEnabled((prev) => !prev)

  return (
    <StoryContext.Provider
      value={{
        mode,
        setMode,
        currentIndex,
        setCurrentIndex,
        recordings,
        addRecording,
        audioEnabled,
        toggleAudio,
      }}
    >
      {children}
    </StoryContext.Provider>
  )
}

export const useStory = () => {
  const context = useContext(StoryContext)
  if (context === undefined) {
    throw new Error("useStory must be used within a StoryProvider")
  }
  return context
}
