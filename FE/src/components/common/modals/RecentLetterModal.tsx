import { useState, useEffect } from 'react';
import { faVolumeHigh } from '@fortawesome/free-solid-svg-icons';
import { TextCircleButton } from '@/components/common/buttons/CircleButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TextButton from '@/components/common/buttons/TextButton';
import { LetterInfo } from '@/types/letter';
import useSubAccountStore from '@/stores/subAccountStore';
import useRecentLetterStore from '@/stores/letter/recentLetterStore';
import fetchSavedAudio from '../../../utils/letterS3/audioLoad';

function RecentLetterModal({ data }: { data: LetterInfo }): JSX.Element {
    const {
        setSelectedLetter,
    } = useRecentLetterStore();

  const [letterAudio, setLetterAudio] = useState<HTMLAudioElement>();
  const myLetterAudio = new Audio();

  const childName = useSubAccountStore.getState().selectedAccount?.name;

  useEffect(() => {
    if (!data) return;

    const loadAudio = async () => {
      const audioUrl = await fetchSavedAudio(data.letterUrl);
      myLetterAudio.src = audioUrl ?? '';
      setLetterAudio(myLetterAudio);
    };

    loadAudio();
  }, []);

  const playMyLetter = () => {
    if (!letterAudio) return;
    if (letterAudio.paused) {
      letterAudio.play();
    } else {
      letterAudio.pause();
    }
  };

  return (
    <div
      role="presentation"
      className="fixed top-0 left-0 w-full h-full z-30 bg-black/60 flex items-center justify-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) setSelectedLetter(null);
      }}
    >
      <div className="w-[500px] min-h-[350px] bg-[#FFF08E] border-8 border-[#ffa500]
        flex flex-col relative items-center justify-between p-8 rounded-3xl overflow-hidden"
      >
        <div className="flex-grow flex flex-col items-center justify-center font-[BMJUA] w-full">
          <div className="flex flex-col gap-4 w-full text-lg">
            <div>
              <TextCircleButton
                icon={<FontAwesomeIcon icon={faVolumeHigh} />}
                text="내가 보낸 편지"
                size="sm"
                variant="action"
                className="text-2xl"
                onClick={playMyLetter}
              />
              {childName}
              (이)에게
            </div>
            <p>{data.reply}</p>
            <div className="text-end">
              {data.role}
              {' '}
              보냄
            </div>
          </div>
        </div>
        <div className="flex gap-4 mt-6">
          <TextButton
            size="md"
            variant="rounded"
            onClick={() => setSelectedLetter(null)}
          >
            닫기
          </TextButton>
        </div>
      </div>
    </div>
  );
}

export default RecentLetterModal;
