import React, { useState, useEffect } from "react"
import { CharacterType } from "../types/story"
import { useStory } from "../contexts/StoryContext"

interface RecordingButtonProps {
  characterType: CharacterType
  storyIndex: number
  onRecordingComplete: () => void
}

export const RecordingButton: React.FC<RecordingButtonProps> = ({ characterType, storyIndex, onRecordingComplete }) => {
  const [isRecording, setIsRecording] = useState(false)
  const [timeLeft, setTimeLeft] = useState(20)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const { addRecording } = useStory()

  useEffect(() => {
    if (isRecording && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000)
      return () => clearTimeout(timer)
    } else if (isRecording && timeLeft === 0) {
      stopRecording()
    }
  }, [isRecording, timeLeft])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      const chunks: BlobPart[] = []

      recorder.ondataavailable = (e) => chunks.push(e.data)
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/mp3" })
        const audioUrl = URL.createObjectURL(blob)
        addRecording(storyIndex, {
          characterType,
          audioUrl,
          timestamp: Date.now(),
        })
        onRecordingComplete()
      }

      setMediaRecorder(recorder)
      recorder.start()
      setIsRecording(true)
      setTimeLeft(20)
    } catch (error) {
      console.error("Failed to start recording:", error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop()
      mediaRecorder.stream.getTracks().forEach((track) => track.stop())
      setIsRecording(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={isRecording ? stopRecording : startRecording}
        className={`px-4 py-2 rounded-full ${isRecording ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"} text-white font-bold transition-colors`}
      >
        {isRecording ? `녹음 중... (${timeLeft}초)` : "녹음 시작"}
      </button>
      {isRecording && (
        <div className="w-full h-2 bg-gray-200 rounded">
          <div className="h-full bg-red-500 rounded transition-all duration-1000" style={{ width: `${(timeLeft / 20) * 100}%` }} />
        </div>
      )}
    </div>
  )
}
