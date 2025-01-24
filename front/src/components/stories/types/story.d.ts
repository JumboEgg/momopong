export type StoryMode = 'reading' | 'together';

export type CharacterType = 'narration' | 'hero1' | 'hero2' | 'bigsis1' | 'bigsis2';

export interface StoryLine {
  type: CharacterType;
  text: string;
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