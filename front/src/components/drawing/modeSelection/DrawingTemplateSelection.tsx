import { useNavigate } from 'react-router-dom';
import { IconCircleButton } from '@/components/common/buttons/CircleButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useDrawing } from '../contexts/DrawingContext';
import drawingTemplate from '../data/templateList';
import { getBackgroundSrc } from '../utils/getImgSrc';

interface DrawingSelectionProps {
  onDrawingSelect: (template: number) => void;
}

function DrawingSelection({ onDrawingSelect }: DrawingSelectionProps): JSX.Element {
  const {
    setTemplateId, setTemplateName, setBackgroundSrc, setOutlineSrc,
  } = useDrawing();

  const navigate = useNavigate();

  const drawingImgList: JSX.Element[] = drawingTemplate.map((template) => (
    <button
      type="button"
      key={template.templateId}
      onClick={() => {
        onDrawingSelect(template.templateId);
        setTemplateId(template.templateId);
        setTemplateName(template.name);
        setBackgroundSrc(template.bgSrc);
        setOutlineSrc(template.olSrc);
      }}
      className="text-center min-w-10 w-[40%] sm:w-[30%] md:w-[20%] m-2"
    >
      <div>
        <img
          src={getBackgroundSrc(template.templateId)}
          alt={template.name}
          className="w-full bg-white"
        />
      </div>
      <div
        className="mt-2 md:text-xl"
      >
        {template.name}
      </div>
    </button>
  ));

  return (
    <div className="w-full h-full p-5 bg-[#FCEDBA]">
      <div>
        <IconCircleButton
          size="sm"
          variant="action"
          className=""
          onClick={() => navigate('/home')}
          icon={<FontAwesomeIcon icon={faArrowLeft} size="sm" />}
        />
      </div>
      <div className="absolute top-10 flex justify-center items-center w-full font-[BMJUA] text-3xl">
        색칠하고 싶은 그림을 골라보세요
      </div>
      <div className="mt-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 justify-between flex flex-wrap items-start content-start">
        { drawingImgList }
      </div>
    </div>
  );
}

export default DrawingSelection;
