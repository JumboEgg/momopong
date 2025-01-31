import {
  createContext, useContext, useMemo, useState,
} from 'react';
import { DrawingContextType, DrawingMode } from '../types/drawing';

const DrawingContext = createContext<DrawingContextType | undefined>(undefined);

function DrawingProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const [mode, setMode] = useState<DrawingMode>('single');
  const [templateId, setTemplateId] = useState<number>(0);
  const [penColor, setPenColor] = useState<string>('black');
  const [isErasing, setIsErasing] = useState<boolean>(false);
  const [imageData, setImageData] = useState<string>('');

  const contextValue = useMemo(
    () => ({
      mode,
      setMode,
      templateId,
      setTemplateId,
      penColor,
      setPenColor,
      isErasing,
      setIsErasing,
      imageData,
      setImageData,
    }),
    [mode, templateId, penColor, isErasing, imageData],
  );

  return (
    <DrawingContext.Provider value={contextValue}>
      {children}
    </DrawingContext.Provider>
  );
}

export const useDrawing = (): DrawingContextType => {
  const context = useContext(DrawingContext);
  if (context === undefined) {
    throw new Error('useDrawing must be used within a DrawingProvider');
  }
  return context;
};

export { DrawingProvider };
