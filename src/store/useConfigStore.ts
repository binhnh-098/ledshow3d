import { create } from "zustand";
import { DEFAULT_CONFIG, type EventConfig } from "../types/config";

interface ConfigStore {
  config: EventConfig;
  setConfig: (patch: Partial<EventConfig>) => void;
  reset: () => void;
}

// Store trung tâm: UI (panel bên trái) đọc/ghi state này,
// scene 3D chỉ "lắng nghe" state này rồi tự vẽ lại — không có chiều ngược lại.
export const useConfigStore = create<ConfigStore>((set) => ({
  config: DEFAULT_CONFIG,
  setConfig: (patch) =>
    set((state) => ({ config: { ...state.config, ...patch } })),
  reset: () => set({ config: DEFAULT_CONFIG }),
}));
