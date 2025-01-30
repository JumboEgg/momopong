import { DrawingProvider } from '@/components/drawing/contexts/DrawingContext';
import DrawingSelection from '@/components/drawing/modeSelection/DrawingTemplateSelection';
import { DrawingMode } from '@/components/drawing/types/drawing';
import ModeSelection from '@/components/drawing/modeSelection/DrawingModeSelection';
import { useState } from 'react';
import DrawingPage from '@/components/drawing/drawingMode/DrawingPage';
import ResultPage from '@/components/drawing/drawingMode/ResultPage';

function Drawing() {
  const [selectedDrawing, setSelectedDrawing] = useState<number>();
  const [selectedMode, setSelectedMode] = useState<DrawingMode>();
  const [resultSrc, setResultSrc] = useState<string>('');

  const handleDrawingSelect = (templateId: number) => {
    setSelectedDrawing(templateId);
  };

  const handleModeSelect = (mode: DrawingMode) => {
    setSelectedMode(mode);
  };

  const content = () => {
    if (!selectedDrawing) {
      return <DrawingSelection onDrawingSelect={handleDrawingSelect} />;
    }

    if (!selectedMode) {
      return <ModeSelection onModeSelect={handleModeSelect} />;
    }

    if (!resultSrc) {
      return <DrawingPage onDrawingResult={setResultSrc} />;
    }

    return <ResultPage />;
  };

  return (
    <DrawingProvider>
      {content()}
    </DrawingProvider>
  );
}
export default Drawing;
