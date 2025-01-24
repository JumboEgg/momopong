import React from "react"
import { StoryMode } from "@/components/stories/types/story"

interface ModeSelectionProps {
  onModeSelect: (mode: StoryMode) => void
}

export const ModeSelection: React.FC<ModeSelectionProps> = ({ onModeSelect }) => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-8">신데렐라 동화</h1>

        <div className="space-y-4">
          <button onClick={() => onModeSelect("reading")} className="w-full py-4 px-6 text-lg font-semibold text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors">
            읽기 모드
          </button>
          <button onClick={() => onModeSelect("together")} className="w-full py-4 px-6 text-lg font-semibold text-white bg-green-500 hover:bg-green-600 rounded-lg transition-colors">
            함께 읽기 모드
          </button>
        </div>
      </div>
    </div>
  )
}
