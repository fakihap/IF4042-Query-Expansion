import { create } from "zustand";

export const WeightingSchemes = {
  LogarithmicTF: "Logarithmic TF",
  BinaryTF: "Binary TF",
  AugmentationTF: "Augmentation TF",
  NaturalTF: "Natural TF",
  IDF: "IDF only",
  TFxIDF: "TF x IDF",
  TFxIDFxNorm: "TF x IDF x Cosine",
} as const
export type WeightingScheme = typeof WeightingSchemes[keyof typeof WeightingSchemes]

export const groupedWeightingSchemes = [
  { 
    group: "Term Frequency", 
    items: [
      WeightingSchemes.LogarithmicTF,
      WeightingSchemes.BinaryTF,
      WeightingSchemes.AugmentationTF,
      WeightingSchemes.NaturalTF
    ]
  },
  { 
    group: "Inverse Document Frequency", 
    items: [
      WeightingSchemes.IDF,
    ]
  },
  { 
    group: "Others", 
    items: [
      WeightingSchemes.TFxIDF,
      WeightingSchemes.TFxIDFxNorm,
    ]
  }
]


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
  weightingScheme: WeightingSchemes.LogarithmicTF,
  setUseStemming: (value) => set({ useStemming: value }),
  setStopWordElim: (value) => set({ useStopWordElim: value }),
  setWeightingScheme: (scheme) => set({ weightingScheme: scheme }),
}))