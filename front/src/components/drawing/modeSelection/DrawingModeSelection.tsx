import { useDrawing } from '../contexts/DrawingContext';
import { DrawingMode } from '../types/drawing';

interface ModeSelectionProps {
  onModeSelect: (mode: DrawingMode) => void;
}

function ModeSelection({ onModeSelect }: ModeSelectionProps): JSX.Element {
  const {
    setMode,
  } = useDrawing();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => {
              onModeSelect('single');
              setMode('single');
            }}
            className="w-full py-4 px-6 text-lg font-semibold text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
          >
            혼자 그리기
          </button>
          <button
            type="button"
            onClick={() => {
              onModeSelect('together');
              setMode('together');
            }}
            className="w-full py-4 px-6 text-lg font-semibold text-white bg-green-500 hover:bg-green-600 rounded-lg transition-colors"
          >
            함께 그리기
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModeSelection;
