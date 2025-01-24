import React, { useEffect, forwardRef, useRef } from "react"
import { useStory } from "@/components/stories/contexts/StoryContext"

interface AudioPlayerProps {
  audioUrl: string
  autoPlay?: boolean
  onEnded?: () => void
}

export const AudioPlayer = forwardRef<HTMLAudioElement, AudioPlayerProps>(({ audioUrl, autoPlay = true, onEnded }, ref) => {
  const { audioEnabled } = useStory()
  const playAttemptRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    const audioElement = ref as React.MutableRefObject<HTMLAudioElement | null>
    if (audioElement?.current) {
      audioElement.current.volume = audioEnabled ? 1 : 0

      if (autoPlay && audioEnabled) {
        // 이전 재생 시도를 취소
        if (playAttemptRef.current) {
          clearTimeout(playAttemptRef.current)
        }

        // 약간의 지연 후 재생 시도
        playAttemptRef.current = setTimeout(() => {
          if (audioElement.current) {
            audioElement.current.play().catch((e) => {
              if (e.name !== "AbortError") {
                console.error("Autoplay failed:", e)
              }
            })
          }
        }, 100)
      }
    }

    // cleanup 함수
    return () => {
      if (playAttemptRef.current) {
        clearTimeout(playAttemptRef.current)
      }
      const audio = audioElement?.current
      if (audio) {
        audio.pause()
        audio.currentTime = 0
      }
    }
  }, [audioUrl, audioEnabled, autoPlay, ref])

  return (
    <div className="mt-4">
      <audio ref={ref} src={audioUrl} controls className="w-full" onEnded={onEnded} onError={(e) => console.error("Audio error:", e)}>
        <p>Your browser doesn't support HTML5 audio.</p>
      </audio>
    </div>
  )
})

AudioPlayer.displayName = "AudioPlayer"
