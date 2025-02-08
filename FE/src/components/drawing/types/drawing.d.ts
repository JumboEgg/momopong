export type DrawingMode = 'single' | 'together' | 'story';

export interface DrawingTemplate {
  storyId: number;
  templateId: number;
  name: string;
  bgSrc: string | null;
  olSrc: string;
}

export interface Friend {
  id: string;
  name: string;
  avatar: string;
}

export interface DrawingContextType {
  mode: DrawingMode;
  setMode: (mode: DrawingMode) => void;
  friendId: number;
  setFriendId: (id: number) => void;
  friendName: string;
  setFriendName: (name: string) => void;
  templateId: number;
  setTemplateId: (id: number) => void;
  templateName: string;
  setTemplateName: (name: string) => void;
  backgroundSrc: string;
  setBackgroundSrc: (bgSrc: string) => void;
  outlineSrc: string;
  setOutlineSrc: (olSrc: string) => void;
  penColor: string;
  setPenColor: (color: string) => void;
  isErasing: boolean;
  setIsErasing: (drawingState: boolean) => void;
  imageData: string;
  setImageData: (resultSrc: string) => void;
}
