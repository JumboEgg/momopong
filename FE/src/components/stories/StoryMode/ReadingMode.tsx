import {
  useRef,
  useCallback,
  useState,
  ReactElement,
  useEffect,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { useStory } from '@/stores/storyStore';
import { useBookContent } from '@/stores/book/bookContentStore';
import makeBookRecord from '@/utils/bookS3/bookRecordCreate';
import { BookParticiPationRecordData } from '@/types/book';
import useSubAccountStore from '@/stores/subAccountStore';
import endBookRecordSession from '@/utils/bookS3/bookRecordEnd';
import StoryIllustration from './StoryIllustration';
import AudioPlayer from '../AudioPlayer';

function ReadingMode(): ReactElement {
  const navigate = useNavigate();
  const {
    bookId,
    currentIndex,
    setCurrentIndex,
    audioEnabled,
    toggleAudio,
    bookRecordId,
    setBookRecordId,
  } = useStory();

  const { bookContent } = useBookContent();

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentContentIndex, setCurrentContentIndex] = useState(0);
  const [showEndOverlay, setShowEndOverlay] = useState(false);

  // 읽기 기록 생성 여부 확인
  const isRecording = useRef(false);
  // 읽기 기록 저장
  const saveReadingSession = async () => {
    const data: BookParticiPationRecordData = {
      childId: useSubAccountStore.getState().selectedAccount?.childId ?? 0,
      bookId: bookId ?? 0,
      role: '',
      mode: 'SINGLE',
    };
    const id = await makeBookRecord(data);
    setBookRecordId(id);
  };

  // 읽기 시작 시 도서 읽기 정보 저장
  useEffect(() => {
    if (isRecording.current) return;
    isRecording.current = true;
    saveReadingSession();
  }, [isRecording.current]);

  const stopCurrentAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, []);

  const handleNext = useCallback(() => {
    const currentPage = bookContent?.pages[currentIndex];

    // 현재 페이지에 다음 콘텐츠가 있는 경우
    if (currentContentIndex < (currentPage?.audios.length ?? 0) - 1) {
      setCurrentContentIndex(currentContentIndex + 1);
    } else if (currentIndex < (bookContent?.pages.length ?? 0) - 1) {
      stopCurrentAudio();
      setCurrentIndex(currentIndex + 1);
      setCurrentContentIndex(0);
    } else {
      setShowEndOverlay(true);
    }
  }, [currentIndex, currentContentIndex, stopCurrentAudio, setCurrentIndex]);

  const handlePrevious = useCallback(() => {
    // 첫 번째 콘텐츠가 아니면 이전 콘텐츠로 이동
    if (currentContentIndex > 0) {
      setCurrentContentIndex(currentContentIndex - 1);
      return;
    }

    // 첫 번째 콘텐츠면 이전 페이지의 마지막 콘텐츠로 이동
    if (currentIndex > 0) {
      stopCurrentAudio();
      setCurrentIndex(currentIndex - 1);
      const prevPage = bookContent?.pages[currentIndex - 1];
      setCurrentContentIndex((prevPage?.audios.length ?? 0) - 1);
    }
  }, [currentIndex, currentContentIndex, stopCurrentAudio, setCurrentIndex]);

  const handleContentEnd = useCallback(() => {
    const currentPage = bookContent?.pages[currentIndex];

    // 현재 페이지의 다음 콘텐츠로 이동 또는 다음 페이지로 전환
    const hasNextContent = currentContentIndex < (currentPage?.audios.length ?? 0) - 1;
    const hasNextPage = currentIndex < (bookContent?.pages.length ?? 0) - 1;

    if (hasNextContent) {
      setCurrentContentIndex(currentContentIndex + 1);
    } else if (hasNextPage) {
      stopCurrentAudio();
      setCurrentIndex(currentIndex + 1);
      setCurrentContentIndex(0);
    } else {
      // 읽기 종료 시 읽기 기록 정보 갱신
      endBookRecordSession(bookRecordId ?? 0);
      setShowEndOverlay(true);
    }
  }, [currentIndex, currentContentIndex, stopCurrentAudio, setCurrentIndex]);

  const handleRestart = useCallback(() => {
    stopCurrentAudio();
    setCurrentIndex(0);
    setCurrentContentIndex(0);
    setShowEndOverlay(false);
    setBookRecordId(null);
    isRecording.current = false;
  }, [stopCurrentAudio, setCurrentIndex]);

  const handleGoHome = useCallback(() => {
    stopCurrentAudio();
    navigate('/home');
  }, [navigate, stopCurrentAudio]);

  const currentPage = bookContent?.pages[currentIndex];
  const currentContent = currentPage?.audios[currentContentIndex];
  const isLastPage = currentIndex === (bookContent?.pages.length ?? 0) - 1;

  const audioUrl = currentContent?.path ?? '';

  return (
    <div className="w-[100vw] h-[100vh] mx-auto relative">
      <div className="mb-6 justify-between items-center hidden">
        <h2 className="text-2xl font-bold text-gray-800">
          신데렐라
          {' '}
          <span className="text-base text-gray-600">
            {currentPage?.pageNumber}
            /
            {bookContent?.totalPage ?? 0}
          </span>
          {' '}
          <span className="text-sm text-gray-500">
            (텍스트
            {' '}
            {currentContentIndex + 1}
            /
            {currentPage?.audios.length ?? 0}
            )
          </span>
        </h2>
      </div>

      <button
        type="button"
        onClick={toggleAudio}
        className={`fixed top-2 right-4 px-4 py-2 rounded ${audioEnabled ? 'bg-green-500' : 'bg-gray-500'} text-white`}
      >
        음성
        {' '}
        <span>{audioEnabled ? 'ON' : 'OFF'}</span>
      </button>

      <StoryIllustration
        pageNumber={currentPage?.pageNumber ?? 0}
        currentContentIndex={currentContentIndex}
        onPrevious={handlePrevious}
        onNext={handleNext}
        isFirst={currentIndex === 0 && currentContentIndex === 0}
        isLast={isLastPage && currentContentIndex === (currentPage?.audios.length ?? 0) - 1}
        currentContent={currentContent}
        illustration={currentPage?.pagePath ?? ''}
      />

      {audioEnabled && currentContent?.path && (
        <AudioPlayer
          ref={audioRef}
          audioFiles={[audioUrl ?? '']}
          autoPlay
          onEnded={handleContentEnd}
        />
      )}

      {showEndOverlay && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black opacity-50" />
          <div className="bg-white rounded-lg p-8 shadow-xl max-w-sm w-full mx-4 z-50 relative">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
              이야기가 끝났어요!
            </h3>
            <p className="text-gray-600 mb-8 text-center">
              이야기를 즐겁게 읽어주셔서 감사합니다.
            </p>
            <div className="flex flex-col gap-4">
              <button
                type="button"
                onClick={handleRestart}
                className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-lg font-medium"
              >
                다시 읽기
              </button>
              <button
                type="button"
                onClick={handleGoHome}
                className="w-full py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-lg font-medium"
              >
                홈으로 가기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReadingMode;
