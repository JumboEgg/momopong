import React from "react"
import { StoryMode } from "@/components/stories/types/story"
import { ReadingMode } from "./StoryMode/ReadingMode"
import { TogetherMode } from "./StoryMode/TogetherMode"

interface StoryContainerProps {
  mode: StoryMode
}

export const StoryContainer: React.FC<StoryContainerProps> = ({ mode }) => {
  return <div className="container mx-auto py-8">{mode === "reading" ? <ReadingMode /> : <TogetherMode />}</div>
}
