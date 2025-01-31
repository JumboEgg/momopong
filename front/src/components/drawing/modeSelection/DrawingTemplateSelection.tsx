import { useDrawing } from '../contexts/DrawingContext';
import drawingTemplate from '../data/templateList';
import { getBackgroundSrc } from '../utils/getImgSrc';

interface DrawingSelectionProps {
  onDrawingSelect: (templateId: number) => void;
}

function DrawingSelection({ onDrawingSelect }: DrawingSelectionProps): JSX.Element {
  const {
    setTemplateId,
  } = useDrawing();

  const drawingImgList: JSX.Element[] = drawingTemplate.map((template) => (
    <button
      type="button"
      key={template.templateId}
      onClick={() => {
        onDrawingSelect(template.templateId);
        setTemplateId(template.templateId);
      }}
      style={{ width: '30%', height: '20%', textAlign: 'center' }}
    >
      <img src={getBackgroundSrc(template.templateId)} alt={template.name} width="100%" />
      <span>{template.name}</span>
    </button>
  ));

  return (
    <div>
      { drawingImgList }
    </div>
  );
}

export default DrawingSelection;
