import { DrawingProvider } from '@/components/drawing/contexts/DrawingContext';
import DrawingSelection from '@/components/drawing/modeSelection/DrawingSelection';
import { DrawingMode } from '@/components/drawing/types/drawing';
import ModeSelection from '@/components/drawing/modeSelection/ModeSelection';
import { useState } from 'react';
import SingleDrawingMode from '@/components/drawing/drawingMode/SingleDrawingMode';
import MultiDrawingMode from '@/components/drawing/drawingMode/MultiDrawingMode';

function Drawing() {
  const [selectedDrawing, setSelectedDrawing] = useState<number>();
  const [selectedMode, setSelectedMode] = useState<DrawingMode>();

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

    return selectedMode === 'single' ? <SingleDrawingMode /> : <MultiDrawingMode />;
  };

  return (
    <DrawingProvider>
      {content()}
    </DrawingProvider>
  );
}
export default Drawing;
