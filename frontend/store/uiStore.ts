import { create } from "zustand";

interface UIState {
  searchDisabled: boolean
  setSearchDisabled: (state: boolean) => void
}

export const useUiStore = create<UIState>((set) => ({
  searchDisabled: false,
  setSearchDisabled: (state) => set({searchDisabled: state})
}))