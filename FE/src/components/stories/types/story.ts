import { BookAudioInfo, PagePosition } from '@/types/book';

export type StoryMode = 'reading' | 'together';

export type CharacterType = 'narration' | 'role1' | 'role2';

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
  // 추가된 부분
  updateRecordingStatus: (status: 'idle' | 'recording' | 'completed') => void;
  getCurrentRecordingStatus: () => 'idle' | 'recording' | 'completed';
}

export interface StoryPageContent {
  type: CharacterType;
  text: string;
  audioId: string;
  illustration?: string;
}

export interface StoryPage {
  pageNumber: number;
  illustration: string;
  contents: StoryPageContent[];
}

// FriendSelection.tsx
export interface FriendSelectionProps {
  onFriendSelect: (friendId: number) => void;
}

export type RecordingStatus = 'idle' | 'recording' | 'completed';

// RecordingButton.tsx
export interface RecordingButtonProps {
  characterType: CharacterType;
  storyIndex: number;
  onRecordingComplete: (audioUrl: string) => void; // 변경
  globalRecordingStatus: RecordingStatus;
}

// StoryIllustration.tsx
export interface StoryIllustrationProps {
  pageNumber: number;
  currentContentIndex: number;
  onPrevious: () => void;
  onNext: () => void;
  isFirst: boolean;
  isLast: boolean;
  userRole?: 'role1' | 'role2';
  currentContent: BookAudioInfo | undefined;
  illustration: string;
  hasObject: boolean;
  position?: PagePosition | null;
}

export interface Story {
  id: number;
  title: string;
  image: string;
  ageRange: string;
}
