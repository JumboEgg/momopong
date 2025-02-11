import React, { useState, KeyboardEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { faArrowLeft, faVolumeHigh } from '@fortawesome/free-solid-svg-icons';
import { TextCircleButton, IconCircleButton } from '@/components/common/buttons/CircleButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '@/components/common/scrollbar.css';
import { LetterInfo } from '@/types/letter';
import useSubAccountStore from '@/stores/subAccountStore';
import useLetterStore from '@/stores/letterStore';
import fetchSavedAudio from '@/utils/audioS3/audioLoad';

function MyLetters(): React.JSX.Element {
  const {
    letterList: letters, selectedLetter, setSelectedLetter,
  } = useLetterStore();

  // const [letterList, setLetterList] = useState<LetterInfo[]>([]);
  // const [selectedLetter, setSelectedLetter] = useState<LetterInfo | null>(null);
  const [letterAudio, setLetterAudio] = useState<HTMLAudioElement>();
  const navigate = useNavigate();
  const myLetterAudio = new Audio();
  const child = useSubAccountStore.getState().selectedAccount;

  function handleLetterSelect(letter: LetterInfo | null): void {
    setSelectedLetter(letter);
  }

  useEffect(() => {
    if (!selectedLetter) return;

    const loadAudio = async () => {
      const audioUrl = await fetchSavedAudio(selectedLetter.letterUrl);
      myLetterAudio.src = audioUrl ?? '';
      setLetterAudio(myLetterAudio);
    };

    loadAudio();
  }, [selectedLetter]);

  const playMyLetter = () => {
    if (!letterAudio) return;
    if (letterAudio.paused) {
      letterAudio.play();
    } else {
      letterAudio.pause();
    }
  };

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>, letter: LetterInfo): void {
    if (event.key === 'Enter' || event.key === ' ') {
      handleLetterSelect(letter);
    }
  }

  const handleBack = () => {
    navigate('/house');
  };

  return (
    <div className="min-h-screen bg-yellow-100 flex flex-col items-center justify-center">
      {/* Content wrapper with padding and full width */}
      <div className="w-full max-w-4xl px-4">
        {/* Back button container */}
        <IconCircleButton
          size="sm"
          variant="action"
          onClick={handleBack}
          icon={<FontAwesomeIcon icon={faArrowLeft} size="lg" />}
          className="fixed top-2 md:top-5 left-2 md:left-5 z-10"
        />

        {/* Main content container */}
        <div className="h-[80vh]">
          <div className="flex gap-4 h-full">
            {/* Left side - Selected Letter */}
            <div className="w-1/2 h-full">
              {selectedLetter ? (
                <div
                  className="bg-pink-200 p-3 md:p-6 rounded-2xl relative font-[BMJUA] h-full animate-slide-up"
                >
                  <span className="absolute -top-10 right-3">
                    <TextCircleButton
                      icon={<FontAwesomeIcon icon={faVolumeHigh} />}
                      text="내가 보낸 편지"
                      size="sm"
                      variant="action"
                      className="text-2xl"
                      onClick={playMyLetter}
                    />
                  </span>
                  <p className="my-3 text-xl md:text-2xl ps-2 md:not-[]:ps-4">
                    { child ? `${child.name}(이)에게` : '나의 소중한 친구에게'}
                  </p>
                  <div className="h-[calc(100%-100px)] md:h-[calc(100%-160px)]">
                    <div className="customScrollbar pink overflow-y-auto h-full text-lg md:text-2xl px-4">
                      <p>{selectedLetter.reply}</p>
                    </div>
                  </div>
                  <p className="my-3 text-xl md:text-2xl text-end px-4">
                    {selectedLetter.role}
                    {' '}
                    보냄
                  </p>
                </div>
              ) : (
                <div className="h-full rounded-2xl font-[BMJUA] text-2xl flex justify-center items-center">
                  누구의 편지를 읽어볼까?
                </div>
              )}
            </div>

            {/* Right side - Letters List */}
            <div className="w-1/2 bg-yellow-200 rounded-2xl border-4 border-orange-300 overflow-hidden h-full p-2 md:p-4">
              <div className="p-2 md:p-4 font-[BMJUA] text-xl md:text-2xl">내가 받은 편지들</div>
              <div className="customScrollbar yellow overflow-y-auto h-[calc(100%-60px)]">
                {letters.map((letter) => (
                  <div
                    key={letter.letterFileName}
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      if (!selectedLetter
                        || letter.letterFileName !== selectedLetter.letterFileName) {
                        handleLetterSelect(letter);
                      } else {
                        handleLetterSelect(null);
                      }
                    }}
                    onKeyDown={(e) => handleKeyDown(e, letter)}
                    className={`p-4 bg-[#FBB787] hover:bg-orange-200 cursor-pointer flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-orange-500 mx-3 mb-3 rounded-2xl ${
                      selectedLetter && letter.letterFileName === selectedLetter.letterFileName ? 'bg-orange-300' : ''
                    }`}
                  >
                    <div>
                      <div className="font-[BMJUA] text-sm md:text-lg">
                        {'<'}
                        {letter.bookTitle}
                        {'>'}
                        의
                        {' '}
                        {letter.role}
                        (이)가 보낸 편지
                      </div>
                      <div className="text-xs md:text-lg text-gray-500">{letter.createdAt.substring(0, 10)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyLetters;
