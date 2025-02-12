import { useState, useEffect } from 'react';
import { faVolumeHigh } from '@fortawesome/free-solid-svg-icons';
import { TextCircleButton } from '@/components/common/buttons/CircleButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TextButton from '@/components/common/buttons/TextButton';
import { LetterInfo } from '@/types/letter';
import fetchSavedAudio from '../../../utils/audioS3/audioLoad';

interface LetterModalProps {
    childName: string;
  data: LetterInfo;
  onClose: () => void;
}

function ReportLetterModal({
  childName,
  data,
  onClose,
}: LetterModalProps): JSX.Element {
  const [letterAudio, setLetterAudio] = useState<HTMLAudioElement>();
  const myLetterAudio = new Audio();

  const onSave = () => {
    if (!letterAudio) return;
    const link = document.createElement('a');
    link.href = letterAudio.src;
    link.download = `${data.childName}(이)가 ${data.role}에게 보낸 편지-${data.createdAt}`; // 저장할 파일 이름 지정
    link.click(); // 다운로드 실행
    onClose();
  };

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
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-[500px] min-h-[350px] bg-[#FFF08E] border-8 border-[#ffa500]
        flex flex-col relative items-center justify-between p-8 rounded-3xl overflow-hidden"
      >
        <div className="flex-grow flex flex-col items-center justify-center font-[BMJUA] w-full">
          <div className="flex flex-col gap-4 w-full">
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
              (이)가 보낸 내용
            </div>
            <p className="break-words">{data.content}</p>
            <p>
              {data.bookTitle}
              의
              {' '}
              {data.role}
              (이)가 보낸 답장
            </p>
            <p>{data.reply}</p>
          </div>
        </div>
        <div className="flex gap-4 mt-6">
          <TextButton
            size="md"
            variant="rounded"
            onClick={onSave}
          >
            저장하기
          </TextButton>
          <TextButton
            size="md"
            variant="rounded"
            onClick={onClose}
          >
            닫기
          </TextButton>
        </div>
      </div>
    </div>
  );
}

export default ReportLetterModal;
