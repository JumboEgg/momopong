import { IconCircleButton } from '@/components/common/buttons/CircleButton';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDrawing } from '@/stores/drawing/drawingStore';
import { useEffect } from 'react';
import useSocketStore from '@/components/drawing/hooks/useSocketStore';
import makeRandomCode from '@/utils/format/randomString';

function DrawingModeSelection(): JSX.Element {
  const {
    setTemplate, setMode, mode,
  } = useDrawing();

  const {
    setRoomId,
  } = useSocketStore();

  useEffect(() => {
    if (mode) {
      setMode(null); // 기존 모드가 있으면 강제로 초기화
    }
  }, []);

  return (
    <div className="h-full w-full bg-[#FCEDBA]">
      <div className="absolute mt-5 ml-5">
        <IconCircleButton
          size="sm"
          variant="action"
          className=""
          onClick={() => setTemplate(null)}
          icon={<FontAwesomeIcon icon={faArrowLeft} size="lg" />}
        />
        <button type="button" onClick={() => setMode('story')}>
          {' '}
        </button>
      </div>
      <div className="h-full w-full flex items-center justify-evenly columns-2">
        <div className="max-w-md flex justify-center">
          <div className="space-y-4 w-[80%] hover:w-full duration-200">
            <button
              type="button"
              onClick={() => {
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
              <div className="self-center text-3xl font-[BMJUA]">혼자 그리기</div>
            </button>
          </div>
        </div>
        <div className="max-w-md flex justify-center">
          <div className="space-y-4 w-[80%] hover:w-full duration-200">
            <button
              type="button"
              onClick={() => {
                setMode('together');
                setRoomId(makeRandomCode());
              }}
              className="py-4 px-6 text-lg hover:text-2xl duration-200 font-semibold flex flex-col"
            >
              <div className="w-full max-w-xl min-w-40 self-center">
                <img
                  src="/images/icons/friendship.png"
                  alt="single mode"
                />
              </div>
              <div className="self-center text-3xl font-[BMJUA]">함께 그리기</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DrawingModeSelection;
