import { create } from "zustand";

export const WeightingSchemes = {
  LogarithmicTF: "LogarithmicTF",
  BinaryTF: "BinaryTF",
  AugmentationTF: "AugmentationTF",
  NaturalTF: "NaturalTF",
  IDF: "IDF",
  TFxIDF: "TFxIDF",
  TFxIDFxNorm: "TFxIDFxNorm",
} as const

export type WeightingScheme = typeof WeightingSchemes[keyof typeof WeightingSchemes]


interface QuerySettingsState {
  useStemming: boolean
  useStopWordElim: boolean
  weightingScheme: WeightingScheme
  setUseStemming: (value: boolean) => void
  setStopWordElim: (value: boolean) => void
  setWeightingScheme: (scheme: WeightingScheme) => void
}

export const useQuerySettingsStore = create<QuerySettingsState>((set) => ({
  useStemming: false,
  useStopWordElim: false,
  weightingScheme: "LogarithmicTF",
  setUseStemming: (value) => set({ useStemming: value }),
  setStopWordElim: (value) => set({ useStopWordElim: value }),
  setWeightingScheme: (scheme) => set({ weightingScheme: scheme }),
}))