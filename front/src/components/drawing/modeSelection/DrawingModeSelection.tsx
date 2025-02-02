import { IconCircleButton } from '@/components/common/buttons/CircleButton';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDrawing } from '../contexts/DrawingContext';
import { DrawingMode } from '../types/drawing';

interface ModeSelectionProps {
  onModeSelect: (mode: DrawingMode) => void;
  onBack: () => void;
}

function DrawingModeSelection({ onModeSelect, onBack }: ModeSelectionProps): JSX.Element {
  const {
    setMode,
  } = useDrawing();

  return (
    <div className="h-full w-full bg-[#FCEDBA]">
      <div className="absolute mt-5 ml-5">
        <IconCircleButton
          size="sm"
          variant="action"
          className=""
          onClick={onBack}
          icon={<FontAwesomeIcon icon={faArrowLeft} size="lg" />}
        />
        <button type="button" onClick={() => onModeSelect('story')}>스토리 모드 테스트</button>
      </div>
      <div className="h-full w-full flex items-center justify-evenly columns-2">
        <div className="max-w-md flex justify-center">
          <div className="space-y-4 w-[80%] hover:w-full duration-200">
            <button
              type="button"
              onClick={() => {
                onModeSelect('single');
                setMode('single');
              }}
              className="py-4 px-6 text-lg hover:text-2xl duration-200 font-semibold flex flex-col"
            >
              <div className="w-full max-w-xl min-w-40 self-center">
                <img
                  src="/images/icons/drawing.png"
                  alt="single mode"
                />
              </div>
              <div className="self-center">혼자 그리기</div>
            </button>
          </div>
        </div>
        <div className="max-w-md flex justify-center">
          <div className="space-y-4 w-[80%] hover:w-full duration-200">
            <button
              type="button"
              onClick={() => {
                onModeSelect('together');
                setMode('together');
              }}
              className="py-4 px-6 text-lg hover:text-2xl duration-200 font-semibold flex flex-col"
            >
              <div className="w-full max-w-xl min-w-40 self-center">
                <img
                  src="/images/icons/friendship.png"
                  alt="single mode"
                />
              </div>
              <div className="self-center">함께 그리기</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DrawingModeSelection;
