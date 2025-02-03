export type StoryMode = 'reading' | 'together';

export type CharacterType = 'narration' | 'prince' | 'princess';

export interface StoryLine {
  type: CharacterType;
  text: string;
  audioFiles: string[];
}

export interface Friend {
  id: string;
  name: string;
  avatar: string;
}

export interface RecordingData {
  characterType: CharacterType;
  audioUrl: string;
  timestamp: number;
}

export interface StoryContextType {
  mode: StoryMode;
  setMode: (mode: StoryMode) => void;
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  recordings: Map<number, RecordingData>;
  addRecording: (index: number, data: RecordingData) => void;
  audioEnabled: boolean;
  toggleAudio: () => void;
}

export interface StoryPageContent {
  type: CharacterType;
  text: string;
  audioFiles: string[];
  illustration?: string; // 선택적 속성 추가
}

export interface StoryPage {
  pageNumber: number;
  illustration?: string;
  contents: StoryPageContent[];
}
