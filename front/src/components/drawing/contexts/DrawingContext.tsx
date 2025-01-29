import {
  createContext, useContext, useMemo, useState,
} from 'react';
import { DrawingContextType, DrawingMode } from '../types/drawing';

const DrawingContext = createContext<DrawingContextType | undefined>(undefined);

function DrawingProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const [mode, setMode] = useState<DrawingMode>('single');
  const [templateId, setTemplateId] = useState<number>(0);

  const contextValue = useMemo(
    () => ({
      mode,
      setMode,
      templateId,
      setTemplateId,
    }),
    [mode, templateId],
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
