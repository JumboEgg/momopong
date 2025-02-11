import { useNavigate } from 'react-router-dom';
import { IconCircleButton } from '@/components/common/buttons/CircleButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useDrawing } from '@/stores/drawingStore';
import { useSketchList } from '@/stores/sketchListStore';
import '@/components/common/scrollbar.css';
import { getOutlinePath } from '@/utils/format/imgPath';

function DrawingSelection(): JSX.Element {
  const {
    setTemplate,
  } = useDrawing();

  const {
    sketchList,
  } = useSketchList();

  const navigate = useNavigate();

  const drawingImgList: JSX.Element[] = sketchList.map((template) => (
    <button
      type="button"
      key={template.sketchId}
      onClick={() => {
        setTemplate(template);
      }}
      className="text-center min-w-10 w-[40%] sm:w-[30%] md:w-[20%] m-2"
    >
      <div>
        <img
          src={getOutlinePath(template.sketchPath) ?? ''}
          alt={template.sketchTitle}
          className="w-full bg-white rounded-2xl"
        />
      </div>
      <div
        className="mt-2 md:text-xl"
      >
        {template.sketchTitle}
      </div>
    </button>
  ));

  return (
    <div className="w-full h-full p-5 bg-[#FCEDBA] relative overflow-clip">
      <div className="relative z-10">
        <IconCircleButton
          size="sm"
          variant="action"
          className=""
          onClick={() => navigate('/home')}
          icon={<FontAwesomeIcon icon={faArrowLeft} size="sm" />}
        />
      </div>
      <div className="absolute top-10 flex justify-center w-full font-[BMJUA] text-3xl z-0">
        색칠하고 싶은 그림을 골라보세요
      </div>
      <div
        className="mt-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4
        flex flex-wrap items-start content-start justify-center
        max-h-[75vh] overflow-y-scroll customScrollbar yellow"
      >
        { drawingImgList }
      </div>
    </div>
  );
}

export default DrawingSelection;
