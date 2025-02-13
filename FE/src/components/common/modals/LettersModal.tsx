import { faX } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useLetterStore from '@/stores/letterStore';
import { IconCircleButton } from '../buttons/CircleButton';

interface LettersModalProps {
    onClose: () => void;
}

function LettersModal({ onClose }: LettersModalProps) {
    const {
        letters,
    } = useLetterStore();

    const letterList = letters.map((letter) => (
      <button
        key={letter.letterRecord}
        type="button"
        className="flex items-center"
      >
        <img
          src="/public/images/bookcover/cover_thelittelmatchgirl.webp"
          alt="sender placeholder"
          className="w-16 aspect-square rounded-full"
        />
        {letter.bookTitle}
        의
        {letter.role}
        (이)가 편지를 보냈어요
      </button>
    ));
    return (
      <div
        className="fixed top-0 left-0 w-full h-full z-30
          bg-[#00000060]
          flex items-center justify-center"
      >
        <div className="w-1/2 min-h-[85vh] bg-broom-200 border-10 border-tainoi-400
            flex flex-col absolute items-center justify-between p-8 rounded-[2vw] overflow-hidden"
        >
          <IconCircleButton
            size="xs"
            variant="action"
            className="absolute top-4 right-4 font-semibold"
            onClick={onClose}
            icon={<FontAwesomeIcon icon={faX} size="lg" />}
          />
          <div className="flex space-x-4">
            내가 받은 편지
          </div>
          <div className="flex-1 w-full overflow-y-auto my-8">
            {letterList}
          </div>
        </div>
      </div>
    );
}

export default LettersModal;
