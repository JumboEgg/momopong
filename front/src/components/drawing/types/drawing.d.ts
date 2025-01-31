export type DrawingMode = 'single' | 'together';

export interface DrawingTemplate {
  storyId: number;
  templateId: number;
  name: string;
}

export interface Friend {
  id: string;
  name: string;
  avatar: string;
}

export interface DrawingContextType {
  mode: DrawingMode;
  setMode: (mode: DrawingMode) => void;
  templateId: number;
  setTemplateId: (id: number) => void;
  penColor: string;
  setPenColor: (color: string) => void;
  isErasing: boolean;
  setIsErasing: (drawingState: boolean) => void;
  imageData: string;
  setImageData: (resultSrc: string) => void;
}
