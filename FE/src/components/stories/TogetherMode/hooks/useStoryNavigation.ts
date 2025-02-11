import { useState } from 'react';
import { useStory } from '@/stores/storyStore';
import { useMultiplayStore } from '@/stores/multiplayStore';
import storyData from '../../data/cinderella';

export function useStoryNavigation() {
  const { currentIndex, setCurrentIndex } = useStory();
  const { currentContentIndex, setCurrentContentIndex } = useMultiplayStore();
  const [isLastAudioCompleted, setIsLastAudioCompleted] = useState(false);

  const currentPage = storyData[currentIndex];
  const currentContent = currentPage?.contents[currentContentIndex];

  const handleNext = () => {
    if (!currentPage) return;

    if (currentContentIndex < currentPage.contents.length - 1) {
      setCurrentContentIndex((prev) => prev + 1);
    } else if (currentIndex < storyData.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setCurrentContentIndex(0);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setCurrentContentIndex(0);
    }
  };

  const isStoryEnd = currentIndex === storyData.length - 1
    && currentContentIndex === currentPage.contents.length - 1
    && isLastAudioCompleted;

  return {
    currentIndex,
    currentContentIndex,
    currentPage,
    currentContent,
    handleNext,
    handlePrevious,
    isStoryEnd,
    setIsLastAudioCompleted,
  };
}
