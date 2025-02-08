import { create } from 'zustand';

// 소리 설정 상태 관리 스토어
interface SoundSettingsStore {
  bgmVolume: number;
  setBgmVolume: (volume: number) => void;
  effectVolume: number;
  setEffectVolume: (volume: number) => void;
}

// Zustand 상태 훅 생성
const useSoundSettingsStore = create<SoundSettingsStore>((set) => ({
  bgmVolume: 10,
  setBgmVolume: (volume) => set({ bgmVolume: volume }),
  effectVolume: 10,
  setEffectVolume: (volume) => set({ effectVolume: volume }),
}));

// Zustand에서 상태를 가져오는 커스텀 훅
export const useSoundSettings = (): SoundSettingsStore => useSoundSettingsStore();
