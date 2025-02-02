import {
  createContext, useContext, useMemo, useState,
} from 'react';
import { DrawingContextType, DrawingMode } from '../types/drawing';

const DrawingContext = createContext<DrawingContextType | undefined>(undefined);

function DrawingProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const [mode, setMode] = useState<DrawingMode>('single');
  const [friendId, setFriendId] = useState<number>(0);
  const [friendName, setFriendName] = useState<string>('');
  const [templateId, setTemplateId] = useState<number>(0);
  const [templateName, setTemplateName] = useState<string>('');
  const [backgroundSrc, setBackgroundSrc] = useState<string>('');
  const [outlineSrc, setOutlineSrc] = useState<string>('');
  const [penColor, setPenColor] = useState<string>('black');
  const [isErasing, setIsErasing] = useState<boolean>(false);
  const [imageData, setImageData] = useState<string>('');

  const contextValue = useMemo(
    () => ({
      mode,
      setMode,
      friendId,
      setFriendId,
      friendName,
      setFriendName,
      templateId,
      setTemplateId,
      templateName,
      setTemplateName,
      backgroundSrc,
      setBackgroundSrc,
      outlineSrc,
      setOutlineSrc,
      penColor,
      setPenColor,
      isErasing,
      setIsErasing,
      imageData,
      setImageData,
    }),
    [
      mode,
      friendId, friendName,
      templateId, templateName,
      backgroundSrc, outlineSrc,
      penColor, isErasing, imageData,
    ],
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
