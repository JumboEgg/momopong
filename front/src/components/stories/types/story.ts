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
  illustration: string;
}

export interface StoryPage {
  pageNumber: number;
  illustration?: string;
  contents: StoryPageContent[];
}

// FriendSelection.tsx
export interface FriendSelectionProps {
  onFriendSelect: (friendId: string) => void;
}

// RecordingButton.tsx
export interface RecordingButtonProps {
  characterType: CharacterType;
  storyIndex: number;
  onRecordingComplete: () => void;
}

// StoryIllustration.tsx
export interface StoryIllustrationProps {
  pageNumber: number;
  currentContentIndex: number;
  onPrevious: () => void;
  onNext: () => void;
  isFirst: boolean;
  isLast: boolean;
  userRole?: 'prince' | 'princess';
}

// TogetherMode.tsx
export interface TogetherModeProps {
  friendId: string;
}
