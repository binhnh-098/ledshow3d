import { create } from "zustand";

export type ViewKey =
  | "free"
  | "chinh-dien"
  | "canh"
  | "tren"
  | "khan-gia"
  | "mat-bang";

interface ViewStore {
  activeView: ViewKey;
  setView: (v: ViewKey) => void;
}

// Store riêng cho góc camera — tách khỏi useConfigStore vì đây là "trạng thái
// xem", không phải tham số sự kiện (đổi góc camera không làm thay đổi layout).
export const useViewStore = create<ViewStore>((set) => ({
  activeView: "free",
  setView: (v) => set({ activeView: v }),
}));
